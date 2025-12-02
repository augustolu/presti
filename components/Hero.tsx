"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Section from "./ui/Section";
import { ArrowRight } from "lucide-react";
import ThreeHero from "./ThreeHero";
import Image from "next/image";
import LiquidBackground from "./LiquidBackground";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollYProgress = useMotionValue(0);

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
    // 0.0 -> 0.2: Transition Phase (Hero Right -> Left, Text Left -> Out, New Text In)
    // 0.2 -> 0.6: Pinned Phase (Hero Left, New Text Right - Stays visible)
    // 0.6 -> 0.8: Exit Phase (Hero Left -> Out, New Text Right -> Out)

    // Hero Position (X)
    // Fast snap to position at 0.15, stays there briefly, then exits
    const heroX = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.35, 0.5], ["120%", "100%", "50%", "-50%", "-10%"]);

    // Hero Scale
    const heroScale = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.35], [1, 0.92, 0.85, 0.85]);

    // Crossfade: 3D Hero fades out, Hero 2 fades in
    const threeHeroOpacity = useTransform(scrollYProgress, [0.05, 0.12], [1, 0]);
    const hero2Opacity = useTransform(scrollYProgress, [0.08, 0.15, 0.5], [0, 1, 1]); // Stays visible longer

    // Initial Text (Left)
    const initialTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
    const initialTextX = useTransform(scrollYProgress, [0, 0.1], [0, -100]);

    // New Text (Right)
    // Enters quickly, stays longer, leaves smoothly
    const newTextOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.35, 0.5], [0, 1, 1, 1]);
    const newTextX = useTransform(scrollYProgress, [0.1, 0.18, 0.35, 0.5], [100, 0, 0, 0]);

    // Name opacity - visible at start, fades out immediately as you scroll
    const nameOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Background Elements */}
                <div className="absolute inset-0 bg-[var(--background)] -z-20" />
                <LiquidBackground />

                {/* Main Content Container */}
                <div className="relative max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center">

                    {/* Initial State: Text Left */}
                    <motion.div
                        style={{ opacity: initialTextOpacity, x: initialTextX }}
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
                            <motion.div style={{ opacity: useTransform(scrollYProgress, [0.08, 0.15, 0.5], [0, 1, 1]) }} className="absolute inset-0 flex items-center justify-start pl-12">
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
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                                    Convierte espectadores casuales en <span className="text-[var(--accent)]">seguidores fieles.</span>
                                </h2>
                                <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">
                                    Edición dinámica diseñada para retener la audiencia y potenciar tu marca personal. Deja de perder visitas por una edición aburrida.
                                </p>
                                <a
                                    href="#contact"
                                    className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--accent)] text-black font-bold text-sm md:text-base rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                                >
                                    Quiero viralizar mi contenido
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
