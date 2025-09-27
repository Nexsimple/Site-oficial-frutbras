import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/products";
import { useCart } from "@/contexts/CartContext";

interface ProductCardModernProps {
  product: Product;
}

const ProductCardModern = ({ product }: ProductCardModernProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<"pacote" | "caixa" | "kg" | "unidade">(
    product.unit as "pacote" | "caixa" | "kg" | "unidade"
  );
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getUnitOptions = () => {
    if (product.category === "polpas") {
      return [
        { value: "pacote", label: `Pacote (${product.packageInfo?.unitsPerPackage || 12}un)` },
        { value: "caixa", label: `Caixa (${product.packageInfo?.packagesPerBox || 4} pacotes)` }
      ];
    }
    if (product.category === "gelo-saborizado") {
      return [
        { value: "caixa", label: `Caixa (${product.packageInfo?.unitsPerBox || 30}un)` }
      ];
    }
    if (product.category === "frutas-congeladas" || product.category === "pescados") {
      return [
        { value: "kg", label: "Por quilograma" }
      ];
    }
    return [{ value: "unidade", label: "Por unidade" }];
  };

  const getUnitPrice = () => {
    if (product.category === "polpas" && selectedOption === "caixa") {
      return product.price * (product.packageInfo?.packagesPerBox || 4);
    }
    return product.price;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption);
    setQuantity(1);
  };

  const updateQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <Card className="overflow-hidden hover-lift glass-card group">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-slow"
        />
        <div className="absolute top-3 right-3">
          {product.available ? (
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              Disponível
            </Badge>
          ) : (
            <Badge variant="destructive" className="shadow-lg">
              Esgotado
            </Badge>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Unit Options */}
        {getUnitOptions().length > 1 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {getUnitOptions().map((option) => (
                <Button
                  key={option.value}
                  variant={selectedOption === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOption(option.value as any)}
                  className="transition-smooth text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(getUnitPrice())}
            </div>
            <div className="text-sm text-muted-foreground">
              por {getUnitOptions().find(opt => opt.value === selectedOption)?.label.toLowerCase() || product.unit}
            </div>
          </div>
        </div>
        
        {product.available ? (
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => updateQuantity(-1)}
                className="hover-scale"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center font-semibold text-lg">
                {quantity}
              </span>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => updateQuantity(1)}
                className="hover-scale"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full gradient-accent text-white hover:shadow-accent-glow transition-smooth group"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Adicionar {quantity} {quantity === 1 ? selectedOption : `${selectedOption}s`}
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="w-full" disabled size="lg">
            Indisponível
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCardModern;