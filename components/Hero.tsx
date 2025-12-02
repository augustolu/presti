"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Section from "./ui/Section";
import { ArrowRight } from "lucide-react";
import ThreeHero from "./ThreeHero";
import Image from "next/image";
import LiquidBackground from "./LiquidBackground";
import WarpTransition from "./WarpTransition";
import { useRouter } from "next/navigation";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYProgress = useMotionValue(0);
    const router = useRouter();
    const [isWarping, setIsWarping] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [destination, setDestination] = useState("");

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleWarp = (path: string) => {
        setDestination(path);
        setIsWarping(true);
    };

    // Mouse tracking for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let rafId: number;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            // Normalize position to [-0.5, 0.5] range
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };

        const tick = () => {
            const rect = el.getBoundingClientRect();
            const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
            scrollYProgress.set(progress);
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        el.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(rafId);
            el.removeEventListener("mousemove", handleMouseMove);
        };
    }, [scrollYProgress, mouseX, mouseY]);

    // Parallax transformations for text elements
    const parallaxTextX = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
    const parallaxTextY = useTransform(mouseY, [-0.5, 0.5], [-25, 25]);

    // Animation Timeline:
    // 0.0 -> 0.15: Intro Phase (Hero Centered)
    // 0.15 -> 0.35: Transition Phase (Hero Moves Left, Text Swaps)
    // 0.35 -> 0.8: Content Phase (Hero Left, New Text Right)

    // Hero Position (X)
    const heroX = useTransform(scrollYProgress, [0, 0.1, 0.4], ["120%", "50%", "0%"]);

    // Hero Scale
    const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

    // Crossfade: 3D Hero fades out, Hero 2 fades in
    const threeHeroOpacity = useTransform(scrollYProgress, [0.15, 0.3], [1, 0]);
    const hero2Opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);

    // Initial Text (Left)
    const initialTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const initialTextY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

    // New Text (Right)
    const newTextOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
    const newTextX = useTransform(scrollYProgress, [0.3, 0.45], [50, 0]);

    // Name opacity
    const nameOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Background Elements */}
                <div className="absolute inset-0 bg-[var(--background)] -z-20" />
                <LiquidBackground startFast />

                {/* Main Content Container */}
                <motion.div
                    className="relative max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center"
                    animate={{ opacity: (isWarping || isLoading) ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                >

                    {/* Initial State: Text Left */}
                    <motion.div
                        style={{ opacity: initialTextOpacity, y: initialTextY }}
                        className="absolute left-0 top-0 w-1/2 h-full flex items-center pointer-events-none z-10"
                    >
                        <motion.div style={{ x: parallaxTextX, y: parallaxTextY }}>
                            <div className="w-full md:w-5/6 pr-8 text-left">
                                <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6 mix-blend-difference">
                                    Tu contenido <br />
                                    <span className="animated-rgb whitespace-nowrap">
                                        Al siguiente nivel.
                                    </span>
                                </h1>
                                <p className="text-gray-400 text-xl mix-blend-difference">
                                    Editor profesional especializado en edición de videos y motion graphics.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Hero Container (Image) - Left Side */}
                    <motion.div
                        style={{ x: heroX, scale: heroScale }}
                        className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-start pointer-events-none z-0 pl-20"
                    >
                        <div className="relative w-full h-full pointer-events-auto flex flex-col items-start justify-center">
                            <motion.div style={{ opacity: threeHeroOpacity }} className="absolute inset-0">
                                <ThreeHero className="w-full h-full" mouseX={mouseX} mouseY={mouseY} />
                            </motion.div>
                            <motion.div style={{ opacity: hero2Opacity }} className="absolute inset-0 flex items-center justify-start pl-12">
                                <div className="relative aspect-[4/5] w-full max-w-md">
                                    <Image
                                        src="/assets/hero2.png"
                                        alt="Hero 2"
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            </motion.div>

                            {/* Name Below Image */}
                            <motion.div
                                style={{ opacity: nameOpacity }}
                                className="absolute bottom-8 left-28 text-center pointer-events-auto cursor-default"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    scale: 1.08,
                                    y: -5,
                                    transition: { type: "spring", stiffness: 300, damping: 15 }
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <motion.div
                                    whileHover={{ rotateZ: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.h3
                                        className="text-2xl md:text-3xl font-bold tracking-wider text-white relative"
                                        style={{ letterSpacing: "0.15em" }}
                                        whileHover={{
                                            textShadow: "0 0 8px rgba(0, 245, 212, 0.4), 0 0 16px rgba(0, 245, 212, 0.3), 0 0 32px rgba(0, 245, 212, 0.2)"
                                        }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        VALENTINO PRESTI
                                    </motion.h3>
                                </motion.div>

                                {/* Animated underline */}
                                <motion.div
                                    className="h-0.5 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mt-3"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    whileHover={{
                                        scaleX: 1.2,
                                        boxShadow: "0 0 20px rgba(0, 245, 212, 0.6)"
                                    }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    style={{ originX: 0.5 }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Scrolled State: Text Right */}
                    <motion.div
                        style={{ opacity: newTextOpacity, x: newTextX }}
                        className="absolute right-0 top-0 w-1/2 h-full flex items-center pointer-events-none z-10 pr-12"
                    >
                        <motion.div style={{ x: parallaxTextX, y: parallaxTextY }} className="w-full">
                            <div className="w-full pointer-events-auto">
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                    Impacto Visual <br />
                                    <span className="text-[var(--accent)]">que Convierte.</span>
                                </h2>
                                <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-lg">
                                    No busques solo un editor. Busca un partner creativo. <br />
                                    Desde narrativas dinámicas hasta Motion Graphics de alto nivel.
                                </p>

                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Button 1: Video Editing */}
                                    <button
                                        onClick={() => handleWarp("/video-editing")}
                                        className="group relative px-6 py-4 bg-transparent border border-[var(--accent)] rounded-xl overflow-hidden flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-[var(--accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-[var(--accent)] font-bold text-lg">Edición de Video</span>
                                            <span className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">Retención & Viralidad</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    {/* Button 2: Motion Graphics */}
                                    <button
                                        onClick={() => handleWarp("/motion-graphics")}
                                        className="group relative px-6 py-4 bg-[var(--accent)] rounded-xl overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,245,212,0.2)] hover:shadow-[0_0_30px_rgba(0,245,212,0.4)] transition-shadow cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                        <div className="flex flex-col items-start">
                                            <span className="text-black font-bold text-lg">Motion Graphics</span>
                                            <span className="text-black/70 text-xs font-medium">Calidad & Branding</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </div>

            <WarpTransition
                isActive={isWarping}
                onComplete={() => {
                    router.push(destination);
                }}
            />
        </div>
    );
}
