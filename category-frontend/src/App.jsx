import { Routes, Route, Navigate } from "react-router-dom";

/* Auth */
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* Layouts */
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

/* Pages */
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import PublicProducts from "./pages/PublicProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Category from "./pages/Category";
import AdminOrders from "./pages/AdminOrders";
import CustomerOrders from "./pages/CustomerOrders";
import PlaceOrder from "./pages/PlaceOrder";

export default function App() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* ── Public ──────────────────────────────────────────── */}
            <Route
                path="/login"
                element={
                    user
                        ? <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />
                        : <Login />
                }
            />

            {/* ── Customer Routes (any logged-in user) ─────────────── */}
            <Route
                element={
                    <ProtectedRoute>
                        <CustomerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Landing />} />
                <Route path="/products" element={<PublicProducts />} />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <CustomerOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/place-order"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <PlaceOrder />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* ── Admin Routes ─────────────────────────────────────── */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute role="ADMIN">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<Category />} />
                <Route path="orders" element={<AdminOrders />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
