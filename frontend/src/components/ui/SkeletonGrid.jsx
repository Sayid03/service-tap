import SkeletonCard from "./SkeletonCard";

export default function SkeletonGrid({ count = 6, hasAvatar = false }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} hasAvatar={hasAvatar} />
      ))}
    </div>
  );
}