import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-fruits.jpg";
import acaiBowl from "@/assets/reference-image-1.png"; // Fallback image
import { Leaf, IceCream, Fish } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Hero = () => {
  const { data: settings } = useSettings();
  const heroImageUrl = settings?.hero_image_url || acaiBowl;

  return (
    <section 
      className="relative text-white py-20 overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80 backdrop-blur-sm"></div>
      
      {/* Floating Icons */}
      <Leaf className="absolute top-1/4 left-1/4 h-8 w-8 text-white/20 animate-float" />
      <IceCream className="absolute top-1/2 right-1/4 h-10 w-10 text-white/20 animate-float [animation-delay:-1.5s]" />
      <Fish className="absolute bottom-1/4 left-1/3 h-12 w-12 text-white/20 animate-float [animation-delay:-3s]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Sabor e Saúde
              <br />
              <span className="text-accent">Direto da Natureza</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              A melhor qualidade em polpas de frutas, açaí e congelados para sua empresa. Produtos 100% naturais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/produtos">
                <Button variant="secondary" size="lg" className="text-lg px-8 hover-scale shadow-accent-glow">
                  Nosso Catálogo
                </Button>
              </Link>
              <Link to="/contato">
                <Button variant="outline-light" size="lg" className="text-lg px-8">
                  Fale Conosco
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative flex justify-center items-center animate-scale-in [animation-delay:0.3s]">
            <div className="absolute w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full animate-pulse-glow"></div>
            <img 
              src={heroImageUrl}
              alt="Tigela de açaí com frutas frescas"
              className="relative w-64 lg:w-80 animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;