
import os

from fastapi import HTTPException
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI


def rag(vectorstore, question):
    retrieved_docs = vectorstore.similarity_search(question, k=3)

    context = "\n\n".join(
        doc.page_content for doc in retrieved_docs
    )

    prompt = f"""
You are a document question-answering assistant.

Answer the user's question using ONLY the information provided
in the context.

Rules:
1. Do not use your own knowledge.
2. Do not make up information.
3. If the answer is not available in the context, say:
   "The information is not available in the uploaded document."
4. Give a clear and concise answer.

Context:
{context}

Question:
{question}
"""

    providers = []

    google_key = os.getenv("GOOGLE_API_KEY")

    if google_key:
        providers.append(
            (
                "Gemini",
                lambda: ChatGoogleGenerativeAI(
                    model=os.getenv(
                        "GEMINI_MODEL", "gemini-3.5-flash"
                    ),
                    google_api_key=google_key,
                    temperature=0,
                    max_retries=0,
                ),
            )
        )

    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openrouter_url = os.getenv(
        "OPENROUTER_BASE_URL",
        "https://openrouter.ai/api/v1",
    )

    if openrouter_key:
        for env_name in (
            "OPENROUTER_MODEL_1",
            "OPENROUTER_MODEL_2",
        ):
            model_name = os.getenv(env_name)

            if model_name:
                providers.append(
                    (
                        f"OpenRouter: {model_name}",
                        lambda model_name=model_name: ChatOpenAI(
                            model=model_name,
                            api_key=openrouter_key,
                            base_url=openrouter_url,
                            temperature=0,
                            max_retries=0,
                        ),
                    )
                )

    if not providers:
        raise HTTPException(
            status_code=503,
            detail="No AI provider is configured.",
        )

    for provider_name, create_llm in providers:
        try:
            llm = create_llm()
            response = llm.invoke(prompt)
            answer = response.content

            if isinstance(answer, list):
                answer = "\n".join(
                    item["text"]
                    for item in answer
                    if isinstance(item, dict)
                    and item.get("text")
                )

            if not isinstance(answer, str) or not answer.strip():
                raise ValueError("Empty response from provider")

            return {
                "answer": answer,
                "provider": provider_name,
                "retrieved_chunks": [
                    {
                        "text": doc.page_content,
                        "metadata": doc.metadata,
                    }
                    for doc in retrieved_docs
                ],
            }

        except Exception as exc:
            print(
                f"{provider_name} failed: "
                f"{type(exc).__name__}"
            )

    raise HTTPException(
        status_code=503,
        detail=(
            "Gemini and OpenRouter models are unavailable. "
            "Check API keys, model availability, and rate limits."
        ),
    )
