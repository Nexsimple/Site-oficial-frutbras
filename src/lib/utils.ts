import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Database } from "@/integrations/supabase/types"; // Import Database type

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define o tipo para o status do pedido do banco de dados
type OrderStatusDB = Database['public']['Enums']['order_status'];

// Mapeia o status da UI (Português) para o status do DB (Inglês)
export const mapStatusToDb = (uiStatus: string): OrderStatusDB => {
  switch (uiStatus) {
    case 'pendente': return 'pending';
    case 'confirmado': return 'confirmed';
    case 'entregue': return 'delivered';
    case 'cancelado': return 'cancelled';
    default: return 'pending'; // Valor padrão ou tratamento de erro
  }
};

// Mapeia o status do DB (Inglês) para o label da UI (Português)
export const mapStatusToUiLabel = (dbStatus: OrderStatusDB): string => {
  switch (dbStatus) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmado';
    case 'delivered': return 'Entregue';
    case 'cancelled': return 'Cancelado';
    default: return 'Desconhecido';
  }
};

// Mapeia o status do DB (Inglês) para o valor da UI (Português para selects)
export const mapStatusToUiValue = (dbStatus: OrderStatusDB): string => {
  switch (dbStatus) {
    case 'pending': return 'pendente';
    case 'confirmed': return 'confirmado';
    case 'delivered': return 'entregue';
    case 'cancelled': return 'cancelado';
    default: return 'pendente';
  }
};