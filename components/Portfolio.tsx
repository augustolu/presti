"use client";

import { motion } from "framer-motion";
import Section from "./ui/Section";
import Image from "next/image";

const projects = [
    {
        id: 1,
        title: "Documental Urbano",
        category: "Edición / Color",
        image: "https://via.placeholder.com/800x600/1a1a1a/00F5D4?text=Project+1",
        size: "col-span-1 md:col-span-2 row-span-2",
    },
    {
        id: 2,
        title: "Fashion Film",
        category: "Edición Rítmica",
        image: "https://via.placeholder.com/600x800/1a1a1a/00F5D4?text=Project+2",
        size: "col-span-1 row-span-2",
    },
    {
        id: 3,
        title: "Music Video",
        category: "VFX / Motion",
        image: "https://via.placeholder.com/600x400/1a1a1a/00F5D4?text=Project+3",
        size: "col-span-1",
    },
    {
        id: 4,
        title: "Commercial",
        category: "Sound Design",
        image: "https://via.placeholder.com/600x400/1a1a1a/00F5D4?text=Project+4",
        size: "col-span-1",
    },
];

export default function Portfolio() {
    return (
        <Section id="portfolio" className="space-y-12">
            <div className="space-y-4 mb-12">
                <h2 className="text-4xl md:text-5xl font-bold">Trabajos Seleccionados</h2>
                <div className="h-1 w-20 bg-[var(--accent)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative overflow-hidden rounded-xl bg-gray-900 border border-white/5 ${project.size}`}
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="text-[var(--accent)] text-sm font-medium mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {project.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                {project.title}
                            </h3>
                        </div>

                        <div className="absolute inset-0 border-2 border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
