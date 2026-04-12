import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route that requires authentication (and optionally a specific role).
 * Redirects to /login with the intended location saved in state.
 */
export default function ProtectedRoute({ children, role }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user.role !== role) {
        // Customer trying to access admin — bounce to home
        return <Navigate to="/" replace />;
    }

    return children;
}
