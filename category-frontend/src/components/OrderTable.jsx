import { Eye, Edit } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderTable({ orders, onViewDetails }) {
    if (!orders.length) {
        return (
            <div className="py-16 text-center text-sm text-[var(--text-muted)]">
                No orders found.
            </div>
        );
    }

    function formatDateTime(value) {
        if (!value) return "—";
        const d = new Date(value);
        return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return (
        <div
            className="overflow-x-auto rounded-xl border border-[var(--border-soft)]"
            style={{ boxShadow: "var(--shadow-subtle)" }}
        >
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="text-xs uppercase tracking-wide bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                        <th className="px-4 py-3 font-medium">Order ID</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium hidden sm:table-cell">Total</th>
                        <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.orderId}
                            className="border-t border-[var(--border-soft)] hover:bg-[var(--accent-soft)] transition-colors duration-150"
                        >
                            <td className="px-4 py-3 text-[var(--text-muted)]">
                                #{order.orderId}
                            </td>

                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                                {order.customerName}
                            </td>

                            <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-primary)] font-medium">
                                &#8377;{Number(order.totalAmount).toFixed(2)}
                            </td>

                            <td className="px-4 py-3 hidden lg:table-cell text-[var(--text-secondary)]">
                                {formatDateTime(order.createdAt)}
                            </td>

                            <td className="px-4 py-3">
                                <OrderStatusBadge status={order.orderStatus} />
                                {!order.status && (
                                     <span className="ml-2 text-[10px] text-[var(--danger)]">(Deleted)</span>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onViewDetails(order)}
                                        aria-label={`View details for order #${order.orderId}`}
                                        className="p-2 rounded-lg border border-[var(--border-soft)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-soft)] transition-colors duration-150 text-[var(--accent-primary)]"
                                    >
                                        <Eye size={16} />
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
