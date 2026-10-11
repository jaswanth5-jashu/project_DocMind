import { useState } from "react";
import "./RightPanel.css";

function RightPanel({ uploadData, chatData, onSwitchToWorkspace }) {
  const [expandedChunks, setExpandedChunks] = useState({});
  const [expandedVectors, setExpandedVectors] = useState({});

  function toggleChunk(number) {
    setExpandedChunks((previous) => ({
      ...previous,
      [number]: !previous[number],
    }));
  }

  function toggleVector(number) {
    setExpandedVectors((previous) => ({
      ...previous,
      [number]: !previous[number],
    }));
  }

  function renderMetadata(metadata) {
    if (!metadata || Object.keys(metadata).length === 0) {
      return "No metadata available.";
    }

    return JSON.stringify(metadata, null, 2);
  }

  return (
    <aside className="right-panel">
      <div className="right-panel-header">
        <div className="header-titles">
          <div className="header-titles-top">
            {onSwitchToWorkspace && (
              <button
                type="button"
                className="mobile-back-btn"
                onClick={onSwitchToWorkspace}
                aria-label="Back to Workspace"
              >
                ← Workspace
              </button>
            )}
            <h2>Document Inspector</h2>
          </div>
          <p>Explore chunks, embeddings, and retrieval results</p>
        </div>
        <span className="inspector-badge">RAG VIEW</span>
      </div>

      {!uploadData ? (
        <div className="inspector-section">
          <div className="inspector-empty">
            <div className="empty-icon">📊</div>
            <h4>No document uploaded yet</h4>
            <p>Upload a PDF, TXT, DOCX, or CSV document to inspect extracted chunks and embeddings.</p>
            {onSwitchToWorkspace && (
              <button
                type="button"
                className="mobile-action-prompt"
                onClick={onSwitchToWorkspace}
              >
                Go to Upload tab →
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="document-summary">
            <div className="summary-info">
              <span className="summary-label">Uploaded Document</span>
              <strong className="summary-filename">{uploadData.filename}</strong>
              <span className="summary-type">{uploadData.file_type || "Document"}</span>
            </div>

            <div className="summary-count">
              <strong>{uploadData.chunks}</strong>
              <span>Chunks</span>
            </div>
          </div>

          <div className="inspector-section">
            <div className="section-heading">
              <h3>Document Chunks</h3>
              <span className="count-badge">
                {uploadData.data?.length || 0} chunks
              </span>
            </div>

            <p className="inspector-description">
              Extracted document text partitioned into chunk intervals for vector indexing.
            </p>

            <div className="chunk-list">
              {(uploadData.data || []).map((chunk) => {
                const vector = chunk.vector || [];
                const dimensions = chunk.dimensions ?? vector.length;
                const isVectorExpanded = !!expandedVectors[chunk.chunk];
                const visibleVector = isVectorExpanded
                  ? vector
                  : vector.slice(0, 10);

                return (
                  <article className="chunk-card" key={chunk.chunk}>
                    <div className="chunk-card-header">
                      <h4>Chunk #{chunk.chunk}</h4>
                      <span className="dimension-badge">{dimensions} dimensions</span>
                    </div>

                    <div className="chunk-explanation">
                      <p className="chunk-label">EXTRACTED TEXT</p>
                      <pre className="chunk-text">{chunk.text}</pre>
                    </div>

                    <div className="chunk-explanation">
                      <p className="chunk-label">EMBEDDING VECTOR</p>

                      {vector.length > 0 ? (
                        <>
                          <p className="inspector-description">
                            Dense numerical representation for semantic similarity search.
                          </p>

                          <code className="vector-preview">
                            [{visibleVector
                              .map((value) => Number(value).toFixed(4))
                              .join(", ")}
                              {!isVectorExpanded && vector.length > 10
                                ? ", ..."
                                : ""}
                            ]
                          </code>

                          <div className="vector-footer">
                            <span>
                              Showing {visibleVector.length} of {dimensions} values
                            </span>

                            <button
                              type="button"
                              className="metadata-toggle"
                              onClick={() => toggleVector(chunk.chunk)}
                              disabled={vector.length <= 10}
                            >
                              {isVectorExpanded ? "View less" : "View more"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="inspector-description">
                          Vector values were not included in the response.
                        </p>
                      )}
                    </div>

                    <div className="vector-footer">
                      <span>Source metadata</span>

                      <button
                        type="button"
                        className="metadata-toggle"
                        onClick={() => toggleChunk(chunk.chunk)}
                      >
                        {expandedChunks[chunk.chunk]
                          ? "Hide metadata"
                          : "View metadata"}
                      </button>
                    </div>

                    {expandedChunks[chunk.chunk] && (
                      <pre className="metadata-content">
                        {renderMetadata(chunk.metadata)}
                      </pre>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Retrieved Chunks Section */}
      <div className="inspector-section">
        <div className="section-heading">
          <h3>Retrieved Context Chunks</h3>
          <span className="count-badge">
            {chatData?.retrieved_chunks?.length || 0} retrieved
          </span>
        </div>

        <p className="inspector-description">
          Top matching passages retrieved from vector search to answer your question.
        </p>

        {chatData?.retrieved_chunks?.length ? (
          <div className="chunk-list">
            {chatData.retrieved_chunks.map((chunk, index) => {
              const metadataKey = `retrieved-${index}`;
              const isMetadataExpanded = !!expandedChunks[metadataKey];

              return (
                <article className="chunk-card retrieved-card" key={metadataKey}>
                  <div className="chunk-card-header">
                    <h4>Result #{index + 1}</h4>
                    <span className="retrieved-badge">Relevant Context</span>
                  </div>

                  <p className="chunk-label">RETRIEVED TEXT</p>
                  <pre className="chunk-text">{chunk.text}</pre>

                  <div className="vector-footer">
                    <span>Source metadata</span>

                    <button
                      type="button"
                      className="metadata-toggle"
                      onClick={() => toggleChunk(metadataKey)}
                    >
                      {isMetadataExpanded
                        ? "Hide metadata"
                        : "View metadata"}
                    </button>
                  </div>

                  {isMetadataExpanded && (
                    <pre className="metadata-content">
                      {renderMetadata(chunk.metadata)}
                    </pre>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="inspector-empty">
            <h4>No retrieved chunks yet</h4>
            <p>Ask a question in the Workspace chat to see context retrieval here.</p>
          </div>
        )}
      </div>

      {/* Generated Answer Section */}
      <div className="inspector-section">
        <div className="section-heading">
          <h3>Generated Answer</h3>
          {chatData?.provider && (
            <span className="count-badge provider-badge">{chatData.provider}</span>
          )}
        </div>

        {chatData?.answer ? (
          <div className="answer-content">
            <p className="answer-text">{chatData.answer}</p>
          </div>
        ) : (
          <div className="inspector-empty">
            <h4>Awaiting question</h4>
            <p>The AI-generated response based on your document will appear here.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightPanel;
