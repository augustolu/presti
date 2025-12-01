"use client";

import { motion } from "framer-motion";
import { Instagram, Mail, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer id="contact" className="bg-black border-t border-white/10 py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold">¿Listo para crear algo increíble?</h2>
                        <p className="text-gray-400 text-lg">
                            Hablemos sobre tu próximo proyecto y cómo podemos llevarlo al siguiente nivel.
                        </p>
                        <a
                            href="mailto:contacto@ejemplo.com"
                            className="inline-block text-2xl font-medium text-[var(--accent)] hover:underline decoration-2 underline-offset-4"
                        >
                            contacto@ejemplo.com
                        </a>
                    </div>

                    <div className="flex flex-col md:items-end gap-6">
                        <div className="flex gap-6">
                            {[Instagram, Twitter, Linkedin, Mail].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ y: -5, color: "var(--accent)" }}
                                    className="text-gray-400 transition-colors"
                                >
                                    <Icon size={24} />
                                </motion.a>
                            ))}
                        </div>
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Editor Portfolio. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
