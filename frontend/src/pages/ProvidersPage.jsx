import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProviders } from "../api/users";
import AvatarPlaceholder from "../components/ui/AvatarPlaceholder";
import RatingBadge from "../components/ui/RatingBadge";

export default function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [region, setRegion] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  const providers = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  const regions = useMemo(() => {
    const uniqueRegions = new Set(
      providers
        .map((provider) => provider.provider_profile?.region)
        .filter(Boolean)
    );
    return Array.from(uniqueRegions).sort();
  }, [providers]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const fullName = [provider.first_name, provider.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const providerSearch =
        provider.username?.toLowerCase().includes(search.toLowerCase()) ||
        fullName.includes(search.toLowerCase());

      const providerVerified = verifiedOnly
        ? provider.is_verified_provider
        : true;

      const providerAvailable = availableOnly
        ? !!provider.provider_profile?.is_available
        : true;

      const providerRegion = region
        ? provider.provider_profile?.region === region
        : true;

      return providerSearch && providerVerified && providerAvailable && providerRegion;
    });
  }, [providers, search, verifiedOnly, availableOnly, region]);

  const resetFilters = () => {
    setSearch("");
    setVerifiedOnly(false);
    setAvailableOnly(false);
    setRegion("");
  };

  if (isLoading) return <p>Loading providers...</p>;
  if (error) return <p>Failed to load providers.</p>;

  return (
    <section>
      <div style={{ marginBottom: "20px" }}>
        <h1>Providers</h1>
        <p>Browse providers by name, availability, verification, and region.</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="filters-grid">
          <label>
            Search
            <input
              type="text"
              placeholder="Search by name or username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            Region
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">All regions</option>
              {regions.map((regionItem) => (
                <option key={regionItem} value={regionItem}>
                  {regionItem}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
          <label style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Verified only
          </label>

          <label style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Available only
          </label>

          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>

          <span>{filteredProviders.length} provider(s) found</span>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="card">
          <p>No providers found.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProviders.map((provider) => {
            const fullName = [provider.first_name, provider.last_name]
              .filter(Boolean)
              .join(" ");
            const displayName = fullName || provider.username;

            return (
              <article key={provider.id} className="card polished-card">
                <div className="entity-head">
                  <AvatarPlaceholder name={displayName} size="lg" />
                  <div className="entity-head-text">
                    <h3>{displayName}</h3>
                    <p>@{provider.username}</p>
                  </div>
                </div>

                <div className="card-topline">
                  <span className="chip">
                    {provider.is_verified_provider ? "Verified" : "Provider"}
                  </span>
                  <RatingBadge
                    rating={provider.average_rating}
                    reviewsCount={provider.reviews_count}
                  />
                </div>

                <p className="provider-bio-preview">
                  {provider.provider_profile?.bio || "No bio provided yet."}
                </p>

                <div className="meta-list">
                  <p><strong>Region:</strong> {provider.provider_profile?.region || "Not specified"}</p>
                  <p><strong>District:</strong> {provider.provider_profile?.district || "Not specified"}</p>
                  <p><strong>Available:</strong> {provider.provider_profile?.is_available ? "Yes" : "No"}</p>
                  <p><strong>Services:</strong> {provider.services_count ?? 0}</p>
                </div>

                <Link to={`/providers/${provider.id}`} className="btn">
                  View provider
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}