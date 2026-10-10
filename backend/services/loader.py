import os
import tempfile
from fastapi import UploadFile
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import Docx2txtLoader

from services.excel_processor import (
    process_excel,
    process_csv,
    dataframe_to_documents
)


async def loader(file: UploadFile):
    content_type = file.content_type
    filename_lower = file.filename.lower() if file.filename else ""

    if content_type == "application/pdf" or filename_lower.endswith(".pdf"):
        return await load_pdf(file)
    elif content_type == "text/plain" or filename_lower.endswith(".txt"):
        return await load_text(file)
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" or filename_lower.endswith(".docx"):
        return await load_docx(file)
    elif content_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" or filename_lower.endswith(".xlsx"):
        return await load_excel(file)
    elif content_type == "text/csv" or filename_lower.endswith(".csv"):
        return await load_csv(file)
    else:
        raise ValueError(f"Unsupported file type: {content_type}")


async def save_file(file: UploadFile):
    content = await file.read()
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, file.filename)

    with open(file_path, "wb") as f:
        f.write(content)

    return file_path


async def load_pdf(file: UploadFile):
    file_path = await save_file(file)
    try:
        loader_inst = PyPDFLoader(file_path)
        document = loader_inst.load()
        return document
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


async def load_text(file: UploadFile):
    file_path = await save_file(file)
    try:
        loader_inst = TextLoader(file_path)
        document = loader_inst.load()
        return document
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


async def load_docx(file: UploadFile):
    file_path = await save_file(file)
    try:
        loader_inst = Docx2txtLoader(file_path)
        document = loader_inst.load()
        return document
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


async def load_excel(file: UploadFile):
    file_path = await save_file(file)
    try:
        df = process_excel(file_path)
        documents = dataframe_to_documents(df)
        return documents
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


async def load_csv(file: UploadFile):
    file_path = await save_file(file)
    try:
        df = process_csv(file_path)
        documents = dataframe_to_documents(df)
        return documents
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
