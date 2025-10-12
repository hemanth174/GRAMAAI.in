import React from 'react';
import { Card } from '@/components/ui/card';

export default function EmptyState({ imageUrl, title, description, children }) {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-100 shadow-lg">
      <div className="text-center py-12 md:py-20 px-6">
        <img
          src={imageUrl}
          alt={title}
          className="mx-auto w-1/2 md:w-1/3 max-w-xs mb-8"
        />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 max-w-md mx-auto">{description}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </Card>
  );
}
