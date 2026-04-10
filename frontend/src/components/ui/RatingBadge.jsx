export default function RatingBadge({ rating, reviewsCount = 0 }) {
    const hasRating = rating !== null && rating !== undefined;
  
    return (
      <div className="rating-badge">
        <span>★</span>
        <span>{hasRating ? rating : "New"}</span>
        <span className="rating-badge-count">
          ({reviewsCount || 0})
        </span>
      </div>
    );
  }