import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import SecuritySection from "../components/landing/SecuritySection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </>
  );
}