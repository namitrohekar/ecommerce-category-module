import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPublicProducts } from "../services/productService";
import { ShoppingBag, ShoppingCart } from "lucide-react";

function SkeletonCard() {
    return (
        <div
            className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 animate-pulse flex flex-col gap-3"
            style={{ boxShadow: "var(--shadow-subtle)" }}
        >
            <div className="h-4 w-3/4 rounded bg-[var(--bg-subtle)]" />
            <div className="h-3 w-1/3 rounded bg-[var(--bg-subtle)]" />
            <div className="h-3 w-full rounded bg-[var(--bg-subtle)]" />
            <div className="h-3 w-2/3 rounded bg-[var(--bg-subtle)]" />
            <div className="mt-auto h-9 w-full rounded-lg bg-[var(--bg-subtle)]" />
        </div>
    );
}

export default function PublicProducts() {
    const navigate = useNavigate();

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

    /** Navigate to checkout with this product pre-selected */
    const handleBuyNow = (product) => {
        navigate("/place-order", {
            state: { preselectedProductId: product.productId },
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Products
                </h1>
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
                    {products.map((product) => {
                        const inStock = product.inventoryCount > 0;
                        return (
                            <div
                                key={product.productId}
                                className={`rounded-xl border bg-[var(--bg-surface)] p-5 flex flex-col transition-colors duration-150 ${
                                    inStock
                                        ? "border-[var(--border-soft)] hover:border-[var(--accent-primary)]"
                                        : "border-[var(--border-soft)] opacity-70"
                                }`}
                                style={{ boxShadow: "var(--shadow-subtle)" }}
                            >
                                {/* Name + price */}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1 leading-snug">
                                        {product.productName}
                                    </h3>
                                    <span className="text-base font-bold text-[var(--accent-primary)] whitespace-nowrap ml-2">
                                        &#8377;{Number(product.price).toFixed(2)}
                                    </span>
                                </div>

                                {/* Category badge */}
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 bg-[var(--accent-soft)] text-[var(--accent-primary)] w-fit">
                                    {product.categoryName}
                                </span>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3 flex-1">
                                        {product.description}
                                    </p>
                                )}

                                {/* SKU + stock row */}
                                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-4">
                                    <span>SKU: {product.sku}</span>
                                    {inStock ? (
                                        <span className="text-[var(--success)] font-medium">
                                            {product.inventoryCount} in stock
                                        </span>
                                    ) : (
                                        <span className="text-[var(--danger)] font-medium">
                                            Out of stock
                                        </span>
                                    )}
                                </div>

                                {/* Buy Now CTA */}
                                {inStock ? (
                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150 focus-teal"
                                    >
                                        <ShoppingCart size={15} />
                                        Buy Now
                                    </button>
                                ) : (
                                    <div className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border-soft)] cursor-not-allowed">
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
                        className="px-3 py-1.5 border border-[var(--border-soft)] rounded-lg text-sm disabled:opacity-40 hover:border-[var(--border-hover)] transition-colors text-[var(--text-primary)]"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-[var(--text-muted)]">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1.5 border border-[var(--border-soft)] rounded-lg text-sm disabled:opacity-40 hover:border-[var(--border-hover)] transition-colors text-[var(--text-primary)]"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
