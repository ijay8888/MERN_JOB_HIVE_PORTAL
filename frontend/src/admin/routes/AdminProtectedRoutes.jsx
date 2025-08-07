import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};
