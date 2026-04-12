import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getOrders, getOrderById } from "../services/orderService";
import OrderTable from "../components/OrderTable";
import OrderDetailModal from "../components/OrderDetailModal";
import Modal from "../components/Modal";
import { ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SkeletonRow() {
    return (
        <tr className="border-t border-[var(--border-soft)] animate-pulse">
            {[...Array(6)].map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <div className="h-4 rounded bg-[var(--bg-subtle)]" />
                </td>
            ))}
        </tr>
    );
}

export default function CustomerOrders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchOrders = useCallback(async () => {
        // Filter by the customer's mapped email — hidden from UI
        if (!user?.email) {
            setOrders([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await getOrders(page, size, true, null, null, user.email);
            const pageData = res.data?.data;
            setOrders(pageData?.content ?? []);
            setTotalPages(pageData?.totalPages ?? 0);
        } catch {
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    }, [page, size, user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewDetails = async (orderSummary) => {
        setModalOpen(true);
        setLoadingDetails(true);
        try {
            const res = await getOrderById(orderSummary.orderId);
            setSelectedOrder(res.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load order details");
            setModalOpen(false);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleModalClosed = () => setSelectedOrder(null);

    const onStatusChanged = () => {
        if (selectedOrder) {
            getOrderById(selectedOrder.orderId).then((res) =>
                setSelectedOrder(res.data.data)
            );
        }
        fetchOrders();
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">My Orders</h1>
                    <p className="mt-2 text-base text-[var(--text-secondary)]">
                        Welcome back, <span className="font-semibold text-[var(--text-primary)]">{user?.name ?? "Customer"}</span>
                    </p>
                </div>
                <Link
                    to="/place-order"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150 shrink-0"
                >
                    <ShoppingCart size={18} />
                    Place New Order
                </Link>
            </div>

            {/* Content */}
            <div
                className="bg-[var(--bg-surface)] rounded-2xl p-6 border border-[var(--border-soft)]"
                style={{ boxShadow: "var(--shadow-subtle)" }}
            >
                {loading ? (
                    <div className="overflow-x-auto rounded-xl border border-[var(--border-soft)]">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-[var(--bg-subtle)]">
                                    {["Order ID", "Customer", "Total", "Date", "Status", "Actions"].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
                            </tbody>
                        </table>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Package size={40} className="text-[var(--text-muted)] mb-3" />
                        <p className="text-sm text-[var(--text-muted)] mb-4">No orders placed yet.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors"
                        >
                            <ShoppingCart size={16} />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <OrderTable orders={orders} onViewDetails={handleViewDetails} />
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border border-[var(--border-soft)] rounded-lg disabled:opacity-40 text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-primary)]"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border border-[var(--border-soft)] rounded-lg disabled:opacity-40 text-sm font-medium hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-primary)]"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Detail modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onClosed={handleModalClosed}
                title="Order Details"
            >
                {loadingDetails ? (
                    <div className="flex justify-center p-8">
                        <span className="text-[var(--text-muted)] animate-pulse">Loading details...</span>
                    </div>
                ) : (
                    selectedOrder && (
                        <OrderDetailModal
                            order={selectedOrder}
                            onStatusChanged={onStatusChanged}
                            isCustomerView={true}
                        />
                    )
                )}
            </Modal>
        </div>
    );
}
