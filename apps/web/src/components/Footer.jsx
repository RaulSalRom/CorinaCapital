
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

const Footer = React.memo(() => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">Corina Capital</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Especialistas en el mercado inmobiliario de la Costa del Sol. 
              Ofrecemos propiedades exclusivas y oportunidades de inversión de alto valor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-semibold text-foreground mb-6 block">Navegación</span>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link to="/properties" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Catálogo de Propiedades
              </Link>
              <Link to="/properties?category=Inversiones" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Oportunidades de Inversión
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <span className="font-semibold text-foreground mb-6 block">Contacto</span>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center text-sm text-muted-foreground group">
                <Mail className="h-4 w-4 mr-3 text-primary group-hover:scale-110 transition-transform" />
                <span>{CONTACT_INFO.EMAIL}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground group">
                <Phone className="h-4 w-4 mr-3 text-primary group-hover:scale-110 transition-transform" />
                <span>{CONTACT_INFO.PHONE}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground group">
                <MapPin className="h-4 w-4 mr-3 text-primary group-hover:scale-110 transition-transform" />
                <span>{CONTACT_INFO.ADDRESS}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Corina Capital. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Aviso Legal
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
