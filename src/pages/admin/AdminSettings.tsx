import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings, 
  Palette, 
  CreditCard, 
  Search,
  Globe,
  Phone,
  LayoutTemplate,
  Info
} from "lucide-react";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { SEOSettings } from "@/components/admin/settings/SEOSettings";
import { ColorSettings } from "@/components/admin/settings/ColorSettings";
import { PaymentSettings } from "@/components/admin/settings/PaymentSettings";
import { ContactSettings } from "@/components/admin/settings/ContactSettings";
import { ContentSettings } from "@/components/admin/settings/ContentSettings";
import { AboutSettings } from "@/components/admin/settings/AboutSettings";
import AuditLogs from "@/components/admin/AuditLogs";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { data: settings, isLoading, isError } = useSettings();

  const settingsTabs = [
    { id: "general", label: "Geral", icon: Settings, description: "Configurações básicas do site" },
    { id: "content", label: "Conteúdo", icon: LayoutTemplate, description: "Gerencie imagens e textos do site" },
    { id: "about", label: "Sobre", icon: Info, description: "Edite o conteúdo da página 'Sobre'" },
    { id: "seo", label: "SEO", icon: Search, description: "Otimização para mecanismos de busca" },
    { id: "appearance", label: "Aparência", icon: Palette, description: "Cores, fontes e tema do site" },
    { id: "payments", label: "Pagamentos", icon: CreditCard, description: "Métodos de pagamento aceitos" },
    { id: "contact", label: "Contato", icon: Phone, description: "Informações de contato e endereço" },
    { id: "audit", label: "Logs", icon: Globe, description: "Histórico de operações e auditoria" }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive font-medium">Erro ao carregar as configurações.</p>
        <p className="text-muted-foreground text-sm">Por favor, tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Configure todos os aspectos do sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-8">
          {settingsTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center space-x-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {settingsTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </CardTitle>
                  <CardDescription>{tab.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {tab.id === "general" && <GeneralSettings settings={settings} />}
                  {tab.id === "content" && <ContentSettings settings={settings} />}
                  {tab.id === "about" && <AboutSettings settings={settings} />}
                  {tab.id === "seo" && <SEOSettings settings={settings} />}
                  {tab.id === "appearance" && <ColorSettings settings={settings} />}
                  {tab.id === "payments" && <PaymentSettings settings={settings} />}
                  {tab.id === "contact" && <ContactSettings settings={settings} />}
                  {tab.id === "audit" && <AuditLogs />}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default AdminSettings;