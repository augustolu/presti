"use client";

import {
    motion,
    useScroll,
    useTransform,
    useAnimationFrame,
    useMotionValue,
    useSpring,
    useVelocity,
    wrap,
    AnimatePresence,
    useMotionValueEvent
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X, Volume2, VolumeX, Play } from "lucide-react";

const videoEditingVideos = [
    "/assets/demo-video-edit.mp4",
    "/assets/demo-video-edit.mp4",
    "/assets/demo-video-edit.mp4",
    "/assets/demo-video-edit.mp4",
];

const motionGraphicsVideos = [
    "/assets/demo-motion.mp4",
    "/assets/demo-motion.mp4",
    "/assets/demo-motion.mp4",
    "/assets/demo-motion.mp4",
];

// Improved Carousel Component handling true infinite loop with Framer Motion
function InfiniteCarousel({ videos, direction, speed, onVideoClick, isPaused }: { videos: string[], direction: 'left' | 'right', speed: number, onVideoClick: (src: string) => void, isPaused: boolean }) {
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            // Calculate width of one set of items
            // This is an approximation, ideally we measure the children
            // 400px item + 24px gap = 424px
            const itemWidth = 424;
            setContentWidth(videos.length * itemWidth);
        }
    }, [videos]);

    useAnimationFrame((t, delta) => {
        if (isPaused) return;

        const moveBy = (direction === 'left' ? -1 : 1) * speed * (delta / 16);
        let newX = x.get() + moveBy;

        // Wrap logic
        if (contentWidth > 0) {
            if (direction === 'left' && newX <= -contentWidth) {
                newX = 0;
            } else if (direction === 'right' && newX >= 0) {
                newX = -contentWidth;
            }
        }

        x.set(newX);
    });

    return (
        <div className="overflow-hidden py-20 px-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" ref={containerRef}>
            <motion.div
                className="flex gap-6"
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -contentWidth, right: 0 }} // Not truly infinite drag, but safe
                onDragEnd={() => {
                    // Optional: Resume or momentum
                }}
            >
                {/* Triple the items for smooth looping */}
                {[...videos, ...videos, ...videos].map((src, idx) => (
                    <motion.div
                        key={idx}
                        className="flex-shrink-0 w-[300px] md:w-[400px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 relative group cursor-pointer"
                        whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onVideoClick(src)}
                    >
                        <video
                            src={src}
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg shadow-black/20">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

function AnimatedTitle({ text }: { text: string }) {
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            scale: 1.5,
        },
    };

    return (
        <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-8 overflow-hidden flex justify-center gap-[1px]"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    className={letter === " " ? "w-3" : "inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"}
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.h2>
    );
}

export default function Portfolio() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const containerRef = useRef<HTMLElement>(null);

    // Refs for individual sections
    const videoSectionRef = useRef<HTMLDivElement>(null);
    const motionSectionRef = useRef<HTMLDivElement>(null);

    // Track visibility for auto-scroll
    const [videoInView, setVideoInView] = useState(false);
    const [motionInView, setMotionInView] = useState(false);

    // Scroll progress
    const { scrollYProgress: videoScrollProgress } = useScroll({
        target: videoSectionRef,
        offset: ["start end", "center center"]
    });

    const { scrollYProgress: motionScrollProgress } = useScroll({
        target: motionSectionRef,
        offset: ["start end", "center center"]
    });

    // Listen to scroll events to trigger auto-scroll only when fully visible
    useMotionValueEvent(videoScrollProgress, "change", (latest) => {
        if (latest >= 0.5 && !videoInView) {
            setVideoInView(true);
        } else if (latest < 0.1 && videoInView) {
            setVideoInView(false);
        }
    });

    useMotionValueEvent(motionScrollProgress, "change", (latest) => {
        if (latest >= 0.5 && !motionInView) {
            setMotionInView(true);
        } else if (latest < 0.1 && motionInView) {
            setMotionInView(false);
        }
    });

    // Transform scroll progress to x position and opacity
    // Increased range: -300 to 0
    const videoX = useTransform(videoScrollProgress, [0, 1], [-300, 0]);
    const videoOpacity = useTransform(videoScrollProgress, [0, 0.6], [0, 1]); // Fade in faster

    const motionX = useTransform(motionScrollProgress, [0, 1], [300, 0]); // From right
    const motionOpacity = useTransform(motionScrollProgress, [0, 0.6], [0, 1]);

    return (
        <section id="portfolio" ref={containerRef} className="py-10 relative overflow-hidden">

            <div className="container mx-auto px-4 mb-4">
                <AnimatedTitle text="Nuestro Trabajo" />
            </div>

            {/* Video Editing Section - Slide Left to Right */}
            <div ref={videoSectionRef} className="mb-4">
                <div className="container mx-auto px-4 mb-0">
                    <div className="inline-block">
                        <span className="block text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1 opacity-80">
                            Showcase
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50 mb-1 tracking-tight">
                            Edición de Video
                        </h3>
                        <p className="text-gray-400 font-medium text-sm md:text-base">Narrativa visual que impacta.</p>
                    </div>
                </div>

                <motion.div
                    style={{ x: videoX, opacity: videoOpacity }}
                    className="w-full -mt-4"
                >
                    <InfiniteCarousel
                        videos={videoEditingVideos}
                        direction="right" // Moves Left to Right
                        speed={1}
                        onVideoClick={setSelectedVideo}
                        isPaused={!!selectedVideo || !videoInView}
                    />
                </motion.div>
            </div>

            {/* Motion Graphics Section - Slide Right to Left */}
            <div ref={motionSectionRef} className="-mt-8">
                <div className="container mx-auto px-4 mb-0 text-right">
                    <div className="inline-block text-right">
                        <span className="block text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1 opacity-80">
                            Showcase
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-bl from-white via-white/90 to-white/50 mb-1 tracking-tight">
                            Motion Graphics
                        </h3>
                        <p className="text-gray-300 font-medium text-sm md:text-base">Animación que da vida a tus ideas.</p>
                    </div>
                </div>

                <motion.div
                    style={{ x: motionX, opacity: motionOpacity }}
                    className="w-full -mt-4"
                >
                    <InfiniteCarousel
                        videos={motionGraphicsVideos}
                        direction="left" // Moves Right to Left
                        speed={1}
                        onVideoClick={setSelectedVideo}
                        isPaused={!!selectedVideo || !motionInView}
                    />
                </motion.div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-auto h-auto max-w-[90vw] max-h-[85vh] bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-[var(--accent)]/30"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-[var(--accent)] hover:text-white transition-colors backdrop-blur-md border border-white/10"
                            >
                                <X size={24} />
                            </button>

                            <video
                                src={selectedVideo}
                                className="w-auto h-auto max-w-full max-h-[85vh] object-contain mx-auto"
                                autoPlay
                                controls
                                playsInline
                            />

                            {/* Decorative Glow */}
                            <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-[var(--accent)]/20" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
