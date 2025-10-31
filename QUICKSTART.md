# 🚀 Quick Start Guide - ChromaDB Version

## Get Started in 5 Minutes

### 1. Install Flask Dependencies
```powershell
cd flaskbackend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
```

### 2. Set Google API Key
```powershell
$env:GOOGLE_API_KEY="your-google-api-key-here"
```

### 3. Start Flask Server
```powershell
python app.py
```
✅ Server running at `http://127.0.0.1:5001`

### 4. Start Node.js Backend
```powershell
# New terminal
cd backend
npm install  # if not already done
node index.js
```
✅ Backend running at `http://localhost:4000`

### 5. Start Next.js Frontend
```powershell
# New terminal
cd papermind  # root directory
npm install  # if not already done
npm run dev
```
✅ Frontend running at `http://localhost:3000`

## That's It! 🎉

Visit `http://localhost:3000` and start uploading papers.

## What's Different?

### Old (FAISS)
- Multiple index files per paper
- Files stored in `faiss_indices/doi_xxxxx/`

### New (ChromaDB)
- Single collection in `chroma_db/`
- All papers in one place
- No duplicate indices

## Verify It's Working

1. **Upload a paper** - Should see success message
2. **Check ChromaDB** - `chroma_db/` directory should exist
3. **Ask questions** - Should get relevant answers
4. **Check no duplicates** - Multiple users can add same paper

## Common Issues

### "GOOGLE_API_KEY not found"
```powershell
$env:GOOGLE_API_KEY="your-key"
```

### "Module not found: chromadb"
```powershell
cd flaskbackend
pip install chromadb
```

### "Port 5001 in use"
Change port in `app.py` line 224:
```python
app.run(host="0.0.0.0", port=5002)
```
And update `backend/.env`:
```
FLASK_URL=http://127.0.0.1:5002
```

## Need More Help?

- 📖 Full setup: `flaskbackend/README.md`
- 🔄 Migration details: `MIGRATION_FAISS_TO_CHROMA.md`
- ✅ Complete summary: `MIGRATION_COMPLETE.md`

## Test the API Directly

```powershell
# Create a paper (after adding to DB)
curl -X POST http://localhost:5001/process-paper `
  -H "Content-Type: application/json" `
  -d '{"title": "10.1234/test", "paper_id": 999}'

# Ask a question
curl -X POST http://localhost:5001/ask `
  -H "Content-Type: application/json" `
  -d '{"paper_id": 999, "question": "What is this about?"}'
```

Happy coding! 🚀
