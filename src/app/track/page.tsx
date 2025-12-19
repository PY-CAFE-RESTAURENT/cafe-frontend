'use client';

import { useState } from 'react';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { useUI } from '@/contexts/UIContext';
import { getOrderStatusLabel, getOrderStatusColor } from '@/lib/orderStatus';

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { isSubmitting, showToast } = useUI();
    const { submit, error, clearError } = useFormSubmission<Order>({
        successMessage: 'Order found successfully',
        errorMessage: 'Order not found. Please check your order ID and try again.',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setValidationError(null);

        if (!orderId.trim()) {
            setValidationError('Please enter an order ID');
            showToast('warning', 'Validation Error', 'Please enter an order ID');
            return;
        }

        const orderIdNum = parseInt(orderId.trim());
        if (isNaN(orderIdNum) || orderIdNum <= 0) {
            setValidationError('Please enter a valid order ID');
            showToast('warning', 'Validation Error', 'Please enter a valid order ID');
            return;
        }

        const orderData = await submit(async () => {
            return await ordersApi.getById(orderIdNum);
        });

        if (orderData) {
            setOrder(orderData);
        } else {
            setOrder(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };


    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

            <form onSubmit={handleSubmit} className="mb-8" aria-label="Track order form">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                            Order ID
                        </label>
                        <input
                            type="text"
                            id="orderId"
                            name="orderId"
                            value={orderId}
                            onChange={(e) => {
                                setOrderId(e.target.value);
                                clearError();
                            }}
                            placeholder="Enter your order ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                            aria-required="true"
                            aria-invalid={validationError ? 'true' : 'false'}
                            aria-describedby={validationError ? 'orderId-error' : undefined}
                        />
                        {validationError && (
                            <div id="orderId-error" className="mt-1 text-sm text-red-600" role="alert">
                                {validationError}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !orderId.trim()}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:self-end"
                        aria-label="Track order"
                    >
                        {isSubmitting ? 'Searching...' : 'Track Order'}
                    </button>
                </div>
            </form>

            {(error || validationError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md" role="alert" aria-live="assertive">
                    <p className="text-red-800">{error || validationError}</p>
                </div>
            )}

            {order && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6" role="region" aria-label="Order details">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                            <p className="text-gray-600" aria-label={`Order placed on ${formatDate(order.created_at)}`}>Placed on {formatDate(order.created_at)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`} role="status" aria-label={`Order status: ${getOrderStatusLabel(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.cart.cart_items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.menu_item.name}</h4>
                                        {item.selected_size && (
                                            <p className="text-xs text-gray-500 capitalize">
                                                Size: {item.selected_size}
                                            </p>
                                        )}
                                        {item.menu_item.description && (
                                            <p className="text-sm text-gray-600">{item.menu_item.description}</p>
                                        )}
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        <p className="font-medium text-gray-900">
                                            ${(item.item_price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">
                                ${order.total_amount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}