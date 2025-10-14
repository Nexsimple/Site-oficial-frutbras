import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Cart, CartItem, Product, CustomerInfo } from "@/types/products";
import { useToast } from "@/hooks/use-toast";
import { pedidosService } from "@/services/pedidos";
import { supabase } from "@/integrations/supabase/client"; // Importar o cliente Supabase

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number, option: "pacote" | "caixa" | "kg" | "unidade") => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (customerInfo: CustomerInfo) => Promise<void>;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; option: "pacote" | "caixa" | "kg" | "unidade" } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: Cart };

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, option } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.selectedOption === option
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, selectedOption: option }];
      }

      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, totalItems };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, totalItems };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: productId });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, totalItems };
    }

    case "CLEAR_CART":
      return { items: [], total: 0, totalItems: 0 };

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0, totalItems: 0 });
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem("frutbras-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("frutbras-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, option: "pacote" | "caixa" | "kg" | "unidade") => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, option } });
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    toast({
      title: "Produto removido",
      description: "Produto removido do carrinho",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do carrinho",
    });
  };

  const createOrder = async (customerInfo: CustomerInfo) => {
    try {
      const userId = null; 

      const urlParams = new URLSearchParams(window.location.search);
      const utmCampaign = urlParams.get('utm_campaign');
      console.log("UTM Campaign capturada:", utmCampaign); // Adicionado para depuração

      const orderData = {
        cliente_info: {
          ...customerInfo,
          totalItems: cart.totalItems,
          timestamp: new Date().toISOString(),
          ...(utmCampaign && { utmCampaign }),
        },
        itens: cart.items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit: item.selectedOption,
          price: item.product.price,
          total: item.product.price * item.quantity
        })),
        valor_total: cart.total,
        status: 'pendente' as const,
        user_id: userId,
      };

      await pedidosService.criarPedido(orderData);

      toast({
        title: "Pedido enviado!",
        description: "Seu pedido foi enviado com sucesso. Entraremos em contato em breve.",
      });

      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Ocorreu um erro ao enviar seu pedido. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}