'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types';
import { ordersApi } from '@/lib/api';
import { useUI } from '@/contexts/UIContext';
import { getOrderStatusLabel, getOrderStatusColor } from '@/lib/orderStatus';

// Helper function to track order completion time
const COMPLETION_TIMES_KEY = 'cafe_order_completion_times';

function getCompletionTime(orderId: number): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const times = JSON.parse(localStorage.getItem(COMPLETION_TIMES_KEY) || '{}');
        return times[orderId] || null;
    } catch {
        return null;
    }
}

function setCompletionTime(orderId: number, timestamp: string): void {
    if (typeof window === 'undefined') return;
    try {
        const times = JSON.parse(localStorage.getItem(COMPLETION_TIMES_KEY) || '{}');
        times[orderId] = timestamp;
        localStorage.setItem(COMPLETION_TIMES_KEY, JSON.stringify(times));
    } catch {
        // Ignore errors
    }
}

export default function OrderManagementPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrders, setUpdatingOrders] = useState<Set<number>>(new Set());
    const [currentTime, setCurrentTime] = useState(new Date());
    const { showToast } = useUI();

    // Update current time every second for countdown display
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Load orders
    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const allOrders = await ordersApi.getAll();
            // Sort by created_at descending (newest first)
            const sortedOrders = allOrders.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setOrders(sortedOrders);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
            setError(errorMessage);
            showToast('error', 'Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    // Initial load
    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    // Initialize completion times for already completed orders when orders are loaded
    // This handles cases where orders were completed before this feature was added
    useEffect(() => {
        if (orders.length > 0) {
            orders.forEach(order => {
                if (order.status === 'completed' && !getCompletionTime(order.id)) {
                    // If order is completed but no completion time is tracked,
                    // set it to now (so it will show "Please Collect" initially)
                    setCompletionTime(order.id, new Date().toISOString());
                }
            });
        }
    }, [orders]);

    // Update order status
    const updateOrderStatus = async (orderId: number, status: 'completed' | 'cancelled') => {
        setUpdatingOrders(prev => new Set(prev).add(orderId));
        try {
            const updatedOrder = await ordersApi.updateStatus(orderId, status);
            setOrders(prevOrders => 
                prevOrders.map(order => order.id === orderId ? updatedOrder : order)
            );
            
            // Track completion time when order is marked as completed
            if (status === 'completed') {
                setCompletionTime(orderId, new Date().toISOString());
            }
            
            const statusLabel = status === 'completed' ? 'ready for collection' : status;
            showToast('success', 'Success', `Order #${orderId} has been marked as ${statusLabel}.`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Failed to ${status} order`;
            showToast('error', 'Error', errorMessage);
        } finally {
            setUpdatingOrders(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    // Auto-complete logic
    useEffect(() => {
        const checkAndAutoComplete = () => {
            const now = new Date().getTime();
            
            setOrders(prevOrders => {
                prevOrders.forEach(order => {
                    // Only process pending orders
                    if (order.status !== 'pending') {
                        return;
                    }

                    const orderCreatedAt = new Date(order.created_at).getTime();
                    const elapsedMinutes = (now - orderCreatedAt) / (1000 * 60);
                    
                    // Calculate total items in order
                    const totalItems = order.cart.cart_items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    );
                    
                    // Determine completion time based on item count
                    // If order has more than 10 items, completion time is 10 minutes, otherwise 5 minutes
                    const completionTimeMinutes = totalItems > 10 ? 10 : 5;
                    
                    // Auto-complete if time has elapsed
                    if (elapsedMinutes >= completionTimeMinutes) {
                        // Update order status
                        ordersApi.updateStatus(order.id, 'completed')
                            .then(updatedOrder => {
                                setOrders(currentOrders =>
                                    currentOrders.map(o => o.id === order.id ? updatedOrder : o)
                                );
                                // Track completion time for auto-completed orders
                                setCompletionTime(order.id, new Date().toISOString());
                                showToast('info', 'Order Ready', `Order #${order.id} is ready for collection.`);
                            })
                            .catch(err => {
                                console.error(`Failed to auto-complete order ${order.id}:`, err);
                            });
                    }
                });
                
                return prevOrders; // Return unchanged, API call will update it
            });
        };

        // Check every 30 seconds
        const interval = setInterval(checkAndAutoComplete, 30000);
        
        // Initial check
        checkAndAutoComplete();

        return () => clearInterval(interval);
    }, [showToast]);

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // Format price
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };


    // Calculate time remaining for auto-completion
    const getTimeRemaining = (order: Order): string | null => {
        if (order.status !== 'pending') return null;

        const now = currentTime.getTime();
        const orderCreatedAt = new Date(order.created_at).getTime();
        const elapsedMinutes = (now - orderCreatedAt) / (1000 * 60);
        
        const totalItems = order.cart.cart_items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        
        // If order has more than 10 items, completion time is 10 minutes, otherwise 5 minutes
        const completionTimeMinutes = totalItems > 10 ? 10 : 5;
        const remainingMinutes = Math.max(0, completionTimeMinutes - elapsedMinutes);
        
        if (remainingMinutes <= 0) {
            return 'Completing soon...';
        }
        
        const minutes = Math.floor(remainingMinutes);
        const seconds = Math.floor((remainingMinutes - minutes) * 60);
        
        return `${minutes}m ${seconds}s remaining`;
    };

    // Calculate total items in order
    const getTotalItems = (order: Order): number => {
        return order.cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Get collection status label for completed orders
    const getCollectionStatus = (order: Order): string | null => {
        if (order.status !== 'completed') return null;

        const completionTimeStr = getCompletionTime(order.id);
        if (!completionTimeStr) {
            // If no completion time tracked, assume it was just completed
            return 'Please Collect';
        }

        const completionTime = new Date(completionTimeStr).getTime();
        const now = currentTime.getTime();
        const elapsedSeconds = (now - completionTime) / 1000;
        const elapsedMinutes = elapsedSeconds / 60;

        // Show "Please Collect" for first 1 minute
        if (elapsedMinutes < 1) {
            return 'Please Collect';
        }
        
        // Show "Collected" after 2 minutes
        if (elapsedMinutes >= 2) {
            return 'Collected';
        }

        // Between 1-2 minutes, show "Please Collect" (still waiting)
        return 'Please Collect';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Order Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage all orders
                        </p>
                    </div>

                    {/* Loading skeleton */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Order Management
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
                                    Error loading orders
                                </h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={loadOrders}
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

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const completedOrders = orders.filter(o => o.status === 'completed');
    const cancelledOrders = orders.filter(o => o.status === 'cancelled');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Order Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Manage all orders and track their status
                            </p>
                        </div>
                        <button
                            onClick={loadOrders}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Refresh orders"
                        >
                            <svg
                                className="w-5 h-5 inline-block mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preparing</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingOrders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready for Collection</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedOrders.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{cancelledOrders.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No orders found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            There are currently no orders in the system.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const isUpdating = updatingOrders.has(order.id);
                            const totalItems = getTotalItems(order);
                            const timeRemaining = getTimeRemaining(order);
                            const collectionStatus = getCollectionStatus(order);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Order #{order.id}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                                                    {getOrderStatusLabel(order.status)}
                                                </span>
                                                {order.status === 'pending' && timeRemaining && (
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                        {timeRemaining}
                                                    </span>
                                                )}
                                                {order.status === 'completed' && collectionStatus && (
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        collectionStatus === 'Please Collect' 
                                                            ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
                                                            : 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
                                                    }`}>
                                                        {collectionStatus}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div>
                                                    <span className="font-medium">Created:</span>{' '}
                                                    {formatDate(order.created_at)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Items:</span> {totalItems}
                                                    {totalItems > 10 && (
                                                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                                            (10 min completion)
                                                        </span>
                                                    )}
                                                    {totalItems <= 10 && (
                                                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                                                            (5 min completion)
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Total:</span>{' '}
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {formatPrice(order.total_amount)}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Order Items Preview */}
                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Items:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.cart.cart_items.slice(0, 3).map((item) => (
                                                        <span
                                                            key={item.id}
                                                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                                                        >
                                                            {item.menu_item.name} (x{item.quantity})
                                                        </span>
                                                    ))}
                                                    {order.cart.cart_items.length > 3 && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                                                            +{order.cart.cart_items.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {order.status === 'pending' && (
                                            <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'completed')}
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Complete order #${order.id}`}
                                                >
                                                    {isUpdating ? (
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Completing...
                                                        </span>
                                                    ) : (
                                                        'Complete'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to cancel order #${order.id}?`)) {
                                                            updateOrderStatus(order.id, 'cancelled');
                                                        }
                                                    }}
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    aria-label={`Cancel order #${order.id}`}
                                                >
                                                    {isUpdating ? (
                                                        <span className="flex items-center">
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Cancelling...
                                                        </span>
                                                    ) : (
                                                        'Cancel'
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

