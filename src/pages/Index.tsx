import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Integrations from "@/components/Integrations";
import CTASection from "@/components/CTASection";
import WhyIBuilt from "@/components/WhyIBuilt";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Integrations />
      <CTASection />
      <WhyIBuilt />
      <Footer />
    </main>
  );
};

export default Index;
