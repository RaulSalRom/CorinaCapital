
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFavorites = async () => {
    if (!isAuthenticated || !currentUser) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const records = await pb.collection('favorites').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      setFavorites(records);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavorites();
  }, [currentUser, isAuthenticated]);

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.propertyId === propertyId);
  };

  const addFavorite = async (propertyId) => {
    if (!isAuthenticated || !currentUser) {
      toast.error('Debes iniciar sesión para guardar favoritos');
      return;
    }

    try {
      const record = await pb.collection('favorites').create({
        userId: currentUser.id,
        propertyId: propertyId
      }, { $autoCancel: false });
      
      setFavorites(prev => [...prev, record]);
      toast.success('Añadido a favoritos');
      return record;
    } catch (error) {
      toast.error('Error al añadir favorito');
      throw error;
    }
  };

  const removeFavorite = async (propertyId) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      const favorite = favorites.find(fav => fav.propertyId === propertyId);
      if (favorite) {
        await pb.collection('favorites').delete(favorite.id, { $autoCancel: false });
        setFavorites(prev => prev.filter(fav => fav.id !== favorite.id));
        toast.success('Eliminado de favoritos');
      }
    } catch (error) {
      toast.error('Error al eliminar favorito');
      throw error;
    }
  };

  const toggleFavorite = async (propertyId) => {
    if (isFavorite(propertyId)) {
      await removeFavorite(propertyId);
    } else {
      await addFavorite(propertyId);
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    getFavorites
  };
};
