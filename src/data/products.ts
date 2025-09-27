import { Product } from "@/types/products";
import smoothiesImage from "@/assets/category-smoothies.jpg";
import frozenImage from "@/assets/category-frozen.jpg";
import flavoredIceImage from "@/assets/category-flavored-ice.jpg";
import pescadosImage from "@/assets/category-pescados.jpg";

export const pulpProducts: Product[] = [
  {
    id: "polpa-acai",
    name: "Polpa de Açaí",
    description: "Polpa pura de açaí, rica em antioxidantes e vitaminas",
    price: 89.90,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: true,
    rating: 4.8,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  },
  {
    id: "polpa-manga",
    name: "Polpa de Manga",
    description: "Polpa natural de manga, doce e refrescante",
    price: 74.90,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: true,
    rating: 4.7,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  },
  {
    id: "polpa-caju",
    name: "Polpa de Caju",
    description: "Polpa de caju com sabor único e tropical",
    price: 85.40,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: false,
    rating: 4.6,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  },
  {
    id: "polpa-goiaba",
    name: "Polpa de Goiaba",
    description: "Polpa cremosa de goiaba, ideal para vitaminas",
    price: 82.80,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: true,
    rating: 4.9,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  },
  {
    id: "polpa-maracuja",
    name: "Polpa de Maracujá",
    description: "Polpa de maracujá com sabor intenso e natural",
    price: 79.90,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: true,
    rating: 4.8,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  },
  {
    id: "polpa-cupuacu",
    name: "Polpa de Cupuaçu",
    description: "Polpa exótica de cupuaçu, sabor amazônico único",
    price: 92.50,
    unit: "pacote",
    category: "polpas",
    image: smoothiesImage,
    available: true,
    rating: 4.7,
    packageInfo: {
      unitsPerPackage: 12,
      packagesPerBox: 4
    }
  }
];

export const frozenFruitProducts: Product[] = [
  {
    id: "acai-congelado",
    name: "Açaí Congelado",
    description: "Açaí puro congelado, ideal para açaí na tigela e smoothies",
    price: 45.90,
    unit: "kg",
    category: "frutas-congeladas",
    image: frozenImage,
    available: true,
    rating: 4.9
  },
  {
    id: "mix-frutas",
    name: "Mix de Frutas",
    description: "Mistura especial de frutas congeladas selecionadas",
    price: 38.90,
    unit: "kg",
    category: "frutas-congeladas",
    image: frozenImage,
    available: true,
    rating: 4.7
  },
  {
    id: "frutas-picadas",
    name: "Frutas Picadas",
    description: "Frutas frescas picadas e congeladas para praticidade",
    price: 28.50,
    unit: "kg",
    category: "frutas-congeladas",
    image: frozenImage,
    available: true,
    rating: 4.6
  },
  {
    id: "smoothie-packs",
    name: "Smoothie Packs",
    description: "Porções individuais de frutas para smoothies",
    price: 22.90,
    unit: "unidade",
    category: "frutas-congeladas",
    image: frozenImage,
    available: false,
    rating: 4.8
  }
];

export const flavoredIceProducts: Product[] = [
  {
    id: "gelo-limao",
    name: "Gelo Saborizado Limão",
    description: "Gelo com sabor natural de limão, refrescante e saboroso",
    price: 24.90,
    unit: "caixa",
    category: "gelo-saborizado",
    image: flavoredIceImage,
    available: true,
    rating: 4.5,
    packageInfo: {
      unitsPerBox: 30
    }
  },
  {
    id: "gelo-morango",
    name: "Gelo Saborizado Morango",
    description: "Gelo com sabor natural de morango, doce e refrescante",
    price: 26.90,
    unit: "caixa",
    category: "gelo-saborizado",
    image: flavoredIceImage,
    available: true,
    rating: 4.6,
    packageInfo: {
      unitsPerBox: 30
    }
  },
  {
    id: "gelo-maracuja",
    name: "Gelo Saborizado Maracujá",
    description: "Gelo com sabor tropical de maracujá",
    price: 27.90,
    unit: "caixa",
    category: "gelo-saborizado",
    image: flavoredIceImage,
    available: false,
    rating: 4.7,
    packageInfo: {
      unitsPerBox: 30
    }
  },
  {
    id: "gelo-abacaxi",
    name: "Gelo Saborizado Abacaxi",
    description: "Gelo com sabor tropical de abacaxi",
    price: 25.90,
    unit: "caixa",
    category: "gelo-saborizado",
    image: flavoredIceImage,
    available: true,
    rating: 4.4,
    packageInfo: {
      unitsPerBox: 30
    }
  }
];

export const seafoodProducts: Product[] = [
  {
    id: "tilapia",
    name: "Tilápia Fresca",
    description: "Tilápia fresca de qualidade, ideal para grelhados e assados",
    price: 24.90,
    unit: "kg",
    category: "pescados",
    image: pescadosImage,
    available: true,
    rating: 4.8
  },
  {
    id: "salmao",
    name: "Salmão Premium",
    description: "Salmão premium congelado, rico em ômega 3",
    price: 89.90,
    unit: "kg",
    category: "pescados",
    image: pescadosImage,
    available: true,
    rating: 4.9
  },
  {
    id: "camarao",
    name: "Camarão Selecionado",
    description: "Camarão selecionado, fresco e saboroso",
    price: 65.90,
    unit: "kg",
    category: "pescados",
    image: pescadosImage,
    available: false,
    rating: 4.7
  },
  {
    id: "polvo",
    name: "Polvo Congelado",
    description: "Polvo congelado de primeira qualidade",
    price: 78.50,
    unit: "kg",
    category: "pescados",
    image: pescadosImage,
    available: true,
    rating: 4.6
  }
];

export const allProducts = [
  ...pulpProducts,
  ...frozenFruitProducts,
  ...flavoredIceProducts,
  ...seafoodProducts
];