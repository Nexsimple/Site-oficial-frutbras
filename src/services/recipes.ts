import { supabase } from "@/integrations/supabase/client";

export const recipesService = {
  // Para a página pública, busca apenas receitas visíveis.
  async getVisibleRecipes() {
    const { data, error } = await (supabase as any)
      .from('recipes')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Para o painel de administração, busca todas as receitas.
  async getAllRecipes() {
    const { data, error } = await (supabase as any)
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createRecipe(recipe: any) {
    const { data, error } = await (supabase as any)
      .from('recipes')
      .insert(recipe)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRecipe(id: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRecipe(id: string) {
    const { error } = await (supabase as any)
      .from('recipes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};