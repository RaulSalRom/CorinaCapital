
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Euro } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient';

const PropertyCard = React.memo(({ property }) => {
  const imageUrl = property.images && property.images.length > 0
    ? pb.files.getUrl(property, property.images[0], { thumb: '400x300' })
    : '/images/placeholder-property.jpg';

  return (
    <Card className="group overflow-hidden border-border hover:shadow-soft-lg transition-all duration-400 hover:-translate-y-1 bg-card flex flex-col h-full">
      <Link to={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {property.category && (
          <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm border-none shadow-sm font-medium">
            {property.category}
          </Badge>
        )}
      </Link>
      
      <CardContent className="p-6 flex-grow">
        <Link to={`/properties/${property.id}`}>
          <h3 className="font-semibold text-xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {property.name}
          </h3>
        </Link>
        
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {property.price && (
          <div className="flex items-center text-primary font-bold text-2xl mt-auto">
            <Euro className="h-5 w-5 mr-1" />
            <span>{property.price.toLocaleString('es-ES')}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Link to={`/properties/${property.id}`}>
            Ver detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
});

export default PropertyCard;
