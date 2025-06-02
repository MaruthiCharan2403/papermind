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

app = Flask(__name__)

embedding_model = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def sanitize_doi(doi):
    return re.sub(r'[^\w\-_.]', '_', doi)

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
    return text


@app.route('/process-paper', methods=['POST'])
def process_paper_route():
    print("Received request to process paper")
    data = request.get_json()
    title = data['title']
    pdf_url = get_pdf_url_from_scihub(title)
    print("PDF URL found:", pdf_url)
    text = extract_text_from_pdf_url(pdf_url)
    print("Extracted text from PDF")
    if not text.strip():
        return jsonify({"error": "Failed to extract text from PDF."}), 400
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100, length_function=len)
    texts = splitter.split_text(text)
    print("Split into", len(texts), "chunks")
    db = FAISS.from_texts(texts, embedding_model)
    print("Created FAISS index")
    s3_faiss_key = f"faiss_indices/{sanitize_doi(title)}_{int(time.time())}"
    print("S3 FAISS key:", s3_faiss_key)
    local_faiss_path = f"./{s3_faiss_key}"
    os.makedirs(os.path.dirname(local_faiss_path), exist_ok=True)
    db.save_local(local_faiss_path)
    print("Saved FAISS index at", local_faiss_path)
    return jsonify({"s3_faiss_key": s3_faiss_key, "message": "FAISS index created and saved successfully."}), 200

@app.route('/ask', methods=['POST'])
def ask_route():
    data = request.get_json()
    s3_faiss_key = data['s3_faiss_key']
    question = data['question']
    loaded_faiss_path = f"./{s3_faiss_key}"
    if not os.path.exists(loaded_faiss_path):
        return jsonify({"error": "FAISS index not found."}), 404
    db = FAISS.load_local(loaded_faiss_path, embedding_model, allow_dangerous_deserialization=True)
    print("Loaded FAISS index from S3 key:", s3_faiss_key)
    if not db:
        return jsonify({"error": "Failed to load FAISS index."}), 500
    retriever = db.as_retriever(search_kwargs={"k": 3})
    docs = retriever.get_relevant_documents(question)
    context = "\n".join([d.page_content for d in docs])
    print("Retrieved context for question:", context)
    prompt = f"Context:\n{context}\n\nQuestion: {question}\nAnswer:..Give a concise answer based on the context.Do not include any information that is not in the context."
    try:
        response = call_gemini_api(prompt)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"answer": response.strip()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)