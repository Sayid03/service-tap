import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMe } from "../hooks/useMe";
import { updateProviderProfile } from "../api/users";
import toast from "react-hot-toast";

export default function ProviderProfilePage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useMe();

  const [form, setForm] = useState({
    bio: "",
    experience_years: "",
    region: "",
    district: "",
    address: "",
    is_available: true,
  });

  useEffect(() => {
    if (me?.provider_profile) {
      setForm({
        bio: me.provider_profile.bio || "",
        experience_years: me.provider_profile.experience_years ?? "",
        region: me.provider_profile.region || "",
        district: me.provider_profile.district || "",
        address: me.provider_profile.address || "",
        is_available: !!me.provider_profile.is_available,
      });
    }
  }, [me]);

  const mutation = useMutation({
    mutationFn: updateProviderProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (!me) return <p>Could not load user.</p>;
  if (me.role !== "provider") return <p>Only providers can access this page.</p>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      ...form,
      experience_years:
        form.experience_years === "" ? null : Number(form.experience_years),
    });
  };

  return (
    <section>
      <h1>Provider Profile</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
        />
        <input
          name="experience_years"
          type="number"
          placeholder="Years of experience"
          value={form.experience_years}
          onChange={handleChange}
        />
        <input
          name="region"
          placeholder="Region"
          value={form.region}
          onChange={handleChange}
        />
        <input
          name="district"
          placeholder="District"
          value={form.district}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />
          Available for bookings
        </label>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save profile"}
        </button>

        {mutation.isSuccess && <p>Profile updated successfully.</p>}
        {mutation.isError && <p>Failed to update profile.</p>}
      </form>
    </section>
  );
}