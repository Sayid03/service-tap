import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getServiceById } from "../api/services";
import { createBooking, getBookings } from "../api/bookings";
import { getReviews, createReview } from "../api/reviews";
import { authStore } from "../store/authStore";
import { useMe } from "../hooks/useMe";

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
  const queryClient = useQueryClient();
  const isAuthed = authStore.isAuthenticated();

  const { data: me } = useMe();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", "service", id],
    queryFn: () => getReviews({ service: id }),
    enabled: !!id,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
    enabled: isAuthed,
  });

  const reviews = Array.isArray(reviewsData)
    ? reviewsData
    : Array.isArray(reviewsData?.results)
    ? reviewsData.results
    : [];

  const bookings = Array.isArray(bookingsData)
    ? bookingsData
    : Array.isArray(bookingsData?.results)
    ? bookingsData.results
    : [];

  const minDateTime = useMemo(() => toLocalDatetimeInputValue(new Date()), []);
  const [bookingForm, setBookingForm] = useState({
    booking_date: "",
    address: "",
    notes: "",
  });

  const [reviewForm, setReviewForm] = useState({
    booking: "",
    rating: 5,
    comment: "",
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      navigate("/bookings");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews", "service", id] });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setReviewForm({
        booking: "",
        rating: 5,
        comment: "",
      });
    },
  });

  const handleBookingChange = (e) => {
    setBookingForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReviewChange = (e) => {
    setReviewForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    bookingMutation.mutate({
      service: Number(id),
      booking_date: bookingForm.booking_date,
      address: bookingForm.address,
      notes: bookingForm.notes,
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    reviewMutation.mutate({
      booking: Number(reviewForm.booking),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment,
    });
  };

  const reviewedBookingIds = new Set(reviews.map((review) => review.booking));

  const eligibleBookings =
    me?.role === "customer"
      ? bookings.filter(
          (booking) =>
            String(booking.service) === String(id) &&
            booking.status === "completed" &&
            !reviewedBookingIds.has(booking.id)
        )
      : [];

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
                value={bookingForm.booking_date}
                onChange={handleBookingChange}
                required
              />
            </label>

            <label>
              Address
              <input
                type="text"
                name="address"
                placeholder="Enter service address"
                value={bookingForm.address}
                onChange={handleBookingChange}
                required
              />
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                placeholder="Add details for the provider"
                rows={4}
                value={bookingForm.notes}
                onChange={handleBookingChange}
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

      <div className="card" style={{ marginTop: "16px" }}>
        <h2>Customer Reviews</h2>

        {reviewsLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {reviews.map((review) => (
              <div key={review.id} className="card">
                <p><strong>{review.customer_username}</strong></p>
                <p><strong>Rating:</strong> {review.rating}/5</p>
                <p>{review.comment || "No comment provided."}</p>
                <p>
                  <small>
                    {review.created_at
                      ? new Date(review.created_at).toLocaleString()
                      : ""}
                  </small>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAuthed && me?.role === "customer" && (
        <div className="card" style={{ marginTop: "16px" }}>
          <h2>Leave a Review</h2>

          {eligibleBookings.length === 0 ? (
            <p>
              You can leave a review only after one of your bookings for this service is completed.
            </p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="form-card" style={{ maxWidth: "100%" }}>
              <label>
                Completed booking
                <select
                  name="booking"
                  value={reviewForm.booking}
                  onChange={handleReviewChange}
                  required
                >
                  <option value="">Select completed booking</option>
                  {eligibleBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      #{booking.id} — {new Date(booking.booking_date).toLocaleString()}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Rating
                <select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                  required
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Okay</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Bad</option>
                </select>
              </label>

              <label>
                Comment
                <textarea
                  name="comment"
                  rows={4}
                  placeholder="Share your experience"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  required
                />
              </label>

              <button type="submit" disabled={reviewMutation.isPending}>
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>

              {reviewMutation.isError && (
                <p style={{ color: "crimson" }}>
                  {reviewMutation.error?.response?.data
                    ? JSON.stringify(reviewMutation.error.response.data)
                    : "Failed to submit review."}
                </p>
              )}

              {reviewMutation.isSuccess && (
                <p>Review submitted successfully.</p>
              )}
            </form>
          )}
        </div>
      )}
    </section>
  );
}