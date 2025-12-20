'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@/types';
import { menuApi } from '@/lib/api';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MenuItemModal } from '@/components/MenuItemModal';
import { CategoryBar } from '@/components/CategoryBar';

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

    const handleItemClick = useCallback((item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }, []);

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
            <div className="min-h-screen bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            Our Menu
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Discover our delicious selection of items
                        </p>
                    </div>

                    {/* Loading State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse border border-gray-200"
                            >
                                <div className="w-full h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
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
            <div className="min-h-screen bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            Our Menu
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Unable to Load Menu
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {error}
                            </p>
                            <button
                                onClick={handleRetry}
                                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors duration-200"
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
        <div className="min-h-screen bg-[#F5F1EB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Our Menu
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Discover our delicious selection of items
                    </p>
                </div>

                {/* Category Bar - Horizontal Scrollable - Sticky */}
                <div className="sticky top-16 z-40 mb-4 bg-[#F5F1EB] pt-2 pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
                    <CategoryBar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />
                </div>

                {/* Filter Bar */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Offers
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Delivery Fee
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Under 30 min
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Highest rated
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Rating
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        Sort
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Results Count */}
                {selectedCategory !== 'All' && filteredItems.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''} in <span className="font-semibold text-gray-900">{selectedCategory}</span>
                        </p>
                    </div>
                )}

                {/* Menu Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No items in this category
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Try selecting a different category or view all items.
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors duration-200"
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Menu Items Available
                            </h3>
                            <p className="text-gray-600 mb-6">
                                There are currently no items available in our menu. Please check back later.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors duration-200"
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