
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyFilter from '@/components/PropertyFilter.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { usePocketbaseSearch } from '@/hooks/usePocketbaseQuery';
import { logError } from '@/lib/logger';
import { TIMING } from '@/lib/constants';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Usar hook de búsqueda con debounce automático
  const { data: allProperties, loading, error } = usePocketbaseSearch(
    'properties',
    searchQuery,
    ['name', 'description', 'location', 'address'],
    TIMING.DEBOUNCE_SEARCH
  );

  // Loguear errores si ocurren
  if (error) {
    logError(error, 'PropertiesPage.usePocketbaseSearch');
  }

  // Filtrar por categoría después de la búsqueda
  const properties = selectedCategory && selectedCategory !== 'all'
    ? allProperties.filter(prop => prop.category === selectedCategory)
    : allProperties;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Helmet>
        <title>Catálogo de Propiedades - Corina Capital</title>
        <meta name="description" content="Explora nuestro catálogo completo de propiedades exclusivas en la Costa del Sol. Habitaciones, inversiones, ventas y alquileres." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/20">
          <div className="bg-background border-b border-border/50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h1 className="mb-4 text-4xl">Catálogo de Propiedades</h1>
                <p className="text-lg text-muted-foreground">
                  Encuentra la propiedad perfecta en la Costa del Sol. Utiliza los filtros para refinar tu búsqueda.
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Filters */}
            <div className="bg-background p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row gap-4 mb-10">
              <div className="flex-1">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Buscar por nombre o ubicación..."
                />
              </div>
              <div className="w-full md:w-72">
                <PropertyFilter
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex justify-center py-32">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-32 bg-background rounded-2xl border border-border/50">
                <p className="text-2xl font-medium text-foreground mb-3">Error al cargar propiedades</p>
                <p className="text-muted-foreground">
                  Ha ocurrido un error. Intenta recargar la página.
                </p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-32 bg-background rounded-2xl border border-border/50">
                <p className="text-2xl font-medium text-foreground mb-3">
                  No se encontraron propiedades
                </p>
                <p className="text-muted-foreground">
                  Intenta ajustar los filtros de búsqueda o explorar otra categoría.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-medium text-muted-foreground bg-background px-4 py-2 rounded-full border border-border/50">
                    Mostrando {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PropertiesPage;
