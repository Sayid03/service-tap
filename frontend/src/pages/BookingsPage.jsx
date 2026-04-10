import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBookings, updateBookingStatus } from "../api/bookings";
import { useMe } from "../hooks/useMe";
import toast from "react-hot-toast";

function getNextActions(status) {
  switch (status) {
    case "pending":
      return ["accepted", "cancelled"];
    case "accepted":
      return ["in_progress", "cancelled"];
    case "in_progress":
      return ["completed"];
    default:
      return [];
  }
}

function formatStatusLabel(status) {
  if (status === "in_progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useMe();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated");
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  const bookings = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  if (meLoading || isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Failed to load bookings.</p>;

  const isProvider = me?.role === "provider";

  return (
    <section>
      <h1>{isProvider ? "Incoming Bookings" : "My Bookings"}</h1>

      {bookings.length === 0 ? (
        <div className="card">
          <p>
            {isProvider
              ? "No customers have booked your services yet."
              : "You have no bookings yet."}
          </p>
          <Link to="/services">
            {isProvider ? "View services" : "Browse services"}
          </Link>
        </div>
      ) : (
        <div className="grid">
          {bookings.map((booking) => {
            const actions = isProvider ? getNextActions(booking.status) : [];

            return (
              <article key={booking.id} className="card">
                <h3>{booking.service_title}</h3>

                <p><strong>Booking ID:</strong> #{booking.id}</p>
                <p>
                  <strong>{isProvider ? "Customer" : "Provider"}:</strong>{" "}
                  {isProvider
                    ? booking.customer_username
                    : booking.provider_username}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {booking.booking_date
                    ? new Date(booking.booking_date).toLocaleString()
                    : "Not specified"}
                </p>
                <p><strong>Address:</strong> {booking.address}</p>
                <p><strong>Status:</strong> {formatStatusLabel(booking.status)}</p>
                <p>
                  <strong>Estimated price:</strong>{" "}
                  {booking.estimated_price ?? "Not specified"}
                </p>
                <p><strong>Notes:</strong> {booking.notes || "No notes"}</p>

                {isProvider && actions.length > 0 && (
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {actions.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        onClick={() =>
                          statusMutation.mutate({
                            id: booking.id,
                            status: nextStatus,
                          })
                        }
                        disabled={statusMutation.isPending}
                      >
                        Mark as {formatStatusLabel(nextStatus)}
                      </button>
                    ))}
                  </div>
                )}

                {isProvider && statusMutation.isError && (
                  <p style={{ color: "crimson", marginTop: "10px" }}>
                    {statusMutation.error?.response?.data
                      ? JSON.stringify(statusMutation.error.response.data)
                      : "Failed to update booking status."}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}