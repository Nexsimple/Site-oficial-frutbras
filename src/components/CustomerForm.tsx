import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, User, Mail, Phone, FileText, MapPin, Building, Home, Landmark } from "lucide-react";
import { CustomerInfo } from "@/types/products";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone é obrigatório (com DDD)"),
  document: z.string().min(11, "CPF ou CNPJ é obrigatório"),
  zipCode: z.string().regex(/^\d{8}$/, "CEP inválido. Digite 8 números."),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Bairro é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

const states = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

interface CustomerFormProps {
  onSubmit: (data: CustomerInfo) => void;
  isLoading: boolean;
}

export const CustomerForm = ({ onSubmit, isLoading }: CustomerFormProps) => {
  const [isCepLoading, setIsCepLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      document: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const handleCepBlur = async (cep: string) => {
    if (cep.length !== 8 || !/^\d{8}$/.test(cep)) return;
    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        form.setValue("street", data.logradouro);
        form.setValue("neighborhood", data.bairro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
        form.setFocus("number");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl><Input placeholder="Seu nome" {...field} className="pl-10" /></FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl><Input type="email" placeholder="seu@email.com" {...field} className="pl-10" /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone *</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl><Input placeholder="(00) 90000-0000" {...field} className="pl-10" /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="document" render={({ field }) => (
              <FormItem>
                <FormLabel>CPF / CNPJ *</FormLabel>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl><Input placeholder="Seu documento para faturamento" {...field} className="pl-10" /></FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="00000-000" {...field} onBlur={(e) => handleCepBlur(e.target.value)} className="pl-10" />
                      {isCepLoading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="street" render={({ field }) => (
              <FormItem>
                <FormLabel>Rua *</FormLabel>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl><Input placeholder="Nome da sua rua" {...field} className="pl-10" /></FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="number" render={({ field }) => <FormItem><FormLabel>Número *</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={form.control} name="complement" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Complemento</FormLabel><FormControl><Input placeholder="Apto, bloco, etc." {...field} /></FormControl><FormMessage /></FormItem>} />
            </div>
            <FormField control={form.control} name="neighborhood" render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl><Input placeholder="Seu bairro" {...field} className="pl-10" /></FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cidade *</FormLabel>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl><Input placeholder="Sua cidade" {...field} className="pl-10" /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {states.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar e Enviar Pedido
        </Button>
      </form>
    </Form>
  );
};