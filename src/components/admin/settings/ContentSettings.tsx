import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCategories, useUpdateCategory } from "@/hooks/useCategories";
import { useUpdateSettings } from "@/hooks/useSettings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CategoryForm } from "./CategoryForm";
import { Image as ImageIcon, Edit, ArrowUp, ArrowDown } from "lucide-react";

export function ContentSettings({ settings }: { settings: any }) {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const updateSettings = useUpdateSettings();
  const updateCategory = useUpdateCategory();
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleHeroImageUpload = (url: string) => {
    updateSettings.mutate({ hero_image_url: url });
  };

  const handlePremiumImageUpload = (url: string) => {
    updateSettings.mutate({ premium_fruits_image_url: url });
  };
  
  const handleRecipesHeroImageUpload = (url: string) => {
    updateSettings.mutate({ recipes_hero_image_url: url });
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const categoryToMove = categories[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const categoryToSwapWith = categories[swapIndex];

    if (!categoryToMove || !categoryToSwapWith) return;

    // Swap positions
    updateCategory.mutate({
      id: categoryToMove.id,
      updates: { position: categoryToSwapWith.position },
    });
    updateCategory.mutate({
      id: categoryToSwapWith.id,
      updates: { position: categoryToMove.position },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Página de Receitas</CardTitle>
          <CardDescription>Personalize o conteúdo da seção de destaque da página de receitas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              defaultValue={settings?.recipes_hero_title}
              onBlur={(e) => updateSettings.mutate({ recipes_hero_title: e.target.value })}
              placeholder="Título da Seção"
            />
            <Input 
              defaultValue={settings?.recipes_hero_subtitle}
              onBlur={(e) => updateSettings.mutate({ recipes_hero_subtitle: e.target.value })}
              placeholder="Subtítulo da Seção"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2">
              <ImageUploader onUpload={handleRecipesHeroImageUpload} bucket="site-assets" />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-sm text-muted-foreground mb-2">Imagem de fundo atual:</p>
              {settings?.recipes_hero_image_url ? (
                <img src={settings.recipes_hero_image_url} alt="Preview" className="rounded-lg border w-full max-w-xs object-cover aspect-video" />
              ) : (
                <div className="rounded-lg border w-full max-w-xs aspect-video bg-muted flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Página Inicial - Imagem Principal (Hero)</CardTitle>
          <CardDescription>Altere a imagem de destaque que aparece na seção principal da página inicial.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <ImageUploader onUpload={handleHeroImageUpload} bucket="site-assets" />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm text-muted-foreground mb-2">Preview da imagem atual:</p>
            {settings?.hero_image_url ? (
              <img src={settings.hero_image_url} alt="Preview" className="rounded-lg border w-full max-w-xs object-cover aspect-square" />
            ) : (
              <div className="rounded-lg border w-full max-w-xs aspect-square bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Página Inicial - Imagem de Destaque (Card)</CardTitle>
          <CardDescription>Altere a imagem do card "Frutas Premium Selecionadas" na página inicial.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <ImageUploader onUpload={handlePremiumImageUpload} bucket="site-assets" />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-sm text-muted-foreground mb-2">Preview da imagem atual:</p>
            {settings?.premium_fruits_image_url ? (
              <img src={settings.premium_fruits_image_url} alt="Preview" className="rounded-lg border w-full max-w-xs object-cover aspect-video" />
            ) : (
              <div className="rounded-lg border w-full max-w-xs aspect-video bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorias de Produtos</CardTitle>
          <CardDescription>Gerencie as imagens, descrições e a ordem de exibição das categorias.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCategories ? (
            <p>Carregando categorias...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category: any, index: number) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === categories.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <Dialog open={editingCategory?.id === category.id} onOpenChange={(isOpen) => !isOpen && setEditingCategory(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Categoria: {category?.name}</DialogTitle>
                      </DialogHeader>
                      <CategoryForm 
                        category={category}
                        onSuccess={() => setEditingCategory(null)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}