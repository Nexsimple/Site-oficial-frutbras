import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateCategory } from "@/hooks/useCategories";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Save } from "lucide-react";

interface CategoryFormProps {
  category: any;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      image_url: category?.image_url || "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [category, form]);

  const handleImageUpload = (url: string) => {
    form.setValue("image_url", url, { shouldDirty: true });
  };

  const onSubmit = (values: any) => {
    updateCategoryMutation.mutate({ id: category.id, updates: values }, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Imagem da Categoria</FormLabel>
          <div className="mt-2">
            <ImageUploader onUpload={handleImageUpload} bucket="site-assets" />
          </div>
          {form.watch("image_url") && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
              <img src={form.watch("image_url")} alt="Preview" className="rounded-lg border w-full max-w-xs object-cover aspect-video" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onSuccess}>Cancelar</Button>
          <Button type="submit" disabled={updateCategoryMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateCategoryMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}