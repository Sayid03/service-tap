export default function SectionHeader({ eyebrow, title, subtitle, action }) {
    return (
      <div className="section-header">
        <div>
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }