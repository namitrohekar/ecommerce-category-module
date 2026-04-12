import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { placeOrder } from "../services/orderService";
import { getPublicProducts } from "../services/productService";
import PlaceOrderForm from "../components/PlaceOrderForm";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function PlaceOrder() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Set by the "Buy Now" button on product cards
    const preselectedProductId = location.state?.preselectedProductId ?? null;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getPublicProducts(0, 200);
                setProducts(res.data?.data?.content || []);
            } catch {
                toast.error("Failed to load products for catalog.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const payload = {
                // Customer identity comes from the auth session (hidden from form)
                customerName: user.name,
                customerEmail: user.email,
                shippingAddress: formData.shippingAddress,
                items: formData.items.map((i) => ({
                    productId: parseInt(i.productId),
                    quantity: parseInt(i.quantity),
                })),
            };

            const res = await placeOrder(payload);
            toast.success(res.data?.message || "Order placed successfully!");
            navigate("/orders");
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to place order.";
            const specificErrs = error.response?.data?.data;
            if (specificErrs && typeof specificErrs === "object") {
                const combined = Object.values(specificErrs).join(", ");
                toast.error(combined || msg);
            } else {
                toast.error(msg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
            <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
            >
                <ArrowLeft size={15} />
                Back to Products
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Place an Order</h1>
                <p className="mt-2 text-base text-[var(--text-secondary)]">
                    {preselectedProductId
                        ? "Your selected product is pre-loaded — add more items or complete your details below."
                        : "Add the products you'd like to order and provide your shipping address."}
                </p>
                {/* Show who's ordering — no email exposed */}
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent-primary)] border-opacity-30">
                    <span className="text-xs font-medium text-[var(--accent-primary)]">
                        Ordering as: <strong>{user?.name}</strong>
                    </span>
                </div>
            </div>

            <div
                className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-soft)]"
                style={{ boxShadow: "var(--shadow-subtle)" }}
            >
                {loading ? (
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-[var(--bg-subtle)] rounded-lg" />
                        <div className="h-20 bg-[var(--bg-subtle)] rounded-lg" />
                        <div className="h-32 bg-[var(--bg-subtle)] rounded-lg" />
                    </div>
                ) : (
                    <PlaceOrderForm
                        products={products}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        preselectedProductId={preselectedProductId}
                    />
                )}
            </div>
        </div>
    );
}
