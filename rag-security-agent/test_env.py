import os
from dotenv import load_dotenv

load_dotenv()  # will load .env from current directory

print("ENV GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))
