import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = authStore.isAuthenticated();

  const handleLogout = () => {
    authStore.clear();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">ServiceTap</Link>

        <nav className="nav-links">
          <Link to="/services">Services</Link>
          <Link to="/providers">Providers</Link>
          {isAuthed ? (
            <>
              <Link to="/bookings">My Bookings</Link>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}