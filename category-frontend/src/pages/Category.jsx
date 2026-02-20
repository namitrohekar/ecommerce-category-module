import { useState, useEffect, useCallback, memo } from "react";
import { toast } from "sonner";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";
import CategoryTable from "../components/CategoryTable";
import CategoryForm from "../components/CategoryForm";
import Modal from "../components/Modal";

// Memoised so table doesn't re-render when modal state changes
const MemoTable = memo(CategoryTable);

/* Skeleton row */
function SkeletonRow() {
    return (
        <tr className="border-t border-[var(--border-soft)] animate-pulse">
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-3 rounded bg-[var(--bg-subtle)]" />
                </td>
            ))}
        </tr>
    );
}

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCategories();
            setCategories(res.data?.data ?? []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    /*  Modal helpers */
    const openCreateModal = useCallback(() => {
        setIsEditing(false);
        setSelectedCategory(null);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((category) => {
        setIsEditing(true);
        setSelectedCategory(category);
        setModalOpen(true);
    }, []);

    // Only close the modal — defer state reset to onClosed (after exit animation)
    const closeModal = useCallback(() => {
        setModalOpen(false);
    }, []);

    // Called by Modal after the exit animation finishes and portal unmounts
    const handleModalClosed = useCallback(() => {
        setIsEditing(false);
        setSelectedCategory(null);
    }, []);

    /* Create / Update */
    const handleFormSubmit = useCallback(
        async (data, setError) => {
            try {
                if (isEditing) {
                    const res = await updateCategory(selectedCategory.categoryId, data);
                    toast.success(res.data.message);
                } else {
                    const res = await createCategory(data);
                    toast.success(res.data.message);
                }
                closeModal();
                fetchCategories();
            } catch (error) {
                const status = error?.response?.status;
                const body = error?.response?.data;

                if (status === 409) {
                    setError("categoryName", {
                        type: "server",
                        message: body?.message ?? "Category name already exists.",
                    });
                    toast.error(body?.message || "Duplicate name — choose another.");
                } else if (status === 400) {
                    const details = body?.data;
                    if (details && typeof details === "object") {
                        Object.entries(details).forEach(([field, msg]) => {
                            setError(field, { type: "server", message: msg });
                        });
                    } else {
                        toast.error(body?.message || "Invalid input. Please check your data.");
                    }
                } else {
                    toast.error(error.response?.data?.message || "Unexpected error. Please try again.");
                }
            }
        },
        [isEditing, selectedCategory, closeModal, fetchCategories]
    );

    /* Delete */
    const handleDelete = useCallback((category) => {
    toast(`Delete "${category.categoryName}"?`, {
        action: {
            label: "Delete",
            onClick: async () => {
                try {
                    const res = await deleteCategory(category.categoryId);
                    toast.success(res.data.message);
                    fetchCategories();
                } catch (error) {
                    const status = error?.response?.status;
                    if (status === 404) {
                        toast.error("Category not found — it may already be deleted.");
                        fetchCategories();
                    } else {
                        toast.error(error.response?.data?.message || "Failed to delete category.");
                    }
                }
            },
        },
        cancel: {
            label: "Cancel",
            onClick: () => {},
        },
    });
}, [fetchCategories]);

    return (
        <div
            className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-[var(--bg-primary)]"
        >
            <div className="max-w-5xl mx-auto">

                {/* Page Header  */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Categories
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                            Manage your product categories
                        </p>
                    </div>

                    {/* New Category */}
                    <button
                        onClick={openCreateModal}
                        aria-label="Add new category"
                        className="self-start sm:self-auto px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150"
                    >
                        + New Category
                    </button>
                </div>

                {/* Table Panel */}
                <div
                    className="rounded-xl p-6 border border-[var(--border-soft)] bg-[var(--bg-surface)]"
                    style={{ boxShadow: "var(--shadow-subtle)" }}
                >
                    {loading ? (
                        <div className="overflow-x-auto rounded-xl border border-[var(--border-soft)]">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[var(--bg-subtle)]">
                                        {["#", "Name", "Description", "Status", "Created At", "Actions"].map(
                                            (h) => (
                                                <th
                                                    key={h}
                                                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
                                                >
                                                    {h}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(4)].map((_, i) => (
                                        <SkeletonRow key={i} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <MemoTable
                            categories={categories}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    )}
                </div>

                {/* Row count */}
                {!loading && (
                    <p className="mt-3 text-xs text-right text-[var(--text-muted)]">
                        {categories.length}{" "}
                        {categories.length === 1 ? "category" : "categories"} total
                    </p>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                onClosed={handleModalClosed}
                title={isEditing ? "Edit Category" : "New Category"}
            >
                <CategoryForm
                    isEditing={isEditing}
                    defaultValues={selectedCategory}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
}
