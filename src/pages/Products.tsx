import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsSection from "@/components/ProductsSection";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Products;