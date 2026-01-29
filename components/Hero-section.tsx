"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import ThreeHero from "./ThreeHero";

export default function HeroSection() {
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

    const xText = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
    const yText = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center bg-transparent overflow-hidden">
            <div className="absolute top-[15vh] h-[40vh] w-full z-10 flex items-center justify-center pointer-events-none">
                <ThreeHero mouseX={mouseX} mouseY={mouseY} />
            </div>
            <motion.div
                style={{ x: xText, y: yText }}
                className="relative z-20 flex flex-col items-center justify-center text-center p-0 mt-[40vh] md:mt-[50vh]"
            >
                <h1 className="text-2xl md:text-6xl lg:text-8xl font-bold flex flex-col items-center gap-2 md:gap-6 text-center px-2 max-w-full w-full">
                    <span className="break-words w-full">Tu contenido</span>
                    <span className="animated-rgb whitespace-normal md:whitespace-nowrap leading-tight pb-4 break-words w-full">
                        Al siguiente nivel.
                    </span>
                </h1>
                <p className="text-gray-300 text-sm md:text-xl max-w-2xl mt-4 px-4">
                    Editor profesional especializado en edición de videos y motion graphics.
                </p>
            </motion.div>
        </section>
    );
}
