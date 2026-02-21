import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * CategoryTable — pure presentational component.
 * Props:
 *   categories : array of category objects from backend
 *   onEdit         : (category) => void
 *   onToggleStatus : (category) => void
 */
export default function CategoryTable({ categories, onEdit, onToggleStatus }) {
    if (!categories.length) {
        return (
            <div className="py-16 text-center text-sm text-[var(--text-muted)]">
                No categories found. Create one to get started.
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
        <div className="overflow-x-auto rounded-xl border border-[var(--border-soft)]"
            style={{ boxShadow: "var(--shadow-subtle)" }}
        >
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="text-xs uppercase tracking-wide bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Description</th>
                        <th className="px-4 py-3 font-medium hidden md:table-cell">Status</th>
                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Created At</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat, index) => (
                        <tr
                            key={cat.categoryId}
                            className="border-t border-[var(--border-soft)] hover:bg-[var(--accent-soft)] transition-colors duration-150"
                        >
                            <td className="px-4 py-3 text-[var(--text-muted)]">
                                {index + 1}
                            </td>

                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                                {cat.categoryName}
                            </td>

                            <td className="px-4 py-3 hidden sm:table-cell max-w-xs truncate text-[var(--text-secondary)]">
                                {cat.description || (
                                    <span className="text-[var(--text-muted)] italic">—</span>
                                )}
                            </td>

                            <td className="px-4 py-3 hidden md:table-cell">
                                <StatusBadge status={cat.status} />
                            </td>

                            <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-muted)]">
                                {cat.createdAt ? formatDateTime(cat.createdAt) : "—"}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    {/* Edit */}
                                    <button
                                        onClick={() =>  cat.status && onEdit(cat)}
                                        disabled ={!cat.status}
                                        title={!cat.status ?  "Inactive category can not be edited" : ""}
                                        aria-label={`Edit ${cat.categoryName}`}
                                        className={`p-2 rounded-lg border transition-colors duration-150 ${
                                        cat.status
                                          ? "border-[var(--border-soft)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-soft)]"
                                          : "border-[var(--border-soft)] opacity-40 cursor-not-allowed"
                                             }`}
                                    >
                                        <Pencil size={15} className={cat.status ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"} />
                                    </button>

                                    {/* Toggle Status */}
                                    <button
                                        onClick={() => onToggleStatus(cat)}
                                        aria-label={cat.status ? `Deactivate ${cat.categoryName}` : `Activate ${cat.categoryName}`}
                                        className={`p-2 rounded-lg border border-[var(--border-soft)] transition-colors duration-150 ${cat.status
                                                ? "hover:border-[var(--warning)] hover:bg-[var(--warning-soft)] text-[var(--warning)]"
                                                : "hover:border-[var(--success)] hover:bg-[var(--success-soft)] text-[var(--text-muted)] hover:text-[var(--success)]"
                                            }`}
                                    >
                                        {cat.status ? (
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

/** Strict boolean equality  never truthy/falsy. */
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
