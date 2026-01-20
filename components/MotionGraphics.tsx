"use client";

import { motion } from "framer-motion";
import { MonitorPlay, ArrowRight } from "lucide-react";
import Link from 'next/link';

interface MotionGraphicsProps {
    hoveredService: "video" | "motion" | null;
    setHoveredService: (service: "video" | "motion" | null) => void;
}

export default function MotionGraphics({ hoveredService, setHoveredService }: MotionGraphicsProps) {
    return (
        <motion.div
            onMouseEnter={() => setHoveredService("motion")}
            onMouseLeave={() => setHoveredService(null)}
            animate={{
                flex: hoveredService === "motion" ? 2 : hoveredService === "video" ? 1 : 1.5,
                boxShadow: hoveredService === "motion" ? '0 0 80px rgba(255,255,255,0.05)' : 'none'
            }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative h-full flex flex-col items-center justify-center p-12 group overflow-hidden hover:bg-white/[.02] transition-colors duration-300 cursor-pointer"
        >
            <MonitorPlay className="absolute -right-4 -top-4 w-80 h-80 text-white/[.01] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" />
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
                <Link href="/motion-graphics" className="mt-4">
                    <span className="text-[var(--accent)] font-medium group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                        Ver Proyectos <ArrowRight className="w-5 h-5" />
                    </span>
                </Link>
            </div>
        </motion.div>
    );
}
