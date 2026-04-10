import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getProviders } from "../api/users";

export default function ProvidersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  const providers = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  if (isLoading) return <p>Loading providers...</p>;
  if (error) return <p>Failed to load providers.</p>;

  return (
    <section>
      <h1>Providers</h1>

      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <div className="grid">
          {providers.map((provider) => {
            const fullName = [provider.first_name, provider.last_name]
              .filter(Boolean)
              .join(" ");

            return (
              <article key={provider.id} className="card">
                <h3>{fullName || provider.username}</h3>
                <p><strong>Username:</strong> {provider.username}</p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {provider.is_verified_provider ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  {provider.average_rating ?? "No rating yet"} (
                  {provider.reviews_count ?? 0} reviews)
                </p>
                <p>
                  <strong>Services:</strong> {provider.services_count ?? 0}
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
                  <strong>Available:</strong>{" "}
                  {provider.provider_profile?.is_available ? "Yes" : "No"}
                </p>

                <Link to={`/providers/${provider.id}`}>View provider</Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}