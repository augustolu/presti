"use client";

import { motion } from "framer-motion";

export default function Marquee() {
    const text = "Adobe Premiere Pro - After Effects - ";
    return (
        <div 
            className="relative w-full h-24 flex items-center overflow-x-hidden backdrop-blur-sm"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))' }}
        >
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: ['0%', '-100%'],
                }}
                transition={{
                    ease: 'linear',
                    duration: 30,
                    repeat: Infinity,
                }}
            >
                <h1 className="text-4xl font-bold text-white/10 uppercase">{text}</h1>
                <h1 className="text-4xl font-bold text-white/10 uppercase">{text}</h1>
                <h1 className="text-4xl font-bold text-white/10 uppercase">{text}</h1>
                <h1 className="text-4xl font-bold text-white/10 uppercase">{text}</h1>
            </motion.div>
        </div>
    );
}