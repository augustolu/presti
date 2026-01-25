"use client";

import { useEffect, useRef, useState } from 'react';

interface WarpTransitionProps {
    isActive: boolean;
    onComplete: () => void;
}

interface Star {
    x: number;
    y: number;
    z: number;
    pz: number; // Previous z for trails
}

const WarpTransition = ({ isActive, onComplete }: WarpTransitionProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const requestRef = useRef<number>();
    const stateRef = useRef<'idle' | 'accelerating' | 'warping' | 'fading'>('idle');
    const speedRef = useRef(0);
    const opacityRef = useRef(0);
    const starsRef = useRef<Star[]>([]);

    // Config from LiquidBackground for consistency
    const starColor = "#E0FFFF";
    const depth = 1000;

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
            stateRef.current = 'accelerating';
            speedRef.current = 2; // Initial speed
            opacityRef.current = 0;

            // Initialize stars
            const stars: Star[] = [];
            for (let i = 0; i < 800; i++) { // Slightly more stars for warp effect
                stars.push({
                    x: (Math.random() - 0.5) * window.innerWidth * 2,
                    y: (Math.random() - 0.5) * window.innerHeight * 2,
                    z: Math.random() * depth,
                    pz: Math.random() * depth
                });
            }
            starsRef.current = stars;
        }
    }, [isActive]);

    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const cx = width / 2;
        const cy = height / 2;

        const animate = () => {
            // Clear
            ctx.fillStyle = '#000000';
            // If fading out (showing modal), we want transparent background so modal shows through
            if (stateRef.current === 'fading') {
                ctx.clearRect(0, 0, width, height);
            } else {
                ctx.fillRect(0, 0, width, height);
            }

            // Update State
            if (stateRef.current === 'accelerating') {
                speedRef.current += (100 - speedRef.current) * 0.02; // Smoother ease-in
                if (speedRef.current > 80) {
                    stateRef.current = 'warping';
                }
            } else if (stateRef.current === 'warping') {
                speedRef.current += (200 - speedRef.current) * 0.05; // Accelerate to max

                // Fade in overlay (darkness/fade to black instead of white flash)
                // Actually, to transition to modal, we might want to just fade out the stars
                // or fade to the modal background color.
                // Let's fade to black (opacity goes up), then switch to modal.
                opacityRef.current += 0.02;

                if (opacityRef.current >= 1) {
                    onComplete();
                    stateRef.current = 'fading';
                    opacityRef.current = 1;
                }
            } else if (stateRef.current === 'fading') {
                // Fade out the black overlay to reveal modal
                opacityRef.current -= 0.04;
                if (opacityRef.current <= 0) {
                    setIsVisible(false);
                    stateRef.current = 'idle';
                    return; // Stop animation
                }
            }

            // Draw Stars (only if not full opacity overlay)
            if (opacityRef.current < 1) {
                ctx.lineWidth = Math.max(1, speedRef.current / 40);
                ctx.lineCap = 'round';
                ctx.strokeStyle = starColor;

                starsRef.current.forEach(star => {
                    star.pz = star.z;
                    star.z -= speedRef.current;

                    if (star.z <= 0) {
                        star.z = depth;
                        star.pz = depth;
                        star.x = (Math.random() - 0.5) * width * 2;
                        star.y = (Math.random() - 0.5) * height * 2;
                    }

                    const x = cx + (star.x / star.z) * 100;
                    const y = cy + (star.y / star.z) * 100;

                    // Trail logic
                    const trailZ = star.z + speedRef.current * 2; // Longer trails
                    const px = cx + (star.x / trailZ) * 100;
                    const py = cy + (star.y / trailZ) * 100;

                    // Alpha based on depth and speed
                    const alpha = Math.min(1, (depth - star.z) / 500) * (1 - opacityRef.current);

                    if (x > -100 && x < width + 100 && y > -100 && y < height + 100) {
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                    }
                });
                ctx.globalAlpha = 1;
            }

            // Draw Overlay (Fade to black)
            if (stateRef.current === 'warping' || stateRef.current === 'fading') {
                // We fade to black to hide the transition to the modal
                // The modal has a black/dark background, so this is seamless.
                ctx.fillStyle = `rgba(0, 0, 0, ${opacityRef.current})`;
                ctx.fillRect(0, 0, width, height);
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[60] pointer-events-none"
            style={{ mixBlendMode: 'normal' }}
        />
    );
};

export default WarpTransition;