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
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders realtime update:', payload);
          
          // Invalidar queries de pedidos
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Novo pedido",
              description: `Pedido #${payload.new?.id?.slice(-6)} foi criado.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Pedido atualizado",
              description: `Status do pedido #${payload.new?.id?.slice(-6)} foi alterado.`,
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
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(auditChannel);
    };
  }, [queryClient]);
};