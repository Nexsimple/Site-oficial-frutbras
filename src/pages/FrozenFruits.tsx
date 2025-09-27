import CategoryPage from "@/components/CategoryPage";
import frozenImage from "@/assets/category-frozen.jpg";

const FrozenFruits = () => {
  return (
    <CategoryPage
      category="frutas-congeladas"
      title="Frutas Congeladas"
      description="Frutas congeladas vendidas por quilograma"
      heroImage={frozenImage}
      breadcrumbTitle="Frutas Congeladas"
    />
  );
};

export default FrozenFruits;