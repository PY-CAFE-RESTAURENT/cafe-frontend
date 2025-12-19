'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { getImageUrl } from '@/lib/imageUtils';

interface MenuItemModalProps {
    item: MenuItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
    const { addToCart, isLoading: cartLoading } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Get available sizes from size_prices (with null check)
    const availableSizes = item?.size_prices ? Object.keys(item.size_prices) : [];
    const hasSizeSelection = item ? availableSizes.length > 0 : false;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen && item) {
            setQuantity(1);
            setImageError(false);
            setIsAdding(false);
            // Set default size to "regular" if available, otherwise first size, or null
            if (hasSizeSelection && availableSizes.length > 0) {
                setSelectedSize(availableSizes.includes('regular') ? 'regular' : availableSizes[0]);
            } else {
                setSelectedSize(null);
            }
        }
    }, [isOpen, item, hasSizeSelection, availableSizes]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleAddToCart = async () => {
        if (!item || quantity <= 0) return;

        setIsAdding(true);
        try {
            await addToCart(item.id, quantity, selectedSize || undefined);
            // Close modal after successful add
            onClose();
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getCurrentPrice = (): number => {
        if (!item) return 0;
        if (selectedSize && item.size_prices?.[selectedSize]) {
            return item.size_prices[selectedSize];
        }
        return item.price;
    };

    const calculateTotal = (): string => {
        if (!item) return '$0.00';
        return formatPrice(getCurrentPrice() * quantity);
    };

    // ✅ Compute image source once (and avoid "" passing into <Image />)
    const imageSrc = useMemo(() => {
        if (!item) return null;
        const src = getImageUrl(item.image_url);
        return src && src.trim().length > 0 ? src : null;
    }, [item]);

    // Early return if modal is not open or item is null
    if (!isOpen || !item) {
        return null;
    }

    const isLoadingState = cartLoading || isAdding;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-10 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" role="document">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600 dark:text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Image Section */}
                    <div className="relative w-full h-64 sm:h-80 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                        {imageSrc ? (
                            <div className="relative w-full h-full">
                                {!imageError ? (
                                    <Image
                                        src={imageSrc}
                                        alt={`${item.name} - ${item.description || 'Menu item'}`}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        sizes="(max-width: 768px) 100vw, 672px"
                                        priority
                                        quality={90}
                                        unoptimized
                                        onError={() => {
                                            setImageError(true);
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={imageSrc}
                                        alt={`${item.name} - ${item.description || 'Menu item'}`}
                                        className="w-full h-full object-cover rounded-t-lg"
                                        onError={() => {
                                            // Image failed to load, already using fallback
                                        }}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <svg
                                        className="mx-auto h-16 w-16 mb-2"
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
                                    <span className="text-lg">No Image Available</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Category and Veg Badge */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            {/* Display multiple categories if available, otherwise single category */}
                            {item.categories && Array.isArray(item.categories) && item.categories.length > 0 ? (
                                item.categories.map((cat, idx) => (
                                    <span 
                                        key={idx}
                                        className="px-3 py-1 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full"
                                    >
                                        {cat}
                                    </span>
                                ))
                            ) : item.category ? (
                                <span className="px-3 py-1 text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">
                                    {item.category}
                                </span>
                            ) : null}
                            {item.is_veg === true ? (
                                <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                                    Vegetarian
                                </span>
                            ) : item.is_veg === false ? (
                                <span className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
                                    Non-Vegetarian
                                </span>
                            ) : null}
                            {item.size && (
                                <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                    Size: {item.size}
                                </span>
                            )}
                        </div>

                        {/* Title and Price */}
                        <div className="flex justify-between items-start mb-4">
                            <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
                                {item.name}
                            </h2>
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400 shrink-0">
                                {formatPrice(getCurrentPrice())}
                            </span>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Description
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        {/* Size Selection */}
                        {hasSizeSelection && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Select Size
                                </h3>
                                <div className="flex flex-wrap gap-3" role="group" aria-label="Size selection">
                                    {availableSizes.map((size) => {
                                        const sizePrice = item?.size_prices?.[size] || 0;
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSelected
                                                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                                                    }`}
                                                aria-pressed={isSelected}
                                                aria-label={`Select ${size} size, ${formatPrice(sizePrice)}`}
                                            >
                                                <div className="text-left">
                                                    <div className="font-semibold capitalize">{size}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {formatPrice(sizePrice)}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Quantity
                            </h3>
                            <div className="flex items-center space-x-3" role="group" aria-label="Quantity selector">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1 || isLoadingState}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${quantity <= 1 || isLoadingState
                                        ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                                        }`}
                                    aria-label="Decrease quantity"
                                    aria-disabled={quantity <= 1 || isLoadingState}
                                >
                                    −
                                </button>
                                <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-12 text-center" aria-live="polite" aria-atomic="true">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={isLoadingState}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingState
                                        ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900'
                                        }`}
                                    aria-label="Increase quantity"
                                    aria-disabled={isLoadingState}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Total and Add to Cart */}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Total:
                                </span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {calculateTotal()}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isLoadingState || quantity <= 0}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoadingState || quantity <= 0
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white hover:shadow-lg'
                                    }`}
                                aria-label={`Add ${quantity} ${item.name} to cart`}
                                aria-disabled={isLoadingState || quantity <= 0}
                            >
                                {isLoadingState ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
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
                                        Adding to Cart...
                                    </div>
                                ) : (
                                    `Add ${quantity} to Cart`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuItemModal;