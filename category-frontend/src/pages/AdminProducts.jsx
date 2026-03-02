import { useState, useEffect, useCallback, memo } from "react";
import { toast } from "sonner";
import {
    getProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
} from "../services/productService";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import Modal from "../components/Modal";

const MemoTable = memo(ProductTable);

function SkeletonRow() {
    return (
        <tr className="border-t border-[var(--border-soft)] animate-pulse">
            {[...Array(8)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-3 rounded bg-[var(--bg-subtle)]" />
                </td>
            ))}
        </tr>
    );
}

/**
 * Maps server-returned field names → react-hook-form field names.
 */
const SERVER_FIELD_MAP = {
    productName: "productName",
    product_name: "productName",
    description: "description",
    price: "price",
    sku: "sku",
    categoryId: "categoryId",
    category_id: "categoryId",
    inventoryCount: "inventoryCount",
    inventory_count: "inventoryCount",
};

function guessFieldFromMessage(msg = "") {
    const lower = msg.toLowerCase();
    if (lower.includes("sku")) return "sku";
    if (lower.includes("product name") || lower.includes("productname")) return "productName";
    if (lower.includes("price")) return "price";
    if (lower.includes("category")) return "categoryId";
    if (lower.includes("inventory")) return "inventoryCount";
    if (lower.includes("description")) return "description";
    return null;
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    /* Pagination */
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    /* Filter */
    const [statusFilter, setStatusFilter] = useState("active");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getProducts(page, size, statusFilter);
            const pageData = res.data?.data;
            setProducts(pageData?.content ?? []);
            setTotalPages(pageData?.totalPages ?? 0);
            setTotalElements(pageData?.totalElements ?? 0);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    }, [page, size, statusFilter]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /* Modal helpers */
    const openCreateModal = useCallback(() => {
        setIsEditing(false);
        setSelectedProduct(null);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((product) => {
        setIsEditing(true);
        setSelectedProduct(product);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => setModalOpen(false), []);

    const handleModalClosed = useCallback(() => {
        setIsEditing(false);
        setSelectedProduct(null);
    }, []);

    /* Create / Update */
    const handleFormSubmit = useCallback(
        async (data, setError) => {
            try {
                if (isEditing) {
                    const res = await updateProduct(selectedProduct.productId, data);
                    toast.success(res.data.message);
                } else {
                    const res = await createProduct(data);
                    toast.success(res.data.message);
                }
                closeModal();
                if (page === 0) {
                    fetchProducts();
                } else {
                    setPage(0);
                }
            } catch (error) {
                const status = error?.response?.status;
                const body = error?.response?.data;
                const serverMsg = body?.message || "Unexpected error. Please try again.";

                if (status === 409) {
                    setError("sku", {
                        type: "server",
                        message: body?.message ?? "SKU already exists.",
                    });
                    toast.error(body?.message || "Duplicate SKU — choose another.");

                } else if (status === 400) {
                    const details = body?.data;

                    if (details && typeof details === "object" && Object.keys(details).length > 0) {
                        let routedCount = 0;
                        const unknownErrors = [];

                        Object.entries(details).forEach(([serverField, msg]) => {
                            const formField = SERVER_FIELD_MAP[serverField];
                            if (formField) {
                                setError(formField, { type: "server", message: msg });
                                routedCount++;
                            } else {
                                unknownErrors.push(msg);
                            }
                        });

                        if (unknownErrors.length > 0) {
                            toast.error(unknownErrors.join(" "));
                        }
                        if (routedCount === 0 && unknownErrors.length === 0) {
                            toast.error(serverMsg);
                        }
                    } else {
                        const guessedField = guessFieldFromMessage(serverMsg);
                        if (guessedField) {
                            setError(guessedField, { type: "server", message: serverMsg });
                        } else {
                            toast.error(serverMsg);
                        }
                    }

                } else {
                    toast.error(serverMsg);
                }
            }
        },
        [isEditing, selectedProduct, closeModal, fetchProducts, page]
    );

    /* Toggle Status */
    const handleToggleStatus = useCallback(
        (product) => {
            const isActivating = !product.status;
            const actionText = isActivating ? "Activate" : "Deactivate";

            const message = isActivating
                ? `Activate "${product.productName}"?`
                : `Deactivating this product will hide it from the customer interface. Deactivate "${product.productName}"?`;

            toast(message, {
                action: {
                    label: actionText,
                    onClick: async () => {
                        try {
                            const res = await toggleProductStatus(product.productId);
                            toast.success(res.data.message);
                            if (page >= totalPages - 1 && page > 0 && products.length === 1) {
                                setPage((p) => p - 1);
                            } else {
                                fetchProducts();
                            }
                        } catch (error) {
                            const status = error?.response?.status;
                            if (status === 404) {
                                toast.error("Product not found.");
                                fetchProducts();
                            } else {
                                toast.error(
                                    error.response?.data?.message ||
                                    `Failed to ${actionText.toLowerCase()} product.`
                                );
                            }
                        }
                    },
                },
                cancel: { label: "Cancel", onClick: () => { } },
            });
        },
        [fetchProducts, page, totalPages, products.length]
    );

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Products
                        </h1>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                            Manage your product catalog
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setPage(0);
                                setStatusFilter(e.target.value);
                            }}
                            className="px-3 py-2 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm 
                            focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    {/* New Product */}
                    <button
                        onClick={openCreateModal}
                        aria-label="Add new product"
                        className="self-start sm:self-auto px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150"
                    >
                        + New Product
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
                                        {["#", "Name", "SKU", "Price", "Category", "Inventory", "Status", "Actions"].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <MemoTable
                            products={products}
                            onEdit={openEditModal}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                </div>

                {/* Row count */}
                {!loading && (
                    <p className="mt-3 text-xs text-right text-[var(--text-muted)]">
                        {totalElements}{" "}
                        {totalElements === 1 ? "product" : "products"} total
                    </p>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-[var(--text-muted)]">
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                onClosed={handleModalClosed}
                title={isEditing ? "Edit Product" : "New Product"}
            >
                <ProductForm
                    isEditing={isEditing}
                    defaultValues={selectedProduct}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
}
