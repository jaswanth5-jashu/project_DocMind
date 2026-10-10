from fastapi import APIRouter, UploadFile, File

from services.loader import loader
from services.chunk import chunker
from services.embeddings import embedding
from services.vector_store import create_vectorstore


router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...)):

    document = await loader(file)

    chunks = chunker(document)

    embedding_model = embedding()

    vectorstore = create_vectorstore(
        chunks,
        embedding_model
    )

    data = []

    for number, record in enumerate(vectorstore.store.values(), start=1):

        data.append({
            "chunk": number,
            "text": record["text"],
            "vector": record["vector"],
            "dimensions": len(record["vector"]),
            "metadata": record.get("metadata", {})
        })

    return {
        "filename": file.filename,
        "file_type": file.content_type,
        "chunks": len(chunks),
        "message": "File processed successfully",
        "data": data
    }