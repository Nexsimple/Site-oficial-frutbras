import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { usePedidos } from "@/hooks/usePedidos"; // Importar o hook usePedidos
import { mapStatusToUiLabel } from "@/lib/utils"; // Importar a função de mapeamento para labels

const AdminDashboard = () => {
  const { data: products = [] } = useProducts();
  const { data: pedidos = [] } = usePedidos(); // Usar usePedidos

  const todayOrders = pedidos.filter(pedido => {
    const today = new Date().toDateString();
    const orderDate = new Date(pedido.created_at).toDateString();
    return today === orderDate;
  });

  const totalRevenue = pedidos
    .filter(pedido => pedido.status === 'delivered') // Usar status 'delivered' (inglês)
    .reduce((sum, pedido) => sum + (pedido.valor_total || 0), 0);

  const stats = [
    {
      title: "Total de Produtos",
      value: products.length.toString(),
      icon: Package,
      change: `${products.filter(p => p.visible).length} ativos`,
      changeType: "info"
    },
    {
      title: "Pedidos Hoje",
      value: todayOrders.length.toString(),
      icon: ShoppingCart,
      change: `${pedidos.filter(o => o.status === 'pending').length} pendentes`, // Usar status 'pending' (inglês)
      changeType: "warning"
    },
    {
      title: "Total de Pedidos", 
      value: pedidos.length.toString(),
      icon: Users,
      change: `${pedidos.filter(o => o.status === 'delivered').length} entregues`, // Usar status 'delivered' (inglês)
      changeType: "positive"
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: `${pedidos.filter(o => o.status === 'delivered').length} pedidos`, // Usar status 'delivered' (inglês)
      changeType: "positive"
    }
  ];

  const recentActivities = [
    ...pedidos.slice(0, 4).map(pedido => ({
      action: `Pedido #${pedido.numero_pedido} - ${mapStatusToUiLabel(pedido.status)}`, // Usar mapStatusToUiLabel para exibir
      time: new Date(pedido.created_at).toLocaleDateString('pt-BR'),
      status: pedido.status
    }))
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <Badge 
                      variant={
                        stat.changeType === 'positive' ? 'default' :
                        stat.changeType === 'warning' ? 'secondary' : 'outline'
                      }
                      className="text-xs mt-2"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === 'delivered' ? 'default' : // Usar status 'delivered'
                    activity.status === 'pending' ? 'secondary' : // Usar status 'pending'
                    activity.status === 'confirmed' ? 'default' : 'destructive' // Usar status 'confirmed' e 'cancelled'
                  }>
                    {mapStatusToUiLabel(activity.status)} {/* Exibe o label em português */}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;