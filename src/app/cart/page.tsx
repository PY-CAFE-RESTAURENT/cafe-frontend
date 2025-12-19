'use client';


import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';

export default function CartPage() {
    const { cart, isLoading, error, clearCart } = useCart();

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Your Cart
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Review your items and proceed to checkout
                        </p>
                    </div>

                    {/* Loading skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                    <div className="animate-pulse flex space-x-4">
                                        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Your Cart
                        </h1>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <div className="flex">
                            <div className="shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Error loading cart
                                </h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state - handled by CartSummary component
    const hasItems = cart && cart.cart.cart_items.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Your Cart
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {hasItems
                            ? 'Review your items and proceed to checkout'
                            : 'Your cart is currently empty'
                        }
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        {hasItems ? (
                            <div className="space-y-4">
                                {/* Clear Cart Button */}
                                <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Cart Items ({cart.total_items})
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Manage your selected items
                                        </p>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
                                                try {
                                                    await clearCart();
                                                } catch (error) {
                                                    console.error('Failed to clear cart:', error);
                                                }
                                            }
                                        }}
                                        disabled={isLoading}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isLoading
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                                                Clearing...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="mr-2 h-4 w-4 inline"
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
                                                Clear Cart
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Cart Items List */}
                                {cart.cart.cart_items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
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
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Add some delicious items from our menu to get started!
                                    </p>
                                    <a
                                        href="/menu"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Browse Menu
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <CartSummary />
                        </div>
                    </div>
                </div>

                {/* Continue Shopping Link */}
                {hasItems && (
                    <div className="mt-8 text-center">
                        <a
                            href="/menu"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Continue Shopping
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}