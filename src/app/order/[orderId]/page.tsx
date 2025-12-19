'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order } from '@/types';
import { ordersApi } from '@/lib/api';
import { getOrderStatusLabel, getOrderStatusColor } from '@/lib/orderStatus';
import { getImageUrl } from '@/lib/imageUtils';

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || isNaN(Number(orderId))) {
                setError('Invalid order ID');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const orderData = await ordersApi.getById(Number(orderId));
                setOrder(orderData);
            } catch (error) {
                console.error('Failed to fetch order:', error);
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load order details'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };


    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="h-8 w-8 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Order Not Found
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {error}
                            </p>
                            <div className="space-x-4">
                                <button
                                    onClick={() => router.push('/menu')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Browse Menu
                                </button>
                                <button
                                    onClick={() => router.push('/track')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Track Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg
                            className="h-8 w-8 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Thank you for your order. We'll prepare it with care.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Order Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Order #{order.id}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                                    <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                    {getOrderStatusLabel(order.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Order Items
                        </h3>
                        <div className="space-y-4">
                            {order.cart.cart_items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    {/* Item Image */}
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                        {getImageUrl(item.menu_item.image_url) ? (
                                            <img
                                                src={getImageUrl(item.menu_item.image_url)!}
                                                alt={item.menu_item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
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

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.menu_item.name}
                                        </h4>
                                        {item.selected_size && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                Size: {item.selected_size}
                                            </p>
                                        )}
                                        {item.menu_item.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                {item.menu_item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatPrice(item.item_price * item.quantity)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Total
                            </span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatPrice(order.total_amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push('/menu')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                        Order Again
                    </button>
                    <button
                        onClick={() => router.push('/track')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                            />
                        </svg>
                        Track Another Order
                    </button>
                </div>

                {/* Additional Information */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Keep your order number <strong>#{order.id}</strong> for tracking and reference.
                    </p>
                    {order.status === 'pending' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Your order is being prepared. We'll notify you when it's ready for collection.
                        </p>
                    )}
                    {order.status === 'completed' && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                            Your order is ready for collection! Please come to the counter to pick it up.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}