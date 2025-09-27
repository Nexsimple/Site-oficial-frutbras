import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateSettings } from "@/hooks/useSettings";
import { Save, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface GeneralSettingsProps {
  settings: any;
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  const updateSettings = useUpdateSettings();

  const form = useForm({
    defaultValues: {
      site_name: settings?.site_name || "Frutbras Store",
      logo: settings?.logo || "",
      policies: settings?.policies || "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        site_name: settings.site_name || "Frutbras Store",
        logo: settings.logo || "",
        policies: settings.policies || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="site_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Site</FormLabel>
              <FormControl>
                <Input placeholder="Frutbras Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={() => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <div>
                  <ImageUploader 
                    onUpload={(url) => form.setValue("logo", url, { shouldDirty: true })} 
                    bucket="site-assets" 
                  />
                  {form.watch("logo") && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">Logo atual:</p>
                      <div className="flex items-center gap-4">
                        <img 
                          src={form.watch("logo")} 
                          alt="Preview do Logo" 
                          className="h-16 w-auto object-contain bg-muted p-2 rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => form.setValue("logo", "", { shouldDirty: true })}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="policies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Políticas e Termos</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Termos de uso, política de privacidade, etc..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="gradient-primary"
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>
    </Form>
  );
}