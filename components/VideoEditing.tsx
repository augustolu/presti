"use client";

import { motion } from "framer-motion";
import { Video, ArrowRight } from "lucide-react";
import Link from 'next/link';

interface VideoEditingProps {
    hoveredService: "video" | "motion" | null;
    setHoveredService: (service: "video" | "motion" | null) => void;
}

export default function VideoEditing({ hoveredService, setHoveredService }: VideoEditingProps) {
    return (
        <motion.div
            onMouseEnter={() => setHoveredService("video")}
            onMouseLeave={() => setHoveredService(null)}
            animate={{ 
                flex: hoveredService === "video" ? 2 : hoveredService === "motion" ? 1 : 1.5,
                boxShadow: hoveredService === "video" ? '0 0 80px rgba(255,255,255,0.05)' : 'none'
            }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative h-full flex flex-col items-center justify-center p-12 group overflow-hidden hover:bg-white/[.02] transition-colors duration-300 cursor-pointer"
        >
            <Video className="absolute -left-4 -bottom-4 w-80 h-80 text-white/[.01] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" />
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
                <Link href="/video-editing" className="mt-4">
                    <span className="text-[var(--accent)] font-medium group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                        Ver Proyectos <ArrowRight className="w-5 h-5" />
                    </span>
                </Link>
            </div>
        </motion.div>
    );
}
