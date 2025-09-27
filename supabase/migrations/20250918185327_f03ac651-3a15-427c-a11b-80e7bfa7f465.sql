-- Insert existing products from static data into the database

-- Polpas de Frutas
INSERT INTO public.products (
  title, slug, short_desc, long_desc, price, stock, category, images, visible, specs
) VALUES
  ('Polpa de Açaí', 'polpa-acai', 'Polpa pura de açaí, rica em antioxidantes e vitaminas', 'Polpa pura de açaí, rica em antioxidantes e vitaminas. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 89.90, 100, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.8, "unit": "pacote"}'),
  ('Polpa de Manga', 'polpa-manga', 'Polpa natural de manga, doce e refrescante', 'Polpa natural de manga, doce e refrescante. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 74.90, 120, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.7, "unit": "pacote"}'),
  ('Polpa de Caju', 'polpa-caju', 'Polpa de caju com sabor único e tropical', 'Polpa de caju com sabor único e tropical. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 85.40, 0, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.6, "unit": "pacote"}'),
  ('Polpa de Goiaba', 'polpa-goiaba', 'Polpa cremosa de goiaba, ideal para vitaminas', 'Polpa cremosa de goiaba, ideal para vitaminas. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 82.80, 80, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.9, "unit": "pacote"}'),
  ('Polpa de Maracujá', 'polpa-maracuja', 'Polpa de maracujá com sabor intenso e natural', 'Polpa de maracujá com sabor intenso e natural. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 79.90, 90, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.8, "unit": "pacote"}'),
  ('Polpa de Cupuaçu', 'polpa-cupuacu', 'Polpa exótica de cupuaçu, sabor amazônico único', 'Polpa exótica de cupuaçu, sabor amazônico único. Pacote com 12 unidades. Caixa com 4 pacotes (48un total)', 92.50, 60, 'polpas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-smoothies.jpg"]', true, '{"packageInfo": {"unitsPerPackage": 12, "packagesPerBox": 4}, "rating": 4.7, "unit": "pacote"}');

-- Frutas Congeladas
INSERT INTO public.products (
  title, slug, short_desc, long_desc, price, stock, category, images, visible, specs
) VALUES
  ('Açaí Congelado', 'acai-congelado', 'Açaí puro congelado, ideal para açaí na tigela e smoothies', 'Açaí puro congelado, ideal para açaí na tigela e smoothies. Vendido por quilograma', 45.90, 200, 'frutas-congeladas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-frozen.jpg"]', true, '{"rating": 4.9, "unit": "kg"}'),
  ('Mix de Frutas', 'mix-frutas', 'Mistura especial de frutas congeladas selecionadas', 'Mistura especial de frutas congeladas selecionadas. Vendido por quilograma', 38.90, 150, 'frutas-congeladas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-frozen.jpg"]', true, '{"rating": 4.7, "unit": "kg"}'),
  ('Frutas Picadas', 'frutas-picadas', 'Frutas frescas picadas e congeladas para praticidade', 'Frutas frescas picadas e congeladas para praticidade. Vendido por quilograma', 28.50, 180, 'frutas-congeladas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-frozen.jpg"]', true, '{"rating": 4.6, "unit": "kg"}'),
  ('Smoothie Packs', 'smoothie-packs', 'Porções individuais de frutas para smoothies', 'Porções individuais de frutas para smoothies. Vendido por unidade', 22.90, 0, 'frutas-congeladas', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-frozen.jpg"]', true, '{"rating": 4.8, "unit": "unidade"}');

-- Gelo Saborizado
INSERT INTO public.products (
  title, slug, short_desc, long_desc, price, stock, category, images, visible, specs
) VALUES
  ('Gelo Saborizado Limão', 'gelo-limao', 'Gelo com sabor natural de limão, refrescante e saboroso', 'Gelo com sabor natural de limão, refrescante e saboroso. Caixa com 30 unidades', 24.90, 120, 'gelo-saborizado', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-flavored-ice.jpg"]', true, '{"packageInfo": {"unitsPerBox": 30}, "rating": 4.5, "unit": "caixa"}'),
  ('Gelo Saborizado Morango', 'gelo-morango', 'Gelo com sabor natural de morango, doce e refrescante', 'Gelo com sabor natural de morango, doce e refrescante. Caixa com 30 unidades', 26.90, 100, 'gelo-saborizado', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-flavored-ice.jpg"]', true, '{"packageInfo": {"unitsPerBox": 30}, "rating": 4.6, "unit": "caixa"}'),
  ('Gelo Saborizado Maracujá', 'gelo-maracuja', 'Gelo com sabor tropical de maracujá', 'Gelo com sabor tropical de maracujá. Caixa com 30 unidades', 27.90, 0, 'gelo-saborizado', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-flavored-ice.jpg"]', true, '{"packageInfo": {"unitsPerBox": 30}, "rating": 4.7, "unit": "caixa"}'),
  ('Gelo Saborizado Abacaxi', 'gelo-abacaxi', 'Gelo com sabor tropical de abacaxi', 'Gelo com sabor tropical de abacaxi. Caixa com 30 unidades', 25.90, 80, 'gelo-saborizado', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-flavored-ice.jpg"]', true, '{"packageInfo": {"unitsPerBox": 30}, "rating": 4.4, "unit": "caixa"}');

-- Pescados
INSERT INTO public.products (
  title, slug, short_desc, long_desc, price, stock, category, images, visible, specs
) VALUES
  ('Tilápia Fresca', 'tilapia', 'Tilápia fresca de qualidade, ideal para grelhados e assados', 'Tilápia fresca de qualidade, ideal para grelhados e assados. Vendido por quilograma', 24.90, 50, 'pescados', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-pescados.jpg"]', true, '{"rating": 4.8, "unit": "kg"}'),
  ('Salmão Premium', 'salmao', 'Salmão premium congelado, rico em ômega 3', 'Salmão premium congelado, rico em ômega 3. Vendido por quilograma', 89.90, 30, 'pescados', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-pescados.jpg"]', true, '{"rating": 4.9, "unit": "kg"}'),
  ('Camarão Selecionado', 'camarao', 'Camarão selecionado, fresco e saboroso', 'Camarão selecionado, fresco e saboroso. Vendido por quilograma', 65.90, 0, 'pescados', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-pescados.jpg"]', true, '{"rating": 4.7, "unit": "kg"}'),
  ('Polvo Congelado', 'polvo', 'Polvo congelado de primeira qualidade', 'Polvo congelado de primeira qualidade. Vendido por quilograma', 78.50, 25, 'pescados', '["https://cxapvtqxbeentcfvwuel.supabase.co/storage/v1/object/public/products/category-pescados.jpg"]', true, '{"rating": 4.6, "unit": "kg"}');