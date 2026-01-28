"use client";


import Marquee from "@/components/Marquee";
import LiquidBackground from "@/components/LiquidBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero-section";
import Contact from "@/components/Contact";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-black">
      <div className="absolute inset-0 w-full h-full z-0">
        <LiquidBackground />
      </div>
      <Navbar />
      <HeroSection />

      <Portfolio />

      <Marquee />

      <Contact />
    </main>
  );
}