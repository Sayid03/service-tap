import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getServices } from "../api/services";
import useDebounce from "../hooks/useDebounce";
import SkeletonGrid from "../components/ui/SkeletonGrid";
import ServiceVisualPlaceholder from "../components/ui/ServiceVisualPlaceholder";
import { getPageFromUrl, normalizePaginatedResponse } from "../utils/pagination";

const initialFilters = {
  search: "",
  category: "",
  pricing_type: "",
  location: "",
  min_rating: "",
  ordering: "",
};

export default function ServicesPage() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    ...initialFilters,
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
  }));

  const [page, setPage] = useState(1);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get("category") || prev.category || "",
      search: searchParams.get("search") || prev.search || "",
    }));
  }, [searchParams]);

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryFilters = useMemo(() => {
    return {
      ...filters,
      search: debouncedSearch,
      page,
    };
  }, [filters, debouncedSearch, page]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["services", queryFilters],
    queryFn: () => getServices(queryFilters),
    placeholderData: (previousData) => previousData,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray(categoriesData?.results)
    ? categoriesData.results
    : [];

  const normalized = normalizePaginatedResponse(data);
  const services = normalized.items;
  const nextPage = getPageFromUrl(normalized.next);

  useEffect(() => {
    if (!data) return;

    if (page === 1) {
      setAllServices(services);
      return;
    }

    setAllServices((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const merged = [...prev];

      services.forEach((item) => {
        if (!existingIds.has(item.id)) {
          merged.push(item);
        }
      });

      return merged;
    });
  }, [data, services, page]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    filters.category,
    filters.pricing_type,
    filters.location,
    filters.min_rating,
    filters.ordering,
  ]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== "").length;
  }, [filters]);

  const isTypingSearch = filters.search !== debouncedSearch;

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const displayedServices = normalized.paginated ? allServices : services;

  return (
    <section>
      <div style={{ marginBottom: "20px" }}>
        <h1>Services</h1>
        <p>Find the right provider by service type, location, rating, and pricing model.</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="filters-grid">
          <label>
            Search
            <input
              type="text"
              name="search"
              placeholder="plumber, tutor, repair..."
              value={filters.search}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={filters.category}
              onChange={handleChange}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Pricing type
            <select
              name="pricing_type"
              value={filters.pricing_type}
              onChange={handleChange}
            >
              <option value="">All pricing types</option>
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </label>

          <label>
            Location
            <input
              type="text"
              name="location"
              placeholder="Tashkent, Chilonzor..."
              value={filters.location}
              onChange={handleChange}
            />
          </label>

          <label>
            Minimum rating
            <select
              name="min_rating"
              value={filters.min_rating}
              onChange={handleChange}
            >
              <option value="">Any rating</option>
              <option value="4.5">4.5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
              <option value="2">2+</option>
            </select>
          </label>

          <label>
            Sort by
            <select
              name="ordering"
              value={filters.ordering}
              onChange={handleChange}
            >
              <option value="">Newest first</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="title">Title: A-Z</option>
              <option value="-created_at">Newest</option>
              <option value="average_rating">Rating: low to high</option>
              <option value="-average_rating">Rating: high to low</option>
              <option value="-reviews_count">Most reviewed</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
          <button type="button" onClick={resetFilters}>
            Reset filters
          </button>
          <span>{activeFiltersCount} filter(s) active</span>
          <span>{displayedServices.length} service(s) shown</span>
          {isTypingSearch && <span>Typing...</span>}
          {!isTypingSearch && isFetching && <span>Updating results...</span>}
        </div>
      </div>

      {isLoading && !data ? (
        <SkeletonGrid count={6} />
      ) : error ? (
        <p>Failed to load services.</p>
      ) : displayedServices.length === 0 ? (
        <div className="card">
          <p>No services found.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {displayedServices.map((service) => (
              <article key={service.id} className="card polished-card">
                <ServiceVisualPlaceholder category={service.category_name} />

                <div className="card-topline">
                  <span className="chip">{service.category_name}</span>
                  <span className="muted-text">
                    {service.average_rating ?? "New"} ★
                  </span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="meta-list">
                  <p><strong>Provider:</strong> {service.provider_username}</p>
                  <p><strong>Location:</strong> {service.location || "Not specified"}</p>
                  <p><strong>Pricing:</strong> {service.pricing_type}</p>
                  <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
                </div>

                <Link to={`/services/${service.id}`} className="btn">
                  View details
                </Link>
              </article>
            ))}
          </div>

          {normalized.paginated && nextPage && (
            <div className="load-more-wrap">
              <button
                className="btn"
                type="button"
                onClick={() => setPage(Number(nextPage))}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}