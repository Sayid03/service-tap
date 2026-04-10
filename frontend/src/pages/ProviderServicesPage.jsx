import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteService, getServices } from "../api/services";
import { useMe } from "../hooks/useMe";
import toast from "react-hot-toast";

export default function ProviderServicesPage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useMe();

  const { data, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServices(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted");
    },
    onError: () => {
      toast.error("Failed to delete service");
    },
  });

  const allServices = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  const services = me
    ? allServices.filter((service) => service.provider_username === me.username)
    : [];

  if (meLoading || isLoading) return <p>Loading services...</p>;
  if (!me) return <p>Could not load your profile.</p>;
  if (me.role !== "provider") return <p>Only providers can access this page.</p>;
  if (error) return <p>Failed to load services.</p>;

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1>My Services</h1>
        <Link to="/provider/services/new" className="btn">Create Service</Link>
      </div>

      {services.length === 0 ? (
        <div className="card">
          <p>You have not created any services yet.</p>
          <Link to="/provider/services/new">Create your first service</Link>
        </div>
      ) : (
        <div className="grid">
          {services.map((service) => (
            <article key={service.id} className="card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p><strong>Category:</strong> {service.category_name}</p>
              <p><strong>Pricing:</strong> {service.pricing_type}</p>
              <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
              <p><strong>Location:</strong> {service.location || "Not specified"}</p>
              <p><strong>Status:</strong> {service.is_active ? "Active" : "Inactive"}</p>
              <p>
                <strong>Rating:</strong> {service.average_rating ?? "No rating yet"} ({service.reviews_count ?? 0})
              </p>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                <Link to={`/services/${service.id}`}>View</Link>
                <Link to={`/provider/services/${service.id}/edit`}>Edit</Link>
                <button
                  onClick={() => {
                    const confirmed = window.confirm("Are you sure you want to delete this service?");
                    if (confirmed) {
                      deleteMutation.mutate(service.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {deleteMutation.isError && (
        <p style={{ color: "crimson", marginTop: "12px" }}>
          Failed to delete service.
        </p>
      )}
    </section>
  );
}