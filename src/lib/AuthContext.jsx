import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setIsLoadingAuth(false);
        }).catch((err) => {
            console.error('Failed to get Supabase session:', err);
            setIsLoadingAuth(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setIsLoadingAuth(false);
            setAuthError(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
    };

    const navigateToLogin = () => {
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isAuthenticated,
            isLoadingAuth,
            // Keep these for backward compatibility with App.jsx
            isLoadingPublicSettings: false,
            authError,
            logout,
            navigateToLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
