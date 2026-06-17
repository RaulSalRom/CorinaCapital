
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { User, Heart, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useFavorites } from '@/hooks/useFavorites.js';
import pb from '@/lib/pocketbaseClient';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, initialLoading } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [initialLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favorites.length === 0) {
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }

      try {
        const propertyIds = favorites.map(fav => fav.propertyId);
        const filter = propertyIds.map(id => `id = "${id}"`).join(' || ');

        const records = await pb.collection('properties').getFullList({
          filter,
          $autoCancel: false
        });

        setFavoriteProperties(records);
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!favoritesLoading) {
      fetchFavoriteProperties();
    }
  }, [favorites, favoritesLoading]);

  if (initialLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mi perfil - Corina Capital</title>
        <meta name="description" content="Gestiona tu perfil y tus propiedades favoritas en Corina Capital" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="mb-8">Mi perfil</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>Tus datos de cuenta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{currentUser?.name || 'Usuario'}</p>
                        <p className="text-sm text-muted-foreground">Miembro desde {new Date(currentUser?.created).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                        <span className="text-muted-foreground">{currentUser?.email}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Propiedades favoritas</span>
                        <span className="font-semibold">{favorites.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Favorite Properties */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-red-500" />
                          Mis favoritos
                        </CardTitle>
                        <CardDescription>Propiedades que has guardado</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading || favoritesLoading ? (
                      <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : favoriteProperties.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground mb-2">
                          No tienes propiedades favoritas
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                          Explora propiedades y guarda tus favoritas
                        </p>
                        <Button asChild>
                          <Link to="/properties">Explorar propiedades</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favoriteProperties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UserProfilePage;
