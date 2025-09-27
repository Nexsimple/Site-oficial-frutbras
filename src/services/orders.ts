import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Order = Tables<"orders">;
export type OrderInsert = TablesInsert<"orders">;
type OrderUpdate = TablesUpdate<"orders">;

export const ordersService = {
  async createOrder(orderData: OrderInsert): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getOrdersByStatus(status: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status } as OrderUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteOrder(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};