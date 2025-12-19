import { MenuItem, CartSummary, CartItemCreate, CartItemUpdate, OrderConfirmation, Order } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new ApiError(response.status, errorText || 'API request failed');
        }

        return response.json();
    } catch (error) {
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new ApiError(
                0,
                `Failed to connect to API at ${url}. Please ensure the backend server is running at ${API_BASE_URL}`
            );
        }
        // Re-throw ApiError as-is
        if (error instanceof ApiError) {
            throw error;
        }
        // Wrap other errors
        throw new ApiError(0, error instanceof Error ? error.message : 'Unknown error occurred');
    }
}

// Menu API
export const menuApi = {
    getAll: (): Promise<MenuItem[]> =>
        fetchApi('/api/v1/menu'),

    getById: (id: number): Promise<MenuItem> =>
        fetchApi(`/api/v1/menu/${id}`),
};

// Cart API
export const cartApi = {
    get: (sessionId: string): Promise<CartSummary> =>
        fetchApi(`/api/v1/cart/${sessionId}`),

    addItem: (sessionId: string, item: CartItemCreate): Promise<CartSummary> =>
        fetchApi(`/api/v1/cart/${sessionId}/items`, {
            method: 'POST',
            body: JSON.stringify(item),
        }),

    updateItem: (sessionId: string, itemId: number, update: CartItemUpdate): Promise<CartSummary> =>
        fetchApi(`/api/v1/cart/${sessionId}/items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(update),
        }),

    removeItem: (sessionId: string, itemId: number): Promise<CartSummary> =>
        fetchApi(`/api/v1/cart/${sessionId}/items/${itemId}`, {
            method: 'DELETE',
        }),

    clear: (sessionId: string): Promise<{ message: string }> =>
        fetchApi(`/api/v1/cart/${sessionId}`, {
            method: 'DELETE',
        }),
};

// Orders API
export const ordersApi = {
    create: (sessionId: string): Promise<OrderConfirmation> =>
        fetchApi(`/api/v1/orders?session_id=${sessionId}`, {
            method: 'POST',
        }),

    getById: (orderId: number): Promise<Order> =>
        fetchApi(`/api/v1/orders/${orderId}`),

    getAll: (skip?: number, limit?: number): Promise<Order[]> => {
        const params = new URLSearchParams();
        if (skip !== undefined) params.append('skip', skip.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        const query = params.toString();
        return fetchApi(`/api/v1/orders${query ? `?${query}` : ''}`);
    },

    updateStatus: (orderId: number, status: 'pending' | 'completed' | 'cancelled'): Promise<Order> =>
        fetchApi(`/api/v1/orders/${orderId}?status=${status}`, {
            method: 'PUT',
        }),
};