import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateSettings } from "@/hooks/useSettings";
import { Save, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface AboutSettingsProps {
  settings: any;
}

export function AboutSettings({ settings }: AboutSettingsProps) {
  const updateSettings = useUpdateSettings();

  const form = useForm({
    defaultValues: {
      about_page_content: {
        hero: { title: "", subtitle: "", location: "", image_url: "" },
        stats: [],
        mission_vision: { mission: "", vision: "" },
        values: [],
        timeline: [],
        team: [],
        certifications: [],
      },
    },
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control: form.control, name: "about_page_content.stats" });
  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({ control: form.control, name: "about_page_content.values" });
  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({ control: form.control, name: "about_page_content.timeline" });
  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({ control: form.control, name: "about_page_content.team" });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control: form.control, name: "about_page_content.certifications" });

  useEffect(() => {
    if (settings?.about_page_content) {
      const currentContent = settings.about_page_content;
      form.reset({
        about_page_content: {
          ...currentContent,
          // Garante que certificações seja um array de objetos para o formulário
          certifications: (currentContent.certifications || []).map((cert: string | { name: string }) => 
            typeof cert === 'string' ? { name: cert } : cert
          ),
        }
      });
    }
  }, [settings, form]);

  const onSubmit = (values: any) => {
    const processedContent = {
      ...values.about_page_content,
      // Converte certificações de volta para um array de strings
      certifications: values.about_page_content.certifications.map((c: { name: string }) => c.name),
    };
    updateSettings.mutate({ about_page_content: processedContent });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Hero Section */}
        <Card>
          <CardHeader><CardTitle>Seção Principal (Hero)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="about_page_content.hero.title" render={({ field }) => <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
            <FormField control={form.control} name="about_page_content.hero.subtitle" render={({ field }) => <FormItem><FormLabel>Subtítulo</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
            <FormField control={form.control} name="about_page_content.hero.location" render={({ field }) => <FormItem><FormLabel>Localização</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
            <FormItem>
              <FormLabel>Imagem de Fundo</FormLabel>
              <ImageUploader onUpload={(url) => form.setValue('about_page_content.hero.image_url', url)} bucket="site-assets" />
              {form.watch('about_page_content.hero.image_url') && <img src={form.watch('about_page_content.hero.image_url')} alt="Preview" className="mt-2 h-24 w-auto rounded" />}
            </FormItem>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader><CardTitle>Estatísticas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {statFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded">
                <FormField control={form.control} name={`about_page_content.stats.${index}.number`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <FormField control={form.control} name={`about_page_content.stats.${index}.label`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Rótulo</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeStat(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendStat({ number: "", label: "" })}><Plus className="h-4 w-4 mr-2" />Adicionar Estatística</Button>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader><CardTitle>Missão e Visão</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="about_page_content.mission_vision.mission" render={({ field }) => <FormItem><FormLabel>Missão</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
            <FormField control={form.control} name="about_page_content.mission_vision.vision" render={({ field }) => <FormItem><FormLabel>Visão</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card>
          <CardHeader><CardTitle>Nossos Valores</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {valueFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded">
                <div className="flex-1 space-y-2">
                  <FormField control={form.control} name={`about_page_content.values.${index}.title`} render={({ field }) => <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField control={form.control} name={`about_page_content.values.${index}.description`} render={({ field }) => <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeValue(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendValue({ title: "", description: "" })}><Plus className="h-4 w-4 mr-2" />Adicionar Valor</Button>
          </CardContent>
        </Card>
        
        {/* Timeline Section */}
        <Card>
          <CardHeader><CardTitle>Linha do Tempo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {timelineFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded">
                <div className="flex-1 space-y-2">
                  <FormField control={form.control} name={`about_page_content.timeline.${index}.year`} render={({ field }) => <FormItem><FormLabel>Ano</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField control={form.control} name={`about_page_content.timeline.${index}.title`} render={({ field }) => <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField control={form.control} name={`about_page_content.timeline.${index}.description`} render={({ field }) => <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeTimeline(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendTimeline({ year: "", title: "", description: "" })}><Plus className="h-4 w-4 mr-2" />Adicionar Evento</Button>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card>
          <CardHeader><CardTitle>Nossa Equipe</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {teamFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded">
                <div className="flex-1 space-y-2">
                  <FormField control={form.control} name={`about_page_content.team.${index}.title`} render={({ field }) => <FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField control={form.control} name={`about_page_content.team.${index}.subtitle`} render={({ field }) => <FormItem><FormLabel>Subtítulo</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  <FormField control={form.control} name={`about_page_content.team.${index}.description`} render={({ field }) => <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeTeam(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendTeam({ title: "", subtitle: "", description: "" })}><Plus className="h-4 w-4 mr-2" />Adicionar Membro</Button>
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader><CardTitle>Certificações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {certFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded">
                <FormField control={form.control} name={`about_page_content.certifications.${index}.name`} render={({ field }) => <FormItem className="flex-1"><FormLabel>Nome da Certificação</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <Button type="button" variant="destructive" size="sm" onClick={() => removeCert(index)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendCert({ name: "" })}><Plus className="h-4 w-4 mr-2" />Adicionar Certificação</Button>
          </CardContent>
        </Card>

        <Button type="submit" className="gradient-primary" disabled={updateSettings.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateSettings.isPending ? "Salvando..." : "Salvar Alterações da Página Sobre"}
        </Button>
      </form>
    </Form>
  );
}