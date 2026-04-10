import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero">
      <h1>Book trusted local services in Uzbekistan</h1>
      <p>
        Find plumbers, electricians, tutors, cleaners, and more with clear
        pricing, fast booking, and verified providers.
      </p>

      <div className="hero-actions">
        <Link to="/services" className="btn">Browse services</Link>
        <Link to="/register" className="btn btn-secondary">Become a provider</Link>
      </div>
    </section>
  );
}