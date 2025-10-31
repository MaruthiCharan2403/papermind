# Flask Backend Setup - ChromaDB Version

## Prerequisites

- Python 3.11 or higher
- pip package manager
- Google API Key for Gemini

## Installation

### 1. Create Virtual Environment

```bash
cd flaskbackend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY="your-google-api-key-here"
```

**Windows (CMD):**
```cmd
set GOOGLE_API_KEY=your-google-api-key-here
```

**Linux/Mac:**
```bash
export GOOGLE_API_KEY="your-google-api-key-here"
```

Or create a `.env` file in the `flaskbackend` directory:
```
GOOGLE_API_KEY=your-google-api-key-here
```

## Running the Server

```bash
python app.py
```

The server will start on `http://0.0.0.0:5001`

## API Endpoints

### 1. Process Paper
**POST** `/process-paper`

Add a research paper to the ChromaDB collection.

**Request:**
```json
{
    "title": "10.1234/example.doi or paper title",
    "paper_id": 123
}
```

**Response:**
```json
{
    "paper_id": 123,
    "message": "Paper successfully added to Chroma collection with 50 chunks."
}
```

### 2. Ask Question
**POST** `/ask`

Query a specific paper with a question.

**Request:**
```json
{
    "paper_id": 123,
    "question": "What is the main methodology used?"
}
```

**Response:**
```json
{
    "answer": "The main methodology involves..."
}
```

### 3. Delete Paper
**POST** `/delete-paper`

Remove a paper from the ChromaDB collection.

**Request:**
```json
{
    "paper_id": 123
}
```

**Response:**
```json
{
    "message": "Paper 123 successfully deleted from collection."
}
```

## Directory Structure

```
flaskbackend/
├── app.py                  # Main Flask application
├── gemini_utils.py         # Google Gemini API utilities
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── test_chroma.py         # Test script
├── venv/                  # Virtual environment (gitignored)
└── chroma_db/            # ChromaDB storage (gitignored)
    └── papers_collection/ # All papers stored here
```

## Testing

### Option 1: Manual Testing via Frontend
1. Start the Flask server
2. Start the Node.js backend
3. Start the Next.js frontend
4. Upload a paper through the web interface
5. Ask questions about the paper

### Option 2: Using Test Script
```bash
python test_chroma.py
```

### Option 3: Using curl

**Process a paper:**
```bash
curl -X POST http://localhost:5001/process-paper \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10.1234/test.paper",
    "paper_id": 999
  }'
```

**Ask a question:**
```bash
curl -X POST http://localhost:5001/ask \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": 999,
    "question": "What is this paper about?"
  }'
```

**Delete a paper:**
```bash
curl -X POST http://localhost:5001/delete-paper \
  -H "Content-Type: application/json" \
  -d '{
    "paper_id": 999
  }'
```

## Docker Deployment

### Build Image
```bash
docker build -t papermind-flask .
```

### Run Container
```bash
docker run -d \
  -p 5001:5001 \
  -e GOOGLE_API_KEY=your-api-key \
  -v $(pwd)/chroma_db:/app/chroma_db \
  papermind-flask
```

**Note:** The `-v` flag mounts the ChromaDB directory to persist data between container restarts.

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'chromadb'"
```bash
pip install chromadb
```

### Issue: "GOOGLE_API_KEY not found"
Make sure the environment variable is set:
```bash
echo $GOOGLE_API_KEY  # Linux/Mac
echo $env:GOOGLE_API_KEY  # Windows PowerShell
```

### Issue: "Sci-Hub blocking requests"
- Try different Sci-Hub domains (configured in `SCI_HUB_DOMAINS`)
- Add delays between requests
- Check internet connection

### Issue: ChromaDB permission errors
```bash
# Ensure the chroma_db directory is writable
chmod -R 755 chroma_db  # Linux/Mac
```

### Issue: Port 5001 already in use
Change the port in `app.py`:
```python
app.run(host="0.0.0.0", port=5002)  # Use different port
```

Also update the backend `.env` file:
```
FLASK_URL=http://localhost:5002
```

## Performance Tips

1. **First query is slow**: ChromaDB initialization takes time on first load. Subsequent queries are faster.

2. **Large papers**: For papers with many chunks, consider increasing `chunk_size` or reducing `k` in retrieval.

3. **Memory usage**: If processing many papers, restart the server periodically to clear memory.

4. **Disk space**: ChromaDB is efficient, but monitor `chroma_db/` directory size for large deployments.

## Migration from FAISS

See `MIGRATION_FAISS_TO_CHROMA.md` for detailed migration instructions.

Quick summary:
- Old FAISS indices can be deleted from `faiss_indices/`
- No database schema changes required
- Re-upload papers to populate ChromaDB

## ChromaDB Benefits

✅ Single collection for all papers  
✅ No duplicate indices  
✅ Metadata-based filtering  
✅ Easier backup and deployment  
✅ Better scalability  
✅ Production-ready  

## Dependencies

Key packages:
- `chromadb` - Vector database
- `langchain-community` - LangChain integrations
- `sentence-transformers` - Embedding models
- `flask` - Web framework
- `google-generativeai` - Gemini API
- `pdfplumber` - PDF text extraction
- `beautifulsoup4` - Web scraping

## Support

For issues or questions:
- ChromaDB docs: https://docs.trychroma.com/
- LangChain docs: https://python.langchain.com/
- Google AI docs: https://ai.google.dev/
