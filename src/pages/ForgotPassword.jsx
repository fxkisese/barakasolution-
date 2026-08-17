import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
        } catch {
            // Always show success regardless
        } finally {
            setLoading(false);
            setSent(true);
        }
    };

    return (
        <AuthLayout
            icon={Mail}
            title="Reset Password"
            subtitle="We'll send you a link to reset it."
            footer={
                <Link to="/login" className="text-gray-500 hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] font-semibold transition-colors hover:underline inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to log in
                </Link>
            }
        >
            {sent ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-center shadow-inner"
                >
                    <p className="text-sm font-body text-gray-700 dark:text-gray-300 leading-relaxed">
                        If an account exists with that email, you will receive a password reset link shortly.<br className="mb-2" />
                        Please check your inbox and spam folder.
                    </p>
                </motion.div>
            ) : (
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
                    
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                        <Button 
                            type="submit" 
                            className="w-full h-12 font-semibold text-base bg-[#1A1A1A] hover:bg-[#2A2A2A] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-100 rounded-xl transition-all shadow-lg" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </motion.div>
                </form>
            )}
        </AuthLayout>
    );
}
