import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getServiceById } from "../api/services";
import { authStore } from "../store/authStore";

export default function ServiceDetailPage() {
  const { id } = useParams();

  const { data: service, isLoading, error } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
  });

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
          {service.average_rating ?? "No ratings yet"} (
          {service.reviews_count ?? 0} reviews)
        </p>
        <p><strong>Status:</strong> {service.is_active ? "Active" : "Inactive"}</p>

        {authStore.isAuthenticated() ? (
          <button style={{ marginTop: "12px" }}>Book this service</button>
        ) : (
          <p style={{ marginTop: "12px" }}>
            <Link to="/login">Log in</Link> to book this service.
          </p>
        )}
      </div>
    </section>
  );
}