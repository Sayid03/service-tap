import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ProvidersPage from "./pages/ProvidersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import ProviderServicesPage from "./pages/ProviderServicesPage";
import ProviderServiceFormPage from "./pages/ProviderServiceFormPage";
import ProviderDetailPage from "./pages/ProviderDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/profile"
            element={
              <ProtectedRoute>
                <ProviderProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/services"
            element={
              <ProtectedRoute>
                <ProviderServicesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/services/new"
            element={
              <ProtectedRoute>
                <ProviderServiceFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider/services/:id/edit"
            element={
              <ProtectedRoute>
                <ProviderServiceFormPage />
              </ProtectedRoute>
            }
          />

          <Route path="/providers/:id" element={<ProviderDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}