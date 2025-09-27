import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateSettings } from "@/hooks/useSettings";
import { Save, CreditCard, Plus, X } from "lucide-react";

const defaultPaymentMethods = [
  { id: "pix", name: "PIX", enabled: true, icon: "💳" },
  { id: "credit", name: "Cartão de Crédito", enabled: true, icon: "💳" },
  { id: "debit", name: "Cartão de Débito", enabled: true, icon: "💳" },
  { id: "money", name: "Dinheiro", enabled: true, icon: "💰" },
  { id: "transfer", name: "Transferência", enabled: false, icon: "🏦" },
];

interface PaymentSettingsProps {
  settings: any;
}

export function PaymentSettings({ settings }: PaymentSettingsProps) {
  const updateSettings = useUpdateSettings();
  const [customMethod, setCustomMethod] = useState("");

  const form = useForm({
    defaultValues: {
      methods: [],
      delivery_fee: 0,
      minimum_order: 0,
      free_delivery_minimum: 0,
    },
  });

  useEffect(() => {
    const savedMethodNames: string[] = settings?.payment_methods || [];
    const defaultMethodNames = defaultPaymentMethods.map(m => m.name);

    const initialMethods = defaultPaymentMethods.map(method => ({
      ...method,
      enabled: savedMethodNames.includes(method.name)
    }));

    savedMethodNames.forEach(savedMethodName => {
      if (!defaultMethodNames.includes(savedMethodName)) {
        initialMethods.push({
          id: savedMethodName.toLowerCase().replace(/\s+/g, "_"),
          name: savedMethodName,
          enabled: true,
          icon: "💳"
        });
      }
    });

    form.reset({
      methods: initialMethods as any,
      delivery_fee: settings?.delivery_settings?.delivery_fee || 0,
      minimum_order: settings?.delivery_settings?.minimum_order || 0,
      free_delivery_minimum: settings?.delivery_settings?.free_delivery_minimum || 0,
    });
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings.mutate({
      payment_methods: values.methods.filter((m: any) => m.enabled).map((m: any) => m.name),
      delivery_settings: {
        delivery_fee: values.delivery_fee,
        minimum_order: values.minimum_order,
        free_delivery_minimum: values.free_delivery_minimum,
      }
    });
  };

  const addCustomMethod = () => {
    if (customMethod.trim()) {
      const currentMethods = form.getValues("methods");
      const newMethod = {
        id: customMethod.toLowerCase().replace(/\s+/g, "_"),
        name: customMethod,
        enabled: true,
        icon: "💳"
      };
      form.setValue("methods", [...currentMethods, newMethod] as any);
      setCustomMethod("");
    }
  };

  const removeMethod = (index: number) => {
    const currentMethods = form.getValues("methods");
    const newMethods = currentMethods.filter((_, i) => i !== index);
    form.setValue("methods", newMethods as any);
  };

  const toggleMethod = (index: number, enabled: boolean) => {
    const currentMethods = form.getValues("methods");
    const newMethods = [...currentMethods];
    newMethods[index] = { ...newMethods[index], enabled };
    form.setValue("methods", newMethods as any);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Métodos de Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("methods").map((method: any, index: number) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.enabled ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={method.enabled}
                      onCheckedChange={(enabled) => toggleMethod(index, !!enabled)}
                    />
                    {index >= defaultPaymentMethods.length && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMethod(index)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Nome do método personalizado"
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomMethod()}
                />
                <Button type="button" onClick={addCustomMethod}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="gradient-primary"
            disabled={updateSettings.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </form>
      </Form>
    </div>
  );
}