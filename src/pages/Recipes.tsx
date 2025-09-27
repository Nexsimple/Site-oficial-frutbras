import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { useRecipes } from "@/hooks/useRecipes";
import { useSettings } from "@/hooks/useSettings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import defaultHero from "@/assets/hero-fruits.jpg";

const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  
  const { data: recipes = [], isLoading } = useRecipes();
  const { data: settings } = useSettings();

  const { featuredRecipe, regularRecipes } = useMemo(() => {
    const featured = recipes.find(r => r.is_featured) || recipes[0];
    const regular = recipes.filter(r => r.id !== featured?.id);
    return { featuredRecipe: featured, regularRecipes: regular };
  }, [recipes]);

  const categories = useMemo(() => [
    { id: "all", label: "🍴 Todos" },
    ...Array.from(new Set(recipes.map(r => r.category))).filter(Boolean).map(c => ({ id: c, label: c }))
  ], [recipes]);

  const filteredRecipes = activeCategory === "all" 
    ? regularRecipes 
    : regularRecipes.filter(recipe => recipe.category === activeCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Fácil": return "bg-primary/10 text-primary";
      case "Médio": return "bg-accent/10 text-accent";
      case "Difícil": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative py-20 text-white bg-cover bg-center"
          style={{ backgroundImage: `url(${settings?.recipes_hero_image_url || defaultHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {settings?.recipes_hero_title || 'Receitas Deliciosas'}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              {settings?.recipes_hero_subtitle || 'Descubra receitas incríveis usando nossos produtos naturais'}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Featured Recipe */}
          {featuredRecipe && (
            <section className="mb-16 animate-fade-in-up [animation-delay:0.2s]">
              <h2 className="text-3xl font-bold text-center mb-8">Receita em Destaque</h2>
              <Card className="overflow-hidden shadow-lg hover-lift grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <img src={featuredRecipe.image_url} alt={featuredRecipe.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 flex flex-col">
                  <Badge className={`w-fit ${getDifficultyColor(featuredRecipe.difficulty)}`}>{featuredRecipe.difficulty}</Badge>
                  <h3 className="text-2xl font-bold mt-4 mb-2">{featuredRecipe.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{featuredRecipe.short_desc}</p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {featuredRecipe.prep_time} min</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {featuredRecipe.servings} porções</div>
                  </div>
                  <Button onClick={() => setSelectedRecipe(featuredRecipe)} size="lg" variant="primary">Ver Receita</Button>
                </div>
              </Card>
            </section>
          )}

          {/* Filters and Regular Recipes */}
          <section className="animate-fade-in-up [animation-delay:0.4s]">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="px-6 py-2 capitalize rounded-full"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden hover-lift group">
                    <button onClick={() => setSelectedRecipe(recipe)} className="w-full text-left">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                          {recipe.difficulty}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2 h-14">{recipe.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {recipe.prep_time} min</div>
                          <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {recipe.servings} porções</div>
                        </div>
                      </CardContent>
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Dialog open={!!selectedRecipe} onOpenChange={(isOpen) => !isOpen && setSelectedRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <div>
              <img src={selectedRecipe.image_url} alt={selectedRecipe.title} className="w-full h-64 object-cover rounded-lg mb-4" />
              <DialogHeader>
                <DialogTitle className="text-3xl mb-2">{selectedRecipe.title}</DialogTitle>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                  <Badge variant="outline">{selectedRecipe.category}</Badge>
                  <Badge className={getDifficultyColor(selectedRecipe.difficulty)}>{selectedRecipe.difficulty}</Badge>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {selectedRecipe.prep_time} min</div>
                  <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {selectedRecipe.servings} porções</div>
                </div>
                <DialogDescription className="pt-4 text-base">{selectedRecipe.long_desc || selectedRecipe.short_desc}</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Ingredientes</h3>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {selectedRecipe.ingredients?.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Instruções</h3>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground">
                    {selectedRecipe.instructions}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Recipes;