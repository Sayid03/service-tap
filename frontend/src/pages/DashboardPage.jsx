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
        {me.role === "customer" ? (
          <>
            <div className="card">
              <h3>Browse services</h3>
              <p>Find a provider and create a booking.</p>
              <Link to="/services">Browse services</Link>
            </div>

            <div className="card">
              <h3>My bookings</h3>
              <p>Track your current and past bookings.</p>
              <Link to="/bookings">Open My Bookings</Link>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <h3>Incoming bookings</h3>
              <p>Review customer requests and update booking statuses.</p>
              <Link to="/bookings">Manage bookings</Link>
            </div>

            <div className="card">
              <h3>Provider profile</h3>
              <p>Update your bio, region, and availability.</p>
              <Link to="/provider/profile">Edit provider profile</Link>
            </div>
          </>
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