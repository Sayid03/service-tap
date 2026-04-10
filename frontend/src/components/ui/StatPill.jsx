export default function StatPill({ label, value }) {
    return (
      <div className="stat-pill">
        <span className="stat-pill-value">{value}</span>
        <span className="stat-pill-label">{label}</span>
      </div>
    );
  }