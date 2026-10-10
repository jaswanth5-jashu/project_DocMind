from langchain_google_genai import GoogleGenerativeAIEmbeddings


def embedding():

    embedding_model = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001"
    )

    return embedding_model