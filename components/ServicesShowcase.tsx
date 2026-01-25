"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Film, X } from "lucide-react";

import VideoEditing from "./VideoEditing";
import MotionGraphics from "./MotionGraphics";
import Section from "./ui/Section";

type ServiceType = "video-editing" | "motion-graphics" | null;

interface ServiceData {
    id: "video-editing" | "motion-graphics";
    title: string;
    icon: React.ElementType;
    description: string;
    features: string[];
    videoSrc: string;
}

const services: ServiceData[] = [
    {
        id: "video-editing",
        title: "Edición de Video",
        icon: Film,
        description: "Transformamos metraje crudo en historias cautivadoras. No solo cortamos video; construimos narrativas que retienen a tu audiencia hasta el último segundo.",
        features: ["Narrativa visual impactante", "Ritmo y flow perfecto", "Retención de audiencia"],
        videoSrc: "/assets/demo-video-edit.mp4",
    },
    {
        id: "motion-graphics",
        title: "Motion Graphics",
        icon: Zap,
        description: "Damos vida a tus ideas más complejas. Animaciones fluidas que explican, venden y elevan la percepción de tu marca al siguiente nivel.",
        features: ["Explicación de ideas complejas", "Identidad de marca sólida", "Dinamismo visual"],
        videoSrc: "/assets/demo-motion.mp4",
    },
];

interface ServicesShowcaseProps {
    onTransition?: (isAccelerating: boolean) => void;
}

export default function ServicesShowcase({ onTransition }: ServicesShowcaseProps) {
    const [activeService, setActiveService] = useState<ServiceType>(null);
    const [hoveredService, setHoveredService] = useState<"video" | "motion" | null>(null);

    const handleServiceClick = (serviceId: "video-editing" | "motion-graphics") => {
        if (onTransition) onTransition(true);

        // Wait for acceleration effect before showing modal
        setTimeout(() => {
            setActiveService(serviceId);
        }, 800);
    };

    const closeModal = () => {
        if (onTransition) onTransition(false);
        setActiveService(null);
    };

    return (
        <>
            <Section fullWidth className="py-0 px-0 relative">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    {/* Global background used instead */}
                </div>

                <div className="w-full h-screen flex flex-col md:flex-row relative z-10">
                    <VideoEditing
                        hoveredService={hoveredService}
                        setHoveredService={setHoveredService}
                        onOpenModal={() => handleServiceClick("video-editing")}
                    />
                    <MotionGraphics
                        hoveredService={hoveredService}
                        setHoveredService={setHoveredService}
                        onOpenModal={() => handleServiceClick("motion-graphics")}
                    />
                </div>
            </Section>



            {/* Video Modal */}
            <AnimatePresence>
                {activeService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                            exit={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
                            className="relative w-full max-w-5xl h-[85vh] flex flex-col md:flex-row bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-violet-900/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Video Section (Left/Top) */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black relative flex items-center justify-center p-4 md:p-8">
                                {/* Glow behind video */}
                                <div className="absolute inset-0 bg-violet-900/20 blur-3xl" />

                                {/* Phone Frame / Video Container */}
                                <div className="relative z-10 aspect-[9/16] h-full max-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                                    <video
                                        src={services.find(s => s.id === activeService)?.videoSrc}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        controls={false}
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                                </div>
                            </div>

                            {/* Info Section (Right/Bottom) */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center bg-slate-900/50">
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold tracking-wider uppercase mb-4 border border-violet-500/20">
                                        Showcase
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                        {services.find(s => s.id === activeService)?.title}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed">
                                        {services.find(s => s.id === activeService)?.description}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-white font-semibold flex items-center">
                                        <Zap className="w-5 h-5 mr-2 text-violet-500" />
                                        Puntos Clave
                                    </h4>
                                    <ul className="space-y-4">
                                        {services.find(s => s.id === activeService)?.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-slate-300">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 mr-3 shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-auto pt-8">
                                    <button className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-900/30">
                                        Solicitar Presupuesto
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
