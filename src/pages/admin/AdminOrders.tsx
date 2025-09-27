import { useState } from "react";
import { Search, Eye, Package, Truck, CheckCircle, XCircle, User, Mail, Phone, Building, Trash2, MapPin, Home, FileText } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePedidos, useAtualizarStatusPedido, useExcluirPedido } from "@/hooks/usePedidos"; // Alterado para usePedidos

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pendente", label: "Pendente", icon: Package, color: "secondary" },
  { value: "confirmado", label: "Confirmado", icon: CheckCircle, color: "default" },
  { value: "entregue", label: "Entregue", icon: Truck, color: "default" },
  { value: "cancelado", label: "Cancelado", icon: XCircle, color: "destructive" },
];

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPedido, setSelectedPedido] = useState<any>(null); // Renomeado para selectedPedido

  const { data: pedidos = [], isLoading } = usePedidos(); // Alterado para usePedidos e 'pedidos'
  const atualizarStatusPedidoMutation = useAtualizarStatusPedido(); // Alterado para useAtualizarStatusPedido
  const excluirPedidoMutation = useExcluirPedido(); // Alterado para useExcluirPedido

  const filteredPedidos = pedidos.filter((pedido: any) => { // Alterado para 'pedidos'
    const matchesSearch = pedido.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.cliente_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // Alterado para cliente_info
                         pedido.cliente_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()); // Alterado para cliente_info
    
    const matchesStatus = statusFilter === "all" || pedido.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (pedidoId: string, newStatus: string) => { // Alterado para 'pedidoId'
    atualizarStatusPedidoMutation.mutate({ // Alterado para atualizarStatusPedidoMutation
      id: pedidoId,
      status: newStatus as any
    });
  };

  const handleDeletePedido = (pedidoId: string) => { // Alterado para 'pedidoId'
    excluirPedidoMutation.mutate(pedidoId); // Alterado para excluirPedidoMutation
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return null;

    return (
      <Badge variant={statusOption.color as any}>
        {statusOption.icon && <statusOption.icon className="h-3 w-3 mr-1" />}
        {statusOption.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie todos os pedidos da loja</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, cliente ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="secondary">
              {filteredPedidos.length} pedido(s)
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.map((pedido: any) => ( // Alterado para 'pedido'
                <TableRow key={pedido.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      #{pedido.id?.slice(-8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pedido.cliente_info?.name || "N/A"}</p> {/* Alterado para cliente_info */}
                      <p className="text-sm text-muted-foreground">{pedido.cliente_info?.email || "N/A"}</p> {/* Alterado para cliente_info */}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      R$ {pedido.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'} {/* Alterado para valor_total */}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(pedido.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPedido(pedido)} // Alterado para setSelectedPedido
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido #{pedido.id?.slice(-8)}</DialogTitle>
                          </DialogHeader>
                          {selectedPedido && ( // Alterado para selectedPedido
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Cliente</h4>
                                  <div className="space-y-2 text-sm p-3 bg-muted rounded-md">
                                    <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedPedido.cliente_info?.name || 'N/A'}</p> {/* Alterado para cliente_info */}
                                    <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedPedido.cliente_info?.email || 'N/A'}</p> {/* Alterado para cliente_info */}
                                    <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedPedido.cliente_info?.phone || 'N/A'}</p> {/* Alterado para cliente_info */}
                                    <p className="flex items-center"><FileText className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedPedido.cliente_info?.document || 'N/A'}</p> {/* Alterado para cliente_info */}
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Endereço de Entrega</h4>
                                  <div className="space-y-2 text-sm p-3 bg-muted rounded-md">
                                    <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" /> 
                                      {selectedPedido.cliente_info?.street}, {selectedPedido.cliente_info?.number} {selectedPedido.cliente_info?.complement && `- ${selectedPedido.cliente_info.complement}`} {/* Alterado para cliente_info */}
                                    </p>
                                    <p className="flex items-center"><Home className="h-4 w-4 mr-2 text-muted-foreground" /> 
                                      {selectedPedido.cliente_info?.neighborhood} - {selectedPedido.cliente_info?.city}, {selectedPedido.cliente_info?.state} {/* Alterado para cliente_info */}
                                    </p>
                                    <p className="flex items-center"><Building className="h-4 w-4 mr-2 text-muted-foreground" /> 
                                      CEP: {selectedPedido.cliente_info?.zipCode} {/* Alterado para cliente_info */}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Status do Pedido</h4>
                                <Select 
                                  value={selectedPedido.status} 
                                  onValueChange={(value) => handleStatusUpdate(selectedPedido.id, value)}
                                >
                                  <SelectTrigger className="w-full md:w-1/2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.slice(1).map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                                <div className="space-y-2 border rounded-md">
                                  {selectedPedido.itens?.map((item: any, index: number) => ( // Alterado para 'itens'
                                    <div key={index} className="flex justify-between p-3 text-sm border-b last:border-b-0">
                                      <div>
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity} ({item.unit})</p>
                                      </div>
                                      <span className="font-medium">R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between font-bold p-3 bg-muted rounded-b-md">
                                    <span>Total:</span>
                                    <span>R$ {selectedPedido.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> {/* Alterado para valor_total */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o pedido #{pedido.id?.slice(-8)}? Esta ação não pode ser desfeita. {/* Alterado para 'pedido' */}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePedido(pedido.id)} // Alterado para handleDeletePedido
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPedidos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" ? "Nenhum pedido encontrado" : "Nenhum pedido cadastrado"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;