import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBookings } from "../api/bookings";

export default function BookingsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  const bookings = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  if (isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Failed to load bookings.</p>;

  return (
    <section>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="card">
          <p>You have no bookings yet.</p>
          <Link to="/services">Browse services</Link>
        </div>
      ) : (
        <div className="grid">
          {bookings.map((booking) => (
            <article key={booking.id} className="card">
              <h3>{booking.service_title}</h3>
              <p><strong>Booking ID:</strong> #{booking.id}</p>
              <p><strong>Provider:</strong> {booking.provider_username}</p>
              <p>
                <strong>Date:</strong>{" "}
                {booking.booking_date
                  ? new Date(booking.booking_date).toLocaleString()
                  : "Not specified"}
              </p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p>
                <strong>Estimated price:</strong>{" "}
                {booking.estimated_price ?? "Not specified"}
              </p>
              <p><strong>Notes:</strong> {booking.notes || "No notes"}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}