#!/usr/bin/env python3
"""
Restart server with proper initialization checks
"""

import sys
import time
import requests
import subprocess

def check_server_status():
    """Check if server is running and properly initialized"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=3)
        if response.status_code == 200:
            data = response.json()
            print(f"Server Status: {data['status']}")
            print(f"Services: {data.get('llm_status', 'unknown')}")
            return data['status'] == 'healthy' or data['status'] == 'partial'
        return False
    except:
        return False

def main():
    print("🔧 Security RAG Server Restart Utility")
    print("=" * 50)
    
    # Check current status
    if check_server_status():
        print("✅ Server is currently running")
        choice = input("Do you want to restart it? (y/n): ").lower().strip()
        if choice not in ['y', 'yes']:
            print("👍 Keeping current server running")
            sys.exit(0)
    else:
        print("ℹ️ Server is not running or not responding")
    
    print("\n🔄 Starting server with proper initialization...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API docs will be at: http://localhost:8000/docs")
    print("\n" + "="*50)
    print("🚀 Starting server... (Press Ctrl+C to stop)")
    print("="*50)
    
    try:
        # Start server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Server failed to start: {e}")
        print("\nTroubleshooting:")
        print("1. Check that all dependencies are installed: pip install -r requirements.txt")
        print("2. Verify your .env file has GOOGLE_API_KEY set")
        print("3. Ensure port 8000 is not already in use")
    except FileNotFoundError:
        print("\n❌ Python or uvicorn not found")
        print("Make sure you're in the virtual environment and have installed requirements.txt")

if __name__ == "__main__":
    main()