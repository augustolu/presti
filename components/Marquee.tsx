"use client";

import { motion } from "framer-motion";

const skills = [
    "Adobe Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "Final Cut Pro",
    "Cinema 4D",
    "Blender",
    "Audition",
    "Photoshop",
];

export default function Marquee() {
    return (
        <div id="skills" className="py-12 bg-white/5 border-y border-white/5 overflow-hidden relative">
            <div className="flex w-full">
                <motion.div
                    className="flex whitespace-nowrap gap-16 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
                        <div
                            key={index}
                            className="text-2xl md:text-4xl font-bold text-gray-500 hover:text-[var(--accent)] transition-colors cursor-default"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Gradients for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />
        </div>
    );
}
