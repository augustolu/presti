"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { Instagram, Phone, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);

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
        <footer id="contact" className="min-h-screen flex flex-col justify-center items-center bg-black relative overflow-hidden py-20">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.03),transparent_70%)] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                <h2
                    ref={titleRef}
                    className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter opacity-0"
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

                <div ref={linksRef} className="grid md:grid-cols-1 gap-8 w-full max-w-3xl mx-auto">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/notpresti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 hover:border-[var(--accent)]/50 opacity-0"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-shadow">
                            <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold mb-1">Instagram</span>
                        <span className="text-sm text-gray-400 group-hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                            @notpresti <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 text-center w-full text-gray-600 text-sm">
                © {new Date().getFullYear()} Valentino Presti. Todos los derechos reservados.
            </div>
        </footer>
    );
}
