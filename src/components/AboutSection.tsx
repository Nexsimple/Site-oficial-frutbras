import { Award, Truck, Users, Leaf, Shield, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Qualidade Premium",
      description: "Produtos certificados com os mais altos padrões de qualidade"
    },
    {
      icon: Truck,
      title: "Entrega Garantida", 
      description: "Logística especializada para manter a cadeia de frio"
    },
    {
      icon: Users,
      title: "Atendimento Personalizado",
      description: "Equipe especializada para atender suas necessidades"
    },
    {
      icon: Leaf,
      title: "Produtos Saudáveis",
      description: "100% naturais, sem conservantes ou aditivos artificiais"
    },
    {
      icon: Shield,
      title: "Segurança Alimentar",
      description: "Rigoroso controle de qualidade em todas as etapas"
    },
    {
      icon: Heart,
      title: "Sustentabilidade",
      description: "Compromisso com práticas ambientalmente responsáveis"
    }
  ];

  const stats = [
    { number: "15+", label: "Anos de Experiência" },
    { number: "1000+", label: "Clientes Satisfeitos" },
    { number: "100%", label: "Produtos Naturais" }
  ];

  return (
    <section id="sobre" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Sobre a Frutbras</h2>
          <h3 className="text-2xl font-semibold text-primary mb-4">Tradição e Qualidade</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Há mais de 15 anos no mercado, a Frutbras é referência em distribuição de polpas de frutas, 
            pescados e produtos congelados, sempre priorizando a qualidade e satisfação dos nossos clientes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;