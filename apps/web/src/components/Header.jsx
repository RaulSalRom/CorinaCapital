import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Habitaciones alquiler', path: '/properties?category=' + encodeURIComponent('Habitaciones alquiler') },
    { name: 'Inversiones', path: '/properties?category=' + encodeURIComponent('Inversiones') },
    { name: 'Propiedades en venta', path: '/properties?category=' + encodeURIComponent('Propiedades en venta') },
    { name: 'Propiedades en alquiler', path: '/properties?category=' + encodeURIComponent('Propiedades en alquiler') },
    { name: 'Obras', path: '/properties?category=' + encodeURIComponent('Obras') }
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <div className="bg-primary p-2 rounded-lg group-hover:shadow-md transition-all">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">Corina Capital</span>
          </Link>

          {/* Main Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors outline-none">
                Propiedades <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/properties" className="w-full font-medium">Todas las propiedades</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.path} asChild className="cursor-pointer">
                    <Link to={cat.path} className="w-full">{cat.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="rounded-full px-6 font-semibold">
              <Link to="/properties">Explorar Catálogo</Link>
            </Button>
          </nav>

          {/* Mobile Interaction */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Sidebar/Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-4 px-2">
              <Link to="/" className="text-lg font-medium px-2 py-1" onClick={closeMenu}>
                Inicio
              </Link>
              <div className="pt-2 pb-1 px-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nuestras Propiedades</span>
              </div>
              <Link to="/properties" className="text-base px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>
                Ver todo el catálogo
              </Link>
              {categories.map((cat) => (
                <Link key={cat.name} to={cat.path} className="text-base text-muted-foreground px-4 py-2 hover:bg-accent rounded-md" onClick={closeMenu}>
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;