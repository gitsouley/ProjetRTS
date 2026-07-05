import { useEffect, useRef } from "react";

const STATUS_COLORS = {
  stable: "var(--accent-signal)",
  limite: "var(--accent-warning)",
  instable: "var(--accent-critical)",
};

export default function SignalPath({ input, results, classification }) {
  const lineRef = useRef(null);
  const color = STATUS_COLORS[classification?.status] || "var(--accent-signal)";

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    el.style.setProperty("--signal-width", "0%");
    requestAnimationFrame(() => {
      el.style.setProperty("--signal-width", "100%");
    });
  }, [results]);

  const { fspl_db: fspl, received_power_dbm: pr, link_margin_db: margin } = results || {};
  const pt = input?.tx_power_dbm;
  const sr = input?.rx_sensitivity_dbm;

  const nodes = [
    { label: "Pt", value: pt != null ? `${pt} dBm` : "—" },
    { label: "FSPL", value: fspl != null ? `${fspl} dB` : "—", muted: true },
    { label: "Pr", value: pr != null ? `${pr} dBm` : "—" },
    { label: "Marge", value: margin != null ? `${margin} dB` : "—" },
    { label: "Sr", value: sr != null ? `${sr} dBm` : "—", muted: true },
  ];

  return (
    <div className="card signal-path-card">
      <div className="signal-path-nodes">
        {nodes.map((node, i) => (
          <div key={node.label} className="signal-node">
            <div
              className="signal-node-circle"
              style={{
                borderColor: node.muted ? "var(--border-subtle)" : color,
                background: node.muted ? "var(--bg-surface-raised)" : `${color}22`,
              }}
            >
              <span className="signal-node-label" style={{ color: node.muted ? "var(--text-muted)" : color }}>
                {node.label}
              </span>
            </div>
            <span
              className="signal-node-value"
              style={{ color: node.muted ? "var(--text-muted)" : color }}
            >
              {node.value}
            </span>
            {i < nodes.length - 1 && <span className="signal-arrow">▶</span>}
          </div>
        ))}
      </div>
      <div
        ref={lineRef}
        className="signal-path-line"
        style={{
          background: `linear-gradient(90deg, ${color}, var(--bg-primary))`,
          width: "var(--signal-width, 0%)",
        }}
      />
    </div>
  );
}
