import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface SitePreviewProps {
  settings: {
    site_name?: string;
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string; 
      accent?: string;
      background?: string;
      foreground?: string;
    };
  };
}

const SitePreview = ({ settings }: SitePreviewProps) => {
  const colors = settings.colors || {};
  
  // Aplicar cores dinamicamente via CSS variables
  const previewStyle = {
    '--preview-primary': colors.primary || 'hsl(158 70% 38%)',
    '--preview-secondary': colors.secondary || 'hsl(210 40% 96.1%)',
    '--preview-accent': colors.accent || 'hsl(25 95% 53%)',
    '--preview-background': colors.background || 'hsl(0 0% 100%)',
    '--preview-foreground': colors.foreground || 'hsl(215 25% 27%)',
  } as React.CSSProperties;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Preview do Site</span>
        </CardTitle>
        <CardDescription>
          Visualização em tempo real das alterações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="border rounded-lg overflow-hidden shadow-sm"
          style={previewStyle}
        >
          {/* Header Preview */}
          <div 
            className="p-4 border-b"
            style={{ 
              backgroundColor: `var(--preview-primary)`,
              color: 'white'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.logo && (
                  <img 
                    src={settings.logo} 
                    alt="Logo" 
                    className="h-8 w-8 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="font-bold text-lg">
                  {settings.site_name || 'Nome do Site'}
                </span>
              </div>
              <div className="flex space-x-4 text-sm">
                <span>Início</span>
                <span>Produtos</span>
                <span>Contato</span>
              </div>
            </div>
          </div>

          {/* Hero Section Preview */}
          <div 
            className="p-6 text-center"
            style={{ 
              backgroundColor: `var(--preview-background)`,
              color: `var(--preview-foreground)`
            }}
          >
            <h2 className="text-2xl font-bold mb-2">
              Bem-vindo ao {settings.site_name || 'Seu Site'}
            </h2>
            <p className="text-sm opacity-75 mb-4">
              Produtos frescos e de qualidade para sua mesa
            </p>
            <Button 
              className="text-sm px-4 py-2 rounded"
              style={{ 
                backgroundColor: `var(--preview-accent)`,
                color: 'white',
                border: 'none'
              }}
            >
              Ver Produtos
            </Button>
          </div>

          {/* Products Section Preview */}
          <div 
            className="p-6"
            style={{ 
              backgroundColor: `var(--preview-secondary)`,
              color: `var(--preview-foreground)`
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Nossos Produtos</h3>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item}
                  className="p-3 rounded border"
                  style={{ 
                    backgroundColor: `var(--preview-background)`,
                    borderColor: `var(--preview-primary)`,
                    borderWidth: '1px'
                  }}
                >
                  <div 
                    className="h-16 rounded mb-2"
                    style={{ backgroundColor: `var(--preview-secondary)` }}
                  />
                  <div className="text-xs font-medium">Produto {item}</div>
                  <div className="text-xs opacity-75">R$ 25,90</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Preview */}
          <div 
            className="p-4 text-center text-xs"
            style={{ 
              backgroundColor: `var(--preview-foreground)`,
              color: `var(--preview-background)`
            }}
          >
            © 2024 {settings.site_name || 'Seu Site'}. Todos os direitos reservados.
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium">Paleta de Cores:</div>
          <div className="flex space-x-2">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: value }}
                  title={`${key}: ${value}`}
                />
                <span className="text-xs mt-1 capitalize">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex justify-center">
          <Badge variant="outline" className="text-xs">
            Preview em Tempo Real
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitePreview;