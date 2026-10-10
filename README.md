# DocMind – RAG Document Q&A

DocMind is a **Retrieval-Augmented Generation (RAG) based document question-answering web application** that allows users to upload documents and ask questions about their content. It extracts text from supported file formats, splits the content into smaller chunks, generates embeddings, and retrieves relevant information to generate context-aware answers using Large Language Models (LLMs).

The application is built with **FastAPI, React, LangChain, and Google Gemini**, with OpenRouter models configured as fallback providers to improve reliability when the primary model is unavailable.

### Key Features
- **Multi-format Document Upload:** Supports PDF, DOCX, TXT, XLSX, and CSV files.
- **Text Extraction & Chunking:** Extracts document content and splits it into manageable chunks.
- **Vector Embeddings:** Converts text into numerical vector representations using Google Gemini Embeddings.
- **Semantic Search:** Retrieves relevant document chunks based on user questions.
- **AI-Powered Answers:** Generates answers grounded in the uploaded document's content.
- **LLM Fallback:** Uses OpenRouter models as alternative providers when the primary Gemini model fails.
- **Interactive Chat Interface:** Displays user questions and AI responses in a conversational UI.
- **Document Inspector:** Displays extracted chunks, embedding vector previews, retrieved context, and generated answers.
- **Session Reset:** Allows users to clear the current in-memory document session.

### Tech Stack
- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI
- **AI / LLM:** Google Gemini, OpenRouter
- **RAG Framework:** LangChain
- **Embeddings:** Google Gemini Embeddings (`gemini-embedding-001`)
- **Vector Store:** LangChain InMemoryVectorStore
- **Deployment:** Vercel

### How It Works
1. Upload a supported document.
2. Extract and split its content into chunks.
3. Generate embeddings for the chunks and store them in an in-memory vector store.
4. Enter a question in the chat interface.
5. Retrieve the most relevant chunks using semantic similarity search.
6. Generate an answer using the retrieved context and the configured LLM provider.
7. Display the answer and retrieved sources in the interface.

### Project Goal
The goal of DocMind is to make document analysis easier by allowing users to interact with their files using natural language instead of manually searching through lengthy documents.

### Note
DocMind currently uses an **in-memory vector store**, so uploaded document data is not permanently stored. In serverless deployments, session persistence may depend on how requests are handled. API availability and fallback behavior also depend on provider quotas, rate limits, and model availability.
