import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAllProducts, useDeleteProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/hooks/use-toast";

const SortableProductRow = ({ product, children }: { product: any, children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes}>
      <TableCell className="cursor-grab touch-none" {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </TableCell>
      {children}
    </TableRow>
  );
};

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { data: products = [], isLoading } = useAllProducts();
  const [productList, setProductList] = useState(products);
  
  const { data: categories = [] } = useCategories();
  const deleteProductMutation = useDeleteProduct();
  const updateProductMutation = useUpdateProduct();
  const { toast } = useToast();

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const filteredProducts = productList.filter((product: any) => {
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleToggleVisibility = async (product: any) => {
    updateProductMutation.mutate({
      id: product.id,
      updates: { visible: !product.visible }
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = productList.findIndex((p) => p.id === active.id);
      const newIndex = productList.findIndex((p) => p.id === over.id);
      
      const reorderedProducts = arrayMove(productList, oldIndex, newIndex);
      setProductList(reorderedProducts);

      const updatePromises = reorderedProducts.map((product, index) => {
        if (product.position !== index) {
          return updateProductMutation.mutateAsync({
            id: product.id,
            updates: { position: index },
            quiet: true,
          });
        }
        return Promise.resolve();
      });

      Promise.all(updatePromises).then(() => {
        toast({
          title: "Ordem atualizada",
          description: "A nova ordem dos produtos foi salva com sucesso.",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos da loja</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Produto</DialogTitle>
            </DialogHeader>
            <ProductForm 
              onSuccess={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary">
              {filteredProducts.length} produto(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={filteredProducts.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {filteredProducts.map((product: any) => (
                    <SortableProductRow key={product.id} product={product}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.title}</p>
                            <p className="text-sm text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category || "Sem categoria"}</Badge>
                      </TableCell>
                      <TableCell>
                        R$ {product.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                          {product.stock} unidades
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.visible ? 'default' : 'secondary'}>
                          {product.visible ? 'Visível' : 'Oculto'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(product)}
                          >
                            {product.visible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar Produto</DialogTitle>
                              </DialogHeader>
                              {editingProduct && (
                                <ProductForm 
                                  product={editingProduct}
                                  onSuccess={() => setEditingProduct(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </SortableProductRow>
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;