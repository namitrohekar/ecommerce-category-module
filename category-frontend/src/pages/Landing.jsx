import { Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart, ArrowRight, ClipboardList } from "lucide-react";

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent-primary)",
                }}
            >
                <ShoppingBag size={32} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3">
                Welcome to ShopHub
            </h1>
            <p className="text-base text-[var(--text-secondary)] max-w-md mb-8">
                Discover our curated collection of products. Browse, pick what you love,
                and place an order in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Primary CTA — browse & buy */}
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white
                               bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150"
                >
                    <ShoppingCart size={16} />
                    Shop Now
                    <ArrowRight size={15} />
                </Link>

                {/* Secondary CTA — view past orders */}
                <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold
                               border border-[var(--border-soft)] text-[var(--text-secondary)]
                               hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-colors duration-150"
                >
                    <ClipboardList size={16} />
                    My Orders
                </Link>
            </div>
        </div>
    );
}
