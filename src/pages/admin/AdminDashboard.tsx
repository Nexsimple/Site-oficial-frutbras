import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";

const AdminDashboard = () => {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.created_at).toDateString();
    return today === orderDate;
  });

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total || 0), 0);

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
      change: `${orders.filter(o => o.status === 'pending').length} pendentes`,
      changeType: "warning"
    },
    {
      title: "Total de Pedidos", 
      value: orders.length.toString(),
      icon: Users,
      change: `${orders.filter(o => o.status === 'delivered').length} entregues`,
      changeType: "positive"
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      change: `${orders.filter(o => o.status === 'delivered').length} pedidos`,
      changeType: "positive"
    }
  ];

  const recentActivities = [
    ...orders.slice(0, 4).map(order => ({
      action: `Pedido #${order.id?.slice(-6)} - ${order.status}`,
      time: new Date(order.created_at).toLocaleDateString('pt-BR'),
      status: order.status
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
                    activity.status === 'delivered' ? 'default' : 
                    activity.status === 'pending' ? 'secondary' : 'outline'
                  }>
                    {activity.status === 'delivered' ? 'Entregue' :
                     activity.status === 'pending' ? 'Pendente' :
                     activity.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
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