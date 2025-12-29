"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WarpTransitionProps {
    isActive: boolean;
    onComplete?: () => void;
}

interface Star {
    x: number;
    y: number;
    z: number;
    pz: number;
}

export default function WarpTransition({ isActive, onComplete }: WarpTransitionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0, height = 0, cx = 0, cy = 0;
        let animationFrameId: number;

        const stars: Star[] = [];
        const starCount = 1000;
        let speed = 0.1;
        const maxSpeed = 5;
        const acceleration = 1.08; // Exponential multiplier

        const initStars = () => {
            stars.length = 0;
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * width * 2,
                    y: (Math.random() - 0.5) * height * 2,
                    z: Math.random() * 1000,
                    pz: 0, // Previous Z
                });
                stars[i].pz = stars[i].z;
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            cx = width / 2;
            cy = height / 2;
            initStars();
        };

        const render = () => {
            // Clear with trail effect - Match LiquidBackground color
            ctx.fillStyle = "rgba(0, 5, 16, 0.4)"; // #000510 with opacity
            ctx.fillRect(0, 0, width, height);

            // Accelerate exponentially
            if (speed < maxSpeed) {
                speed *= acceleration;
            }

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineCap = "round";

            stars.forEach((star) => {
                star.pz = star.z;
                star.z -= speed;

                if (star.z <= 0) {
                    star.z = 1000;
                    star.pz = 1000;
                    star.x = (Math.random() - 0.5) * width * 2;
                    star.y = (Math.random() - 0.5) * height * 2;
                }

                const x = (star.x / star.z) * 100 + cx;
                const y = (star.y / star.z) * 100 + cy;

                const px = (star.x / star.pz) * 100 + cx;
                const py = (star.y / star.pz) * 100 + cy;

                // Draw line from previous position to current
                if (x > 0 && x < width && y > 0 && y < height && star.z < 900) {
                    const alpha = Math.min(1, (1000 - star.z) / 500);
                    ctx.lineWidth = Math.max(0.5, (1000 - star.z) / 300);
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        resize();
        render();
        window.addEventListener("resize", resize);

        // Auto-complete callback after some time if provided
        const timeout = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1500); // 1.5s duration

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeout);
        };
    }, [isActive, onComplete]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-[#000510] pointer-events-auto"
                >
                    <canvas ref={canvasRef} className="w-full h-full" />
                    {/* Flash to white at the end */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3, ease: "easeIn" }}
                        className="absolute inset-0 bg-white"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
