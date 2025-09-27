import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRealtime } from "@/hooks/useRealtime";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import Index from "./pages/Index";
import Products from "./pages/Products";
import PulpProducts from "./pages/PulpProducts";
import FrozenFruits from "./pages/FrozenFruits";
import FlavoredIce from "./pages/FlavoredIce";
import Seafood from "./pages/Seafood";
import Recipes from "./pages/Recipes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminRecipes from "@/pages/admin/AdminRecipes";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotificationManager from "@/components/admin/NotificationManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component wrapper para usar hooks dentro do QueryClientProvider
const AppContent = () => {
  useRealtime(); // Hook para sincronização em tempo real
  useDynamicTheme(); // Hook para aplicar tema dinâmico
  
  return (
    <BrowserRouter>
      <NotificationManager />
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/polpas-de-frutas" element={<PulpProducts />} />
          <Route path="/produtos/frutas-congeladas" element={<FrozenFruits />} />
          <Route path="/produtos/gelo-saborizado" element={<FlavoredIce />} />
          <Route path="/produtos/pescados" element={<Seafood />} />
          <Route path="/receitas" element={<Recipes />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
          
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="recipes" element={<AdminRecipes />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;