"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CursorTrail() {
    const pathRef = useRef<SVGPathElement>(null);
    const pointsRef = useRef<{ x: number; y: number }[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef<number>(0);
    const lastScrollY = useRef<number>(0);

    // State for click animations
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

    useEffect(() => {
        // Initialize mouse position
        mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        lastScrollY.current = window.scrollY;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleClick = (e: MouseEvent) => {
            const newClick = { id: Date.now(), x: e.clientX, y: e.clientY };
            setClicks((prev) => [...prev, newClick]);
            // Remove the click after animation duration (1s)
            setTimeout(() => {
                setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
            }, 1000);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);

        const animate = () => {
            const points = pointsRef.current;
            const mouse = mouseRef.current;
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY.current;

            // Shift existing points based on scroll delta to attach them to the page
            // This creates a trail even when scrolling without moving the mouse
            if (deltaY !== 0) {
                points.forEach(p => {
                    p.y -= deltaY;
                });
            }

            lastScrollY.current = currentScrollY;

            // Add new point at mouse position
            points.unshift({ ...mouse });

            // Limit trail length
            if (points.length > 20) {
                points.pop();
            }

            // Draw the path
            if (pathRef.current && points.length > 1) {
                pathRef.current.setAttribute("d", getPath(points));
            }

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden mix-blend-screen">
            {/* Trail SVG */}
            <svg className="w-full h-full absolute top-0 left-0">
                <defs>
                    <linearGradient id="trail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path
                    ref={pathRef}
                    fill="none"
                    stroke="url(#trail-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    opacity="0.8"
                />
            </svg>

            {/* Click Ripple Animations */}
            <AnimatePresence>
                {clicks.map((click) => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full border-2 border-[var(--accent)]"
                        style={{
                            left: click.x,
                            top: click.y,
                            width: "40px",
                            height: "40px",
                            marginLeft: "-20px", // Center the div
                            marginTop: "-20px",
                            boxShadow: "0 0 20px var(--accent)",
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

// Helper to create a smooth Bezier curve from points
function getPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";

    // Start at the first point (mouse position)
    let d = `M ${points[0].x} ${points[0].y}`;

    // Draw quadratic bezier curves through the points
    for (let i = 1; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        // Midpoint between p0 and p1 is the control point for the next curve
        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;

        d += ` Q ${p0.x} ${p0.y} ${midX} ${midY}`;
    }

    // Line to the last point
    d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;

    return d;
}
