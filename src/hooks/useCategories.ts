import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories';
import { toast } from '@/hooks/use-toast';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      categoriesService.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};