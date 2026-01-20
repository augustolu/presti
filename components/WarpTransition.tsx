"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WarpTransitionProps {
    isActive: boolean;
    onComplete: () => void;
}

const WarpTransition = ({ isActive, onComplete }: WarpTransitionProps) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isActive) {
            setShouldRender(true);
        }
    }, [isActive]);

    if (!shouldRender) {
        return null;
    }

    const variants = {
        hidden: {
            scale: 0,
            opacity: 0,
            borderRadius: '50%',
        },
        visible: {
            scale: 50,
            opacity: 1,
            borderRadius: '0%',
            transition: {
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
            },
        },
    };

    return (
        <motion.div
            className="fixed inset-0 bg-[var(--accent)] z-50 pointer-events-none"
            variants={variants}
            initial="hidden"
            animate={isActive ? 'visible' : 'hidden'}
            onAnimationComplete={() => {
                if (isActive) {
                    onComplete();
                } else {
                    setShouldRender(false);
                }
            }}
        />
    );
};

export default WarpTransition;