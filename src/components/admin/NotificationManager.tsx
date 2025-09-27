import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle, AlertCircle, Info, Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  persistent?: boolean;
}

const NotificationManager = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitorar conexão online/offline
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        title: 'Conexão restaurada',
        message: 'Sincronização em tempo real ativa novamente.'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        title: 'Conexão perdida',
        message: 'Trabalhando offline. Alterações serão sincronizadas quando a conexão for restaurada.',
        persistent: true
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitorar erros de sincronização do Supabase
  useEffect(() => {
    const channel = supabase.channel('sync-errors');
    
    // Escutar por erros de conexão
    const handleError = (error: any) => {
      console.error('Supabase sync error:', error);
      addNotification({
        type: 'error',
        title: 'Erro de sincronização',
        message: 'Falha ao sincronizar dados. Verifique sua conexão.',
        persistent: true
      });
    };

    // Monitor de status de conexão do Supabase
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from('settings').select('id').limit(1);
        if (error) throw error;
      } catch (error) {
        handleError(error);
      }
    };

    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkSupabaseConnection, 30000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Manter apenas 5 notificações

    // Auto remove não-persistentes após 5 segundos
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getVariant = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Status de conexão */}
      <Card className="border shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {isOnline ? "Sincronização ativa" : "Modo offline"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      {notifications.map((notification) => (
        <Alert key={notification.id} variant={getVariant(notification.type)} className="shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{notification.title}</div>
                <AlertDescription className="text-xs mt-1">
                  {notification.message}
                </AlertDescription>
                <div className="text-xs text-muted-foreground mt-1">
                  {notification.timestamp.toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default NotificationManager;