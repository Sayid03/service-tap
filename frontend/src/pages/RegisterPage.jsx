import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    role: "customer",
    phone_number: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser(form);
      toast.success("Account created successfully");
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data
        ? JSON.stringify(err.response.data)
        : "Registration failed. Check your fields.";
      setError(message);
      toast.error("Registration failed");
    }
  };

  return (
    <section className="form-page">
      <h1>Create account</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last name" value={form.last_name} onChange={handleChange} />
        <input name="phone_number" placeholder="Phone number" value={form.phone_number} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
        </select>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input name="confirm_password" type="password" placeholder="Confirm password" value={form.confirm_password} onChange={handleChange} />
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
    </section>
  );
}