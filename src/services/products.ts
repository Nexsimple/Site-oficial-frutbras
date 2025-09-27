import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;

export const productsService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('visible', true)
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('visible', true)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createProduct(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};