import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getServiceById } from "../api/services";
import { createBooking } from "../api/bookings";
import { authStore } from "../store/authStore";

function toLocalDatetimeInputValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthed = authStore.isAuthenticated();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });

  const minDateTime = useMemo(() => toLocalDatetimeInputValue(new Date()), []);
  const [form, setForm] = useState({
    booking_date: "",
    address: "",
    notes: "",
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      navigate("/bookings");
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    bookingMutation.mutate({
      service: Number(id),
      booking_date: form.booking_date,
      address: form.address,
      notes: form.notes,
    });
  };

  if (isLoading) return <p>Loading service...</p>;
  if (error) return <p>Failed to load service details.</p>;
  if (!service) return <p>Service not found.</p>;

  return (
    <section>
      <Link to="/services">← Back to services</Link>

      <div className="card" style={{ marginTop: "16px" }}>
        <h1>{service.title}</h1>
        <p>{service.description}</p>

        <p><strong>Category:</strong> {service.category_name}</p>
        <p><strong>Provider:</strong> {service.provider_username}</p>
        <p><strong>Pricing type:</strong> {service.pricing_type}</p>
        <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
        <p>
          <strong>Estimated duration:</strong>{" "}
          {service.estimated_duration_hours ?? "Not specified"} hours
        </p>
        <p><strong>Location:</strong> {service.location || "Not specified"}</p>
        <p>
          <strong>Rating:</strong>{" "}
          {service.average_rating ?? "No ratings yet"} ({service.reviews_count ?? 0} reviews)
        </p>
        <p><strong>Status:</strong> {service.is_active ? "Active" : "Inactive"}</p>
      </div>

      <div className="card" style={{ marginTop: "16px" }}>
        <h2>Book this service</h2>

        {!isAuthed ? (
          <p>
            <Link to="/login">Log in</Link> to make a booking.
          </p>
        ) : (
          <form onSubmit={handleBookingSubmit} className="form-card" style={{ maxWidth: "100%" }}>
            <label>
              Booking date and time
              <input
                type="datetime-local"
                name="booking_date"
                min={minDateTime}
                value={form.booking_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Address
              <input
                type="text"
                name="address"
                placeholder="Enter service address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                placeholder="Add details for the provider"
                rows={4}
                value={form.notes}
                onChange={handleChange}
              />
            </label>

            <button type="submit" disabled={bookingMutation.isPending}>
              {bookingMutation.isPending ? "Creating booking..." : "Confirm booking"}
            </button>

            {bookingMutation.isError && (
              <p style={{ color: "crimson" }}>
                {bookingMutation.error?.response?.data
                  ? JSON.stringify(bookingMutation.error.response.data)
                  : "Failed to create booking."}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}