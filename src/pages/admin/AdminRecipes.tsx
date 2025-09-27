import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAllRecipes, useDeleteRecipe, useUpdateRecipe } from "@/hooks/useRecipes";
import { RecipeForm } from "@/components/admin/RecipeForm";

const AdminRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: recipes = [], isLoading } = useAllRecipes();
  const deleteRecipeMutation = useDeleteRecipe();
  const updateRecipeMutation = useUpdateRecipe();

  const filteredRecipes = recipes.filter((recipe: any) => {
    return recipe.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta receita?")) {
      deleteRecipeMutation.mutate(id);
    }
  };

  const handleToggleVisibility = async (recipe: any) => {
    updateRecipeMutation.mutate({
      id: recipe.id,
      updates: { visible: !recipe.visible }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receitas</h1>
          <p className="text-muted-foreground">Gerencie as receitas do site</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Receita</DialogTitle>
            </DialogHeader>
            <RecipeForm 
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredRecipes.length} receita(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receita</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe: any) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {recipe.image_url ? (
                        <img 
                          src={recipe.image_url} 
                          alt={recipe.title}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          <ChefHat className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-sm text-muted-foreground">{recipe.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.category || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>{recipe.difficulty}</TableCell>
                  <TableCell>
                    <Badge variant={recipe.visible ? 'default' : 'secondary'}>
                      {recipe.visible ? 'Visível' : 'Oculta'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(recipe)}
                      >
                        {recipe.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRecipe(recipe)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar Receita</DialogTitle>
                          </DialogHeader>
                          {editingRecipe && (
                            <RecipeForm 
                              recipe={editingRecipe}
                              onSuccess={() => setEditingRecipe(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredRecipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma receita encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecipes;