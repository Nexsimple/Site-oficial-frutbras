import CategoryPage from "@/components/CategoryPage";
import pescadosImage from "@/assets/category-pescados.jpg";

const Seafood = () => {
  return (
    <CategoryPage
      category="pescados"
      title="Pescados"
      description="Pescados frescos e congelados vendidos por quilograma"
      heroImage={pescadosImage}
      breadcrumbTitle="Pescados"
    />
  );
};

export default Seafood;