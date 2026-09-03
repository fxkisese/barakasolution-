import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

/**
 * Wraps any route that should only be accessible to the admin user.
 *
 * States:
 *  - Auth loading  → spinner
 *  - Not logged in → redirect to /login
 *  - Wrong account → Access Denied screen
 *  - Admin email   → renders children
 */
export default function ProtectedAdminRoute({ children }) {
    const { user, isLoadingAuth } = useAuth();

    // 1. Still resolving session
    if (isLoadingAuth) {
        return (
            <div style={{
                position: 'fixed', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#f7f6f4',
            }}>
                <div style={{
                    width: 40, height: 40,
                    border: '3px solid #e4e2dd',
                    borderTopColor: '#D4AF37',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // 2. Not logged in at all
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Logged in but not the admin
    if (ADMIN_EMAIL && user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return (
            <div style={{
                position: 'fixed', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: '#0f0e0d',
                fontFamily: "'Inter', sans-serif",
                gap: 16,
                padding: 24,
            }}>
                {/* Gold bar accent */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                    background: 'linear-gradient(90deg, #D4AF37, #C9A84C)',
                }} />

                {/* Lock icon */}
                <div style={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.12)',
                    border: '1.5px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, marginBottom: 8,
                }}>
                    🔒
                </div>

                <h1 style={{
                    color: '#ffffff',
                    fontSize: 26, fontWeight: 700,
                    letterSpacing: '-0.02em', margin: 0,
                }}>
                    Access Denied
                </h1>

                <p style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 14, textAlign: 'center',
                    maxWidth: 340, margin: 0, lineHeight: 1.6,
                }}>
                    You are signed in as <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user.email}</strong>,
                    which does not have permission to access this area.
                </p>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: 'rgba(255,255,255,0.7)',
                            border: '1.5px solid rgba(255,255,255,0.12)',
                            borderRadius: 10, padding: '10px 22px',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        ← Back to Site
                    </button>
                    <button
                        onClick={async () => {
                            const { supabase } = await import('@/api/supabaseClient');
                            await supabase.auth.signOut();
                            window.location.href = '/login';
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #D4AF37, #C9A84C)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10, padding: '10px 22px',
                            fontWeight: 600, fontSize: 13, cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: '0 2px 12px rgba(212,175,55,0.3)',
                        }}
                    >
                        Sign in with Admin Account
                    </button>
                </div>
            </div>
        );
    }

    // 4. Authenticated admin — grant access
    return children;
}
