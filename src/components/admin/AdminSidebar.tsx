import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home,
  Package, 
  ShoppingCart, 
  Settings,
  LogOut,
  ExternalLink,
  BarChart3,
  ChefHat
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/admin",
    end: true
  },
  {
    title: "Produtos",
    icon: Package,
    url: "/admin/products"
  },
  {
    title: "Receitas",
    icon: ChefHat,
    url: "/admin/recipes"
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    url: "/admin/orders"
  },
  {
    title: "Configurações",
    icon: Settings,
    url: "/admin/settings"
  }
];

interface AdminSidebarProps {
  user: any;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: settings } = useSettings();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate("/admin/login");
  };

  const isActive = (path: string, end = false) => {
    if (end) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          {settings?.logo ? (
            <img src={settings.logo} alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">{settings?.site_name || "Frutbras Store"}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url, item.end)}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    <span>Voltar ao Site</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-foreground">Logado como:</p>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}