import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, LogOut } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/categories", icon: FolderTree, label: "Categories" },
    { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };
    const linkBase =
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150";
    const linkInactive =
        "text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-primary)]";
    const linkActive =
        "bg-[var(--accent-soft)] text-[var(--accent-primary)]";

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            {/* Sidebar */}
            <aside
                className="hidden md:flex flex-col w-60 border-r border-[var(--border-soft)] bg-[var(--bg-surface)]"
                style={{ boxShadow: "var(--shadow-subtle)" }}
            >
                <div className="px-5 py-5 border-b border-[var(--border-soft)]">
                    <h1 className="text-lg font-bold text-[var(--accent-primary)]">
                        Admin Panel
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Manage your store
                    </p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4 py-4 border-t border-[var(--border-soft)] space-y-3">
                    {user && (
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[var(--text-muted)] truncate">👤 {user.name}</span>
                            <button
                                id="admin-logout-btn"
                                onClick={handleLogout}
                                title="Sign out"
                                className="ml-2 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    )}
                    <ThemeToggle />
                </div>
            </aside>

            {/* Mobile header */}
            <div className="flex-1 flex flex-col">
                <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-soft)] bg-[var(--bg-surface)]">
                    <h1 className="text-base font-bold text-[var(--accent-primary)]">
                        Admin Panel
                    </h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Mobile nav */}
                <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b border-[var(--border-soft)] bg-[var(--bg-surface)]">
                    {navItems.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive
                                    ? "bg-[var(--accent-soft)] text-[var(--accent-primary)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Content area */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
