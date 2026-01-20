"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Instagram, Phone, Mail, ArrowUpRight } from "lucide-react";
import CursorTrail from "./CursorTrail";
import ContactForm from "./ContactForm";

export default function Contact() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [stars, setStars] = useState<any[]>([]);

    useEffect(() => {
        const generatedStars = [...Array(30)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
        }));
        setStars(generatedStars);
    }, []);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Title Animation
                        animate(titleRef.current, {
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 1000,
                            ease: "outExpo",
                            delay: 200,
                        });

                        // Text Animation
                        animate(textRef.current, {
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 1000,
                            ease: "outExpo",
                            delay: 400,
                        });

                        // Links Animation (Staggered)
                        animate(linksRef.current?.children, {
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 800,
                            ease: "outExpo",
                            delay: stagger(100, { start: 600 }),
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (titleRef.current) observer.observe(titleRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <footer
            id="contact"
            ref={containerRef}
            className="min-h-screen flex flex-col justify-center items-center bg-[#05000a] relative overflow-hidden py-20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {isHovering && <CursorTrail />}
            {/* Background Elements - Galactic Atmosphere */}
            <motion.div style={{ opacity }} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">

                {/* Starfield - Boosted Visibility */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.width,
                            height: star.height,
                        }}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: parseFloat(star.animationDuration),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: parseFloat(star.animationDelay),
                        }}
                    />
                ))}

                {/* Side Energy Fields (The Force) - Intensified */}
                <motion.div
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scaleX: [1, 1.5, 1],
                        filter: ["blur(40px)", "blur(20px)", "blur(40px)"]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute left-0 top-0 w-[20%] h-full bg-gradient-to-r from-violet-700/60 via-violet-500/20 to-transparent"
                />
                <motion.div
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scaleX: [1, 1.5, 1],
                        filter: ["blur(40px)", "blur(20px)", "blur(40px)"]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute right-0 top-0 w-[20%] h-full bg-gradient-to-l from-violet-700/60 via-violet-500/20 to-transparent"
                />

                {/* Center Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_50%)]" />
            </motion.div>

            <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                <h2
                    ref={titleRef}
                    className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter opacity-0"
                    style={{
                        textShadow: "0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(139,92,246,0.5), 0 0 1px rgba(255,255,255,0.5)"
                    }}
                >
                    Hablemos.
                </h2>

                <p
                    ref={textRef}
                    className="text-xl md:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed opacity-0"
                >
                    ¿Listo para llevar tu contenido al siguiente nivel? <br />
                    Estoy disponible para nuevos proyectos.
                </p>

                <div ref={linksRef} className="grid md:grid-cols-3 gap-8 w-full max-w-3xl mx-auto">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/notpresti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:border-[var(--accent)]/50 opacity-0 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-shadow relative z-10">
                            <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold mb-1 relative z-10">Instagram</span>
                        <span className="text-sm text-gray-400 group-hover:text-[var(--accent)] transition-colors flex items-center gap-1 relative z-10">
                            @notpresti <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </a>

                    {/* Phone */}
                    <a
                        href="https://wa.me/5492664884211"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:border-[var(--accent)]/50 opacity-0 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-shadow relative z-10">
                            <Phone className="w-6 h-6 text-green-500" />
                        </div>
                        <span className="text-lg font-bold mb-1 relative z-10">Whatsapp</span>
                        <span className="text-sm text-gray-400 group-hover:text-[var(--accent)] transition-colors relative z-10">
                            +54 9 266 488-4211
                        </span>
                    </a>

                    {/* Email */}
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:border-[var(--accent)]/50 opacity-0 relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow relative z-10">
                            <Mail className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-lg font-bold mb-1 relative z-10">Email</span>
                        <span className="text-sm text-gray-400 group-hover:text-[var(--accent)] transition-colors relative z-10">
                            Envíame un mensaje
                        </span>
                    </button>
                </div>
            </div>

            <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

            <div className="absolute bottom-8 text-center w-full text-gray-600 text-sm">
                © {new Date().getFullYear()} Valentino Presti. Todos los derechos reservados.
            </div>
        </footer>
    );
}