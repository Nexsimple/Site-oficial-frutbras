import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Settings = Tables<"settings">;
type SettingsInsert = TablesInsert<"settings">;
type SettingsUpdate = TablesUpdate<"settings">;

export const settingsService = {
  async getSettings(): Promise<Settings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateSettings(updates: SettingsUpdate): Promise<Settings> {
    const currentSettings = await settingsService.getSettings();
    
    if (currentSettings) {
      // If settings exist, update them
      const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', currentSettings.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // If no settings exist, create them
      const { data, error } = await supabase
        .from('settings')
        .insert(updates as SettingsInsert) // Cast needed as updates might not have all required insert fields
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  },

  async getSEODefaults() {
    const settings = await settingsService.getSettings();
    return settings?.seo_default || {};
  },

  async getSiteColors() {
    const settings = await settingsService.getSettings();
    return settings?.colors || {};
  },

  async getPaymentMethods() {
    const settings = await settingsService.getSettings();
    return settings?.payment_methods || [];
  },

  async getContactInfo() {
    const settings = await settingsService.getSettings();
    return {
      whatsapp: settings?.whatsapp,
      email: settings?.email,
      phone: settings?.phone
    };
  }
};