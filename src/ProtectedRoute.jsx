// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./auth";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />; // Se não está logado -> login
  }

  return children; // Se está logado -> entra normalmente
};

export default ProtectedRoute;
