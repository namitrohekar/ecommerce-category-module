import { Pencil, Trash2 } from "lucide-react";

/**
 * CategoryTable — pure presentational component.
 * Props:
 *   categories : array of category objects from backend
 *   onEdit     : (category) => void
 *   onDelete   : (category) => void
 */
export default function CategoryTable({ categories, onEdit, onDelete }) {
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
                                        onClick={() => onEdit(cat)}
                                        aria-label={`Edit ${cat.categoryName}`}
                                        className="p-2 rounded-lg border border-[var(--border-soft)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-soft)] transition-colors duration-150"
                                    >
                                        <Pencil size={15} className="text-[var(--accent-primary)]" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => onDelete(cat)}
                                        aria-label={`Delete ${cat.categoryName}`}
                                        className="p-2 rounded-lg border border-[var(--border-soft)] hover:border-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors duration-150"
                                    >
                                        <Trash2 size={15} className="text-[var(--danger)]" />
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
