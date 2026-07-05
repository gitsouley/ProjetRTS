import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

export default function ChartFsplVsFrequency({ data, currentFrequency, currentFspl }) {
  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          marginBottom: "1rem",
          color: "var(--text-muted)",
        }}
      >
        Affaiblissement FSPL en fonction de la fréquence
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-subtle)" />
          <XAxis
            dataKey="frequency_mhz"
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "var(--font-mono)" }}
            label={{ value: "Fréquence (MHz)", position: "bottom", fill: "var(--text-muted)", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 12, fontFamily: "var(--font-mono)" }}
            label={{ value: "FSPL (dB)", angle: -90, position: "insideLeft", fill: "var(--text-muted)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
            }}
          />
          <Line
            type="monotone"
            dataKey="fspl_db"
            stroke="var(--accent-data)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent-data)" }}
          />
          {currentFrequency && currentFspl !== undefined && (
            <ReferenceDot
              x={currentFrequency}
              y={currentFspl}
              r={6}
              fill="var(--accent-signal)"
              stroke="var(--bg-primary)"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
