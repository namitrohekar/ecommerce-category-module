import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getPublicProducts } from "../services/productService";
import { ShoppingBag } from "lucide-react";

function SkeletonCard() {
    return (
        <div
            className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 animate-pulse"
            style={{ boxShadow: "var(--shadow-subtle)" }}
        >
            <div className="h-4 w-3/4 rounded bg-[var(--bg-subtle)] mb-3" />
            <div className="h-3 w-1/2 rounded bg-[var(--bg-subtle)] mb-4" />
            <div className="h-3 w-full rounded bg-[var(--bg-subtle)] mb-2" />
            <div className="h-3 w-2/3 rounded bg-[var(--bg-subtle)]" />
        </div>
    );
}

export default function PublicProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPublicProducts(page, 12);
            const pageData = res.data?.data;
            setProducts(pageData?.content ?? []);
            setTotalPages(pageData?.totalPages ?? 0);
            setTotalElements(pageData?.totalElements ?? 0);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Products
                </h1>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                    Browse our collection of products
                </p>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingBag
                        size={40}
                        className="text-[var(--text-muted)] mb-3"
                    />
                    <p className="text-sm text-[var(--text-muted)]">
                        No products available right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5
                                       hover:border-[var(--accent-primary)] transition-colors duration-150"
                            style={{ boxShadow: "var(--shadow-subtle)" }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1">
                                    {product.productName}
                                </h3>
                                <span className="text-base font-bold text-[var(--accent-primary)] whitespace-nowrap ml-2">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                            </div>

                            <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 bg-[var(--accent-soft)] text-[var(--accent-primary)]">
                                {product.categoryName}
                            </span>

                            {product.description && (
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                                <span>SKU: {product.sku}</span>
                                <span>
                                    {product.inventoryCount > 0
                                        ? `${product.inventoryCount} in stock`
                                        : "Out of stock"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Count */}
            {!loading && (
                <p className="mt-4 text-xs text-right text-[var(--text-muted)]">
                    {totalElements} {totalElements === 1 ? "product" : "products"} total
                </p>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-3 py-1.5 border border-[var(--border-soft)] rounded-lg text-sm
                                   disabled:opacity-40 hover:border-[var(--border-hover)] transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[var(--text-muted)]">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1.5 border border-[var(--border-soft)] rounded-lg text-sm
                                   disabled:opacity-40 hover:border-[var(--border-hover)] transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
