import { createContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@api/authApi';
const AUTH_STORAGE_KEY = 'orion_auth';
const defaultValue = {
    token: '',
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isCliente: false,
    loginWithCredentials: async () => ({
        id: '',
        legacyId: '',
        email: '',
        nombre: '',
        rol: '',
        activo: false,
    }),
    loadProfile: async () => undefined,
    logout: () => undefined,
};
export const AuthContext = createContext(defaultValue);
function readStoredAuth() {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw)
        return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed.token || !parsed.user)
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
export function AuthProvider({ children }) {
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    useEffect(() => {
        const stored = readStoredAuth();
        if (stored) {
            setToken(stored.token);
            setUser(stored.user);
        }
    }, []);
    const persist = (nextToken, nextUser) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
        setToken(nextToken);
        setUser(nextUser);
    };
    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken('');
        setUser(null);
    };
    const loginWithCredentials = async (email, password) => {
        const response = await authApi.login({ email, password });
        const nextUser = response.data.user;
        persist(response.data.token, nextUser);
        return nextUser;
    };
    const loadProfile = async () => {
        if (!token)
            return;
        const response = await authApi.me(token);
        persist(token, response.data);
    };
    const value = useMemo(() => ({
        token,
        user,
        isAuthenticated: Boolean(token),
        isAdmin: user?.rol === 'admin',
        isCliente: user?.rol === 'cliente',
        loginWithCredentials,
        loadProfile,
        logout,
    }), [token, user]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
