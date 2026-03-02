import { useState, useEffect } from "react";
import { getCategories, getCategoryProductCount } from "../services/categoryService";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

/**
 * CategoryReassignModal
 * Shown when deactivating/deleting a category that has products.
 *
 * Props:
 *   isOpen       : boolean
 *   category     : the category being deactivated ({ categoryId, categoryName })
 *   onClose      : () => void
 *   onConfirm    : (reassignCategoryId: Long|null) => void
 *   actionLabel  : "Deactivate" | "Delete" etc.
 */
export default function CategoryReassignModal({
    isOpen,
    category,
    onClose,
    onConfirm,
    actionLabel = "Deactivate",
}) {
    const [productCount, setProductCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [mode, setMode] = useState("uncategorized"); // "uncategorized" | "select"
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    useEffect(() => {
        if (!isOpen || !category) return;

        setLoading(true);
        setMode("uncategorized");
        setSelectedCategoryId("");

        Promise.all([
            getCategoryProductCount(category.categoryId),
            getCategories(0, 100, "active"),
        ])
            .then(([countRes, catRes]) => {
                const count = countRes.data?.data?.productCount ?? 0;
                setProductCount(count);

                const allCats = catRes.data?.data?.content ?? [];
                // Exclude current category and "Uncategorized"
                const filtered = allCats.filter(
                    (c) =>
                        c.categoryId !== category.categoryId &&
                        c.categoryName.toLowerCase() !== "uncategorized"
                );
                setCategories(filtered);
            })
            .catch(() => {
                setProductCount(0);
                setCategories([]);
            })
            .finally(() => setLoading(false));
    }, [isOpen, category]);

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const reassignId = mode === "select" && selectedCategoryId
                ? parseInt(selectedCategoryId, 10)
                : null;
            await onConfirm(reassignId);
        } finally {
            setSubmitting(false);
        }
    };

    const canConfirm =
        mode === "uncategorized" || (mode === "select" && selectedCategoryId);

    const inputClass = [
        "w-full px-3 py-2 rounded-lg border text-sm",
        "text-[var(--text-primary)] bg-[var(--bg-surface)]",
        "border-[var(--border-soft)] hover:border-[var(--border-hover)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]",
        "transition-colors duration-150",
    ].join(" ");

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${actionLabel} Category`}
        >
            {loading ? (
                <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                    Loading…
                </div>
            ) : productCount === 0 ? (
                // No products — simple confirmation
                <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        {actionLabel} <strong>"{category?.categoryName}"</strong>?
                        This category has no products.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm border border-[var(--border-soft)] 
                                       text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(null)}
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white 
                                       bg-[var(--danger)] hover:bg-[var(--danger)] transition-colors disabled:opacity-60"
                        >
                            {submitting ? `${actionLabel}…` : actionLabel}
                        </button>
                    </div>
                </div>
            ) : (
                // Has products — reassignment required
                <div>
                    {/* Warning */}
                    <div
                        className="flex items-start gap-3 p-3 rounded-lg mb-5"
                        style={{
                            backgroundColor: "var(--warning-soft)",
                            border: "1px solid var(--warning)",
                        }}
                    >
                        <AlertTriangle
                            size={18}
                            className="text-[var(--warning)] shrink-0 mt-0.5"
                        />
                        <div className="text-sm text-[var(--text-primary)]">
                            <strong>"{category?.categoryName}"</strong> contains{" "}
                            <strong>{productCount}</strong>{" "}
                            {productCount === 1 ? "product" : "products"}.
                            Choose how to reassign them before proceeding.
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {/* Option 1: Uncategorized */}
                        <label
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${mode === "uncategorized"
                                ? "border-[var(--accent-primary)] bg-[var(--accent-soft)]"
                                : "border-[var(--border-soft)] hover:border-[var(--border-hover)]"
                                }`}
                        >
                            <input
                                type="radio"
                                name="reassignMode"
                                checked={mode === "uncategorized"}
                                onChange={() => setMode("uncategorized")}
                                className="mt-0.5"
                            />
                            <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Move to "Uncategorized"
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Products will be moved to the default Uncategorized category.
                                </p>
                            </div>
                        </label>

                        {/* Option 2: Select category */}
                        <label
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${mode === "select"
                                ? "border-[var(--accent-primary)] bg-[var(--accent-soft)]"
                                : "border-[var(--border-soft)] hover:border-[var(--border-hover)]"
                                }`}
                        >
                            <input
                                type="radio"
                                name="reassignMode"
                                checked={mode === "select"}
                                onChange={() => setMode("select")}
                                className="mt-0.5"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Move to another category
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mb-2">
                                    Select an active category to reassign products to.
                                </p>
                                {mode === "select" && (
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="">Select a category…</option>
                                        {categories.map((cat) => (
                                            <option key={cat.categoryId} value={cat.categoryId}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {mode === "select" && categories.length === 0 && (
                                    <p className="text-xs text-[var(--danger)] mt-1">
                                        No other active categories available.
                                    </p>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm border border-[var(--border-soft)] 
                                       text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={submitting || !canConfirm}
                            className={[
                                "px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors",
                                submitting || !canConfirm
                                    ? "bg-[var(--text-muted)] cursor-not-allowed opacity-60"
                                    : "bg-[var(--danger)] hover:opacity-90",
                            ].join(" ")}
                        >
                            {submitting
                                ? `${actionLabel}…`
                                : `${actionLabel} & Reassign`}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
