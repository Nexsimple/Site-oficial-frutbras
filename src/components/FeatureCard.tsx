import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import heroImage from "@/assets/hero-fruits.jpg"; // fallback image

const FeatureCard = () => {
  const { data: settings } = useSettings();
  const imageUrl = settings?.premium_fruits_image_url || heroImage;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 items-center">
              {/* Image */}
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="Polpas de frutas naturais premium selecionadas da Frutbras"
                  className="w-full h-80 lg:h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Frutas Premium Selecionadas
                </h3>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Polpas, sucos e produtos derivados de frutas brasileiras com o mais alto 
                  padrão de qualidade. Perfeito para sua empresa.
                </p>

                <Link to="/contato">
                  <Button variant="default" size="lg" className="w-full gradient-accent text-white hover-scale shadow-accent-glow">
                    Solicitar Orçamento
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FeatureCard;