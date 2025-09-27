import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeatureCard />
        <ProductsSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
