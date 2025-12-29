"use client";

import { motion, useMotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import ThreeHero from "./ThreeHero";
import LiquidBackground from "./LiquidBackground";
import { ArrowDown } from "lucide-react";

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);

    // Mouse tracking for the 3D hero element
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    useEffect(() => {
        const sectionEl = containerRef.current;
        if (!sectionEl) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY, currentTarget } = e;
            if (!currentTarget) return;

            const {
                left,
                top,
                width,
                height,
            } = (currentTarget as HTMLElement).getBoundingClientRect();
            
            const x = (clientX - (left + width / 2)) / width;
            const y = (clientY - (top + height / 2)) / height;
            mouseX.set(x);
            mouseY.set(y);
        };

        sectionEl.addEventListener("mousemove", handleMouseMove);
        return () => {
            sectionEl.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <section 
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden"
        >
            <div className="absolute inset-0 w-full h-full z-0">
                <LiquidBackground />
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-7xl mx-auto px-6">
                
                <motion.h1 
                    className="text-6xl md:text-8xl font-bold leading-tight mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Tu contenido <br />
                    <span className="animated-rgb whitespace-nowrap">
                        Al siguiente nivel.
                    </span>
                </motion.h1>

                {/* 3D Hero */}
                <div className="relative w-full h-[80vh] md:h-[90vh] max-w-7xl my-4">
                    <ThreeHero mouseX={mouseX} mouseY={mouseY} />
                </div>

                <motion.p 
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Editor profesional especializado en edición de videos y motion graphics.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <a
                        href="#contact"
                        className="group mt-4 inline-flex relative px-8 py-4 bg-[var(--accent)] rounded-xl overflow-hidden items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,245,212,0.2)] hover:shadow-[0_0_30px_rgba(0,245,212,0.4)] transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        <span className="text-black font-bold text-lg tracking-wider">Mis Servicios</span>
                        <ArrowDown className="w-5 h-5 text-black group-hover:translate-y-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}