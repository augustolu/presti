"use client";

import { useEffect, useRef } from "react";

export default function LiquidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let time = 0;

        const mouse = { x: -1000, y: -1000 };

        // Vertical following state
        let centerY = height / 2;
        let targetCenterY = height / 2;

        // Wave configuration
        const waves = [
            { amplitude: 50, frequency: 0.002, speed: 0.01, color: "rgba(0, 206, 209, 0.15)", offset: 0 }, // #00CED1
            { amplitude: 70, frequency: 0.0015, speed: 0.008, color: "rgba(64, 224, 208, 0.15)", offset: 2 }, // #40E0D0
            { amplitude: 30, frequency: 0.003, speed: 0.015, color: "rgba(32, 178, 170, 0.15)", offset: 4 }, // #20B2AA
        ];

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);

            time += 1;

            // Vertical following logic
            // Target is based on mouse Y, but dampened (e.g., moves 20% of mouse distance)
            // If mouse is at -1000 (initial), keep center at height/2
            if (mouse.y > -100) {
                const offset = (mouse.y - height / 2) * 0.2; // 20% following strength
                targetCenterY = (height / 2) + offset;
            } else {
                targetCenterY = height / 2;
            }

            // Smooth lerp
            centerY += (targetCenterY - centerY) * 0.05;

            waves.forEach((wave) => {
                ctx.beginPath();
                ctx.moveTo(0, centerY);

                for (let x = 0; x < width; x++) {
                    // Base Sine Wave
                    const yBase = Math.sin(x * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude;

                    // Mouse Interaction (Gaussian Bump)
                    const dx = x - mouse.x;
                    const dist = Math.abs(dx);
                    const interactionRadius = 200;

                    let interaction = 0;
                    if (dist < interactionRadius) {
                        const dy = (centerY + yBase) - mouse.y;
                        const vDist = Math.abs(dy);

                        // Interaction is now relative to the moving center
                        const influence = Math.max(0, 1 - dist / interactionRadius) * Math.max(0, 1 - vDist / 300);
                        interaction = 50 * Math.exp(-(dx * dx) / (2 * 60 * 60));
                    }

                    ctx.lineTo(x, centerY + yBase + interaction);
                }

                ctx.strokeStyle = wave.color;
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        />
    );
}
