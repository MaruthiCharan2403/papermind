from flask import Flask, request, jsonify
import os
import requests
from bs4 import BeautifulSoup
from io import BytesIO
import pdfplumber
from urllib.parse import urljoin
import time
import random
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings
import re
from gemini_utils import call_gemini_api
import pickle
import shutil

app = Flask(__name__)

embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize FAISS storage directory
FAISS_STORE_DIR = "./faiss_db"
os.makedirs(FAISS_STORE_DIR, exist_ok=True)

# Store paper metadata separately
METADATA_FILE = os.path.join(FAISS_STORE_DIR, "paper_metadata.pkl")

def load_metadata():
    """Load paper metadata from disk"""
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'rb') as f:
            return pickle.load(f)
    return {}

def save_metadata(metadata):
    """Save paper metadata to disk"""
    with open(METADATA_FILE, 'wb') as f:
        pickle.dump(metadata, f)

def get_paper_index_path(paper_id):
    """Get the FAISS index path for a specific paper"""
    return os.path.join(FAISS_STORE_DIR, f"paper_{paper_id}")

def load_vectorstore(paper_id):
    """Load FAISS vectorstore for a specific paper"""
    index_path = get_paper_index_path(paper_id)
    if os.path.exists(index_path):
        return FAISS.load_local(index_path, embedding_model, allow_dangerous_deserialization=True)
    return None

SCI_HUB_DOMAINS = [
    "https://tesble.com",
    "https://sci-hub.se",
    "https://sci-hub.st",
    "https://sci-hub.ru",
    "https://sci-hub.ee",
]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
]

def get_pdf_url_from_scihub(query_text, max_retries=3):
    for retry in range(max_retries):
        for domain in SCI_HUB_DOMAINS:
            try:
                session = requests.Session()
                headers = {
                    "User-Agent": random.choice(USER_AGENTS),
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "origin": "https://sci-hub.se",
                    "referer": "https://sci-hub.se"
                }
                time.sleep(random.uniform(1, 3))
                print(f"Trying: {domain} (Attempt {retry + 1})")
                response = session.post(
                    domain,
                    data={"request": query_text},
                    headers=headers,
                    timeout=10,
                )
                response.raise_for_status()
                soup = BeautifulSoup(response.text, "html.parser")
                iframe = soup.find("iframe")
                if iframe and iframe.get("src"):
                    pdf_url = iframe["src"]
                else:
                    embed = soup.find("embed", {"type": "application/pdf"})
                    if embed and embed.get("src"):
                        pdf_url = embed["src"]
                    else:
                        raise Exception("PDF not found in response")
                if pdf_url.startswith("//"):
                    pdf_url = "https:" + pdf_url
                elif pdf_url.startswith("/"):
                    pdf_url = urljoin(domain, pdf_url)
                return pdf_url
            except Exception as e:
                print(f"Failed: {domain} | Error: {str(e)}")
                continue
    raise Exception("All attempts failed. Sci-Hub may be blocking requests.")

def extract_text_from_pdf_url(pdf_url):
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    response = requests.get(pdf_url, headers=headers, timeout=10)
    response.raise_for_status()
    text = ""
    with pdfplumber.open(BytesIO(response.content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    
    # Clean up the text
    # Remove excessive whitespace and line breaks
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)  # Multiple blank lines to double
    text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces to single
    
    return text


@app.route('/process-paper', methods=['POST'])
def process_paper_route():
    print("Received request to process paper")
    data = request.get_json()
    title = data['title']
    paper_id = data.get('paper_id')  # Get paper ID from request
    
    if not paper_id:
        return jsonify({"error": "paper_id is required"}), 400
    
    pdf_url = get_pdf_url_from_scihub(title)
    print("PDF URL found:", pdf_url)
    text = extract_text_from_pdf_url(pdf_url)
    print("Extracted text from PDF")
    if not text.strip():
        return jsonify({"error": "Failed to extract text from PDF."}), 400
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,  
        chunk_overlap=300, 
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]  
    )
    texts = splitter.split_text(text)
    print(f"Split into {len(texts)} chunks (chunk_size=1500, overlap=300)")
    metadatas = [
        {
            "paper_id": str(paper_id), 
            "title": title, 
            "chunk_index": i,
            "total_chunks": len(texts)
        } 
        for i in range(len(texts))
    ]
    
    # Create FAISS vectorstore for this paper
    vectorstore = FAISS.from_texts(texts=texts, embedding=embedding_model, metadatas=metadatas)
    
    # Save the vectorstore to disk
    index_path = get_paper_index_path(paper_id)
    vectorstore.save_local(index_path)
    
    # Update metadata
    all_metadata = load_metadata()
    all_metadata[str(paper_id)] = {
        "title": title,
        "num_chunks": len(texts),
        "index_path": index_path
    }
    save_metadata(all_metadata)
    
    print(f"Added {len(texts)} chunks to FAISS index for paper_id: {paper_id}")
    
    return jsonify({
        "paper_id": paper_id,
        "message": f"Paper successfully indexed with FAISS with {len(texts)} chunks."
    }), 200

