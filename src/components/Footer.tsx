import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex flex-col mb-6">
              <h3 className="text-2xl font-bold">Frutbras</h3>
              <p className="text-sm text-white/80">Alimentos Congelados</p>
            </div>
            
            <p className="text-white/90 mb-6 leading-relaxed">
              Há mais de 15 anos oferecendo produtos de qualidade superior. 
              Especialistas em polpas de frutas, pescados e alimentos congelados.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Produtos</h4>
            <ul className="space-y-3">
              <li><a href="/produtos/polpas-de-frutas" className="text-white/80 hover:text-accent transition-colors">Polpas de Frutas</a></li>
              <li><a href="/produtos/frutas-congeladas" className="text-white/80 hover:text-accent transition-colors">Frutas Frescas</a></li>
              <li><a href="/produtos/gelo-saborizado" className="text-white/80 hover:text-accent transition-colors">Produtos Congelados</a></li>
              <li><a href="/produtos/pescados" className="text-white/80 hover:text-accent transition-colors">Frutas Desidratadas</a></li>
              <li><a href="/receitas" className="text-white/80 hover:text-accent transition-colors">Sucos Naturais</a></li>
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Mix de Frutas</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Endereço</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                <div className="text-white/90 text-sm">
                  <p>R. José Veloso N°193</p>
                  <p>Jardim Adriana, Rio Verde - GO</p>
                  <p>CEP: 75906-580, Brasil</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <div className="text-white/90 text-sm">
                  <p>contato@frutbras.com.br</p>
                  <p>vendas@frutbras.com.br</p>
                  <p>frutbras.comercial@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Telefone</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-white/90 text-sm">+55 64 8441-7040</span>
              </div>
              
              <div>
                <h5 className="text-accent font-medium mb-2">Horário</h5>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div className="text-white/90 text-sm">
                    <p>Segunda à Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center space-y-4">
          <p className="text-white/60 text-sm">
            © 2024 Frutbras Alimentos Congelados. Todos os direitos reservados.
          </p>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10 text-xs">
              <Shield className="h-3 w-3 mr-2" />
              Painel do Administrador
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;