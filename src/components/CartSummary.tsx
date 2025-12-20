'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useUI } from '@/contexts/UIContext';

interface CartSummaryProps {
    totalAmount?: number;
    totalItems?: number;
    onCheckout?: () => Promise<void>;
    isLoading?: boolean;
}

export function CartSummary({
    totalAmount,
    totalItems,
    onCheckout,
    isLoading: externalLoading
}: CartSummaryProps) {
    const router = useRouter();
    const { cart, placeOrder } = useCart();
    const { showToast } = useUI();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    // Use external loading state if provided, otherwise use only local state
    // Don't use global cartLoading to prevent unnecessary rerenders
    const isLoadingState = externalLoading || isCheckingOut;

    // Use props if provided, otherwise get from cart context
    // Memoize to prevent recalculation on every render
    const displayTotalAmount = useMemo(() => 
        totalAmount ?? cart?.total_amount ?? 0,
        [totalAmount, cart?.total_amount]
    );
    const displayTotalItems = useMemo(() => 
        totalItems ?? cart?.total_items ?? 0,
        [totalItems, cart?.total_items]
    );

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleCheckout = async () => {
        // Clear any previous errors
        setCheckoutError(null);

        // Check if cart is empty
        if (displayTotalItems === 0) {
            const errorMessage = 'Your cart is empty. Add items before checking out.';
            setCheckoutError(errorMessage);
            showToast('warning', 'Empty Cart', errorMessage);
            return;
        }

        setIsCheckingOut(true);
        setCheckoutError(null);
        try {
            if (onCheckout) {
                // Use custom checkout handler if provided
                await onCheckout();
            } else {
                // Use default checkout logic from cart context
                const orderConfirmation = await placeOrder();

                showToast('success', 'Order Placed', 'Your order has been placed successfully!');
                
                // Small delay to ensure cart is cleared before navigation
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Redirect to order confirmation page using Next.js router
                router.push(`/order/${orderConfirmation.order.id}`);
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to place order. Please try again.';
            setCheckoutError(errorMessage);
            showToast('error', 'Checkout Failed', errorMessage);
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Handle empty cart state
    if (displayTotalItems === 0 && !isLoadingState) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
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
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.1M6 18a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Add some delicious items from our menu to get started!
                    </p>
                    <a
                        href="/menu"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Browse Menu
                    </a>
                </div>
            </div>
        );
    }

    return (
        <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6" aria-label="Order summary">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
            </h2>

            {/* Cart Totals */}
            <div className="space-y-3 mb-6" role="group" aria-label="Cart totals">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        Items ({displayTotalItems})
                    </span>
                    <span className="text-gray-900 dark:text-white" aria-label={`Subtotal: ${formatPrice(displayTotalAmount)}`}>
                        {formatPrice(displayTotalAmount)}
                    </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Total
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white" aria-label={`Total amount: ${formatPrice(displayTotalAmount)}`}>
                            {formatPrice(displayTotalAmount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {checkoutError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md" role="alert" aria-live="assertive">
                    <div className="flex">
                        <div className="shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                {checkoutError}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Button */}
            <button
                onClick={handleCheckout}
                disabled={isLoadingState || displayTotalItems === 0}
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md transition-colors ${isLoadingState || displayTotalItems === 0
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                aria-label={displayTotalItems === 0 ? 'Cannot checkout: cart is empty' : 'Proceed to checkout'}
                aria-disabled={isLoadingState || displayTotalItems === 0}
            >
                {isCheckingOut ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Placing Order...
                    </>
                ) : (
                    'Proceed to Checkout'
                )}
            </button>

            {/* Additional Info */}
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                By proceeding to checkout, you agree to our terms and conditions.
            </p>
        </aside>
    );
}

export default CartSummary;