"use client";

import LiquidBackground from "@/components/LiquidBackground";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WarpTransition from "@/components/WarpTransition";
import { motion } from "framer-motion";

export default function VideoEditingPage() {
    const router = useRouter();
    const [isWarping, setIsWarping] = useState(false);

    const handleBack = () => {
        setIsWarping(true);
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">
            <LiquidBackground forceSlow startFast />

            <motion.div
                className="z-10 text-center p-8"
                animate={{ opacity: isWarping ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-6xl font-bold text-[var(--accent)] mb-8">Edición de Video</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                    aca vemos q choton ponemos
                </p>

                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all hover:scale-105 backdrop-blur-sm cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver al Inicio</span>
                </button>
            </motion.div>

            <WarpTransition
                isActive={isWarping}
                onComplete={() => router.push("/")}
            />
        </div>
    );
}
