import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProviderById } from "../api/users";
import { getServices } from "../api/services";
import AvatarPlaceholder from "../components/ui/AvatarPlaceholder";
import RatingBadge from "../components/ui/RatingBadge";
import SkeletonGrid from "../components/ui/SkeletonGrid";

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

    if (providerLoading || servicesLoading) {
      return (
        <section>
          <div className="card provider-hero-card" style={{ marginTop: "16px" }}>
            <div className="entity-head entity-head-large">
              <div className="skeleton skeleton-avatar-xl"></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton skeleton-line medium"></div>
                <div className="skeleton skeleton-line short"></div>
              </div>
            </div>
          </div>
    
          <div style={{ marginTop: "24px" }}>
            <SkeletonGrid count={3} />
          </div>
        </section>
      );
    }
  if (providerError || servicesError) return <p>Failed to load provider data.</p>;
  if (!provider) return <p>Provider not found.</p>;

  const fullName = [provider.first_name, provider.last_name]
    .filter(Boolean)
    .join(" ");
  const displayName = fullName || provider.username;

  return (
    <section>
      <Link to="/providers">← Back to providers</Link>

      <div className="card provider-hero-card" style={{ marginTop: "16px" }}>
        <div className="entity-head entity-head-large">
          <AvatarPlaceholder name={displayName} size="xl" />
          <div className="entity-head-text">
            <h1>{displayName}</h1>
            <p>@{provider.username}</p>
          </div>
        </div>

        <div className="provider-hero-meta">
          <span className="chip">
            {provider.is_verified_provider ? "Verified" : "Provider"}
          </span>
          <RatingBadge
            rating={provider.average_rating}
            reviewsCount={provider.reviews_count}
          />
          <span className="soft-pill">
            {provider.services_count ?? 0} services
          </span>
        </div>

        <p><strong>Bio:</strong> {provider.provider_profile?.bio || "Not provided"}</p>
        <p>
          <strong>Experience:</strong>{" "}
          {provider.provider_profile?.experience_years ?? "Not specified"} years
        </p>
        <p><strong>Region:</strong> {provider.provider_profile?.region || "Not specified"}</p>
        <p><strong>District:</strong> {provider.provider_profile?.district || "Not specified"}</p>
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
              <article key={service.id} className="card polished-card">
                <div className="card-topline">
                  <span className="chip">{service.category_name}</span>
                  <RatingBadge
                    rating={service.average_rating}
                    reviewsCount={service.reviews_count}
                  />
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="meta-list">
                  <p><strong>Pricing:</strong> {service.pricing_type}</p>
                  <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
                  <p><strong>Location:</strong> {service.location || "Not specified"}</p>
                </div>

                <Link to={`/services/${service.id}`} className="btn">
                  View service
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}