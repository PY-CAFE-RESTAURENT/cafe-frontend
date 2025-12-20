'use client';

import React from 'react';
import Link from 'next/link';

export default function DevStatusPage() {
    return (
        <div className="min-h-screen bg-[#F5F1EB] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🍽️ Cafe Restaurant Ordering System
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A modern self-service cafe ordering platform built with Next.js and FastAPI, 
                        enabling customers to browse menus, manage carts, and place orders seamlessly. 
                        The system features real-time order management, size-based pricing, automatic 
                        order completion, and comprehensive error handling for a smooth user experience.
                    </p>
                </div>

                {/* Project Overview */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📋</span> Project Overview
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        This is a full-stack cafe ordering system designed for self-service restaurants. 
                        Customers can browse a comprehensive menu with high-quality images, select item sizes 
                        (small/regular/large) with dynamic pricing, manage their cart, and place orders. 
                        The admin interface provides real-time order management with automatic completion 
                        based on order complexity. The system uses session-based cart management, eliminating 
                        the need for user authentication while maintaining a personalized experience.
                    </p>
                </div>

                {/* Features Implemented */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">✅</span> Features Implemented
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Menu browsing with 50+ items and high-quality images</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Size selection (small/regular/large) with dynamic pricing</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Shopping cart management (add, update, remove, clear)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Order placement and confirmation</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Order tracking by order ID</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Admin order management dashboard</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Auto-completion: 5min (≤10 items) / 10min (&gt;10 items)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Session-based cart persistence</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Error handling with retry logic</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Image optimization and lazy loading</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Accessibility (ARIA labels, keyboard navigation)</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-green-600 mr-2 font-bold">✓</span>
                                <span className="text-gray-700">Modern light theme with maroon & amber accents</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🛠️</span> Technology Stack
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Frontend</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2"></span>
                                    Next.js 16 (App Router)
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2"></span>
                                    React 19 with TypeScript
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2"></span>
                                    Tailwind CSS 4
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2"></span>
                                    React Context + useReducer
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#F97316] rounded-full mr-2"></span>
                                    Next.js Image Optimization
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Backend</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#8B3E47] rounded-full mr-2"></span>
                                    FastAPI (Python)
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#8B3E47] rounded-full mr-2"></span>
                                    SQLAlchemy ORM
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#8B3E47] rounded-full mr-2"></span>
                                    PostgreSQL Database
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#8B3E47] rounded-full mr-2"></span>
                                    Docker & Docker Compose
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="w-2 h-2 bg-[#8B3E47] rounded-full mr-2"></span>
                                    Pydantic for validation
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Future Features */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🚀</span> Future Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">User authentication & accounts</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Payment gateway integration</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Real-time order notifications</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Order history for users</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Favorites/Wishlist feature</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Reviews and ratings system</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Advanced admin dashboard</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Analytics and reporting</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Email/SMS notifications</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-amber-500 mr-2 font-bold">○</span>
                                <span className="text-gray-700">Multi-language support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔗</span> Quick Links
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Link 
                            href="/menu" 
                            className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
                        >
                            <div className="font-semibold text-[#F97316]">Menu</div>
                            <div className="text-sm text-amber-700">Browse items</div>
                        </Link>
                        <Link 
                            href="/cart" 
                            className="p-4 bg-[#8B3E47]/10 rounded-lg hover:bg-[#8B3E47]/20 transition-colors border border-[#8B3E47]/20"
                        >
                            <div className="font-semibold text-[#8B3E47]">Cart</div>
                            <div className="text-sm text-[#722F37]">View cart</div>
                        </Link>
                        <Link 
                            href="/admin/orders" 
                            className="p-4 bg-[#8B3E47]/10 rounded-lg hover:bg-[#8B3E47]/20 transition-colors border border-[#8B3E47]/20"
                        >
                            <div className="font-semibold text-[#8B3E47]">Admin</div>
                            <div className="text-sm text-[#722F37]">Manage orders</div>
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-600">
                    <p>Built with ❤️ using Next.js and FastAPI</p>
                </div>
            </div>
        </div>
    );
}

