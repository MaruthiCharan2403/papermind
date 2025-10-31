"""
Test script for ChromaDB migration
Run this after starting the Flask server to verify everything works
"""

import requests
import json

FLASK_URL = "http://127.0.0.1:5001"

def test_process_paper():
    """Test adding a paper to Chroma collection"""
    print("\n=== Testing /process-paper endpoint ===")
    
    # Note: This is a test. Real usage requires paper to be in database first
    data = {
        "title": "10.1234/test.paper",  # Example DOI
        "paper_id": 999  # Test paper ID
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{FLASK_URL}/process-paper", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_ask_question(paper_id=999):
    """Test querying a paper"""
    print("\n=== Testing /ask endpoint ===")
    
    data = {
        "paper_id": paper_id,
        "question": "What is the main finding of this paper?"
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{FLASK_URL}/ask", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_delete_paper(paper_id=999):
    """Test deleting a paper"""
    print("\n=== Testing /delete-paper endpoint ===")
    
    data = {
        "paper_id": paper_id
    }
    
    print(f"Request: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{FLASK_URL}/delete-paper", json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def check_chroma_collection():
    """Check if Chroma collection exists and has data"""
    print("\n=== Checking Chroma Collection ===")
    
    try:
        import chromadb
        client = chromadb.PersistentClient(path="./chroma_db")
        
        # List collections
        collections = client.list_collections()
        print(f"Collections: {[c.name for c in collections]}")
        
        # Get papers_collection if it exists
        if collections:
            for collection in collections:
                if collection.name == "papers_collection":
                    count = collection.count()
                    print(f"Papers collection has {count} chunks")
                    
                    # Sample a few documents
                    if count > 0:
                        results = collection.get(limit=3)
                        print(f"\nSample metadata:")
                        for i, metadata in enumerate(results['metadatas']):
                            print(f"  Chunk {i+1}: {metadata}")
        else:
            print("No collections found yet")
            
        return True
    except Exception as e:
        print(f"Error checking Chroma: {e}")
        return False

def main():
    print("=" * 60)
    print("ChromaDB Migration Test Suite")
    print("=" * 60)
    print("\nMake sure:")
    print("1. Flask server is running (python app.py)")
    print("2. GOOGLE_API_KEY environment variable is set")
    print("3. You're in the flaskbackend directory")
    print()
    
    input("Press Enter to continue...")
    
    # Check if collection exists
    check_chroma_collection()
    
    # Note: Full test requires actual paper processing which downloads from Sci-Hub
    # For quick testing, you can manually add test data or use actual papers
    
    print("\n" + "=" * 60)
    print("Manual Testing Instructions:")
    print("=" * 60)
    print("\n1. Upload a paper through the web interface")
    print("2. Note the paper_id from the database")
    print("3. Ask questions about that paper")
    print("4. Verify answers are relevant")
    print("5. Check chroma_db/ directory was created")
    print("6. Test deleting a paper")
    print("\nOr use the full application flow for end-to-end testing.")

if __name__ == "__main__":
    main()
