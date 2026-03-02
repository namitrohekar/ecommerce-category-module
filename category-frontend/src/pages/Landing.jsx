import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

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
                Discover our curated collection of products. Browse categories, explore
                details, and find exactly what you need.
            </p>

            <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white 
                           bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150"
            >
                Browse Products
                <ArrowRight size={16} />
            </Link>
        </div>
    );
}
