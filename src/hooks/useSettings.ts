import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { toast } from '@/hooks/use-toast';
import { TablesUpdate } from '@/integrations/supabase/types';

type SettingsUpdate = TablesUpdate<"settings">;

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.getSettings,
  });
};

export const useSEODefaults = () => {
  return useQuery({
    queryKey: ['settings', 'seo'],
    queryFn: settingsService.getSEODefaults,
  });
};

export const useSiteColors = () => {
  return useQuery({
    queryKey: ['settings', 'colors'],
    queryFn: settingsService.getSiteColors,
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['settings', 'payment-methods'],
    queryFn: settingsService.getPaymentMethods,
  });
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['settings', 'contact'],
    queryFn: settingsService.getContactInfo,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: SettingsUpdate) => settingsService.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Configurações atualizadas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};