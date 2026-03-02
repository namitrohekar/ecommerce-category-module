import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * ProductTable — pure presentational component.
 * Props:
 *   products       : array of product objects from backend
 *   onEdit         : (product) => void
 *   onToggleStatus : (product) => void
 */
export default function ProductTable({ products, onEdit, onToggleStatus }) {
    if (!products.length) {
        return (
            <div className="py-16 text-center text-sm text-[var(--text-muted)]">
                No products found. Create one to get started.
            </div>
        );
    }

    function formatDateTime(value) {
        const d = new Date(value);

        const datePart = d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        const timePart = d.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
        });

        return `${datePart} • ${timePart}`;
    }

    return (
        <div
            className="overflow-x-auto rounded-xl border border-[var(--border-soft)]"
            style={{ boxShadow: "var(--shadow-subtle)" }}
        >
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="text-xs uppercase tracking-wide bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">SKU</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell">Price</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Inventory</th>
                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod, index) => (
                        <tr
                            key={prod.productId}
                            className="border-t border-[var(--border-soft)] hover:bg-[var(--accent-soft)] transition-colors duration-150"
                        >
                            <td className="px-4 py-3 text-[var(--text-muted)]">
                                {index + 1}
                            </td>

                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                                {prod.productName}
                            </td>

                            <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-secondary)]">
                                {prod.sku}
                            </td>

                            <td className="px-4 py-3 hidden md:table-cell text-[var(--text-primary)] font-medium">
                                ${Number(prod.price).toFixed(2)}
                            </td>

                            <td className="px-4 py-3 hidden md:table-cell text-[var(--text-secondary)]">
                                {prod.categoryName || (
                                    <span className="text-[var(--text-muted)] italic">—</span>
                                )}
                            </td>

                            <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-secondary)]">
                                {prod.inventoryCount}
                            </td>

                            <td className="px-4 py-3 hidden lg:table-cell">
                                <StatusBadge status={prod.status} />
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    {/* Edit */}
                                    <button
                                        onClick={() => prod.status && onEdit(prod)}
                                        disabled={!prod.status}
                                        title={!prod.status ? "Inactive product cannot be edited" : ""}
                                        aria-label={`Edit ${prod.productName}`}
                                        className={`p-2 rounded-lg border transition-colors duration-150 ${prod.status
                                            ? "border-[var(--border-soft)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-soft)]"
                                            : "border-[var(--border-soft)] opacity-40 cursor-not-allowed"
                                            }`}
                                    >
                                        <Pencil
                                            size={15}
                                            className={prod.status ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}
                                        />
                                    </button>

                                    {/* Toggle Status */}
                                    <button
                                        onClick={() => onToggleStatus(prod)}
                                        aria-label={
                                            prod.status
                                                ? `Deactivate ${prod.productName}`
                                                : `Activate ${prod.productName}`
                                        }
                                        className={`p-2 rounded-lg border border-[var(--border-soft)] transition-colors duration-150 ${prod.status
                                            ? "hover:border-[var(--warning)] hover:bg-[var(--warning-soft)] text-[var(--warning)]"
                                            : "hover:border-[var(--success)] hover:bg-[var(--success-soft)] text-[var(--text-muted)] hover:text-[var(--success)]"
                                            }`}
                                    >
                                        {prod.status ? (
                                            <ToggleRight size={18} className="text-[var(--success)]" />
                                        ) : (
                                            <ToggleLeft size={18} className="text-[var(--text-muted)]" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/** Strict boolean equality badge */
function StatusBadge({ status }) {
    const isActive = status === true;

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent"
            style={{
                backgroundColor: isActive ? "var(--success-soft)" : "var(--bg-subtle)",
                color: isActive ? "var(--success)" : "var(--text-muted)",
                borderColor: isActive ? "var(--success)" : "transparent",
            }}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}
