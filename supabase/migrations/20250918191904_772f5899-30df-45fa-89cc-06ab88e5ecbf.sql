-- Criar tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para audit_logs
CREATE POLICY "Authenticated users can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Função para criar logs de auditoria
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  user_email_val TEXT;
BEGIN
  -- Tentar obter o email do usuário autenticado
  SELECT email INTO user_email_val 
  FROM auth.users 
  WHERE id = auth.uid();

  -- Inserir log baseado na operação
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, new_data, user_email)
    VALUES (TG_TABLE_NAME, 'INSERT', NEW.id::TEXT, to_jsonb(NEW), user_email_val);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, new_data, user_email)
    VALUES (TG_TABLE_NAME, 'UPDATE', NEW.id::TEXT, to_jsonb(OLD), to_jsonb(NEW), user_email_val);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, user_email)
    VALUES (TG_TABLE_NAME, 'DELETE', OLD.id::TEXT, to_jsonb(OLD), user_email_val);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers para auditoria
CREATE TRIGGER audit_products_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_settings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

CREATE TRIGGER audit_orders_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.create_audit_log();

-- Habilitar realtime para todas as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;

-- Configurar REPLICA IDENTITY para capturar dados completos
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.settings REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;