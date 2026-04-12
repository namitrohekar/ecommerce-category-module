import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Tiny artificial delay for UX feel
        await new Promise((r) => setTimeout(r, 300));

        const ok = login(username.trim(), password);
        if (!ok) {
            setError("Invalid username or password.");
            setLoading(false);
            return;
        }

        // Route based on role
        const isAdmin =
            username.trim().toLowerCase() === "admin";
        navigate(isAdmin ? "/admin" : from, { replace: true });
    };

    const fillDemo = (role) => {
        if (role === "customer") {
            setUsername("customer");
            setPassword("customer");
        } else {
            setUsername("admin");
            setPassword("admin");
        }
        setError("");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-4">
            {/* Card */}
            <div
                className="w-full max-w-sm rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-8"
                style={{ boxShadow: "var(--shadow-subtle)" }}
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
                    >
                        <ShoppingBag size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-[var(--text-primary)]">ShopHub</h1>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Sign in to continue</p>
                </div>

                {/* Quick-fill chips */}
                <div className="flex gap-2 mb-6">
                    <button
                        type="button"
                        id="demo-customer-btn"
                        onClick={() => fillDemo("customer")}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                        👤 Customer demo
                    </button>
                    <button
                        type="button"
                        id="demo-admin-btn"
                        onClick={() => fillDemo("admin")}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                        🛡️ Admin demo
                    </button>
                </div>

                {/* Form */}
                <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="login-username"
                            className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <User
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                            />
                            <input
                                id="login-username"
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="customer  ·  admin"
                                required
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="login-password"
                            className="block text-sm font-medium text-[var(--text-primary)] mb-1"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                            />
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 rounded-lg">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <button
                        id="login-submit-btn"
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                {/* Credentials hint */}
                <div className="mt-6 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                    <p className="text-xs text-[var(--text-muted)] text-center font-medium mb-2">Demo credentials</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-0.5">
                            <p className="font-semibold text-[var(--text-secondary)]">Customer</p>
                            <p className="text-[var(--text-muted)]">user: <span className="font-mono">customer</span></p>
                            <p className="text-[var(--text-muted)]">pass: <span className="font-mono">customer</span></p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-semibold text-[var(--text-secondary)]">Admin</p>
                            <p className="text-[var(--text-muted)]">user: <span className="font-mono">admin</span></p>
                            <p className="text-[var(--text-muted)]">pass: <span className="font-mono">admin</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
