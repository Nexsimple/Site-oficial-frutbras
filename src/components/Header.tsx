import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSettings } from "@/hooks/useSettings";

const Header = () => {
  const { cart } = useCart();
  const { data: settings } = useSettings();

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover-scale">
          {settings?.logo && (
            <img src={settings.logo} alt="Logo" className="h-10 w-auto" />
          )}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {settings?.site_name || "Frutbras Store"}
            </h1>
            <p className="text-sm text-muted-foreground">Alimentos Congelados</p>
          </div>
        </Link>

        {/* Navigation Menu - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-foreground hover:text-primary transition-smooth font-medium relative group"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            to="/produtos" 
            className="text-foreground hover:text-primary transition-smooth font-medium relative group"
          >
            Produtos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            to="/receitas" 
            className="text-foreground hover:text-primary transition-smooth font-medium relative group"
          >
            Receitas
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            to="/sobre" 
            className="text-foreground hover:text-primary transition-smooth font-medium relative group"
          >
            Sobre
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            to="/contato" 
            className="text-foreground hover:text-primary transition-smooth font-medium relative group"
          >
            Contato
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover-scale">
            <Search className="h-5 w-5" />
          </Button>
          
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative hover-scale">
              <ShoppingCart className="h-5 w-5" />
              {cart.totalItems > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse-glow"
                >
                  {cart.totalItems}
                </Badge>
              )}
            </Button>
          </CartDrawer>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover-scale">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-6 mt-8">
                <Link 
                  to="/" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Início
                </Link>
                <Link 
                  to="/produtos" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Produtos
                </Link>
                <Link 
                  to="/receitas" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Receitas
                </Link>
                <Link 
                  to="/sobre" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Sobre
                </Link>
                <Link 
                  to="/contato" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Contato
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;