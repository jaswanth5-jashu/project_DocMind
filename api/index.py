import sys
import os

# Append backend folder to python path so module imports work correctly on Vercel
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from main import app

