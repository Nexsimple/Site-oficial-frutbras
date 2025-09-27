export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // "pacote", "caixa", "kg", "unidade"
  category: "polpas" | "frutas-congeladas" | "gelo-saborizado" | "pescados";
  image: string;
  available: boolean;
  rating: number;
  packageInfo?: {
    unitsPerPackage?: number; // para polpas: 12 unidades por pacote
    packagesPerBox?: number;  // para polpas: 4 pacotes por caixa (48 total)
    unitsPerBox?: number;     // para gelo: 30 unidades por caixa
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption: "pacote" | "caixa" | "kg" | "unidade";
}

export interface Cart {
  items: CartItem[];
  total: number;
  totalItems: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  time: string;
  servings: string;
  rating: number;
  category: "drinks" | "sobremesas" | "mix-frutas";
  ingredients: string[];
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF ou CNPJ
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}