export default function AvatarPlaceholder({ name = "User", size = "md" }) {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  
    return (
      <div className={`avatar avatar-${size}`} aria-hidden="true">
        {initials || "U"}
      </div>
    );
  }