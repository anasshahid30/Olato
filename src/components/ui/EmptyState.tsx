import React from 'react';
import { Button } from './Button';
import { SearchX, BookmarkX, MapPinOff } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'saved' | 'location';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type = 'search',
  title,
  description,
  actionText,
  onAction,
  className = '',
}: EmptyStateProps) {
  const defaults = {
    search: {
      icon: <SearchX className="w-12 h-12 text-[#5B5CE2]" />,
      title: title || 'No deals found nearby',
      description: description || 'Try adjusting your search query, increasing distance radius, or clearing filters to discover nearby offers.',
      actionText: actionText || 'Reset Filters',
    },
    saved: {
      icon: <BookmarkX className="w-12 h-12 text-[#5B5CE2]" />,
      title: title || 'No saved deals yet',
      description: description || 'Explore verified discounts around you and tap the heart icon to save your favorite offers for quick access.',
      actionText: actionText || 'Explore Deals',
    },
    location: {
      icon: <MapPinOff className="w-12 h-12 text-[#5B5CE2]" />,
      title: title || 'Location services unavailable',
      description: description || 'We could not detect your exact position. Please select a city neighborhood hub from the header menu.',
      actionText: actionText || 'Select Location Hub',
    },
  };

  const current = defaults[type];

  return (
    <div
      className={`flex flex-col items-center justify-center p-10 bg-white border border-[#E7E7EC] rounded-2xl text-center shadow-sm max-w-lg mx-auto ${className}`}
    >
      <div className="p-4 bg-[#EEF0FF] rounded-2xl mb-4">{current.icon}</div>
      <h3 className="text-xl font-bold text-[#15151A] mb-2">{current.title}</h3>
      <p className="text-sm text-[#6F7078] mb-6 leading-relaxed max-w-md">{current.description}</p>
      {onAction && (
        <Button variant="primary" onClick={onAction}>
          {current.actionText}
        </Button>
      )}
    </div>
  );
}
