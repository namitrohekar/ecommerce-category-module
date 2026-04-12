import { useState, useEffect } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import { toast } from "sonner";
import { updateOrderStatus, cancelOrder } from "../services/orderService";

export default function OrderDetailModal({ order, onStatusChanged, isCustomerView = false }) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!order) return null;

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        try {
            if (newStatus === "CANCELLED") {
                await cancelOrder(order.orderId);
            } else {
                await updateOrderStatus(order.orderId, { orderStatus: newStatus });
            }
            toast.success(`Order status updated to ${newStatus}`);
            if (onStatusChanged) onStatusChanged();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order status");
        } finally {
            setIsUpdating(false);
        }
    };

    function formatDateTime(value) {
        if (!value) return "—";
        const d = new Date(value);
        return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    const canCancel = order.orderStatus === "PENDING";
    const canShip = !isCustomerView && order.orderStatus === "PENDING";
    const canDeliver = !isCustomerView && order.orderStatus === "SHIPPED";

    return (
        <div className="flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
                        Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Placed on {formatDateTime(order.createdAt)}
                    </p>
                </div>
                <OrderStatusBadge status={order.orderStatus} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Customer Details</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{order.customerName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{order.customerEmail}</p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Shipping Address</h4>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{order.shippingAddress}</p>
                </div>
            </div>

            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Order Items</h4>
            <div className="overflow-auto border border-[var(--border-soft)] rounded-xl bg-[var(--bg-surface)] mb-6 flex-1">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="sticky top-0 bg-[var(--bg-surface)] z-10 shadow-sm">
                        <tr className="text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border-soft)]">
                            <th className="px-4 py-3 font-medium">Product</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium text-center">Qty</th>
                            <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item, idx) => (
                            <tr key={idx} className="border-b border-[var(--border-soft)] last:border-b-0 text-[var(--text-secondary)]">
                                <td className="px-4 py-3">{item.productName || `Product #${item.productId}`}</td>
                                <td className="px-4 py-3">&#8377;{Number(item.unitPrice).toFixed(2)}</td>
                                <td className="px-4 py-3 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 text-right text-[var(--text-primary)] font-medium">
                                    &#8377;{(item.quantity * item.unitPrice).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>Subtotal</span>
                        <span>&#8377;{(order.totalAmount - (order.taxAmount || 0) - (order.shippingCost || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>Tax</span>
                        <span>&#8377;{Number(order.taxAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>Shipping</span>
                        <span>&#8377;{Number(order.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-[var(--border-soft)] flex justify-between text-base font-bold text-[var(--text-primary)]">
                        <span>Total</span>
                        <span>&#8377;{Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--border-soft)] flex justify-end gap-3 shrink-0">
                {canCancel && (
                    <button
                        onClick={() => handleStatusUpdate("CANCELLED")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors disabled:opacity-50"
                    >
                        Cancel Order
                    </button>
                )}
                {canShip && (
                    <button
                        onClick={() => handleStatusUpdate("SHIPPED")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
                    >
                        Mark as Shipped
                    </button>
                )}
                {canDeliver && (
                    <button
                        onClick={() => handleStatusUpdate("DELIVERED")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--success)] text-white hover:bg-[#15803d] transition-colors disabled:opacity-50"
                    >
                        Mark as Delivered
                    </button>
                )}
            </div>
        </div>
    );
}
