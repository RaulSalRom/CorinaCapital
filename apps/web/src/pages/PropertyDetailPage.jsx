
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, Euro, ChevronRight, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { usePocketbaseGetOne } from '@/hooks/usePocketbaseQuery';
import { logError } from '@/lib/logger';
import { CONTACT_INFO } from '@/lib/constants';
import pb from '@/lib/pocketbaseClient';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Usar hook personalizado para obtener una propiedad
  const { data: property, loading, error } = usePocketbaseGetOne('properties', id);

  if (error) {
    logError(error, `PropertyDetailPage.usePocketbaseGetOne(${id})`);
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted/20">
          <h2 className="mb-6 text-3xl">Propiedad no encontrada</h2>
          <p className="text-muted-foreground mb-8">La propiedad que buscas no existe o ha sido retirada.</p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/properties">Volver al catálogo</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images.map(img => pb.files.getUrl(property, img))
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200'];

  return (
    <>
      <Helmet>
        <title>{`${property.name} - Corina Capital`}</title>
        <meta name="description" content={property.description || `Detalles de ${property.name} en ${property.location}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/20 pb-20">
          {/* Breadcrumb */}
          <div className="bg-background border-b border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                <Link to="/" className="hover:text-foreground transition-colors">Inicio</Link>
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
                <Link to="/properties" className="hover:text-foreground transition-colors">Catálogo</Link>
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
                <span className="text-foreground font-medium truncate">{property.name}</span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <div className="space-y-4 bg-background p-2 rounded-3xl border border-border/50 shadow-sm">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={images[selectedImage]}
                      alt={property.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 px-2 snap-x">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`relative flex-shrink-0 w-24 md:w-32 aspect-video rounded-xl overflow-hidden snap-start transition-all ${
                            selectedImage === idx ? 'ring-2 ring-primary ring-offset-2 ring-offset-background opacity-100' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div>
                        {property.category && (
                          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-sm">
                            {property.category}
                          </Badge>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{property.name}</h1>
                        <div className="flex items-center text-muted-foreground text-lg">
                          <MapPin className="h-5 w-5 mr-2 text-primary" />
                          <span>{property.location}</span>
                        </div>
                      </div>
                      
                      {property.price && (
                        <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 text-center md:text-right min-w-[200px]">
                          <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-1">Precio</span>
                          <div className="flex items-center justify-center md:justify-end text-primary text-3xl font-bold">
                            <Euro className="h-7 w-7 mr-1" />
                            <span>{property.price.toLocaleString('es-ES')}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-semibold mb-4">Descripción</h3>
                        <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed">
                          <p className="whitespace-pre-line">{property.description || 'Sin descripción disponible.'}</p>
                        </div>
                      </div>

                      {property.detailed_features && (
                        <>
                          <Separator className="my-8" />
                          <div>
                            <h3 className="text-2xl font-semibold mb-6">Características Principales</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {property.detailed_features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                                <div key={idx} className="flex items-start">
                                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{feature.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-28 h-fit">
                <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-6">Estado de la Propiedad</h3>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                      <span className="font-medium text-foreground">Disponibilidad</span>
                      <Badge variant={property.availability ? 'default' : 'secondary'} className="px-3 py-1">
                        {property.availability ? 'Disponible' : 'No disponible'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground border-none shadow-lg rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <CardContent className="p-8 relative z-10">
                    <h3 className="text-2xl font-semibold mb-3">¿Interesado?</h3>
                    <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                      Contacta con nuestros asesores para recibir información detallada o programar una visita a esta propiedad.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                        <Phone className="h-5 w-5 mr-4 text-white/90" />
                        <span className="font-medium tracking-wide">{CONTACT_INFO.PHONE}</span>
                      </div>
                      <div className="flex items-center bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                        <Mail className="h-5 w-5 mr-4 text-white/90" />
                        <span className="font-medium">{CONTACT_INFO.EMAIL}</span>
                      </div>
                    </div>

                    <Button variant="secondary" size="lg" className="w-full rounded-full font-semibold text-primary hover:bg-white transition-colors">
                      Solicitar Información
                    </Button>
                  </CardContent>
                </Card>

                {property.contact_info && (
                  <Card className="border-border/50 shadow-sm rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <h3 className="text-lg font-semibold mb-4">Notas Adicionales</h3>
                      <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
                        {property.contact_info}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PropertyDetailPage;
