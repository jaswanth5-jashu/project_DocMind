
import { useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import LeftPanel from "./LeftPanel/LeftPanel";
import RightPanel from "./RightPanel/RightPanel";

function App() {
  const [uploadData, setUploadData] = useState(null);
  const [chatData, setChatData] = useState(null);

  function handleReset() {
    setUploadData(null);
    setChatData(null);
  }

  return (
    <div className="app">
      <Header />

      <main className="dashboard">
        <section className="dashboard-left">
          <LeftPanel
            onUploadSuccess={setUploadData}
            onChatSuccess={setChatData}
            onReset={handleReset}
          />
        </section>

        <section className="dashboard-right">
          <RightPanel
            key={uploadData ? "uploaded" : "empty"}
            uploadData={uploadData}
            chatData={chatData}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
