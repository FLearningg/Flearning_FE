import React, { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser, googleLogin as apiGoogleLogin, logoutUser } from '../api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSuccess = (accessToken, userInfo) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        setToken(accessToken);
        setCurrentUser(userInfo);
    };

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        handleLoginSuccess(response.data.accessToken, response.data.user);
    };

    const googleLogin = async (tokenId) => {
        const response = await apiGoogleLogin(tokenId);
        handleLoginSuccess(response.data.accessToken, response.data.user);
    };
    
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Lỗi khi gọi API logout:", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('currentUser');
            setToken(null);
            setCurrentUser(null);
        }
    };

    const value = {
        currentUser,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        googleLogin,
        register: registerUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};