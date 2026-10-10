
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services import vector_store
from services.rag import rag

router = APIRouter()


class Question(BaseModel):
    question: str


@router.post("/chat")
async def chat(data: Question):
    if vector_store.vectorstore is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a document first."
        )

    result = rag(
        vector_store.vectorstore,
        data.question
    )

    return {
        "question": data.question,
        "answer": result["answer"],
        "retrieved_chunks": result["retrieved_chunks"]
    }


@router.post("/reset")
async def reset():
    vector_store.reset_vectorstore()

    return {
        "message": "Session reset successfully"
    }
