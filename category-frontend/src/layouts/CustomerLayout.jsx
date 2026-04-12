import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, ShoppingCart, LogOut } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/", icon: Home, label: "Home", end: true },
    { to: "/products", icon: ShoppingBag, label: "Products" },
    { to: "/orders", icon: ShoppingCart, label: "My Orders" },
];

export default function CustomerLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            {/* Navbar */}
            <header
                className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[var(--bg-surface)]"
                style={{ boxShadow: "var(--shadow-subtle)" }}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
                    <NavLink to="/" className="text-lg font-bold text-[var(--accent-primary)]">
                        ShopHub
                    </NavLink>

                    <div className="flex items-center gap-4">
                        <nav className="flex items-center gap-1">
                            {navItems.map(({ to, label, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive
                                            ? "bg-[var(--accent-soft)] text-[var(--accent-primary)]"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* User pill */}
                        {user && (
                            <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-soft)]">
                                <span className="text-xs font-medium text-[var(--text-secondary)] hidden sm:block">
                                    {user.name}
                                </span>
                                <button
                                    id="customer-logout-btn"
                                    onClick={handleLogout}
                                    title="Sign out"
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        )}

                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-surface)]">
                <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 text-center text-xs text-[var(--text-muted)]">
                    © 2026 ShopHub. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
