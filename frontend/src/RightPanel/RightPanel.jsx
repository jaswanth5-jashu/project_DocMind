
import { useState } from "react";
import "./RightPanel.css";

function RightPanel({ uploadData, chatData }) {
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
        <div>
          <h2>Document Inspector</h2>
          <p>Explore chunks, embeddings and retrieval results</p>
        </div>
        <span className="inspector-badge">RAG VIEW</span>
      </div>

      {!uploadData ? (
        <div className="inspector-section">
          <div className="inspector-empty">
            <div className="empty-icon">▤</div>
            <h4>No document uploaded</h4>
            <p>Use the Upload tab to inspect chunks and vectors.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="document-summary">
            <div>
              <span className="summary-label">Uploaded file</span>
              <strong>{uploadData.filename}</strong>
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
              Extracted text split into smaller pieces for retrieval.
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
                      <h4>Document Chunk {chunk.chunk}</h4>
                      <span>{dimensions} dimensions</span>
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
                            Numerical representation of this chunk used for
                            similarity search.
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
                              Showing {visibleVector.length} of{" "}
                              {dimensions} values
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
                          Vector values were not included in the upload
                          response.
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

      <div className="inspector-section">
        <div className="section-heading">
          <h3>Retrieved Chunks</h3>
          <span className="count-badge">
            {chatData?.retrieved_chunks?.length || 0} chunks
          </span>
        </div>

        <p className="inspector-description">
          Text selected from the document as context for your question.
        </p>

        {chatData?.retrieved_chunks?.length ? (
          <div className="chunk-list">
            {chatData.retrieved_chunks.map((chunk, index) => {
              const metadataKey = `retrieved-${index}`;
              const isMetadataExpanded = !!expandedChunks[metadataKey];

              return (
                <article className="chunk-card" key={metadataKey}>
                  <div className="chunk-card-header">
                    <h4>Retrieved Chunk {index + 1}</h4>
                    <span>Search result</span>
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
            <h4>No search results yet</h4>
            <p>Ask a question to see retrieved chunks here.</p>
          </div>
        )}
      </div>

      <div className="inspector-section">
        <div className="section-heading">
          <h3>Generated Answer</h3>
          {chatData?.provider && (
            <span className="count-badge">{chatData.provider}</span>
          )}
        </div>

        {chatData?.answer ? (
          <div className="answer-content">
            <p>{chatData.answer}</p>
          </div>
        ) : (
          <div className="inspector-empty">
            <h4>Waiting for a question</h4>
            <p>Your document-based answer will appear here.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightPanel;
