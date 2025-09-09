#!/usr/bin/env python3
"""
Startup script for the Security RAG Agent API
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_environment():
    """Check if the environment is properly set up"""
    print("🔍 Checking environment...")
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ .env file not found!")
        print("Please create a .env file with your Google API key:")
        print("GOOGLE_API_KEY=your_actual_api_key_here")
        return False
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: Virtual environment not detected")
        print("It's recommended to run this in a virtual environment")
    
    # Check if required packages are installed
    try:
        import fastapi
        import langchain
        import google.generativeai
        print("✅ Required packages found")
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Run: pip install -r requirements.txt")
        return False
    
    # Check if directories exist
    Path("./chroma_db").mkdir(exist_ok=True)
    Path("./app/data/nmap").mkdir(parents=True, exist_ok=True)
    Path("./app/data/web_reports").mkdir(parents=True, exist_ok=True)
    
    return True

def start_server(host="0.0.0.0", port=8000, reload=True):
    """Start the FastAPI server"""
    print(f"🚀 Starting Security RAG Agent API on {host}:{port}")
    
    cmd = [
        "uvicorn",
        "app.main:app",
        "--host", host,
        "--port", str(port),
    ]
    
    if reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd, check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")
    except FileNotFoundError:
        print("❌ uvicorn not found. Make sure you've installed the requirements:")
        print("pip install -r requirements.txt")

def main():
    parser = argparse.ArgumentParser(description="Security RAG Agent API Server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")
    parser.add_argument("--skip-checks", action="store_true", help="Skip environment checks")
    
    args = parser.parse_args()
    
    if not args.skip_checks:
        if not check_environment():
            print("\n❌ Environment check failed. Use --skip-checks to bypass.")
            sys.exit(1)
    
    print("✅ Environment check passed")
    print("\n" + "="*60)
    print("🤖 Security RAG Agent API")
    print("="*60)
    print(f"📍 API will be available at: http://{args.host}:{args.port}")
    print(f"📚 Documentation: http://{args.host}:{args.port}/docs")
    print(f"🔍 Health check: http://{args.host}:{args.port}/health")
    print("="*60)
    
    start_server(args.host, args.port, not args.no_reload)

if __name__ == "__main__":
    main()