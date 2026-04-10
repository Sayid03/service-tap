import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { useMe } from "../../hooks/useMe";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = authStore.isAuthenticated();
  const { data: me } = useMe();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    authStore.clear();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          ServiceTap
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? "nav-links-open" : ""}`}>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/providers" onClick={closeMenu}>Providers</Link>

          {isAuthed ? (
            <>
              {me?.role === "provider" && (
                <Link to="/provider/services" onClick={closeMenu}>
                  My Services
                </Link>
              )}

              <Link to="/bookings" onClick={closeMenu}>
                {me?.role === "provider" ? "Incoming Bookings" : "My Bookings"}
              </Link>

              <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>

              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}