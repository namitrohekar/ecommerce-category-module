import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getOrders, getOrderById } from "../services/orderService";
import OrderTable from "../components/OrderTable";
import OrderDetailModal from "../components/OrderDetailModal";
import Modal from "../components/Modal";

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

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    /* Pagination */
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    /* Filter */
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            // "all" disables the status filter by passing empty string
            const orderStatus = statusFilter === "all" ? null : statusFilter;
            // Get all visible orders ideally. In this system active status is part of the API.
            // Admin can see soft deleted too if we wanted, but we'll show active by default or null.
            const res = await getOrders(page, size, null, orderStatus);
            const pageData = res.data?.data;
            setOrders(pageData?.content ?? []);
            setTotalPages(pageData?.totalPages ?? 0);
            setTotalElements(pageData?.totalElements ?? 0);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    }, [page, size, statusFilter]);

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

    const handleModalClosed = () => {
        setSelectedOrder(null);
    };

    const onStatusChanged = () => {
        // Refresh full order details the modal has right now
        if (selectedOrder) {
            getOrderById(selectedOrder.orderId).then(res => {
                setSelectedOrder(res.data.data);
            });
        }
        // Refresh the main table
        fetchOrders();
    };

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Orders</h1>
                        <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Track and manage customer orders</p>
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
                            <option value="all">All Orders</option>
                            <option value="PENDING">Pending</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Table Panel */}
                <div className="rounded-xl p-6 border border-[var(--border-soft)] bg-[var(--bg-surface)]" style={{ boxShadow: "var(--shadow-subtle)" }}>
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
                                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
                    )}
                </div>

                {!loading && (
                    <p className="mt-3 text-xs text-right text-[var(--text-muted)]">
                        {totalElements} {totalElements === 1 ? "order" : "orders"} total
                    </p>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-end items-center gap-4 mt-4">
                        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">Prev</button>
                        <span className="text-sm text-[var(--text-muted)]">Page {page + 1} of {totalPages}</span>
                        <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next</button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onClosed={handleModalClosed}
                title="Order Details"
            >
                {loadingDetails ? (
                    <div className="flex justify-center p-8"><span className="text-[var(--text-muted)] animate-pulse">Loading details...</span></div>
                ) : (
                    selectedOrder && <OrderDetailModal order={selectedOrder} onStatusChanged={onStatusChanged} />
                )}
            </Modal>
        </div>
    );
}
