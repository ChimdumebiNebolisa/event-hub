import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Integrations from "@/components/Integrations";
import CTASection from "@/components/CTASection";
import WhyIBuilt from "@/components/WhyIBuilt";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <>
      <SEO />
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <Problem />
        <HowItWorks />
        <Features />
        <Integrations />
        <CTASection />
        <WhyIBuilt />
        <Footer />
        <CookieConsent />
      </main>
    </>
  );
};

export default Index;
