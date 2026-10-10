from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.chat import router as chat_router
from routes.upload import router as upload_router

load_dotenv()

app = FastAPI(title="DocMind RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "DocMind RAG API is running"}