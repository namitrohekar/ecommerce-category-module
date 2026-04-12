import { createContext, useContext, useState } from "react";


// Hardcoded demo users — email is the internal identifier used by the backend

export const DEMO_USERS = [
    {
        username: "customer",
        password: "customer",
        role: "CUSTOMER",
        name: "Customer",
        // This email is stored in the backend's customers table after first order
        email: "customer@shophub.demo",
    },
    {
        username: "admin",
        password: "admin",
        role: "ADMIN",
        name: "Store Admin",
        email: null, // admin doesn't filter by email
    },
];

const SESSION_KEY = "shopHub_auth_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const login = (username, password) => {
        const found = DEMO_USERS.find(
            (u) =>
                u.username.toLowerCase() === username.toLowerCase() &&
                u.password === password
        );
        if (!found) return false;
        const session = {
            username: found.username,
            name: found.name,
            role: found.role,
            email: found.email,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setUser(session);
        return true;
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        // Also clear any old-format session keys
        localStorage.removeItem("shopHub_customer");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
