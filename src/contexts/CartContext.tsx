'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { CartSummary, OrderConfirmation } from '@/types';
import { cartApi, ordersApi } from '@/lib/api';
import { getCurrentSessionId, ensureValidSession, recoverSession } from '@/lib/session';
import { retry, isRetryableError } from '@/lib/retry';

// Cart Context Types
interface CartContextType {
    cart: CartSummary | null;
    sessionId: string;
    addToCart: (itemId: number, quantity: number, size?: string) => Promise<void>;
    updateCartItem: (itemId: number, quantity: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    placeOrder: () => Promise<OrderConfirmation>;
    isLoading: boolean;
    error: string | null;
}

// Cart Actions
type CartAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CART'; payload: CartSummary | null }
    | { type: 'SET_SESSION_ID'; payload: string };

// Cart State
interface CartState {
    cart: CartSummary | null;
    sessionId: string;
    isLoading: boolean;
    error: string | null;
}

// Cart Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        case 'SET_CART':
            return {
                ...state,
                cart: action.payload,
                isLoading: false,
                error: null,
            };
        case 'SET_SESSION_ID':
            return {
                ...state,
                sessionId: action.payload,
            };
        default:
            return state;
    }
}

// Initial State
const initialState: CartState = {
    cart: null,
    sessionId: '',
    isLoading: false,
    error: null,
};

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Props
interface CartProviderProps {
    children: ReactNode;
}

// Cart Provider Component
export function CartProvider({ children }: CartProviderProps) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from API with retry logic
    const loadCart = useCallback(async (sessionId: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartSummary = await retry(
                () => cartApi.get(sessionId),
                {
                    maxAttempts: 3,
                    retryable: (error) => {
                        // Don't retry 404 errors (cart doesn't exist yet)
                        if (error?.status === 404) {
                            return false;
                        }
                        return isRetryableError(error);
                    },
                }
            );
            dispatch({ type: 'SET_CART', payload: cartSummary });
        } catch (error: any) {
            // If cart doesn't exist yet, that's okay - it will be created on first add
            if (error?.status === 404 || (error instanceof Error && error.message.includes('404'))) {
                dispatch({ type: 'SET_CART', payload: null });
            } else {
                // Try to recover session and retry once
                try {
                    const recoveredSession = recoverSession();
                    dispatch({ type: 'SET_SESSION_ID', payload: recoveredSession.sessionId });
                    const cartSummary = await cartApi.get(recoveredSession.sessionId);
                    dispatch({ type: 'SET_CART', payload: cartSummary });
                } catch (recoveryError) {
                    dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart. Please try again.' });
                }
            }
        }
    }, []);

    // Initialize session on mount
    useEffect(() => {
        try {
            // Ensure we have a valid session
            const session = ensureValidSession();
            dispatch({ type: 'SET_SESSION_ID', payload: session.sessionId });

            // Load existing cart for the session
            loadCart(session.sessionId);
        } catch (error) {
            console.error('Failed to initialize session:', error);
            // Try to recover session
            try {
                const recoveredSession = recoverSession();
                dispatch({ type: 'SET_SESSION_ID', payload: recoveredSession.sessionId });
                loadCart(recoveredSession.sessionId);
            } catch (recoveryError) {
                dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize session. Please refresh the page.' });
            }
        }
    }, [loadCart]);

    // Add item to cart with retry and session recovery
    const addToCart = async (itemId: number, quantity: number, size?: string): Promise<void> => {
        if (quantity <= 0) {
            dispatch({ type: 'SET_ERROR', payload: 'Quantity must be a positive integer' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartSummary = await retry(
                () => cartApi.addItem(state.sessionId, {
                    menu_item_id: itemId,
                    quantity,
                    selected_size: size || null,
                }),
                {
                    maxAttempts: 3,
                    retryable: isRetryableError,
                }
            );
            dispatch({ type: 'SET_CART', payload: cartSummary });
        } catch (error: any) {
            // Try session recovery on failure
            if (error?.status === 401 || error?.status === 404) {
                try {
                    const recoveredSession = recoverSession();
                    dispatch({ type: 'SET_SESSION_ID', payload: recoveredSession.sessionId });
                    const cartSummary = await cartApi.addItem(recoveredSession.sessionId, {
                        menu_item_id: itemId,
                        quantity,
                        selected_size: size || null,
                    });
                    dispatch({ type: 'SET_CART', payload: cartSummary });
                } catch (recoveryError) {
                    dispatch({
                        type: 'SET_ERROR',
                        payload: error instanceof Error ? error.message : 'Failed to add item to cart'
                    });
                }
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to add item to cart'
                });
            }
        }
    };

    // Update cart item quantity with retry
    const updateCartItem = async (itemId: number, quantity: number): Promise<void> => {
        if (quantity <= 0) {
            dispatch({ type: 'SET_ERROR', payload: 'Quantity must be a positive integer' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartSummary = await retry(
                () => cartApi.updateItem(state.sessionId, itemId, { quantity }),
                {
                    maxAttempts: 3,
                    retryable: isRetryableError,
                }
            );
            dispatch({ type: 'SET_CART', payload: cartSummary });
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to update cart item'
            });
        }
    };

    // Remove item from cart with retry
    const removeFromCart = async (itemId: number): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const cartSummary = await retry(
                () => cartApi.removeItem(state.sessionId, itemId),
                {
                    maxAttempts: 3,
                    retryable: isRetryableError,
                }
            );
            dispatch({ type: 'SET_CART', payload: cartSummary });
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to remove item from cart'
            });
        }
    };

    // Clear entire cart with retry
    const clearCart = async (): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await retry(
                () => cartApi.clear(state.sessionId),
                {
                    maxAttempts: 3,
                    retryable: isRetryableError,
                }
            );
            dispatch({ type: 'SET_CART', payload: null });
        } catch (error) {
            dispatch({
                type: 'SET_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to clear cart'
            });
        }
    };

    // Place order from current cart with retry
    const placeOrder = async (): Promise<OrderConfirmation> => {
        // Validate cart has items
        if (!state.cart || state.cart.total_items === 0) {
            const error = new Error('Cannot place order: cart is empty');
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const orderConfirmation = await retry(
                () => ordersApi.create(state.sessionId),
                {
                    maxAttempts: 3,
                    retryable: (error) => {
                        // Don't retry client errors (4xx) except 429 (rate limit)
                        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
                            return false;
                        }
                        return isRetryableError(error);
                    },
                }
            );

            // Clear cart on backend and frontend after successful order placement
            try {
                await retry(
                    () => cartApi.clear(state.sessionId),
                    {
                        maxAttempts: 2,
                        retryable: isRetryableError,
                    }
                );
            } catch (clearError) {
                // Log error but don't fail the order placement
                console.warn('Failed to clear cart after order placement:', clearError);
            }
            
            // Clear cart state in frontend
            dispatch({ type: 'SET_CART', payload: null });

            return orderConfirmation;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            throw error;
        }
    };

    const contextValue: CartContextType = {
        cart: state.cart,
        sessionId: state.sessionId,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        placeOrder,
        isLoading: state.isLoading,
        error: state.error,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use cart context
export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}