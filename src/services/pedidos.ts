import { supabase } from "@/integrations/supabase/client";
import { CustomerInfo } from "@/types/products";

export interface Pedido {
  id: string;
  numero_pedido: string;
  cliente_info: CustomerInfo & {
    totalItems: number;
    timestamp: string;
  };
  itens: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
  }>;
  valor_total: number;
  status: 'pendente' | 'confirmado' | 'entregue' | 'cancelado';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export const pedidosService = {
  async criarPedido(pedidoData: Omit<Pedido, 'id' | 'numero_pedido' | 'created_at' | 'updated_at'>): Promise<Pedido> {
    const { data, error } = await supabase
      .from('pedidos')
      .insert(pedidoData)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async obterTodosPedidos(): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async obterPedidosPorStatus(status: string): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async atualizarStatusPedido(id: string, status: Pedido['status']): Promise<Pedido> {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  async obterPedido(id: string): Promise<Pedido | null> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async excluirPedido(id: string): Promise<void> {
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async obterMeusPedidos(): Promise<Pedido[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};