export default function Header({ onNavigate, currentPage }) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        padding: "1rem 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "var(--accent-signal)" }}>Link</span>Budget
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
            Pro
          </span>
        </button>

        <nav style={{ display: "flex", gap: "1rem" }}>
          <NavButton
            label="Accueil"
            active={currentPage === "home"}
            onClick={() => onNavigate("home")}
          />
          <NavButton
            label="Simulation"
            active={currentPage === "simulate"}
            onClick={() => onNavigate("simulate")}
          />
        </nav>
      </div>
    </header>
  );
}

function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "var(--bg-surface-raised)" : "transparent",
        border: active ? "1px solid var(--border-subtle)" : "1px solid transparent",
        color: active ? "var(--accent-signal)" : "var(--text-muted)",
        padding: "0.4rem 0.9rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "0.85rem",
        transition: "all 150ms ease",
      }}
    >
      {label}
    </button>
  );
}
