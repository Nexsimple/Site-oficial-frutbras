import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

// Import fallback images
import smoothiesImage from "@/assets/category-smoothies.jpg";
import frozenImage from "@/assets/category-frozen.jpg";
import flavoredIceImage from "@/assets/category-flavored-ice.jpg";
import pescadosImage from "@/assets/category-pescados.jpg";

const fallbackImages: { [key: string]: string } = {
  polpas: smoothiesImage,
  'frutas-congeladas': frozenImage,
  'gelo-saborizado': flavoredIceImage,
  pescados: pescadosImage,
};

const ProductsSection = () => {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section id="produtos" className="py-16 gradient-section relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Nossos Produtos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Produtos frescos e de qualidade para sua mesa. Distribuidora especializada 
            em polpas de frutas, pescados e produtos congelados.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category: any) => (
              <ProductCard 
                key={category.id} 
                title={category.name}
                description={category.description}
                image={category.image_url || fallbackImages[category.slug]}
                imageAlt={category.name}
                slug={category.slug}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/produtos">
            <Button variant="default" size="lg" className="px-8 gradient-primary text-white hover-scale shadow-glow">
              Ver Catálogo Completo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;