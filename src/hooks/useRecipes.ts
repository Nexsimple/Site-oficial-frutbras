import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesService } from '@/services/recipes';
import { toast } from '@/hooks/use-toast';

// Hook para a página pública de receitas.
export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: recipesService.getVisibleRecipes,
  });
};

// Hook para o painel de administração.
export const useAllRecipes = () => {
  return useQuery({
    queryKey: ['recipes', 'admin'],
    queryFn: recipesService.getAllRecipes,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recipesService.createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', 'admin'] });
      toast({
        title: "Receita criada",
        description: "A nova receita foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar receita",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      recipesService.updateRecipe(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      toast({
        title: "Receita atualizada",
        description: "A receita foi atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar receita",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: recipesService.deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', 'admin'] });
      toast({
        title: "Receita excluída",
        description: "A receita foi excluída com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir receita",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};