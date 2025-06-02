// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const isAuthenticated = () => {
  // Puedes mejorar esto usando contexto, Redux, etc.
  return !!localStorage.getItem("token");
};

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Evita mostrar múltiples toasts si el usuario navega varias veces
    toast.error("Debes iniciar sesión primero", { toastId: "login-required" });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
