import { useState, useEffect } from "react";
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
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { Link as LinkIcon, X } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

const productSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  short_desc: z.string().optional(),
  long_desc: z.string().optional(),
  price: z.number().min(0, "Preço deve ser maior que 0"),
  stock: z.number().int().min(0, "Estoque deve ser maior ou igual a 0"),
  category: z.string().optional(),
  visible: z.boolean().default(true),
  images: z.array(z.string()).default([]),
  specs: z.object({
    unit: z.string().optional(),
  }).optional(),
});

const categories = [
  "polpas",
  "frutas-congeladas",
  "gelo-saborizado",
  "pescados",
];

const units = [
  "unidade",
  "pacote",
  "caixa",
  "kg",
];

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      short_desc: "",
      long_desc: "",
      price: 0,
      stock: 0,
      category: "",
      visible: true,
      images: [],
      specs: {
        unit: "unidade",
      },
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || "",
        slug: product.slug || "",
        short_desc: product.short_desc || "",
        long_desc: product.long_desc || "",
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || "",
        visible: product.visible ?? true,
        images: product.images || [],
        specs: {
          unit: product.specs?.unit || "unidade",
        },
      });
      setImageUrls(product.images || []);
    }
  }, [product, form]);

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
    if (!product) {
      form.setValue("slug", generateSlug(title));
    }
  };

  const handleImageUpload = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    form.setValue("images", newUrls, { shouldDirty: true });
  };

  const addImageUrlFromPrompt = () => {
    const url = prompt("Digite a URL da imagem:");
    if (url) {
      handleImageUpload(url);
    }
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue("images", newUrls, { shouldDirty: true });
  };

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      if (product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          updates: values,
        });
      } else {
        await createProductMutation.mutateAsync(values);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do produto" 
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

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specs.unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade de Venda</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 pt-8">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Produto Visível</FormLabel>
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
                <Input placeholder="Descrição breve do produto" {...field} />
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
                  placeholder="Descrição detalhada do produto"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Imagens</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader onUpload={handleImageUpload} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-muted-foreground">Ou</p>
              <Button type="button" variant="outline" onClick={addImageUrlFromPrompt} className="w-full">
                <LinkIcon className="h-4 w-4 mr-2" />
                Adicionar por URL
              </Button>
            </div>
          </div>
          
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Produto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
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
            disabled={createProductMutation.isPending || updateProductMutation.isPending}
          >
            {createProductMutation.isPending || updateProductMutation.isPending
              ? "Salvando..." 
              : product ? "Atualizar Produto" : "Criar Produto"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}