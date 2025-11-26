import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure with API key from environment or hardcoded fallback
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def call_gemini_api(prompt):
    response = genai.GenerativeModel("gemini-2.5-flash").generate_content(prompt)
    return response.text
