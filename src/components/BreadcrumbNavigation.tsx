import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
}

const BreadcrumbNavigation = ({ items }: BreadcrumbNavigationProps) => {
  return (
    <div className="flex items-center gap-2 mb-8 text-sm animate-fade-in">
      <Link 
        to="/" 
        className="text-primary hover:underline flex items-center gap-1 transition-smooth hover-scale"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="text-primary hover:underline transition-smooth"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbNavigation;