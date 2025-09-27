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
  FormDescription,
} from "@/components/ui/form";
import { useUpdateSettings } from "@/hooks/useSettings";
import { Save } from "lucide-react";

interface SEOSettingsProps {
  settings: any;
}

export function SEOSettings({ settings }: SEOSettingsProps) {
  const updateSettings = useUpdateSettings();
  const seoDefaults = settings?.seo_default || {};

  const form = useForm({
    defaultValues: {
      title: seoDefaults.title || "",
      description: seoDefaults.description || "",
      keywords: seoDefaults.keywords || "",
      author: seoDefaults.author || "",
      og_title: seoDefaults.og_title || "",
      og_description: seoDefaults.og_description || "",
      og_image: seoDefaults.og_image || "",
    },
  });

  useEffect(() => {
    const newSeoDefaults = settings?.seo_default || {};
    form.reset({
      title: newSeoDefaults.title || "",
      description: newSeoDefaults.description || "",
      keywords: newSeoDefaults.keywords || "",
      author: newSeoDefaults.author || "",
      og_title: newSeoDefaults.og_title || "",
      og_description: newSeoDefaults.og_description || "",
      og_image: newSeoDefaults.og_image || "",
    });
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings.mutate({
      seo_default: values
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Meta Tags Básicas</h3>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título Padrão</FormLabel>
                <FormControl>
                  <Input placeholder="Brasfrut - Frutas e Açaí de Qualidade" {...field} />
                </FormControl>
                <FormDescription>
                  Este será o título padrão que aparece na aba do navegador
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Padrão</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Sua descrição aparecerá nos resultados de busca..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Máximo 160 caracteres. Esta descrição aparecerá nos resultados de pesquisa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Palavras-chave</FormLabel>
                <FormControl>
                  <Input placeholder="açaí, frutas, sorvete, picolé, brasfrut" {...field} />
                </FormControl>
                <FormDescription>
                  Separe as palavras-chave por vírgulas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autor</FormLabel>
                <FormControl>
                  <Input placeholder="Brasfrut" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Open Graph (Redes Sociais)</h3>
          
          <FormField
            control={form.control}
            name="og_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título para Redes Sociais</FormLabel>
                <FormControl>
                  <Input placeholder="Brasfrut - Frutas e Açaí de Qualidade" {...field} />
                </FormControl>
                <FormDescription>
                  Título que aparecerá quando o site for compartilhado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="og_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição para Redes Sociais</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descrição que aparecerá nas redes sociais..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="og_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem para Redes Sociais</FormLabel>
                <FormControl>
                  <Input placeholder="https://exemplo.com/imagem-social.jpg" {...field} />
                </FormControl>
                <FormDescription>
                  Imagem que aparecerá quando o site for compartilhado (1200x630px recomendado)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="gradient-primary"
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? "Salvando..." : "Salvar SEO"}
        </Button>
      </form>
    </Form>
  );
}