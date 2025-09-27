import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Award, Truck, Shield } from "lucide-react";
import { useContactInfo } from "@/hooks/useSettings";

const Contact = () => {
  const { data: contactInfo, isLoading } = useContactInfo();

  const features = [
    {
      icon: Award,
      title: "30+ anos de experiência",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Produtos 100% naturais", 
      color: "text-accent"
    },
    {
      icon: Award,
      title: "Qualidade certificada",
      color: "text-accent"
    },
    {
      icon: Truck,
      title: "Entrega garantida",
      color: "text-accent"
    }
  ];

  const services = [
    {
      title: "Atacado",
      description: "Fornecimento para restaurantes, lanchonetes e comércios",
      features: ["Preços especiais", "Entrega programada", "Suporte dedicado"]
    },
    {
      title: "Varejo", 
      description: "Produtos para consumidores finais com qualidade premium",
      features: ["Produtos frescos", "Embalagens adequadas", "Atendimento personalizado"]
    },
    {
      title: "Delivery",
      description: "Entregamos em toda região com agilidade e segurança", 
      features: ["Entrega rápida", "Produtos refrigerados", "Rastreamento"]
    }
  ];

  const handleWhatsAppClick = () => {
    if (contactInfo?.whatsapp) {
      const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Entre em <span className="text-accent">Contato</span>
            </h1>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Estamos prontos para atender sua empresa com produtos de qualidade superior
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <p className="text-white/90 font-medium">{feature.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full text-background" style={{ zIndex: 0, transform: 'translateY(1px)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="currentColor" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,149.3C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Nossos Canais de Atendimento</h2>
              <p className="text-lg text-muted-foreground">
                Fale conosco através dos canais abaixo ou visite nosso endereço.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              {/* Address */}
              <Card className="p-6 hover-lift">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Endereços</h3>
                      <div className="text-muted-foreground">
                        <p className="font-medium">Rio Verde - GO</p>
                        <p>R. José Veloso N°193, Jardim Adriana</p>
                        <p>CEP: 75906-580</p>
                        <br/>
                        <p className="font-medium">Uberlândia - MG</p>
                        <p>Seu endereço em Uberlândia aqui</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="p-6 hover-lift">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Telefone</h3>
                      {isLoading ? (
                        <p className="text-muted-foreground">Carregando...</p>
                      ) : (
                        <p className="text-muted-foreground">{contactInfo?.phone || "Não informado"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="p-6 hover-lift">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">E-mail</h3>
                      {isLoading ? (
                        <p className="text-muted-foreground">Carregando...</p>
                      ) : (
                        <div className="text-muted-foreground">
                          <p>{contactInfo?.email || "Não informado"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="p-6 hover-lift">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Horário</h3>
                      <div className="text-muted-foreground">
                        <p>Segunda à Sexta: 8h às 18h</p>
                        <p>Sábado: 8h às 12h</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Como Podemos Te Ajudar</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {services.map((service, index) => (
                <Card key={index} className="p-6 hover-lift">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Prefere conversar diretamente?</h2>
            <p className="text-xl text-white/90 mb-8">
              Chame no WhatsApp para um atendimento mais rápido
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="px-8 hover-scale shadow-accent-glow"
              onClick={handleWhatsAppClick}
              disabled={isLoading || !contactInfo?.whatsapp}
            >
              Chamar no WhatsApp
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;