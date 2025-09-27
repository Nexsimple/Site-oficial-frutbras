import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const CategoryNavigation = () => {
  const location = useLocation();
  
  const categories = [
    { name: "Polpas", path: "/produtos/polpas-de-frutas", active: "polpas-de-frutas" },
    { name: "Frutas", path: "/produtos/frutas-congeladas", active: "frutas-congeladas" },
    { name: "Gelo", path: "/produtos/gelo-saborizado", active: "gelo-saborizado" },
    { name: "Pescados", path: "/produtos/pescados", active: "pescados" }
  ];

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8">
      {categories.map((category) => {
        const isActive = location.pathname.includes(category.active);
        return (
          <Link key={category.active} to={category.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`
                transition-smooth hover-scale font-medium px-6 py-2
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "text-foreground hover:text-primary hover:bg-primary/10"
                }
              `}
            >
              {category.name}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryNavigation;