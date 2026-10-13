
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const FavoriteButton = ({ propertyId, variant = 'ghost', size = 'icon' }) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!isAuthenticated) return null;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className="transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorite(propertyId) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
        }`}
      />
    </Button>
  );
};

export default FavoriteButton;
