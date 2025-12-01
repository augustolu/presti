"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Section from "./ui/Section";
import { ArrowRight } from "lucide-react";
import ThreeHero from "./ThreeHero";
import Image from "next/image";
import LiquidBackground from "./LiquidBackground";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Animation Timeline:
    // 0.0 -> 0.2: Transition Phase (Hero Right -> Left, Text Left -> Out, New Text In)
    // 0.2 -> 0.6: Pinned Phase (Hero Left, New Text Right - Stays visible)
    // 0.6 -> 0.8: Exit Phase (Hero Left -> Out, New Text Right -> Out)

    // Hero Position (X)
    // Starts at 25% (Right), moves to -25% (Left) by 0.2, stays there until 0.6, then moves further left to -50%
    const heroX = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.8], ["25%", "-25%", "-25%", "-50%"]);

    // Hero Scale
    const heroScale = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.8], [1, 0.9, 0.9, 0.8]);

    // Crossfade: 3D Hero fades out, Hero 2 fades in
    const threeHeroOpacity = useTransform(scrollYProgress, [0.1, 0.2], [1, 0]);
    const hero2Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.6, 0.8], [0, 1, 1, 0]); // Fades out at end

    // Initial Text (Left)
    const initialTextOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const initialTextX = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

    // New Text (Right)
    // Enters by 0.2, stays until 0.6, leaves by 0.8
    const newTextOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.6, 0.8], [0, 1, 1, 0]);
    const newTextX = useTransform(scrollYProgress, [0.15, 0.25, 0.6, 0.8], [100, 0, 0, 100]);

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">

                {/* Background Elements */}
                <div className="absolute inset-0 bg-[var(--background)] -z-20" />
                <LiquidBackground />

                {/* Hero Container - Animates Position */}
                <motion.div
                    style={{ x: heroX, scale: heroScale }}
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                >
                    {/* Allow pointer events only on the canvas for interaction */}
                    <div className="relative w-full h-full pointer-events-auto">
                        {/* 3D Hero (Initial) */}
                        <motion.div style={{ opacity: threeHeroOpacity }} className="absolute inset-0">
                            <ThreeHero className="w-full h-full" />
                        </motion.div>

                        {/* Hero 2 (Scrolled) - Static Image */}
                        <motion.div style={{ opacity: hero2Opacity }} className="absolute inset-0 flex items-center justify-center">
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
                    </div>
                </motion.div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12">

                    {/* Initial State: Text Left */}
                    <motion.div
                        style={{ opacity: initialTextOpacity, x: initialTextX }}
                        className="absolute inset-0 flex items-center justify-start pointer-events-none"
                    >
                        <div className="w-full md:w-3/4 pr-8 text-left">
                            <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-6 mix-blend-difference">
                                Tu contenido <br />
                                <span className="animated-rgb">
                                    Al siguiente nivel.
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xl max-w-xl mix-blend-difference">
                                Editor profesional especializado en edición de videos y motion graphics.
                            </p>
                        </div>
                    </motion.div>

                    {/* Scrolled State: Right Side Content */}
                    <motion.div
                        style={{ opacity: newTextOpacity, x: newTextX }}
                        className="absolute inset-0 flex items-center justify-end pointer-events-none"
                    >
                        <div className="w-full md:w-3/4 pl-8 pointer-events-auto">
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                Convierte espectadores casuales en <span className="text-[var(--accent)]">seguidores fieles.</span>
                            </h2>
                            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                                Edición dinámica diseñada para retener la audiencia y potenciar tu marca personal.
                                Deja de perder visitas por una edición aburrida.
                            </p>

                            <a
                                href="#contact"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                            >
                                Quiero viralizar mi contenido
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
