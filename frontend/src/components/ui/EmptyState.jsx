import { Link } from "react-router-dom";

export default function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="card centered-block">
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && actionTo && <Link to={actionTo} className="btn">{actionLabel}</Link>}
    </div>
  );
}