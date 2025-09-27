import CategoryPage from "@/components/CategoryPage";
import flavoredIceImage from "@/assets/category-flavored-ice.jpg";

const FlavoredIce = () => {
  return (
    <CategoryPage
      category="gelo-saborizado"
      title="Gelo Saborizado"
      description="Caixas com 30 unidades de gelo saborizado"
      heroImage={flavoredIceImage}
      breadcrumbTitle="Gelo Saborizado"
    />
  );
};

export default FlavoredIce;