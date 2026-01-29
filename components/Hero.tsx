"use client";

import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import ThreeHero from "./ThreeHero";
import LiquidBackground from "./LiquidBackground";
import { Video, MonitorPlay, ArrowRight } from "lucide-react";

interface LenisScrollEvent extends Event {
    detail: {
        scroll: number;
    };
}

export default function Hero() {
    const [hoveredService, setHoveredService] = useState<"video" | "motion" | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const scrollYProgress = useMotionValue(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = (e: LenisScrollEvent) => {
            const { scroll: y } = e.detail;

            const rect = el.getBoundingClientRect();
            const elTop = rect.top + y;
            const elHeight = rect.height;
            const viewportHeight = window.innerHeight;

            const progress = (y - elTop) / (elHeight - viewportHeight);
            scrollYProgress.set(Math.max(0, Math.min(1, progress)));
        };

        window.addEventListener("lenis-scroll", handleScroll as unknown as EventListener);

        return () => {
            window.removeEventListener("lenis-scroll", handleScroll as unknown as EventListener);
        };
    }, [scrollYProgress]);

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Mouse tracking for 3D hero
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX - innerWidth / 2) / innerWidth;
            const y = (clientY - innerHeight / 2) / innerHeight;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Animations based on scroll
    // Animations based on scroll
    const opacityHero = useTransform(smoothProgress, [0, 0.2], [1, 0]);
    const scaleHero = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);
    const opacityLogo = useTransform(smoothProgress, [0, 0.2], [1, 0]); // Logo fades out

    // Branching animations
    const opacityBranch = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
    const yBranch = useTransform(smoothProgress, [0.3, 0.5], [50, 0]);

    // Line drawing animations
    const lineLength = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);

    // Text follow cursor animation
    const xText = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
    const yText = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

    return (
        <section ref={containerRef} className="relative w-full h-auto bg-black">
            {/* Sticky Wrapper for Scrollytelling */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">

                {/* Backgrounds */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <LiquidBackground />
                </div>

                {/* 3D Hero - Anchor */}
                <motion.div
                    style={{ opacity: opacityLogo }}
                    className="absolute left-0 w-full top-[5vh] h-[50vh] z-10 flex items-center justify-center pointer-events-none"
                >
                    <ThreeHero mouseX={mouseX} mouseY={mouseY} />
                </motion.div>

                {/* Content Container */}
                <div className="relative z-20 min-h-screen flex flex-col items-center justify-center pb-32 pointer-events-none">

                    {/* Initial Hero Content */}
                    <motion.div
                        style={{ opacity: opacityHero, scale: scaleHero, x: xText, y: yText }}
                        className="text-center flex flex-col items-center gap-6 p-6"
                    >
                        <h1 className="text-4xl md:text-8xl font-bold flex flex-col items-center gap-6">
                            <span>Tu contenido</span>
                            <span className="animated-rgb whitespace-nowrap leading-tight pb-4">
                                Al siguiente nivel.
                            </span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                            Editor profesional especializado en edición de videos y motion graphics.
                        </p>
                    </motion.div>

                    {/* Branching Services Content */}
                    <motion.div
                        style={{ opacity: opacityBranch, y: yBranch }}
                        className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-auto"
                    >
                        <div className="w-full h-full flex flex-col md:flex-row">

                            {/* Left Section: Video Editing */}
                            <motion.div
                                onMouseEnter={() => setHoveredService("video")}
                                onMouseLeave={() => setHoveredService(null)}
                                animate={{ flex: hoveredService === "video" ? 2 : hoveredService === "motion" ? 1 : 1.5 }}
                                transition={{ duration: 0.2, ease: "circOut" }}
                                className="relative h-full flex flex-col items-center justify-center p-6 md:p-12 group overflow-hidden hover:bg-white/[.02] transition-all duration-200 cursor-pointer hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]"
                            >
                                {/* Background Icon Hook */}
                                <Video className="absolute -left-12 -bottom-12 w-96 h-96 text-white/[.03] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 group-hover:ring-[var(--accent)]/50">
                                        <Video className="w-10 h-10 text-[var(--accent)]" />
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Edición de Video</h3>
                                    <motion.p
                                        animate={{ opacity: hoveredService === "motion" ? 0.5 : 1 }}
                                        className="text-gray-400 max-w-md text-lg"
                                    >
                                        Narrativa visual impactante. Cortes dinámicos, color grading y storytelling que atrapa.
                                    </motion.p>
                                    <span className="text-[var(--accent)] font-medium group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                                        Ver Proyectos <ArrowRight className="w-5 h-5" />
                                    </span>
                                </div>
                            </motion.div>

                            {/* Right Section: Motion Graphics */}
                            <motion.div
                                onMouseEnter={() => setHoveredService("motion")}
                                onMouseLeave={() => setHoveredService(null)}
                                animate={{ flex: hoveredService === "motion" ? 2 : hoveredService === "video" ? 1 : 1.5 }}
                                transition={{ duration: 0.2, ease: "circOut" }}
                                className="relative h-full flex flex-col items-center justify-center p-6 md:p-12 group overflow-hidden hover:bg-white/[.02] transition-all duration-200 cursor-pointer hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]"
                            >
                                {/* Background Icon Hook */}
                                <MonitorPlay className="absolute -right-12 -top-12 w-96 h-96 text-white/[.03] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" />

                                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20 group-hover:ring-[var(--accent)]/50">
                                        <MonitorPlay className="w-10 h-10 text-[var(--accent)]" />
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Motion Graphics</h3>
                                    <motion.p
                                        animate={{ opacity: hoveredService === "video" ? 0.5 : 1 }}
                                        className="text-gray-400 max-w-md text-lg"
                                    >
                                        Animaciones que dan vida. Intros, logos y explicativos con acabados premium.
                                    </motion.p>
                                    <span className="text-[var(--accent)] font-medium group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                                        Ver Proyectos <ArrowRight className="w-5 h-5" />
                                    </span>
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}