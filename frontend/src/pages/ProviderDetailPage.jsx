import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProviderById } from "../api/users";
import { getServices } from "../api/services";

export default function ProviderDetailPage() {
  const { id } = useParams();

  const {
    data: provider,
    isLoading: providerLoading,
    error: providerError,
  } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => getProviderById(id),
    enabled: !!id,
  });

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  const allServices = Array.isArray(servicesData)
    ? servicesData
    : Array.isArray(servicesData?.results)
    ? servicesData.results
    : [];

  const providerServices = provider
    ? allServices.filter(
        (service) => service.provider_username === provider.username
      )
    : [];

  if (providerLoading || servicesLoading) return <p>Loading provider...</p>;
  if (providerError || servicesError) return <p>Failed to load provider data.</p>;
  if (!provider) return <p>Provider not found.</p>;

  const fullName = [provider.first_name, provider.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <section>
      <Link to="/providers">← Back to providers</Link>

      <div className="card" style={{ marginTop: "16px" }}>
        <h1>{fullName || provider.username}</h1>

        <p><strong>Username:</strong> {provider.username}</p>
        <p>
          <strong>Verified provider:</strong>{" "}
          {provider.is_verified_provider ? "Yes" : "No"}
        </p>
        <p>
          <strong>Rating:</strong>{" "}
          {provider.average_rating ?? "No rating yet"} (
          {provider.reviews_count ?? 0} reviews)
        </p>
        <p><strong>Services count:</strong> {provider.services_count ?? 0}</p>
        <p><strong>Bio:</strong> {provider.provider_profile?.bio || "Not provided"}</p>
        <p>
          <strong>Experience:</strong>{" "}
          {provider.provider_profile?.experience_years ?? "Not specified"} years
        </p>
        <p>
          <strong>Region:</strong>{" "}
          {provider.provider_profile?.region || "Not specified"}
        </p>
        <p>
          <strong>District:</strong>{" "}
          {provider.provider_profile?.district || "Not specified"}
        </p>
        <p>
          <strong>Availability:</strong>{" "}
          {provider.provider_profile?.is_available ? "Available" : "Unavailable"}
        </p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h2>Services by this provider</h2>

        {providerServices.length === 0 ? (
          <div className="card">
            <p>This provider has no public services yet.</p>
          </div>
        ) : (
          <div className="grid">
            {providerServices.map((service) => (
              <article key={service.id} className="card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p><strong>Category:</strong> {service.category_name}</p>
                <p><strong>Pricing:</strong> {service.pricing_type}</p>
                <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
                <p><strong>Location:</strong> {service.location || "Not specified"}</p>
                <p>
                  <strong>Rating:</strong>{" "}
                  {service.average_rating ?? "No rating yet"} (
                  {service.reviews_count ?? 0})
                </p>
                <Link to={`/services/${service.id}`}>View service</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}