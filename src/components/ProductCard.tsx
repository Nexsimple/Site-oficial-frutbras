import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  slug: string;
}

const getProductRoute = (slug: string) => {
  const routes: { [key: string]: string } = {
    "polpas": "/produtos/polpas-de-frutas",
    "frutas-congeladas": "/produtos/frutas-congeladas", 
    "gelo-saborizado": "/produtos/gelo-saborizado",
    "pescados": "/produtos/pescados"
  };
  return routes[slug] || "/produtos";
};

const ProductCard = ({ title, description, image, imageAlt, slug }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={imageAlt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-center text-foreground mb-2 h-14">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <Link to={getProductRoute(slug)}>
          <Button variant="outline" className="w-full hover-scale">
            Ver Produtos
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;