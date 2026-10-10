from langchain_core.vectorstores import InMemoryVectorStore

vectorstore = None


def create_vectorstore(chunks, embedding_model):
    global vectorstore

    vectorstore = InMemoryVectorStore(embedding_model)
    vectorstore.add_documents(chunks)

    return vectorstore


def reset_vectorstore():
    global vectorstore
    vectorstore = None
