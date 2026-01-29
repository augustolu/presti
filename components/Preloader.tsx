"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { allVideos } from "@/constants/assets";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadAssets = async () => {
            const totalAssets = allVideos.length;
            let loadedCount = 0;

            const updateProgress = () => {
                loadedCount++;
                const newProgress = (loadedCount / totalAssets) * 100;
                setProgress(newProgress);
            };

            const promises = allVideos.map((src) => {
                return new Promise<void>((resolve) => {
                    const video = document.createElement("video");
                    video.src = src;
                    video.preload = "auto";

                    // We consider it "loaded" enough when it can play through or has buffered enough data
                    // 'canplaythrough' is ideal but might be too strict for slow connections
                    // 'loadeddata' is faster but might buffer later
                    const onLoaded = () => {
                        updateProgress();
                        resolve();
                        cleanup();
                    };

                    const onError = () => {
                        console.warn(`Failed to preload video: ${src}`);
                        updateProgress(); // Count it anyway to avoid hanging
                        resolve();
                        cleanup();
                    };

                    const cleanup = () => {
                        video.removeEventListener("canplaythrough", onLoaded);
                        video.removeEventListener("error", onError);
                    };

                    video.addEventListener("canplaythrough", onLoaded);
                    video.addEventListener("error", onError);

                    // Fallback timeout in case of network issues (10 seconds max per video)
                    setTimeout(() => {
                        cleanup();
                        resolve(); // Resolve anyway to not block indefinitely
                    }, 10000);
                });
            });

            try {
                await Promise.all(promises);
            } catch (error) {
                console.error("Error preloading assets:", error);
            }

            // Ensure minimum branding time (1s)
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        };

        loadAssets();
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
