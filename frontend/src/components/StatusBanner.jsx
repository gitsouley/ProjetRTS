const COLOR_MAP = {
  green: "var(--accent-signal)",
  orange: "var(--accent-warning)",
  red: "var(--accent-critical)",
};

export default function StatusBanner({ classification, interpretation }) {
  const borderColor = COLOR_MAP[classification?.color] || "var(--accent-signal)";

  return (
    <div className="card status-banner" style={{ borderLeftColor: borderColor }}>
      <p className="status-banner-text" style={{ color: borderColor }}>
        {interpretation}
      </p>
    </div>
  );
}
