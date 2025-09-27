import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useUpdateSettings } from "@/hooks/useSettings";
import { Save, Palette, RefreshCw } from "lucide-react";
import SitePreview from "./SitePreview";

interface ColorSettingsProps {
  settings: any;
}

export function ColorSettings({ settings }: ColorSettingsProps) {
  const updateSettings = useUpdateSettings();
  const colors = settings?.colors || {};

  const form = useForm({
    defaultValues: {
      primary: colors.primary || "#22c55e",
      secondary: colors.secondary || "#f3f4f6",
      accent: colors.accent || "#fb923c",
      background: colors.background || "#ffffff",
      foreground: colors.foreground || "#0f172a",
    },
  });

  useEffect(() => {
    const currentColors = settings?.colors || {};
    form.reset({
      primary: currentColors.primary || "#22c55e",
      secondary: currentColors.secondary || "#f3f4f6",
      accent: currentColors.accent || "#fb923c",
      background: currentColors.background || "#ffffff",
      foreground: currentColors.foreground || "#0f172a",
    });
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings.mutate({
      colors: values
    });
  };

  const resetToDefaults = () => {
    form.reset({
      primary: "#22c55e",
      secondary: "#f3f4f6",
      accent: "#fb923c",
      background: "#ffffff",
      foreground: "#0f172a",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Personalização de Cores</h3>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="primary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Primária</FormLabel>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input type="color" className="w-20 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#22c55e" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Cor principal do site (botões, links, destaques)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Destaque</FormLabel>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input type="color" className="w-20 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#fb923c" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Cor secundária para elementos de destaque
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor Secundária</FormLabel>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input type="color" className="w-20 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#f3f4f6" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Cor para fundos secundários e elementos sutis
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Fundo</FormLabel>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input type="color" className="w-20 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#ffffff" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Cor de fundo principal do site
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foreground"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cor do Texto</FormLabel>
                  <div className="flex items-center space-x-3">
                    <FormControl>
                      <Input type="color" className="w-20 h-10" {...field} />
                    </FormControl>
                    <FormControl>
                      <Input placeholder="#0f172a" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Cor principal para textos e elementos de primeiro plano
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <Button 
              type="submit" 
              className="gradient-primary w-full"
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettings.isPending ? "Salvando..." : "Salvar Cores"}
            </Button>
          </form>
        </Form>
      </div>

      <SitePreview settings={{
        ...settings,
        colors: form.watch()
      }} />
    </div>
  );
}