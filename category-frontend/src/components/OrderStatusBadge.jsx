export default function OrderStatusBadge({ status }) {
    if (!status) return null;

    let bgColor = "var(--bg-subtle)";
    let textColor = "var(--text-muted)";
    let borderColor = "transparent";

    switch (status) {
        case "PENDING":
            bgColor = "var(--warning-soft)";
            textColor = "var(--warning)";
            borderColor = "var(--warning)";
            break;
        case "SHIPPED":
            bgColor = "var(--accent-soft)";
            textColor = "var(--accent-primary)";
            borderColor = "var(--accent-primary)";
            break;
        case "DELIVERED":
            bgColor = "var(--success-soft)";
            textColor = "var(--success)";
            borderColor = "var(--success)";
            break;
        case "CANCELLED":
            bgColor = "var(--danger-soft)";
            textColor = "var(--danger)";
            borderColor = "var(--danger)";
            break;
        default:
            break;
    }

    return (
        <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
            }}
        >
            {status}
        </span>
    );
}
