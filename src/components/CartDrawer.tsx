import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShoppingCart, Minus, Plus, Trash2, Send } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerForm } from "./CustomerForm";
import { CustomerInfo } from "@/types/products";

interface CartDrawerProps {
  children: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { cart, updateQuantity, removeFromCart, createOrder } = useCart();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getUnitLabel = (option: string, product: any) => {
    switch (option) {
      case "pacote":
        return `pacote (${product.packageInfo?.unitsPerPackage || 12}un)`;
      case "caixa":
        if (product.category === "polpas") {
          return `caixa (${product.packageInfo?.packagesPerBox || 4} pacotes)`;
        }
        return `caixa (${product.packageInfo?.unitsPerBox || 30}un)`;
      case "kg":
        return "kg";
      case "unidade":
        return "unidade";
      default:
        return option;
    }
  };

  const handleFormSubmit = async (data: CustomerInfo) => {
    setIsLoading(true);
    try {
      await createOrder(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to submit order", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Carrinho de Compras
              {cart.totalItems > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {cart.totalItems} {cart.totalItems === 1 ? "item" : "itens"}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full mt-6">
            {cart.items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Seu carrinho está vazio</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Adicione produtos para continuar
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {cart.items.map((item) => (
                    <Card key={`${item.product.id}-${item.selectedOption}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {getUnitLabel(item.selectedOption, item.product)}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm font-semibold">
                                {formatPrice(
                                  item.product.price * item.quantity
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(cart.total)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsFormOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Finalizar Pedido
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Ao finalizar, entraremos em contato para confirmar seu
                    pedido
                  </p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informações para o Pedido</DialogTitle>
            <DialogDescription>
              Precisamos de alguns dados para concluir seu pedido.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDrawer;