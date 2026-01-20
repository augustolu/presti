"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    title?: string;
    subtitle?: string;
    delay?: number;
    fullWidth?: boolean;
}

export default function Section({ children, className, id, title, subtitle, delay = 0, fullWidth = false }: SectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={cn(
                "py-20 px-6 md:px-12",
                !fullWidth && "max-w-7xl mx-auto",
                className
            )}
        >
            {title && (
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-center">{title}</h2>
                    {subtitle && <p className="text-lg text-gray-400 text-center mt-2">{subtitle}</p>}
                </div>
            )}
            {children}
        </motion.section>
    );
}
