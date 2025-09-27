import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Truck, Shield, Check } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import heroImageFallback from "@/assets/hero-fruits.jpg";

const About = () => {
  const { data: settings, isLoading } = useSettings();
  const content = settings?.about_page_content || {};

  const {
    hero = {},
    stats = [],
    mission_vision = {},
    values = [],
    timeline = [],
    team = [],
    certifications = []
  } = content;

  const teamIcons: { [key: string]: React.ElementType } = {
    "Equipe Comercial": Users,
    "Controle de Qualidade": Award,
    "Logística": Truck,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                  {hero.title || "Nossa História"}
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {hero.subtitle || ""}
                </p>
                <p className="text-lg text-white/80 mb-8">
                  {hero.location || ""}
                </p>
                
                {stats.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-accent">{stat.number}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative animate-scale-in">
                <img 
                  src={hero.image_url || heroImageFallback}
                  alt="Frutas frescas Frutbras"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <Card className="p-8 hover-lift">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {mission_vision.mission || ""}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8 hover-lift">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Visão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {mission_vision.vision || ""}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Values */}
            {values.length > 0 && (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Nossos Valores</h2>
                  <p className="text-lg text-muted-foreground">
                    Os princípios que guiam cada decisão e ação da Frutbras
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  {values.map((value: any, index: number) => (
                    <Card key={index} className="p-6 hover-lift">
                      <CardContent className="p-0 flex items-start gap-4">
                        <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Timeline */}
        {timeline.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-foreground mb-4">Nossa Jornada</h2>
                <p className="text-lg text-muted-foreground">Uma história de crescimento e evolução constante</p>
              </div>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border"></div>
                {timeline.map((item: any, index: number) => (
                  <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <Card className="p-6 hover-lift">
                        <p className="text-lg font-bold text-primary mb-2">{item.year}</p>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Team */}
        {team.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Nossa Equipe</h2>
                <p className="text-lg text-muted-foreground">Profissionais dedicados ao seu sucesso</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {team.map((member: any, index: number) => {
                  const IconComponent = teamIcons[member.title] || Users;
                  return (
                    <Card key={index} className="p-6 text-center hover-lift">
                      <CardContent className="p-0">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{member.title}</h3>
                        <p className="text-sm text-primary font-medium mb-3">{member.subtitle}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Certificações</h2>
                <p className="text-lg text-muted-foreground">Compromisso com qualidade e segurança</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {certifications.map((cert: string, index: number) => (
                  <Card key={index} className="p-6 text-center hover-lift">
                    <CardContent className="p-0">
                      <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-accent" />
                      </div>
                      <p className="font-medium text-foreground">{cert}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default About;