import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  bucket?: string; // Adicionando a propriedade bucket
}

export function ImageUploader({ onUpload, bucket = 'product-images' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket) // Usando o bucket dinâmico
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket) // Usando o bucket dinâmico
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error('Could not get public URL for the uploaded image.');
      }

      onUpload(data.publicUrl);
      toast({
        title: 'Upload concluído',
        description: 'A imagem foi enviada com sucesso.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Erro no upload',
        description: error.message || 'Não foi possível enviar a imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, toast, bucket]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Enviando...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="font-semibold">
            {isDragActive ? 'Solte a imagem aqui' : 'Arraste e solte ou clique para enviar'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, GIF, WEBP (Max 5MB)
          </p>
        </div>
      )}
    </div>
  );
}