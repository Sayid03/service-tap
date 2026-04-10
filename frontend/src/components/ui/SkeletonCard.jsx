export default function SkeletonCard({ lines = 3, hasAvatar = false }) {
    return (
      <div className="card skeleton-card">
        {hasAvatar && (
          <div className="skeleton-row">
            <div className="skeleton skeleton-avatar"></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-line short"></div>
              <div className="skeleton skeleton-line tiny"></div>
            </div>
          </div>
        )}
  
        {!hasAvatar && <div className="skeleton skeleton-image"></div>}
  
        <div className="skeleton skeleton-line medium"></div>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`skeleton skeleton-line ${
              index === lines - 1 ? "short" : "full"
            }`}
          ></div>
        ))}
      </div>
    );
  }