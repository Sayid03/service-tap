import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getServices } from "../api/services";
import useDebounce from "../hooks/useDebounce";

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
    };
  }, [filters, debouncedSearch]);

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

  const services = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

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
  };

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
          <span>{services.length} service(s) found</span>
          {isTypingSearch && <span>Typing...</span>}
          {!isTypingSearch && isFetching && <span>Updating results...</span>}
        </div>
      </div>

      {isLoading && !data ? (
        <p>Loading services...</p>
      ) : error ? (
        <p>Failed to load services.</p>
      ) : services.length === 0 ? (
        <div className="card">
          <p>No services found.</p>
        </div>
      ) : (
        <div className="grid">
          {services.map((service) => (
            <article key={service.id} className="card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <p><strong>Category:</strong> {service.category_name}</p>
              <p><strong>Provider:</strong> {service.provider_username}</p>
              <p><strong>Location:</strong> {service.location || "Not specified"}</p>
              <p><strong>Pricing:</strong> {service.pricing_type}</p>
              <p><strong>Price:</strong> {service.price ?? "Negotiable"}</p>
              <p>
                <strong>Rating:</strong>{" "}
                {service.average_rating ?? "No rating yet"} ({service.reviews_count ?? 0})
              </p>
              <Link to={`/services/${service.id}`}>View details</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}