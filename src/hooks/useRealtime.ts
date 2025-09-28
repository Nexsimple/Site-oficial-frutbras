import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Canal para produtos
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products realtime update:', payload);
          
          // Invalidar queries relacionadas a produtos
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['products', 'category'] });
          queryClient.invalidateQueries({ queryKey: ['allProducts'] });
          
          // Mostrar notificação baseada na operação
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Produto adicionado",
              description: `Novo produto "${payload.new?.title}" foi criado.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Produto atualizado", 
              description: `Produto "${payload.new?.title}" foi modificado.`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Produto removido",
              description: `Produto foi excluído do sistema.`,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    // Canal para configurações
    const settingsChannel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'settings'
        },
        (payload) => {
          console.log('Settings realtime update:', payload);
          
          // Invalidar todas as queries de configurações
          queryClient.invalidateQueries({ queryKey: ['settings'] });
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Configurações atualizadas",
              description: "As configurações do site foram modificadas em tempo real.",
            });
          }
        }
      )
      .subscribe();

    // Canal para pedidos  
    const pedidosChannel = supabase
      .channel('pedidos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pedidos' // Alterado de 'orders' para 'pedidos'
        },
        (payload) => {
          console.log('Pedidos realtime update:', payload);
          
          // Invalidar queries de pedidos
          queryClient.invalidateQueries({ queryKey: ['pedidos'] }); // Alterado de 'orders' para 'pedidos'
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Novo pedido",
              description: `Pedido #${payload.new?.numero_pedido} foi criado.`, // Usando numero_pedido
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Pedido atualizado",
              description: `Status do pedido #${payload.new?.numero_pedido} foi alterado.`, // Usando numero_pedido
            });
          }
        }
      )
      .subscribe();

    // Canal para logs de auditoria
    const auditChannel = supabase
      .channel('audit-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          console.log('Audit log created:', payload);
          
          // Invalidar logs de auditoria
          queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(pedidosChannel); // Alterado de ordersChannel para pedidosChannel
      supabase.removeChannel(auditChannel);
    };
  }, [queryClient]);
};