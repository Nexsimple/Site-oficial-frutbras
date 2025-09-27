import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import { toast } from '@/hooks/use-toast';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAllOrders,
  });
};

export const useOrdersByStatus = (status: 'pending' | 'confirmed' | 'delivered' | 'cancelled') => {
  return useQuery({
    queryKey: ['orders', 'status', status],
    queryFn: () => ordersService.getOrdersByStatus(status),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Pedido criado",
        description: "Seu pedido foi enviado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'delivered' | 'cancelled' }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Pedido excluído",
        description: "O pedido foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};