import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidosService } from '@/services/pedidos';
import { toast } from '@/hooks/use-toast';

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: pedidosService.obterTodosPedidos,
  });
};

export const usePedidosPorStatus = (status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado') => {
  return useQuery({
    queryKey: ['pedidos', 'status', status],
    queryFn: () => pedidosService.obterPedidosPorStatus(status),
  });
};

export const usePedido = (id: string) => {
  return useQuery({
    queryKey: ['pedidos', id],
    queryFn: () => pedidosService.obterPedido(id),
    enabled: !!id,
  });
};

export const useCriarPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pedidosService.criarPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
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

export const useAtualizarStatusPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado' }) =>
      pedidosService.atualizarStatusPedido(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
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

export const useExcluirPedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pedidosService.excluirPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
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