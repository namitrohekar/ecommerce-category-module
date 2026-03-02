import { Routes, Route } from "react-router-dom";

/* Layouts */
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

/* Customer Pages */
import Landing from "./pages/Landing";
import PublicProducts from "./pages/PublicProducts";

/* Admin Pages */
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import Category from "./pages/Category";

export default function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/products" element={<PublicProducts />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<Category />} />
      </Route>
    </Routes>
  );
}
