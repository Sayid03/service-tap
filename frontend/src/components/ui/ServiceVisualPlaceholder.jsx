export default function ServiceVisualPlaceholder({ category = "Service" }) {
    return (
      <div className="service-visual">
        <span className="service-visual-badge">{category}</span>
      </div>
    );
  }