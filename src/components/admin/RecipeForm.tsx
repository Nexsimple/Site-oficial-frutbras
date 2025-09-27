import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/useRecipes";
import { ImageUploader } from "./ImageUploader";
import { Save } from "lucide-react";

const recipeSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  short_desc: z.string().optional(),
  long_desc: z.string().optional(),
  ingredients: z.string().optional(), // Usaremos string para o textarea
  instructions: z.string().optional(),
  prep_time: z.coerce.number().int().min(0).optional(),
  servings: z.coerce.number().int().min(0).optional(),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']).default('Fácil'),
  category: z.string().optional(),
  image_url: z.string().optional(),
  visible: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

interface RecipeFormProps {
  recipe?: any;
  onSuccess?: () => void;
}

export function RecipeForm({ recipe, onSuccess }: RecipeFormProps) {
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      slug: "",
      short_desc: "",
      long_desc: "",
      ingredients: "",
      instructions: "",
      prep_time: 0,
      servings: 0,
      difficulty: "Fácil",
      category: "",
      image_url: "",
      visible: true,
      is_featured: false,
    },
  });

  useEffect(() => {
    if (recipe) {
      form.reset({
        ...recipe,
        ingredients: recipe.ingredients?.join('\n') || "",
      });
    }
  }, [recipe, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!recipe) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    const processedValues = {
      ...values,
      ingredients: values.ingredients?.split('\n').filter(line => line.trim() !== ''),
    };

    try {
      if (recipe) {
        await updateRecipeMutation.mutateAsync({
          id: recipe.id,
          updates: processedValues,
        });
      } else {
        await createRecipeMutation.mutateAsync(processedValues);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-6">
          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Receita Visível</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Marcar como Destaque</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome da receita" 
                    {...field}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="url-amigavel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="short_desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Curta</FormLabel>
              <FormControl>
                <Input placeholder="Uma breve descrição da receita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Bebidas, Sobremesas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dificuldade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prep_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de Preparo (min)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rendimento (porções)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredientes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Um ingrediente por linha..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruções</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o passo a passo do preparo."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="long_desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Completa</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Uma descrição mais detalhada, se necessário."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Imagem da Receita</FormLabel>
          <div className="mt-2">
            <ImageUploader onUpload={(url) => form.setValue("image_url", url, { shouldDirty: true })} bucket="site-assets" />
          </div>
          {form.watch("image_url") && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
              <img src={form.watch("image_url")} alt="Preview" className="rounded-lg border w-full max-w-xs object-cover aspect-video" />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="gradient-primary"
            disabled={createRecipeMutation.isPending || updateRecipeMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {createRecipeMutation.isPending || updateRecipeMutation.isPending
              ? "Salvando..." 
              : recipe ? "Atualizar Receita" : "Criar Receita"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}