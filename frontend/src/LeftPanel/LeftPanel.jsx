
import { useState, useRef, useEffect } from "react";
import {
  uploadDocument,
  sendQuestion,
  resetSession,
} from "../services/api";
import "./LeftPanel.css";

function LeftPanel({ onUploadSuccess, onChatSuccess, onReset }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const history = chatHistoryRef.current;

    if (history) {
      history.scrollTop = history.scrollHeight;
    }
  }, [messages, loading]);

  async function handleUpload() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await uploadDocument(file);

      onUploadSuccess(data);
      onChatSuccess(null);
      setMessages([]);
      setQuestion("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setActiveTab("chat");
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleChat(event) {
    event.preventDefault();

    const userQuestion = question.trim();

    if (!userQuestion) {
      setError("Please enter a question.");
      return;
    }

    setError("");
    setQuestion("");

    setMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: userQuestion,
      },
    ]);

    setLoading(true);

    try {
      const data = await sendQuestion(userQuestion);

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: data.answer || "No answer was returned.",
          provider: data.provider || "",
        },
      ]);

      onChatSuccess(data);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to get an answer. Please try again.";

      setError(errorMessage);

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset session? Uploaded document and chat data will be cleared."
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      await resetSession();

      setFile(null);
      setQuestion("");
      setMessages([]);
      setActiveTab("chat");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onReset();
    } catch (err) {
      setError(err.message || "Failed to reset session.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="left-panel">
      <div className="panel-heading">
        <h2>Workspace</h2>
        <p>Upload documents and ask questions</p>

        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Reset Session"}
        </button>
      </div>

      <div className="panel-tabs">
        <button
          type="button"
          className={`panel-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("chat");
            setError("");
          }}
          disabled={loading}
        >
          Chat
        </button>

        <button
          type="button"
          className={`panel-tab ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("upload");
            setError("");
          }}
          disabled={loading}
        >
          Upload
        </button>
      </div>

      <div className="panel-content">
        {activeTab === "chat" ? (
          <div className="chat-content">
            <h3>Ask your document</h3>
            <p>Ask questions based on your uploaded document.</p>

            <div
              className="chat-history"
              ref={chatHistoryRef}
              aria-live="polite"
              aria-label="Chat conversation"
            >
              {messages.length === 0 && (
                <div className="chat-empty">
                  <p>Your conversation will appear here.</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <span className="message-sender">
                    {message.role === "user" ? "You" : "AI Answer"}
                  </span>

                  <div
                    className={`message-bubble ${
                      message.isError ? "message-error" : ""
                    }`}
                  >
                    {message.text}
                  </div>

                  {message.provider && (
                    <span className="message-provider">
                      via {message.provider}
                    </span>
                  )}
                </div>
              ))}

              {loading && activeTab === "chat" && (
                <div className="chat-message assistant-message">
                  <span className="message-sender">AI Answer</span>
                  <div className="message-bubble typing-indicator">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <form className="chat-form" onSubmit={handleChat}>
              <label htmlFor="document-question">
                Your question
              </label>

              <textarea
                id="document-question"
                className="chat-input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask something about your document..."
                rows={3}
                disabled={loading}
              />

              {error && (
                <p className="upload-error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="upload-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Thinking..." : "Send Question"}
              </button>
            </form>
          </div>
        ) : (
          <div className="upload-content">
            <h3>Upload a document</h3>
            <p>Choose a file to inspect its chunks and vectors.</p>

            <label className="file-picker" htmlFor="document-file">
              <span className="file-picker-icon">↑</span>
              <strong>Choose a file</strong>
              <span>PDF, TXT, DOCX, XLSX or CSV</span>
            </label>

            <input
              ref={fileInputRef}
              id="document-file"
              type="file"
              accept=".pdf,.txt,.docx,.xlsx,.csv"
              disabled={loading}
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setError("");
              }}
            />

            {file && (
              <div className="selected-file">
                <span>📄</span>
                <span className="selected-file-name">{file.name}</span>
              </div>
            )}

            {error && (
              <p className="upload-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              className="upload-button"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Processing document..." : "Upload Document"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default LeftPanel;
