"use client";

import { motion } from "framer-motion";

export default function Marquee() {
    const text = "Adobe Premiere Pro • After Effects • Motion Graphics • Edición de Video • Diseño Visual • ";
    // Duplicate the text enough times to ensure it covers the screen and allows for smooth looping
    const content = Array(4).fill(text).join("");

    return (
        <div
            className="relative w-full h-24 flex items-center overflow-hidden backdrop-blur-sm"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))' }}
        >
            {/* Gradient Masks for professional fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: ["0%", "-20%"], // Move exactly half the width (since we double the content below)
                }}
                transition={{
                    ease: "linear",
                    duration: 20,
                    repeat: Infinity,
                }}
            >
                {/* Render content twice to create seamless loop */}
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold text-white/10 uppercase px-4">{content}</h1>
                </div>
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold text-white/10 uppercase px-4">{content}</h1>
                </div>
            </motion.div>
        </div>
    );
}