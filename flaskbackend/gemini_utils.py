import os
import google.generativeai as genai

genai.configure(api_key="AIzaSyCxc3QLpDeV11PkXp0fmfZCARBuTz3oYmA")

def call_gemini_api(prompt):
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
    return response.text
