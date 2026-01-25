"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRect?: DOMRect | null;
}

export default function ContactForm({ isOpen, onClose, triggerRect }: ContactFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        setIsLoading(true);
        setStatus("idle");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            user_name: formData.get('user_name'),
            user_email: formData.get('user_email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to send message.');
            }

            setStatus("success");
            formRef.current.reset();
            setTimeout(() => {
                onClose();
                setStatus("idle");
            }, 3000);
        } catch (error: any) {
            console.error("API Error:", error);
            setStatus("error");
            setErrorMessage("Hubo un error al enviar el mensaje. Por favor intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate position
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    let initial = { opacity: 0, scale: 0.9, y: 20, x: 0 };
    let animateState = { opacity: 1, scale: 1, y: 0, x: 0 };
    let exit = { opacity: 0, scale: 0.9, y: 20, x: 0 };
    let style: React.CSSProperties = {};

    if (isOpen && triggerRect && isDesktop) {
        // Desktop positioning: To the right of the button
        const top = triggerRect.top + (triggerRect.height / 2) - 250; // Center vertically relative to button (approx height 500)
        // Actually let's just align top for now or center it better.
        // Let's try to center it vertically against the button center
        // Form height is dynamic, but let's assume it's around 500-600px.
        // Safer to just align it somewhat centrally but anchored to the right.

        style = {
            position: 'fixed',
            top: Math.max(20, Math.min(window.innerHeight - 600, triggerRect.top - 200)), // Clamp to screen
            left: triggerRect.right + 20,
            zIndex: 50,
            transformOrigin: "center left", // Expand from the side facing the button
        };

        // "Chiquito" start (scale 0.1), "Exponencial" feel (snappy spring)
        initial = { opacity: 0, scale: 0.1, x: -30, y: 0 };
        animateState = { opacity: 1, scale: 1, x: 0, y: 0 };
        exit = { opacity: 0, scale: 0.1, x: -30, y: 0 };
    }


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - lighter/transparent for glass feel */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal / Popover */}
                    <motion.div
                        initial={initial}
                        animate={animateState}
                        exit={exit}
                        transition={{ type: "spring", damping: 20, stiffness: 400, mass: 0.8 }}
                        style={isDesktop && triggerRect ? style : undefined}
                        className={`
                            fixed z-50 w-full max-w-md overflow-hidden
                            ${isDesktop && triggerRect ? '' : 'inset-0 m-auto h-fit p-4'} 
                        `}
                    >
                        <div className="relative bg-[#0a0510]/60 backdrop-blur-2xl border border-violet-500/20 rounded-2xl shadow-2xl shadow-violet-900/30 overflow-hidden">

                            {/* Breathing Background Glow */}
                            <motion.div
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px] pointer-events-none"
                            />
                            <motion.div
                                animate={{
                                    opacity: [0.2, 0.5, 0.2],
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1
                                }}
                                className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"
                            />

                            {/* Decorative Gradient Line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

                            {/* Header */}
                            <div className="relative flex items-center justify-between p-6 border-b border-white/5 z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Hablemos</h3>
                                    <p className="text-sm text-violet-200/70 mt-1">Cuéntame sobre tu proyecto</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-violet-300/70 hover:text-white group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="relative p-6 z-10">
                                {status === "success" ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 ring-1 ring-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-2">¡Mensaje enviado!</h4>
                                        <p className="text-gray-400">Gracias por contactarme. Te responderé pronto.</p>
                                    </motion.div>
                                ) : (
                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="user_name" className="text-sm font-medium text-violet-200/80 ml-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                name="user_name"
                                                id="user_name"
                                                required
                                                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all hover:bg-white/[0.07] backdrop-blur-sm"
                                                placeholder="¿Cómo te llamas?"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="user_email" className="text-sm font-medium text-violet-200/80 ml-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="user_email"
                                                id="user_email"
                                                required
                                                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all hover:bg-white/[0.07] backdrop-blur-sm"
                                                placeholder="tu@email.com"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="message" className="text-sm font-medium text-violet-200/80 ml-1">
                                                Mensaje
                                            </label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all resize-none hover:bg-white/[0.07] backdrop-blur-sm"
                                                placeholder="Cuéntame los detalles..."
                                            />
                                        </div>

                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                                            >
                                                <AlertCircle className="w-5 h-5 shrink-0" />
                                                <span>{errorMessage}</span>
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.7)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 group relative overflow-hidden border border-white/10"
                                        >
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    Enviar Mensaje
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
