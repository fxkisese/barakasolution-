import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, Chrome } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            if (signUpError) throw signUpError;
            setSent(true);
        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/` },
        });
    };

    if (sent) {
        return (
            <AuthLayout
                icon={Mail}
                title="Check Your Email"
                subtitle={`We've sent a confirmation link to ${email}`}
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-center shadow-inner"
                >
                    <p className="text-sm font-body text-gray-700 dark:text-gray-300 leading-relaxed">
                        Please click the link in your email to confirm your account.<br className="mb-2" />
                        Once confirmed, you can securely log in.
                    </p>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            icon={UserPlus}
            title="Create an Account"
            subtitle="Join us today to get started."
            footer={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#D4AF37] hover:text-[#B8902A] font-semibold transition-colors hover:underline">
                        Log in
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
                        or register with email
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
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true" />
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-11 h-12 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#D4AF37] dark:focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all rounded-xl"
                            required
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true" />
                        <Input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </motion.div>
            </form>
        </AuthLayout>
    );
}
