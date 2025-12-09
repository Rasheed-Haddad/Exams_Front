import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requireAdmin && user?.role !== "teacher") {
    return <Navigate to="/subject" replace />;
  }

  if (!requireAdmin && user?.role === "teacher") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
