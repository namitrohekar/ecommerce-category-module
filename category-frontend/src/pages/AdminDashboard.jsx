import { Link } from "react-router-dom";
import { Package, FolderTree, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
    const cards = [
        {
            to: "/admin/products",
            icon: Package,
            title: "Products",
            description: "Manage your product catalog, inventory, and pricing.",
        },
        {
            to: "/admin/categories",
            icon: FolderTree,
            title: "Categories",
            description: "Organize products into categories for easy navigation.",
        },
    ];

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                    Dashboard
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mb-8">
                    Welcome back. Manage your storefront from here.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {cards.map(({ to, icon: Icon, title, description }) => (
                        <Link
                            key={to}
                            to={to}
                            className="group rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6
                                       hover:border-[var(--accent-primary)] transition-colors duration-150"
                            style={{ boxShadow: "var(--shadow-subtle)" }}
                        >
                            <div
                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4"
                                style={{
                                    backgroundColor: "var(--accent-soft)",
                                    color: "var(--accent-primary)",
                                }}
                            >
                                <Icon size={20} />
                            </div>
                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                                {title}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                {description}
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] group-hover:gap-2 transition-all duration-150">
                                Manage <ArrowRight size={12} />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
