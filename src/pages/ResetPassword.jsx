import React, { useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, CheckCircle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { motion } from "framer-motion";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;
            setDone(true);
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <AuthLayout
                icon={CheckCircle}
                title="Password Updated"
                subtitle="Your password has been successfully changed."
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-6 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-center shadow-inner mb-6"
                >
                    <p className="text-sm font-body text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        You can now securely log in to your account with your new password.
                    </p>
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
                        <Button
                            className="w-full h-12 font-semibold text-base bg-[#1A1A1A] hover:bg-[#2A2A2A] dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-100 rounded-xl transition-all shadow-lg"
                            onClick={() => (window.location.href = "/login")}
                        >
                            Go to Log In
                        </Button>
                    </motion.div>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            icon={Lock}
            title="Set New Password"
            subtitle="Choose a strong password to protect your account."
        >
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
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">New Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true" />
                        <Input
                            id="password"
                            type="password"
                            autoFocus
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
                                Updating...
                            </>
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </motion.div>
            </form>
        </AuthLayout>
    );
}
