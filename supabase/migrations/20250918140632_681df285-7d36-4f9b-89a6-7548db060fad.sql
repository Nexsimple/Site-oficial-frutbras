-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  short_desc TEXT,
  long_desc TEXT,
  specs JSONB DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  visible BOOLEAN DEFAULT true,
  seo_meta JSONB DEFAULT '{}',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'delivered', 'cancelled');

CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status order_status NOT NULL DEFAULT 'pending',
  customer_info JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT DEFAULT 'Brasfrut',
  logo TEXT,
  seo_default JSONB DEFAULT '{}',
  payment_methods TEXT[] DEFAULT '{"PIX", "Cartão", "Boleto", "Dinheiro"}',
  colors JSONB DEFAULT '{}',
  policies TEXT,
  whatsapp TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (visible = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL 
TO authenticated 
USING (true);

-- RLS Policies for orders
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
USING (true);

CREATE POLICY "Authenticated users can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated 
USING (true);

-- RLS Policies for settings
CREATE POLICY "Settings are viewable by everyone" 
ON public.settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage settings" 
ON public.settings 
FOR ALL 
TO authenticated 
USING (true);

-- Create storage bucket for products
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policies for products bucket
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated users can update product images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'products');

CREATE POLICY "Authenticated users can delete product images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'products');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (site_name, seo_default, colors) VALUES (
  'Brasfrut',
  '{"title": "Brasfrut - Polpas de Frutas e Produtos Congelados", "description": "Os melhores produtos congelados, polpas de frutas e pescados frescos."}',
  '{"primary": "hsl(142, 72%, 29%)", "secondary": "hsl(142, 72%, 94%)"}'
);