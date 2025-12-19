'use client';

import React from 'react';
import Link from 'next/link';

export default function DevStatusPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        🍽️ Cafe Restaurant Ordering System
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A modern self-service cafe ordering platform built with Next.js and FastAPI, 
                        enabling customers to browse menus, manage carts, and place orders seamlessly. 
                        The system features real-time order management, size-based pricing, automatic 
                        order completion, and comprehensive error handling for a smooth user experience.
                    </p>
                </div>

                {/* Project Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">📋</span> Project Overview
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This is a full-stack cafe ordering system designed for self-service restaurants. 
                        Customers can browse a comprehensive menu with high-quality images, select item sizes 
                        (small/regular/large) with dynamic pricing, manage their cart, and place orders. 
                        The admin interface provides real-time order management with automatic completion 
                        based on order complexity. The system uses session-based cart management, eliminating 
                        the need for user authentication while maintaining a personalized experience.
                    </p>
                </div>

                {/* Features Implemented */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">✅</span> Features Implemented
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Menu browsing with 50+ items and high-quality images</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Size selection (small/regular/large) with dynamic pricing</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Shopping cart management (add, update, remove, clear)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Order placement and confirmation</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Order tracking by order ID</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Admin order management dashboard</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Auto-completion: 5min (≤10 items) / 10min (&gt;10 items)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Session-based cart persistence</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Error handling with retry logic</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Image optimization and lazy loading</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Accessibility (ARIA labels, keyboard navigation)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <span className="text-gray-700 dark:text-gray-300">Dark mode support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">🛠️</span> Technology Stack
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Frontend</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Next.js 16 (App Router)
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    React 19 with TypeScript
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Tailwind CSS 4
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    React Context + useReducer
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Next.js Image Optimization
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Backend</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    FastAPI (Python)
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    SQLAlchemy ORM
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    PostgreSQL Database
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Docker & Docker Compose
                                </li>
                                <li className="flex items-center text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Pydantic for validation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Future Features */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">🚀</span> Future Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">User authentication & accounts</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Payment gateway integration</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Real-time order notifications</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Order history for users</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Favorites/Wishlist feature</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Reviews and ratings system</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Advanced admin dashboard</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Analytics and reporting</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Email/SMS notifications</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-yellow-500 mr-2">○</span>
                                <span className="text-gray-700 dark:text-gray-300">Multi-language support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">🔗</span> Quick Links
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link 
                            href="/menu" 
                            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        >
                            <div className="font-semibold text-blue-700 dark:text-blue-300">Menu</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Browse items</div>
                        </Link>
                        <Link 
                            href="/cart" 
                            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        >
                            <div className="font-semibold text-green-700 dark:text-green-300">Cart</div>
                            <div className="text-sm text-green-600 dark:text-green-400">View cart</div>
                        </Link>
                        <Link 
                            href="/admin/orders" 
                            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        >
                            <div className="font-semibold text-purple-700 dark:text-purple-300">Admin</div>
                            <div className="text-sm text-purple-600 dark:text-purple-400">Manage orders</div>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
                    <p>Built with ❤️ using Next.js and FastAPI</p>
                </div>
            </div>
        </div>
    );
}

