import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Integrations from "@/components/Integrations";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import WhyIBuilt from "@/components/WhyIBuilt";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <HowItWorks />
      <Integrations />
      <Features />
      <CTASection />
      <WhyIBuilt />
      <Footer />
    </main>
  );
};

export default Index;
