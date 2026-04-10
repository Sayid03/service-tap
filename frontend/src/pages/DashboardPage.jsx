import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";

export default function DashboardPage() {
  const { data: me, isLoading, error } = useMe();

  if (isLoading) return <p>Loading your dashboard...</p>;
  if (error) return <p>Could not load your profile.</p>;
  if (!me) return <p>No user data found.</p>;

  const fullName = [me.first_name, me.last_name].filter(Boolean).join(" ");

  return (
    <section>
      <h1>Dashboard</h1>

      <div className="card">
        <p><strong>Name:</strong> {fullName || me.username}</p>
        <p><strong>Username:</strong> {me.username}</p>
        <p><strong>Email:</strong> {me.email || "Not specified"}</p>
        <p><strong>Role:</strong> {me.role}</p>
        <p><strong>Phone:</strong> {me.phone_number || "Not specified"}</p>
        <p>
          <strong>Verified provider:</strong>{" "}
          {me.is_verified_provider ? "Yes" : "No"}
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Customer actions</h3>
          <p>Browse services and manage your bookings.</p>
          <Link to="/services">Browse services</Link>
          <br />
          <Link to="/bookings">My bookings</Link>
        </div>

        {me.role === "provider" && (
          <div className="card">
            <h3>Provider actions</h3>
            <p>Manage your provider profile and later your services.</p>
            <Link to="/provider/profile">Provider profile</Link>
          </div>
        )}
      </div>

      {me.role === "provider" && me.provider_profile && (
        <div className="card">
          <h3>Provider profile</h3>
          <p><strong>Bio:</strong> {me.provider_profile.bio || "Not set"}</p>
          <p>
            <strong>Experience:</strong>{" "}
            {me.provider_profile.experience_years ?? "Not set"} years
          </p>
          <p><strong>Region:</strong> {me.provider_profile.region || "Not set"}</p>
          <p><strong>District:</strong> {me.provider_profile.district || "Not set"}</p>
          <p><strong>Address:</strong> {me.provider_profile.address || "Not set"}</p>
          <p>
            <strong>Available:</strong>{" "}
            {me.provider_profile.is_available ? "Yes" : "No"}
          </p>
        </div>
      )}
    </section>
  );
}