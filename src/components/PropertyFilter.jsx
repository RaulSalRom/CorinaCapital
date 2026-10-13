
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyFilter = ({ value, onChange }) => {
  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Habitaciones alquiler', label: 'Habitaciones alquiler' },
    { value: 'Inversiones', label: 'Inversiones' },
    { value: 'Propiedades en venta', label: 'Propiedades en venta' },
    { value: 'Propiedades en alquiler', label: 'Propiedades en alquiler' },
    { value: 'Obras', label: 'Obras' }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-64 bg-white text-foreground">
        <SelectValue placeholder="Filtrar por categoría" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.value} value={cat.value}>
            {cat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PropertyFilter;
