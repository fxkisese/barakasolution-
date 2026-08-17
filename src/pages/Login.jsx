import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Chrome } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) throw signInError;
            // The AuthContext will pick up the session change and we can redirect
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/admin` },
        });
    };

    return (
        <AuthLayout
            icon={LogIn}
            title="Welcome Back"
            subtitle="Enter your details to access your account."
            footer={
                <>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-[#D4AF37] hover:text-[#B8902A] font-semibold transition-colors hover:underline">
                        Create an account
                    </Link>
                </>
            }
        >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                    variant="outline"
                    className="w-full h-12 text-sm font-medium mb-6 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300"
                    onClick={handleGoogle}
                    type="button"
                >
                    <Chrome className="w-4 h-4 mr-2" />
                    Continue with Google
                </Button>
            </motion.div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#121212] px-3 text-muted-foreground tracking-wider rounded-full font-medium">
                        or login with email
                    </span>
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-center"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-11 h-12 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                        <Link to="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true" />
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-11 h-12 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            required
                        />
                    </div>
                </div>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full h-12 font-semibold text-base bg-[#1A1A1A] hover:bg-[#2A2A2A] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-100 rounded-xl transition-all shadow-lg" 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </Button>
                </motion.div>
            </form>
        </AuthLayout>
    );
}