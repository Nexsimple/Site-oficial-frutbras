import CategoryPage from "@/components/CategoryPage";
import smoothiesImage from "@/assets/category-smoothies.jpg";

const PulpProducts = () => {
  return (
    <CategoryPage
      category="polpas"
      title="Polpas de Frutas"
      description="Pacotes de 12 unidades - Caixa com 4 pacotes (48un total)"
      heroImage={smoothiesImage}
      breadcrumbTitle="Polpas de Frutas"
    />
  );
};

export default PulpProducts;