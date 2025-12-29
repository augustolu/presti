"use client";

import Section from "./ui/Section";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

export default function Contact() {
    return (
        <Section id="contact" className="py-32 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                        ¿Listo para <br />
                        <span className="text-[var(--accent)]">empezar?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Llevemos tu contenido al siguiente nivel. <br />
                        Hablemos sobre tu próximo proyecto.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="mailto:contacto@valentinopresti.com"
                            className="group relative px-8 py-4 bg-[var(--accent)] text-black rounded-full font-bold text-lg flex items-center gap-3 overflow-hidden transition-transform hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <Mail className="w-5 h-5" />
                            <span>Enviar Email</span>
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-8 py-4 bg-white/5 border border-white/10 rounded-full font-medium text-lg text-white flex items-center gap-3 hover:bg-white/10 transition-colors"
                        >
                            <span>Instagram</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
