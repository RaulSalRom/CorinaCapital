
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Map, TrendingUp, Key, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { usePocketbaseQuery } from '@/hooks/usePocketbaseQuery';
import { logError } from '@/lib/logger';

const HomePage = () => {
  // Obtener propiedades destacadas (las 4 más recientes) usando hook centralizado
  const { data: featuredProperties, loading, error } = usePocketbaseQuery('properties', {
    sort: '-created',
    limit: 4
  });

  // Loguear errores si ocurren
  if (error) {
    logError(error, 'HomePage.usePocketbaseQuery');
  }

  return (
    <>
      <Helmet>
        <title>Corina Capital - Inmobiliaria Exclusiva en la Costa del Sol</title>
        <meta name="description" content="Descubre propiedades exclusivas y oportunidades de inversión en la Costa del Sol con Corina Capital." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/20">
              <Sun className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white tracking-wide uppercase">Especialistas en la Costa del Sol</span>
            </div>
            <h1 className="text-white mb-6 max-w-4xl mx-auto drop-shadow-lg">
              Exclusividad y Rentabilidad en el Mediterráneo
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
              Descubre el catálogo más selecto de propiedades, desde residencias de lujo hasta oportunidades de inversión de alto rendimiento.
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6 shadow-soft-lg transition-all duration-300 hover:scale-105 rounded-full">
              <Link to="/properties">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="mb-6">El Estándar Corina Capital</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nuestra experiencia en el mercado inmobiliario de la Costa del Sol nos permite ofrecer un servicio integral, transparente y orientado a maximizar el valor para nuestros clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-muted/50 rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="bg-background w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <Map className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ubicaciones Premium</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seleccionamos cuidadosamente propiedades en las zonas más demandadas y exclusivas de la costa malagueña.
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="bg-background w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Alta Rentabilidad</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Identificamos oportunidades de inversión y obras con un alto potencial de revalorización en el mercado actual.
                </p>
              </div>

              <div className="bg-muted/50 rounded-2xl p-8 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="bg-background w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <Key className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Gestión Integral</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Acompañamiento completo en todo el proceso, desde la búsqueda hasta la entrega de llaves y gestión de alquileres.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-24 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="mb-4">Propiedades Destacadas</h2>
                <p className="text-lg text-muted-foreground">
                  Una selección de nuestras mejores propiedades disponibles actualmente en el mercado.
                </p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex rounded-full px-6">
                <Link to="/properties">
                  Ver catálogo completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-background rounded-2xl border border-border/50">
                <p className="text-lg text-muted-foreground">Error al cargar las propiedades destacadas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center md:hidden">
              <Button asChild variant="outline" size="lg" className="w-full rounded-full">
                <Link to="/properties">
                  Ver catálogo completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
