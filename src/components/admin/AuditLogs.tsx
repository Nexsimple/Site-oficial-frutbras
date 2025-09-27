import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Activity, Search } from "lucide-react";
import { useAuditLogs, type AuditLog } from "@/hooks/useAuditLogs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [operationFilter, setOperationFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: auditLogs = [], isLoading } = useAuditLogs(200);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTable = tableFilter === "all" || log.table_name === tableFilter;
    const matchesOperation = operationFilter === "all" || log.operation === operationFilter;
    
    return matchesSearch && matchesTable && matchesOperation;
  });

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return 'default';
      case 'UPDATE':
        return 'secondary';
      case 'DELETE':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatJsonData = (data: any) => {
    if (!data) return 'N/A';
    return JSON.stringify(data, null, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Logs de Auditoria</span>
          </CardTitle>
          <CardDescription>
            Histórico completo de todas as operações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, tabela ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={tableFilter} onValueChange={setTableFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tabelas</SelectItem>
                <SelectItem value="products">Produtos</SelectItem>
                <SelectItem value="settings">Configurações</SelectItem>
                <SelectItem value="orders">Pedidos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as operações</SelectItem>
                <SelectItem value="INSERT">Criação</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center">
              <Badge variant="outline" className="text-xs">
                {filteredLogs.length} registros
              </Badge>
            </div>
          </div>

          {/* Tabela de Logs */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tabela</TableHead>
                  <TableHead>Operação</TableHead>
                  <TableHead>ID do Registro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', {
                          locale: ptBR
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.user_email || 'Sistema'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.table_name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOperationColor(log.operation)}>
                          {log.operation}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.record_id.slice(-8)}...
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum log encontrado com os filtros aplicados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data/Hora:</label>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedLog.created_at), 'dd/MM/yyyy HH:mm:ss', {
                      locale: ptBR
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Usuário:</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedLog.user_email || 'Sistema'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Tabela:</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.table_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Operação:</label>
                  <Badge variant={getOperationColor(selectedLog.operation)}>
                    {selectedLog.operation}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">ID do Registro:</label>
                <p className="text-sm font-mono text-muted-foreground">{selectedLog.record_id}</p>
              </div>

              {selectedLog.old_data && (
                <div>
                  <label className="text-sm font-medium">Dados Anteriores:</label>
                  <pre className="text-xs bg-muted p-3 rounded-md mt-1 overflow-x-auto">
                    {formatJsonData(selectedLog.old_data)}
                  </pre>
                </div>
              )}

              {selectedLog.new_data && (
                <div>
                  <label className="text-sm font-medium">Dados Novos:</label>
                  <pre className="text-xs bg-muted p-3 rounded-md mt-1 overflow-x-auto">
                    {formatJsonData(selectedLog.new_data)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;