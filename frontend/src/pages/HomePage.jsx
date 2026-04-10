import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getCategories, getServices } from "../api/services";
import { getProviders } from "../api/users";
import SectionHeader from "../components/ui/SectionHeader";
import LoadingBlock from "../components/ui/LoadingBlock";
import EmptyState from "../components/ui/EmptyState";
import StatPill from "../components/ui/StatPill";

export default function HomePage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ["home-services"],
    queryFn: () => getServices({ ordering: "-reviews_count" }),
  });

  const { data: providersData, isLoading: providersLoading } = useQuery({
    queryKey: ["home-providers"],
    queryFn: getProviders,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray(categoriesData?.results)
    ? categoriesData.results
    : [];

  const services = Array.isArray(servicesData)
    ? servicesData
    : Array.isArray(servicesData?.results)
    ? servicesData.results
    : [];

  const providers = Array.isArray(providersData)
    ? providersData
    : Array.isArray(providersData?.results)
    ? providersData.results
    : [];

  const featuredServices = useMemo(() => services.slice(0, 6), [services]);
  const featuredProviders = useMemo(() => providers.slice(0, 4), [providers]);
  const featuredCategories = useMemo(() => categories.slice(0, 6), [categories]);

  return (
    <section className="home-page">
      <div className="hero hero-polished">
        <div className="hero-copy">
          <p className="hero-badge">Trusted local services across Uzbekistan</p>
          <h1>Book plumbers, tutors, electricians, cleaners, and more in minutes</h1>
          <p className="hero-description">
            Compare providers, see ratings, book instantly, and manage everything
            from one place.
          </p>

          <div className="hero-actions">
            <Link to="/services" className="btn">Find a service</Link>
            <Link to="/providers" className="btn btn-secondary">Browse providers</Link>
          </div>

          <div className="hero-stats">
            <StatPill label="Categories" value={categories.length || 0} />
            <StatPill label="Services" value={services.length || 0} />
            <StatPill label="Providers" value={providers.length || 0} />
          </div>
        </div>

        <div className="hero-panel card">
          <h3>Why people would use it</h3>
          <ul className="feature-list">
            <li>Fast booking for home and freelance services</li>
            <li>Transparent pricing and ratings</li>
            <li>Verified providers and cleaner discovery</li>
            <li>Built for the Uzbekistan market</li>
          </ul>
        </div>
      </div>

      <section className="section-space">
        <SectionHeader
          eyebrow="Popular categories"
          title="Start with a service type"
          subtitle="Quickly jump into the kind of help you need."
          action={<Link to="/services">See all services</Link>}
        />

        {categoriesLoading ? (
          <LoadingBlock text="Loading categories..." />
        ) : featuredCategories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            text="Categories will appear here once they are added."
          />
        ) : (
          <div className="category-grid">
            {featuredCategories.map((category) => (
              <div key={category.id} className="card category-card">
                <h3>{category.name}</h3>
                <p>{category.description || "Explore services in this category."}</p>
                <Link to={`/services?category=${category.id}`}>Browse category</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section-space">
        <SectionHeader
          eyebrow="Top marketplace picks"
          title="Featured services"
          subtitle="High-interest services customers can discover right away."
          action={<Link to="/services">Browse all</Link>}
        />

        {servicesLoading ? (
          <LoadingBlock text="Loading featured services..." />
        ) : featuredServices.length === 0 ? (
          <EmptyState
            title="No services yet"
            text="Once providers add services, featured listings will appear here."
            actionLabel="Browse providers"
            actionTo="/providers"
          />
        ) : (
          <div className="grid">
            {featuredServices.map((service) => (
              <article key={service.id} className="card service-card">
                <div className="card-topline">
                  <span className="chip">{service.category_name}</span>
                  <span className="muted-text">
                    {service.average_rating ?? "New"} ★
                  </span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p><strong>Provider:</strong> {service.provider_username}</p>
                <p><strong>Location:</strong> {service.location || "Not specified"}</p>
                <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
                <Link to={`/services/${service.id}`}>View details</Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section-space">
        <SectionHeader
          eyebrow="Trusted people"
          title="Featured providers"
          subtitle="Providers customers can review before booking."
          action={<Link to="/providers">See all providers</Link>}
        />

        {providersLoading ? (
          <LoadingBlock text="Loading providers..." />
        ) : featuredProviders.length === 0 ? (
          <EmptyState
            title="No providers yet"
            text="Providers will appear here once accounts are created."
          />
        ) : (
          <div className="grid">
            {featuredProviders.map((provider) => {
              const fullName = [provider.first_name, provider.last_name]
                .filter(Boolean)
                .join(" ");

              return (
                <article key={provider.id} className="card provider-card">
                  <div className="card-topline">
                    <span className="chip">
                      {provider.is_verified_provider ? "Verified" : "Provider"}
                    </span>
                    <span className="muted-text">
                      {provider.average_rating ?? "New"} ★
                    </span>
                  </div>
                  <h3>{fullName || provider.username}</h3>
                  <p><strong>Username:</strong> {provider.username}</p>
                  <p><strong>Region:</strong> {provider.provider_profile?.region || "Not specified"}</p>
                  <p><strong>District:</strong> {provider.provider_profile?.district || "Not specified"}</p>
                  <p><strong>Services:</strong> {provider.services_count ?? 0}</p>
                  <Link to={`/providers/${provider.id}`}>View provider</Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="section-space">
        <div className="cta-strip card">
          <div>
            <h2>Are you a service provider?</h2>
            <p>Create your profile, publish services, and start receiving bookings.</p>
          </div>
          <Link to="/register" className="btn">Become a provider</Link>
        </div>
      </section>
    </section>
  );
}