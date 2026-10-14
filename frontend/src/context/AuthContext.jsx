import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('bb_token'));
    const [username, setUsername] = useState(() => localStorage.getItem('bb_name'));

    useEffect(() => {
        if (token) {
            setUser({ token });
        }
    }, [token]);

    const loginCtx = (tok, name) => {
        localStorage.setItem('bb_token', tok);
        localStorage.setItem('bb_name', name);
        setToken(tok);
        setUsername(name);
        setUser({ token: tok });
    };

    const logout = () => {
        localStorage.removeItem('bb_token');
        localStorage.removeItem('bb_name');
        setToken(null);
        setUsername(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, username, loginCtx, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
