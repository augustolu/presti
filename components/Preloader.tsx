"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random increment for realistic feel
                return prev + Math.random() * 10;
            });
        }, 100);

        // Ensure minimum load time of 2 seconds for branding
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        const handleLoad = () => {
            // When window loads, we still wait for the timer if it hasn't finished
            // But if the timer is done, we can finish immediately
            // In this simple logic, the timer acts as the minimum duration
        };

        window.addEventListener("load", handleLoad);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
            window.removeEventListener("load", handleLoad);
        };
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                            KnightDesign
                        </h1>
                        <p className="text-gray-400 text-sm tracking-widest uppercase">
                            Portfolio
                        </p>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>

                    <motion.div
                        className="mt-4 text-xs text-gray-500 font-mono"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        {Math.floor(Math.min(progress, 100))}%
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
