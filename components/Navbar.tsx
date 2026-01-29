"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    { name: "Inicio", href: "#" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contacto", href: "#contact" },
];

export default function Navbar({ onNavigating }: { onNavigating?: (state: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);

        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const targetId = href.replace("#", "");
        const elem = document.getElementById(targetId);

        if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="relative w-32 h-10" onClick={(e) => handleScroll(e, "#")}>
                    <Image
                        src="/assets/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScroll(e, link.href)}
                            className="text-sm font-medium text-gray-300 hover:text-[var(--accent)] transition-colors cursor-pointer"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black border-b border-white/10"
                >
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScroll(e, link.href)}
                                className="text-lg font-medium text-gray-300 hover:text-[var(--accent)] cursor-pointer"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
