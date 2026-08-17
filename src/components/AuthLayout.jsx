import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background px-4">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-[100px] animate-pulse" />
                <div className="absolute top-[60%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#1A1A1A]/5 dark:from-white/5 to-transparent blur-[120px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] shadow-xl mb-6 ring-4 ring-white/50 dark:ring-white/10"
                    >
                        <Icon className="w-8 h-8" strokeWidth={1.5} aria-hidden="true" />
                    </motion.div>
                    <h1 className="text-4xl font-heading font-medium tracking-tight text-[#1A1A1A] dark:text-white mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-muted-foreground font-body text-base px-6">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="bg-white/60 dark:bg-[#121212]/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 p-8 relative overflow-hidden">
                    {/* Subtle inner glow for the card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-3xl" />
                    
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                {footer && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center text-sm font-body text-muted-foreground mt-8"
                    >
                        {footer}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
