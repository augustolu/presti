"use client";
import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/lib/LenisContext";

interface LenisScrollEvent extends Event {
  detail: {
    scroll: number;
  };
}

const ScrollDownArrow = () => {
  const [showArrow, setShowArrow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = (e: LenisScrollEvent) => {
      const { scroll: y } = e.detail;
      const currentScrollY = y;
      // Show arrow if scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
      setLastScrollY(currentScrollY);

      // Check if user is in the contact section
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const contactSectionTop = contactSection.offsetTop;
        const contactSectionHeight = contactSection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollBottom = currentScrollY + windowHeight;

        if (scrollBottom >= contactSectionTop + contactSectionHeight / 2) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    };

    window.addEventListener(
      "lenis-scroll",
      handleScroll as unknown as EventListener
    );

    return () => {
      window.removeEventListener(
        "lenis-scroll",
        handleScroll as unknown as EventListener
      );
    };
  }, [lastScrollY]);

  const scrollToNextSection = () => {
    if (!lenis) return;
    const sections = Array.from(
      document.querySelectorAll("section[data-section]")
    );
    const currentSectionIndex = sections.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });

    const nextSection = sections[currentSectionIndex + 1];
    if (nextSection) {
      lenis.scrollTo(nextSection as HTMLElement);
    }
  };

  return (
    <AnimatePresence>
      {showArrow && !isAtBottom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 right-8 z-50 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-[var(--accent)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollDownArrow;
