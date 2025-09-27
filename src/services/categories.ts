import { supabase } from "@/integrations/supabase/client";

export const categoriesService = {
  async getCategories() {
    const { data, error } = await (supabase as any)
      .from('categories')
      .select('*')
      .order('position', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};