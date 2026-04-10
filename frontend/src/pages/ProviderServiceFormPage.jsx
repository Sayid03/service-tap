import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  createService,
  getCategories,
  getServiceById,
  updateService,
} from "../api/services";
import { useMe } from "../hooks/useMe";

const initialForm = {
  category: "",
  title: "",
  description: "",
  pricing_type: "fixed",
  price: "",
  estimated_duration_hours: "",
  location: "",
  is_active: true,
};

export default function ProviderServiceFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useMe();

  const [form, setForm] = useState(initialForm);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id),
    enabled: isEdit,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : Array.isArray(categoriesData?.results)
    ? categoriesData.results
    : [];

  useEffect(() => {
    if (isEdit && serviceData) {
      setForm({
        category: serviceData.category ?? "",
        title: serviceData.title ?? "",
        description: serviceData.description ?? "",
        pricing_type: serviceData.pricing_type ?? "fixed",
        price: serviceData.price ?? "",
        estimated_duration_hours: serviceData.estimated_duration_hours ?? "",
        location: serviceData.location ?? "",
        is_active: !!serviceData.is_active,
      });
    }
  }, [isEdit, serviceData]);

  const payload = useMemo(() => {
    const base = {
      category: Number(form.category),
      title: form.title,
      description: form.description,
      pricing_type: form.pricing_type,
      location: form.location,
      is_active: form.is_active,
    };

    if (form.pricing_type === "fixed" || form.pricing_type === "hourly") {
      base.price = form.price === "" ? null : Number(form.price);
    }

    if (form.estimated_duration_hours !== "") {
      base.estimated_duration_hours = Number(form.estimated_duration_hours);
    }

    return base;
  }, [form]);

  const mutation = useMutation({
    mutationFn: () =>
      isEdit ? updateService(id, payload) : createService(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      if (isEdit) {
        await queryClient.invalidateQueries({ queryKey: ["service", id] });
      }
      navigate("/provider/services");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (meLoading || categoriesLoading || (isEdit && serviceLoading)) {
    return <p>Loading form...</p>;
  }

  if (!me) return <p>Could not load your profile.</p>;
  if (me.role !== "provider") return <p>Only providers can access this page.</p>;

  return (
    <section>
      <h1>{isEdit ? "Edit Service" : "Create Service"}</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Home plumbing repair"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your service clearly"
            required
          />
        </label>

        <label>
          Pricing Type
          <select
            name="pricing_type"
            value={form.pricing_type}
            onChange={handleChange}
            required
          >
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </label>

        {(form.pricing_type === "fixed" || form.pricing_type === "hourly") && (
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <label>
          Estimated Duration (hours)
          <input
            type="number"
            min="0"
            step="0.5"
            name="estimated_duration_hours"
            value={form.estimated_duration_hours}
            onChange={handleChange}
          />
        </label>

        <label>
          Location
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Tashkent, Chilonzor"
          />
        </label>

        <label style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Service is active
        </label>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? isEdit ? "Saving..." : "Creating..."
            : isEdit ? "Save Changes" : "Create Service"}
        </button>

        {mutation.isError && (
          <p style={{ color: "crimson" }}>
            {mutation.error?.response?.data
              ? JSON.stringify(mutation.error.response.data)
              : "Failed to save service."}
          </p>
        )}
      </form>
    </section>
  );
}