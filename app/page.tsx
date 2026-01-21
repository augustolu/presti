"use client";

import { useState } from "react";
import Marquee from "@/components/Marquee";
import LiquidBackground from "@/components/LiquidBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero-section";
import Contact from "@/components/Contact";
import MotionGraphics from "@/components/MotionGraphics";
import VideoEditing from "@/components/VideoEditing";
import Section from "@/components/ui/Section";

export default function Home() {
  const [hoveredService, setHoveredService] = useState<"video" | "motion" | null>(null);

  return (
    <main className="relative min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-black">
      <div className="absolute inset-0 w-full h-full z-0">
        <LiquidBackground />
      </div>
      <Navbar />
      <HeroSection />

      <Section fullWidth className="py-0 px-0">
        <div className="w-full h-screen flex flex-col md:flex-row">
          <VideoEditing
            hoveredService={hoveredService}
            setHoveredService={setHoveredService}
          />
          <MotionGraphics
            hoveredService={hoveredService}
            setHoveredService={setHoveredService}
          />
        </div>
      </Section>

      <Marquee />

      <Contact />
    </main>
  );
}