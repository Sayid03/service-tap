import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getServices } from "../api/services";

export default function ServicesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  const services = data?.results || data || [];

  if (isLoading) return <p>Loading services...</p>;
  if (error) return <p>Failed to load services.</p>;

  return (
    <section>
      <h1>Services</h1>

      <div className="grid">
        {services.map((service) => (
          <article key={service.id} className="card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p><strong>Category:</strong> {service.category_name}</p>
            <p><strong>Provider:</strong> {service.provider_username}</p>
            <p><strong>Location:</strong> {service.location || "Not specified"}</p>
            <p><strong>Price:</strong> {service.price || "Negotiable"}</p>
            <p><strong>Rating:</strong> {service.average_rating ?? "No rating yet"}</p>
            <Link to={`/services/${service.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </section>
  );
}