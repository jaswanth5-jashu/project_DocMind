from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunker(document):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=50
    )

    chunks = splitter.split_documents(document)
    return chunks