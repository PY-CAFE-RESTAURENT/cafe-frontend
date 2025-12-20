'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/imageUtils';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart?: (itemId: number, quantity: number) => void;
    onItemClick?: (item: MenuItem) => void;
    isLoading?: boolean;
}

function MenuItemCardComponent({ item, onAddToCart, onItemClick, isLoading: externalLoading }: MenuItemCardProps) {
    // Only get addToCart function, not isLoading to prevent rerenders
    const { addToCart } = useCart();
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Use external loading state if provided, otherwise use local isAdding state only
    // Don't use global cartLoading to prevent all cards from rerendering
    const isLoadingState = externalLoading || isAdding;

    // ✅ Compute image source once (and avoid "" passing into <Image />)
    const imageSrc = useMemo(() => {
        if (!item) return null;
        const src = getImageUrl(item.image_url);
        return src && src.trim().length > 0 ? src : null;
    }, [item]);

    const handleAddToCart = useCallback(async () => {
        // If item has size selection, open modal instead
        if (item.size_prices && Object.keys(item.size_prices).length > 0) {
            if (onItemClick) {
                onItemClick(item);
            }
            return;
        }

        setIsAdding(true);
        try {
            if (onAddToCart) {
                // Use custom handler if provided
                onAddToCart(item.id, 1);
            } else {
                // Use cart context by default
                await addToCart(item.id, 1);
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        } finally {
            setIsAdding(false);
        }
    }, [item.id, item.size_prices, onAddToCart, onItemClick, addToCart]);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleCardClick = useCallback(() => {
        if (onItemClick) {
            onItemClick(item);
        }
    }, [item, onItemClick]);

    return (
        <article
            className={`bg-white rounded-lg shadow-lg hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 ${onItemClick ? 'cursor-pointer' : ''
                }`}
            onClick={handleCardClick}
            role={onItemClick ? 'button' : undefined}
            tabIndex={onItemClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onItemClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
            aria-label={onItemClick ? `View details for ${item.name}` : undefined}
        >
            {/* Image Section */}
            <div className="relative w-full h-48 bg-gray-100">
                {imageSrc ? (
                    <div className="relative w-full h-full">
                        {!imageError ? (
                            <Image
                                src={imageSrc}
                                alt={`${item.name} - ${item.description || 'Menu item'}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
                                priority={false}
                                quality={85}
                                unoptimized
                                onError={() => {
                                    setImageError(true);
                                }}
                            />
                        ) : (
                            <img
                                src={imageSrc}
                                alt={`${item.name} - ${item.description || 'Menu item'}`}
                                className="w-full h-full object-cover"
                                onError={() => {
                                    // Image failed to load, already using fallback
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-500">
                            <svg
                                className="mx-auto h-12 w-12 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-sm">No Image</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Category and Veg Badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap" role="group" aria-label="Item categories">
                    {/* Display multiple categories if available, otherwise single category */}
                    {item.categories && Array.isArray(item.categories) && item.categories.length > 0 ? (
                        item.categories.map((cat, idx) => (
                            <span 
                                key={idx}
                                className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full" 
                                aria-label={`Category: ${cat}`}
                            >
                                {cat}
                            </span>
                        ))
                    ) : item.category ? (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full" aria-label={`Category: ${item.category}`}>
                            {item.category}
                        </span>
                    ) : null}
                    {item.is_veg === true ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1" aria-label="Vegetarian">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full" aria-hidden="true"></span>
                            Veg
                        </span>
                    ) : item.is_veg === false ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1" aria-label="Non-vegetarian">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full" aria-hidden="true"></span>
                            Non-Veg
                        </span>
                    ) : null}
                    {item.size_prices && Object.keys(item.size_prices).length > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full" aria-label="Available in multiple sizes">
                            Sizes Available
                        </span>
                    )}
                    {item.size && !item.size_prices && (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full" aria-label={`Size: ${item.size}`}>
                            {item.size}
                        </span>
                    )}
                </div>

                {/* Name and Price */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                    </h3>
                    <span className="text-lg font-bold text-[#F97316] ml-2 shrink-0" aria-label={`Price: ${formatPrice(item.price)}`}>
                        {formatPrice(item.price)}
                    </span>
                </div>

                {/* Size */}
                {item.size && (
                    <p className="text-xs text-gray-600 mb-2">
                        Size: {item.size}
                    </p>
                )}

                {/* Description */}
                {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.description}
                    </p>
                )}

                {/* Add to Cart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking button
                        handleAddToCart();
                    }}
                    disabled={isLoadingState}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 ${isLoadingState
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#F97316] hover:bg-[#EA580C] text-white hover:shadow-lg hover:shadow-[#F97316]/50 font-semibold'
                        }`}
                    aria-label={`Add ${item.name} to cart`}
                >
                    {isLoadingState ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Adding...
                        </div>
                    ) : (
                        'Add to Cart'
                    )}
                </button>
            </div>
        </article>
    );
}

// Memoize the component to prevent unnecessary rerenders
export const MenuItemCard = memo(MenuItemCardComponent, (prevProps, nextProps) => {
    // Only rerender if these props change
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.name === nextProps.item.name &&
        prevProps.item.price === nextProps.item.price &&
        prevProps.item.image_url === nextProps.item.image_url &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.onAddToCart === nextProps.onAddToCart &&
        prevProps.onItemClick === nextProps.onItemClick
    );
});

MenuItemCard.displayName = 'MenuItemCard';

export default MenuItemCard;