@app.route('/ask', methods=['POST'])
def ask_route():
    try:
        data = request.get_json()
        paper_id = data.get('paper_id')  # Get paper_id instead of s3_faiss_key
        question = data['question']
        
        print(f"Received ask request - paper_id: {paper_id}, question: {question}")
        
        if not paper_id:
            return jsonify({"error": "paper_id is required"}), 400
        
        # Load the FAISS vectorstore for this paper
        vectorstore = load_vectorstore(paper_id)
        
        if vectorstore is None:
            return jsonify({"error": f"No FAISS index found for paper_id: {paper_id}"}), 404
        
        print(f"Loaded FAISS index for paper_id: {paper_id}")
        
        question_lower = question.lower()
        needs_early_chunks = any(keyword in question_lower for keyword in 
            ['abstract', 'summary', 'overview', 'about', 'main finding', 'conclusion', 'introduction'])
        
        if needs_early_chunks:
            k = 6  
        else:
            k = 4

        print(f"Retrieving top {k} chunks (needs_early_chunks: {needs_early_chunks})")
        
        # Perform similarity search with FAISS
        docs = vectorstore.similarity_search(question, k=k)
        
        # For abstract/intro questions, also get the first few chunks
        if needs_early_chunks and docs:
            from langchain.schema import Document
            current_chunk_texts = set([d.page_content for d in docs])
            
            # Get all documents from the vectorstore
            all_docs = vectorstore.docstore._dict
            
            # Find and add first 3 chunks if not already present
            for doc_id, doc in all_docs.items():
                if doc.metadata and doc.metadata.get('chunk_index', 999) <= 2:
                    if doc.page_content not in current_chunk_texts:
                        docs.insert(0, doc)
                        print(f"Added early chunk {doc.metadata.get('chunk_index')} to results")
        
        if not docs:
            return jsonify({"error": "No relevant documents found for this paper."}), 404
        
        # Sort chunks by index to maintain logical order for better context
        docs_with_index = [(d, d.metadata.get('chunk_index', 999)) for d in docs]
        docs_sorted = sorted(docs_with_index, key=lambda x: x[1])
        sorted_docs = [d[0] for d in docs_sorted]
        
        context = "\n\n---\n\n".join([d.page_content for d in sorted_docs])
        print(f"Retrieved {len(docs)} chunks, context length: {len(context)} characters")
        print("First 300 chars of context:", context[:300] + "...")
        
        # Improved prompt for better answers
        prompt = f"""You are analyzing a research paper. Based on the following excerpts from the paper, answer the question accurately and concisely.

Context from the paper:
{context}

Question: {question}

Instructions:
- Provide a clear, direct answer based ONLY on the information in the context above
- If the context contains an abstract or summary, use it to answer questions about the paper's overview
- Be specific and cite relevant details from the context
- If the answer cannot be found in the provided context, say "The provided excerpts do not contain this information"
- Do not make assumptions or add information not present in the context

Answer:"""
        
        try:
            response = call_gemini_api(prompt)
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return jsonify({"error": f"AI API error: {str(e)}"}), 500
        
        return jsonify({"answer": response.strip()})
    except Exception as e:
        print(f"Error in /ask endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/delete-paper', methods=['POST'])
def delete_paper_route():
    """Delete all chunks of a specific paper from the collection"""
    data = request.get_json()
    paper_id = data.get('paper_id')
    
    if not paper_id:
        return jsonify({"error": "paper_id is required"}), 400
    
    try:
        # Delete the FAISS index files for this paper
        index_path = get_paper_index_path(paper_id)
        
        if os.path.exists(index_path):
            shutil.rmtree(index_path)
            print(f"Deleted FAISS index directory for paper_id: {paper_id}")
        
        # Update metadata
        all_metadata = load_metadata()
        if str(paper_id) in all_metadata:
            del all_metadata[str(paper_id)]
            save_metadata(all_metadata)
        
        print(f"Deleted all data for paper_id: {paper_id}")
        return jsonify({"message": f"Paper {paper_id} successfully deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/debug/collection-info', methods=['GET'])
def collection_info():
    """Debug endpoint to check what's in the FAISS storage"""
    try:
        all_metadata = load_metadata()
        
        if all_metadata:
            total_chunks = sum(info.get('num_chunks', 0) for info in all_metadata.values())
            
            return jsonify({
                "total_chunks": total_chunks,
                "total_papers": len(all_metadata),
                "paper_ids_found": list(all_metadata.keys()),
                "papers_info": all_metadata
            }), 200
        else:
            return jsonify({
                "total_chunks": 0,
                "total_papers": 0,
                "message": "No papers indexed yet. Upload a paper first."
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)