// API Response Types based on backend schemas
export interface MenuItem {
    id: number;
    name: string;
    description?: string;
    price: number;
    category?: string; // Single category for backward compatibility
    categories?: string[]; // Multiple categories like ["coffee", "hot-drinks", "veg"]
    size?: string;
    is_veg?: boolean;
    image_url?: string;
    size_prices?: { [key: string]: number }; // e.g., {"small": 2.99, "regular": 3.99, "large": 4.99}
}

export interface CartItem {
    id: number;
    menu_item_id: number;
    quantity: number;
    menu_item: MenuItem;
    selected_size?: string | null;
    item_price: number; // Price at time of adding (based on size)
}

export interface Cart {
    id: number;
    session_id: string;
    created_at: string;
    cart_items: CartItem[];
}

export interface CartSummary {
    cart: Cart;
    total_amount: number;
    total_items: number;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
    id: number;
    cart_id: number;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    cart: Cart;
}

export interface OrderConfirmation {
    order: Order;
    message: string;
}

// API Request Types
export interface CartItemCreate {
    menu_item_id: number;
    quantity: number;
    selected_size?: string | null;
}

export interface CartItemUpdate {
    quantity: number;
}

// Session Management Types
export interface SessionData {
    sessionId: string;
    createdAt: string;
    lastActivity: string;
}