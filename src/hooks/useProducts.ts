import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService, ProductUpdate } from '@/services/products';
import { toast } from '@/hooks/use-toast';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getProducts,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsService.getProductsByCategory(category),
    enabled: !!category,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: !!slug,
  });
};

// Admin hooks
export const useAllProducts = () => {
  return useQuery({
    queryKey: ['products', 'admin'],
    queryFn: productsService.getAllProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto criado",
        description: "O produto foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates, quiet = false }: { id: string; updates: ProductUpdate; quiet?: boolean }) =>
      productsService.updateProduct(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (!variables.quiet) {
        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};