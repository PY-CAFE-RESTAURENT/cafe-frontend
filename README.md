# Cafe Restaurant Frontend

A modern, responsive Next.js frontend for a self-service cafe/restaurant ordering system. Built with React 19, TypeScript, and Tailwind CSS, providing an intuitive interface for customers to browse menus, manage carts, and place orders.

## 🚀 Overview

This frontend application provides a seamless ordering experience for cafe customers. It features a beautiful, accessible UI with dark mode support, real-time cart management, order tracking, and an admin dashboard for order management. The application uses session-based cart persistence, eliminating the need for user authentication while maintaining a personalized experience.

## ✨ Features

### Customer Features
- **Menu Browsing**: Browse 50+ menu items with high-quality images, descriptions, and categories
- **Size Selection**: Choose from small/regular/large sizes with dynamic pricing
- **Shopping Cart**: Add, update, remove items with real-time quantity management
- **Order Placement**: Seamless checkout process with order confirmation
- **Order Tracking**: Track orders by order ID with real-time status updates
- **Session Persistence**: Cart persists across browser sessions using localStorage

### Admin Features
- **Order Management**: View all orders with status, timestamps, and details
- **Auto-completion**: Automatic order completion (5min for ≤10 items, 10min for >10 items)
- **Manual Controls**: Complete or cancel orders manually
- **Collection Status**: "Please Collect" and "Collected" status labels

### Technical Features
- **Error Handling**: Comprehensive error boundaries and retry logic with exponential backoff
- **Image Optimization**: Next.js Image component with lazy loading and fallback handling
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Dark Mode**: Full dark mode support throughout the application
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Performance**: Optimized with React Context, useMemo, and code splitting

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API + useReducer
- **Icons**: Heroicons
- **Image Optimization**: Next.js Image component
- **API Client**: Native fetch with custom error handling

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running at `http://localhost:8000` (or configure `NEXT_PUBLIC_API_URL`)

### Installation

1. Clone and navigate to the project:
```bash
git clone <your-repo>
cd cafe-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (optional):
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── menu/              # Menu browsing page
│   ├── cart/              # Shopping cart page
│   ├── track/             # Order tracking page
│   ├── order/[orderId]/   # Order confirmation page
│   ├── admin/orders/      # Admin order management
│   └── dev-status/        # Development status page
├── components/            # Reusable React components
│   ├── MenuItemCard.tsx
│   ├── MenuItemModal.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── Navigation.tsx
│   └── ErrorBoundary.tsx
├── contexts/              # React Context providers
│   └── CartContext.tsx
├── lib/                   # Utility functions
│   ├── api.ts            # API client
│   ├── session.ts        # Session management
│   ├── retry.ts          # Retry logic
│   ├── imageUtils.ts     # Image URL utilities
│   └── orderStatus.ts    # Order status helpers
└── types/                 # TypeScript type definitions
    └── index.ts
```

## 🎨 Key Components

### MenuItemCard
Displays menu items in a grid with images, prices, and add-to-cart functionality. Supports size selection for items with size-based pricing.

### MenuItemModal
Detailed view of menu items with size selection, quantity controls, and enhanced add-to-cart functionality.

### CartItem
Individual cart item display with quantity controls, size display, and remove functionality.

### CartSummary
Cart totals, item count, and checkout button with loading states.

### Navigation
Main navigation bar with cart badge, responsive design, and active state indicators.

### ErrorBoundary
Global error boundary for graceful error handling and recovery.

## 🔌 API Integration

The frontend communicates with the FastAPI backend through a custom API client (`lib/api.ts`):

- **Menu API**: Fetch menu items
- **Cart API**: Cart operations (get, add, update, remove, clear)
- **Orders API**: Order creation, tracking, and management

All API calls include:
- Automatic retry logic with exponential backoff
- Session recovery for invalid sessions
- Comprehensive error handling
- Loading states

## 🎯 Key Features Explained

### Session Management
- UUID-based session IDs stored in localStorage
- Automatic session recovery on invalid sessions
- Session validation and regeneration

### Image Handling
- Automatic URL transformation for relative paths
- Next.js Image optimization with fallback to regular img tags
- Lazy loading and proper sizing attributes
- Error handling with placeholder display

### Order Auto-completion
- Orders with ≤10 items: Auto-complete after 5 minutes
- Orders with >10 items: Auto-complete after 10 minutes
- Real-time countdown timers in admin dashboard
- Collection status labels ("Please Collect", "Collected")

### Error Handling
- React Error Boundaries for UI errors
- API retry logic with exponential backoff
- Network error detection and recovery
- User-friendly error messages

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)

## 📱 Pages

- `/` - Home page (redirects to menu)
- `/menu` - Browse menu items
- `/cart` - Shopping cart
- `/track` - Track orders by ID
- `/order/[orderId]` - Order confirmation page
- `/admin/orders` - Admin order management
- `/dev-status` - Development status and project info

## 🎨 Styling

The application uses Tailwind CSS with:
- Custom color scheme (amber/green accents)
- Dark mode support via `dark:` classes
- Responsive breakpoints (sm, md, lg)
- Custom animations and transitions

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## 🚀 Future Enhancements

- User authentication and accounts
- Payment gateway integration
- Real-time order notifications
- Order history
- Favorites/wishlist
- Reviews and ratings
- Advanced admin dashboard
- Analytics and reporting

## 📄 License

This project is part of a cafe ordering system demonstration.
