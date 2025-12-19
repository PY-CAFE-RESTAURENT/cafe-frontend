'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { menuApi } from '@/lib/api';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItemModal } from '@/components/MenuItemModal';

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        loadMenuItems();
    }, []);

    const loadMenuItems = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const items = await menuApi.getAll();
            console.log('Loaded menu items:', items);
            console.log('Categories found:', items.map(item => item.category));
            setMenuItems(items);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load menu items';
            setError(errorMessage);
            console.error('Failed to load menu items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        loadMenuItems();
    };

    const handleItemClick = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    // Get unique categories from menu items (handle both single category and multiple categories)
    const allCategoriesSet = new Set<string>();

    menuItems.forEach(item => {
        // Add single category if exists
        if (item.category && typeof item.category === 'string' && item.category.trim().length > 0) {
            allCategoriesSet.add(item.category.trim());
        }
        // Add multiple categories if exists
        if (item.categories && Array.isArray(item.categories)) {
            item.categories.forEach(cat => {
                if (cat && typeof cat === 'string' && cat.trim().length > 0) {
                    allCategoriesSet.add(cat.trim());
                }
            });
        }
    });

    const uniqueCategories = Array.from(allCategoriesSet).sort();

    // Build categories list: All, then Veg/Non-Veg, then other categories
    const vegNonVegCategories: string[] = [];
    if (menuItems.some(item => item.is_veg === true)) {
        vegNonVegCategories.push('Veg');
    }
    if (menuItems.some(item => item.is_veg === false || item.is_veg === undefined)) {
        vegNonVegCategories.push('Non-Veg');
    }

    const categories = ['All', ...vegNonVegCategories, ...uniqueCategories];

    // Filter menu items by selected category
    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : selectedCategory === 'Veg'
            ? menuItems.filter(item => item.is_veg === true)
            : selectedCategory === 'Non-Veg'
                ? menuItems.filter(item => item.is_veg === false || item.is_veg === undefined)
                : menuItems.filter(item => {
                    // Check if item belongs to selected category (either in single category or categories array)
                    const singleCategoryMatch = item.category === selectedCategory;
                    const multipleCategoriesMatch = item.categories && Array.isArray(item.categories)
                        ? item.categories.includes(selectedCategory)
                        : false;
                    return singleCategoryMatch || multipleCategoriesMatch;
                });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Menu
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Discover our delicious selection of items
                        </p>
                    </div>

                    {/* Loading State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Menu
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Discover our delicious selection of items
                        </p>
                    </div>

                    {/* Error State */}
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-center max-w-md">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto h-16 w-16 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Unable to Load Menu
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {error}
                            </p>
                            <button
                                onClick={handleRetry}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
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
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Our Menu
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Discover our delicious selection of items
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Categories
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedCategory === category
                                        ? 'bg-amber-600 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No categories available
                            </p>
                        )}
                    </div>
                    {selectedCategory !== 'All' && filteredItems.length > 0 && (
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in {selectedCategory}
                        </p>
                    )}
                </div>

                {/* Menu Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <MenuItemCard
                                key={item.id}
                                item={item}
                                onItemClick={handleItemClick}
                            />
                        ))}
                    </div>
                ) : menuItems.length > 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-center max-w-md">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No items in this category
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Try selecting a different category or view all items.
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
                            >
                                View All Items
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-center max-w-md">
                            <div className="mb-4">
                                <svg
                                    className="mx-auto h-16 w-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Menu Items Available
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                There are currently no items available in our menu. Please check back later.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
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
                )}

                {/* Menu Item Modal */}
                <MenuItemModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            </div>
        </div>
    );
}