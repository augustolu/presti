import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-black">
      <Navbar />
      <Hero />
      <Marquee />
      <Contact />
      <Footer />
    </main>
  );
}
