"use client";

import { useState } from "react";
import Marquee from "@/components/Marquee";
import LiquidBackground from "@/components/LiquidBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero-section";
import Contact from "@/components/Contact";
import ServicesShowcase from "@/components/ServicesShowcase";

export default function Home() {
  const [isAccelerating, setIsAccelerating] = useState(false);

  return (
    <main className="relative min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-black">
      <div className="absolute inset-0 w-full h-full z-0">
        <LiquidBackground isAccelerating={isAccelerating} />
      </div>
      <Navbar />
      <HeroSection />

      <ServicesShowcase onTransition={setIsAccelerating} />

      <Marquee />

      <Contact />
    </main>
  );
}