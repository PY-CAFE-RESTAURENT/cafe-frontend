'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/imageUtils';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity?: (itemId: number, quantity: number) => void;
    onRemove?: (itemId: number) => void;
    isLoading?: boolean;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove, isLoading: externalLoading }: CartItemProps) {
    // Only get functions, not isLoading to prevent rerenders
    const { updateCartItem, removeFromCart } = useCart();
    const [imageError, setImageError] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    // Use external loading state if provided, otherwise use only local state
    // Don't use global cartLoading to prevent all items from rerendering
    const isLoadingState = externalLoading || isUpdating || isRemoving;

    const handleQuantityChange = useCallback(async (newQuantity: number) => {
        if (newQuantity <= 0) {
            return;
        }

        setIsUpdating(true);
        try {
            if (onUpdateQuantity) {
                // Use custom handler if provided
                onUpdateQuantity(item.id, newQuantity);
            } else {
                // Use cart context by default
                await updateCartItem(item.id, newQuantity);
            }
        } catch (error) {
            console.error('Failed to update cart item quantity:', error);
        } finally {
            setIsUpdating(false);
        }
    }, [item.id, onUpdateQuantity, updateCartItem]);

    const handleRemove = useCallback(async () => {
        setIsRemoving(true);
        try {
            if (onRemove) {
                // Use custom handler if provided
                onRemove(item.id);
            } else {
                // Use cart context by default
                await removeFromCart(item.id);
            }
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        } finally {
            setIsRemoving(false);
        }
    }, [item.id, onRemove, removeFromCart]);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    // ✅ Compute image source once (and avoid "" passing into <Image />)
    const imageSrc = useMemo(() => {
        if (!item.menu_item) return null;
        const src = getImageUrl(item.menu_item.image_url);
        return src && src.trim().length > 0 ? src : null;
    }, [item.menu_item]);

    const subtotal = item.item_price * item.quantity;

    return (
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4" aria-label={`Cart item: ${item.menu_item.name}, quantity: ${item.quantity}`}>
            <div className="flex items-start space-x-4">
                {/* Image Section */}
                <div className="relative w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden shrink-0">
                    {imageSrc ? (
                        <div className="relative w-full h-full">
                            {!imageError ? (
                                <Image
                                    src={imageSrc}
                                    alt={`${item.menu_item.name} - ${item.menu_item.description || 'Menu item'}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                    loading="lazy"
                                    unoptimized
                                    onError={() => {
                                        setImageError(true);
                                    }}
                                />
                            ) : (
                                <img
                                    src={imageSrc}
                                    alt={`${item.menu_item.name} - ${item.menu_item.description || 'Menu item'}`}
                                    className="w-full h-full object-cover"
                                    onError={() => {
                                        // Image failed to load, already using fallback
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <svg
                                className="h-8 w-8 text-gray-400"
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
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    {/* Item Name and Price */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate pr-2">
                                {item.menu_item.name}
                            </h3>
                            {item.selected_size && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    Size: {item.selected_size}
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">
                            {formatPrice(item.item_price)} each
                        </span>
                    </div>

                    {/* Description */}
                    {item.menu_item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {item.menu_item.description}
                        </p>
                    )}

                    {/* Quantity Controls and Subtotal */}
                    <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400" id={`quantity-label-${item.id}`}>Qty:</span>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md" role="group" aria-labelledby={`quantity-label-${item.id}`}>
                                <button
                                    onClick={() => handleQuantityChange(item.quantity - 1)}
                                    disabled={isLoadingState || item.quantity <= 1}
                                    className={`px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingState || item.quantity <= 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    aria-label={`Decrease quantity of ${item.menu_item.name}`}
                                    aria-disabled={isLoadingState || item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-600 min-w-12 text-center" aria-live="polite" aria-atomic="true">
                                    {isUpdating ? (
                                        <svg
                                            className="animate-spin h-4 w-4 mx-auto text-gray-600"
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
                                    ) : (
                                        item.quantity
                                    )}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(item.quantity + 1)}
                                    disabled={isLoadingState}
                                    className={`px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingState
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    aria-label={`Increase quantity of ${item.menu_item.name}`}
                                    aria-disabled={isLoadingState}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Subtotal and Remove Button */}
                        <div className="flex items-center space-x-3">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white" aria-label={`Subtotal: ${formatPrice(subtotal)}`}>
                                {formatPrice(subtotal)}
                            </span>
                            <button
                                onClick={handleRemove}
                                disabled={isLoadingState}
                                className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isLoadingState
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                                aria-label={`Remove ${item.menu_item.name} from cart`}
                                aria-disabled={isLoadingState}
                            >
                                {isRemoving ? (
                                    <svg
                                        className="animate-spin h-5 w-5"
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
                                ) : (
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

// Memoize the component to prevent unnecessary rerenders
export const CartItem = memo(CartItemComponent, (prevProps, nextProps) => {
    // Only rerender if these props change
    // Return true if props are equal (don't rerender), false if different (rerender)
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.quantity === nextProps.item.quantity &&
        prevProps.item.item_price === nextProps.item.item_price &&
        prevProps.item.menu_item?.id === nextProps.item.menu_item?.id &&
        prevProps.item.menu_item?.name === nextProps.item.menu_item?.name &&
        prevProps.isLoading === nextProps.isLoading &&
        prevProps.onUpdateQuantity === nextProps.onUpdateQuantity &&
        prevProps.onRemove === nextProps.onRemove
    );
});

CartItem.displayName = 'CartItem';

export default CartItem;