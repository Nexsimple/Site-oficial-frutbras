import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CategoryPageProps {
  category: string;
  title: string;
  description: string;
  heroImage: string;
  breadcrumbTitle: string;
}

const CategoryPage = ({ category, title, description, heroImage, breadcrumbTitle }: CategoryPageProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { data: products = [], isLoading } = useProductsByCategory(category);
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1;
    const specs = product.specs || {};
    const unit = specs.unit || 'unidade';

    const productForCart = {
      id: product.id,
      name: product.title,
      description: product.short_desc || '',
      price: product.price,
      unit: unit,
      category: product.category,
      image: product.images?.[0] || heroImage,
      available: product.stock > 0,
      rating: specs.rating || 4.5,
      packageInfo: specs.packageInfo
    };

    const option = unit as "pacote" | "caixa" | "kg" | "unidade";
    addToCart(productForCart, quantity, option);

    if (selectedProduct) {
      setSelectedProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getUnitLabel = (specs: any) => {
    if (!specs || !specs.unit) return 'unidade';

    const unitMap: { [key: string]: string } = {
      'pacote': 'pacote',
      'kg': 'kg',
      'caixa': 'caixa',
      'unidade': 'unidade'
    };

    return unitMap[specs.unit] || specs.unit;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Carregando produtos...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Link to="/" className="text-primary hover:underline flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
            <span className="text-muted-foreground">›</span>
            <Link to="/produtos" className="text-primary hover:underline">Produtos</Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-foreground font-medium">{breadcrumbTitle}</span>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-8">
            <Link to="/produtos/polpas-de-frutas">
              <Button variant={category === 'polpas' ? 'default' : 'ghost'}
                className={category === 'polpas' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}>
                Polpas
              </Button>
            </Link>
            <Link to="/produtos/frutas-congeladas">
              <Button variant={category === 'frutas-congeladas' ? 'default' : 'ghost'}
                className={category === 'frutas-congeladas' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}>
                Frutas
              </Button>
            </Link>
            <Link to="/produtos/gelo-saborizado">
              <Button variant={category === 'gelo-saborizado' ? 'default' : 'ghost'}
                className={category === 'gelo-saborizado' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}>
                Gelo
              </Button>
            </Link>
            <Link to="/produtos/pescados">
              <Button variant={category === 'pescados' ? 'default' : 'ghost'}
                className={category === 'pescados' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}>
                Pescados
              </Button>
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="relative mb-12 rounded-2xl overflow-hidden">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">{title}</h1>
                <p className="text-lg">{description}</p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product: any) => {
              const specs = product.specs || {};
              const rating = specs.rating || 4.5;
              const unitLabel = getUnitLabel(specs);
              const isAvailable = product.stock > 0;

              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="aspect-square relative">
                    <button onClick={() => setSelectedProduct(product)} className="w-full h-full block cursor-pointer group">
                      <img
                        src={product.images?.[0] || heroImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                    {isAvailable ? (
                      <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded">
                        Disponível
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-destructive text-white text-xs px-2 py-1 rounded">
                        Esgotado
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-center text-foreground mb-2 h-14">{product.title}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                      {product.short_desc}
                    </p>
                    <div className="text-2xl font-bold text-foreground mb-4">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">por {unitLabel}</div>
                    <div className="mt-auto">
                      {isAvailable ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(product.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {quantities[product.id] || 1}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="default"
                            className="w-full gradient-primary"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Adicionar {quantities[product.id] || 1} {unitLabel}{(quantities[product.id] || 1) > 1 ? 's' : ''}
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" className="w-full" disabled>
                          Indisponível
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Não encontrou o que procura?
              </h3>
              <p className="text-muted-foreground mb-6">
                Entre em contato conosco para produtos personalizados ou encomendas especiais.
              </p>
              <Button variant="default" size="lg" className="gradient-primary">
                Fale Conosco
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <img
                  src={selectedProduct.images?.[0] || heroImage}
                  alt={selectedProduct.title}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="flex flex-col h-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedProduct.title}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-1 my-2">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{selectedProduct.specs?.rating || 4.5}</span>
                </div>

                <DialogDescription className="text-base text-muted-foreground mt-2 flex-grow overflow-y-auto max-h-48 pr-2">
                  {selectedProduct.long_desc || selectedProduct.short_desc}
                </DialogDescription>

                <div className="mt-auto pt-4">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatPrice(selectedProduct.price)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    por {getUnitLabel(selectedProduct.specs)}
                  </div>

                  {selectedProduct.stock > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(selectedProduct.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium text-lg">
                          {quantities[selectedProduct.id] || 1}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(selectedProduct.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="w-full gradient-primary"
                        size="lg"
                        onClick={() => handleAddToCart(selectedProduct)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Indisponível
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CategoryPage;