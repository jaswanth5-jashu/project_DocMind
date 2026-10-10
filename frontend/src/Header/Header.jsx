import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">D</div>

        <div>
          <h1>DocMind</h1>
          <span>RAG Document Assistant</span>
        </div>
      </div>

      <div className="header-status">
        <span className="status-dot"></span>
        Project Connected
      </div>
    </header>
  );
}

export default Header;