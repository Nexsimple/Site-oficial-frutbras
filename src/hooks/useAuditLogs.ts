import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  table_name: string;
  operation: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
  user_email?: string;
  created_at: string;
}

const auditLogsService = {
  async getAuditLogs(limit = 50) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getAuditLogsByTable(tableName: string, limit = 50) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getAuditLogsByRecord(tableName: string, recordId: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

export const useAuditLogs = (limit?: number) => {
  return useQuery({
    queryKey: ['audit-logs', limit],
    queryFn: () => auditLogsService.getAuditLogs(limit),
  });
};

export const useAuditLogsByTable = (tableName: string, limit?: number) => {
  return useQuery({
    queryKey: ['audit-logs', 'table', tableName, limit],
    queryFn: () => auditLogsService.getAuditLogsByTable(tableName, limit),
  });
};

export const useAuditLogsByRecord = (tableName: string, recordId: string) => {
  return useQuery({
    queryKey: ['audit-logs', 'record', tableName, recordId],
    queryFn: () => auditLogsService.getAuditLogsByRecord(tableName, recordId),
    enabled: !!tableName && !!recordId,
  });
};