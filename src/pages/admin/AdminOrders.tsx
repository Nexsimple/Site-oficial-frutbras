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
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrders";

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pending", label: "Pendente", icon: Package, color: "secondary" },
  { value: "confirmed", label: "Confirmado", icon: CheckCircle, color: "default" },
  { value: "delivered", label: "Entregue", icon: Truck, color: "default" },
  { value: "cancelled", label: "Cancelado", icon: XCircle, color: "destructive" },
];

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_info?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({
      id: orderId,
      status: newStatus as any
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrderMutation.mutate(orderId);
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
              {filteredOrders.length} pedido(s)
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
              {filteredOrders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      #{order.id?.slice(-8)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_info?.name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_info?.email || "N/A"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      R$ {order.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido #{order.id?.slice(-8)}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Cliente</h4>
                                  <div className="space-y-2 text-sm p-3 bg-muted rounded-md">
                                    <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedOrder.customer_info?.name || 'N/A'}</p>
                                    <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedOrder.customer_info?.email || 'N/A'}</p>
                                    <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedOrder.customer_info?.phone || 'N/A'}</p>
                                    <p className="flex items-center"><FileText className="h-4 w-4 mr-2 text-muted-foreground" /> {selectedOrder.customer_info?.document || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <h4 className="font-semibold">Endereço de Entrega</h4>
                                  <div className="space-y-2 text-sm p-3 bg-muted rounded-md">
                                    <p className="flex items-start"><MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" /> 
                                      {selectedOrder.customer_info?.street}, {selectedOrder.customer_info?.number} {selectedOrder.customer_info?.complement && `- ${selectedOrder.customer_info.complement}`}
                                    </p>
                                    <p className="flex items-center"><Home className="h-4 w-4 mr-2 text-muted-foreground" /> 
                                      {selectedOrder.customer_info?.neighborhood} - {selectedOrder.customer_info?.city}, {selectedOrder.customer_info?.state}
                                    </p>
                                    <p className="flex items-center"><Building className="h-4 w-4 mr-2 text-muted-foreground" /> 
                                      CEP: {selectedOrder.customer_info?.zipCode}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Status do Pedido</h4>
                                <Select 
                                  value={selectedOrder.status} 
                                  onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}
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
                                  {selectedOrder.items?.map((item: any, index: number) => (
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
                                    <span>R$ {selectedOrder.total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
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
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o pedido #{order.id?.slice(-8)}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOrder(order.id)}
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

          {filteredOrders.length === 0 && (
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