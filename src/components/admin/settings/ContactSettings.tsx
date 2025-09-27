import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Save, Phone } from "lucide-react";

interface ContactSettingsProps {
  settings: any;
}

export function ContactSettings({ settings }: ContactSettingsProps) {
  const updateSettings = useUpdateSettings();

  const form = useForm({
    defaultValues: {
      phone: settings?.phone || "",
      whatsapp: settings?.whatsapp || "",
      email: settings?.email || "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        email: settings.email || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: any) => {
    updateSettings.mutate({
      phone: values.phone,
      whatsapp: values.whatsapp,
      email: values.email,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Informações de Contato</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número para contato via WhatsApp
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Principal</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contato@brasfrut.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="gradient-primary"
          disabled={updateSettings.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? "Salvando..." : "Salvar Contato"}
        </Button>
      </form>
    </Form>
  );
}