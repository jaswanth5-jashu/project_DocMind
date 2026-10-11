import { useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import LeftPanel from "./LeftPanel/LeftPanel";
import RightPanel from "./RightPanel/RightPanel";

function App() {
  const [uploadData, setUploadData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [mobileView, setMobileView] = useState("workspace"); // 'workspace' | 'inspector'

  function handleReset() {
    setUploadData(null);
    setChatData(null);
    setMobileView("workspace");
  }

  function handleUploadSuccess(data) {
    setUploadData(data);
  }

  function handleChatSuccess(data) {
    setChatData(data);
  }

  return (
    <div className="app">
      <Header />

      {/* Mobile / Tablet Segmented Navigation */}
      <nav className="mobile-nav" aria-label="View Switcher">
        <button
          type="button"
          className={`mobile-nav-btn ${mobileView === "workspace" ? "active" : ""}`}
          onClick={() => setMobileView("workspace")}
          aria-pressed={mobileView === "workspace"}
        >
          <span className="mobile-nav-icon">💬</span>
          <span>Workspace</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-btn ${mobileView === "inspector" ? "active" : ""}`}
          onClick={() => setMobileView("inspector")}
          aria-pressed={mobileView === "inspector"}
        >
          <span className="mobile-nav-icon">📊</span>
          <span>Inspector</span>
          {uploadData?.chunks ? (
            <span className="mobile-nav-badge">{uploadData.chunks}</span>
          ) : null}
        </button>
      </nav>

      <main className="dashboard">
        <section
          className={`dashboard-left ${
            mobileView === "workspace" ? "mobile-panel-active" : "mobile-panel-hidden"
          }`}
        >
          <LeftPanel
            onUploadSuccess={handleUploadSuccess}
            onChatSuccess={handleChatSuccess}
            onReset={handleReset}
            onSwitchToInspector={() => setMobileView("inspector")}
            hasUploadedData={!!uploadData}
            chunkCount={uploadData?.chunks || 0}
          />
        </section>

        <section
          className={`dashboard-right ${
            mobileView === "inspector" ? "mobile-panel-active" : "mobile-panel-hidden"
          }`}
        >
          <RightPanel
            key={uploadData ? "uploaded" : "empty"}
            uploadData={uploadData}
            chatData={chatData}
            onSwitchToWorkspace={() => setMobileView("workspace")}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
