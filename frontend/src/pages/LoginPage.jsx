import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/auth";
import { authStore } from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(form);
      authStore.setTokens(data);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.detail || "Invalid username or password.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <section className="form-page">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </section>
  );
}