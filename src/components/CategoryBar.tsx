'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CategoryIcon } from './CategoryIcon';

interface CategoryBarProps {
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

export function CategoryBar({ categories, selectedCategory, onCategorySelect }: CategoryBarProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowLeftArrow(scrollLeft > 0);
                setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
            }
        };

        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const scrollToCategory = (category: string) => {
        onCategorySelect(category);
        // Find the selected category button and scroll it into view
        setTimeout(() => {
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button && scrollContainerRef.current) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }, 100);
    };

    return (
        <div className="relative mb-6">
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#F97316] hover:bg-[#EA580C] shadow-lg rounded-lg px-3 py-2 transition-all border-2 border-[#F97316] hover:border-[#EA580C] hover:shadow-xl"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Categories Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {categories.map((category) => {
                    const isSelected = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            data-category={category}
                            onClick={() => scrollToCategory(category)}
                            className={`
                                flex flex-col items-center justify-center gap-2 min-w-[80px] px-4 py-3 rounded-xl
                                transition-all duration-200 shrink-0
                                ${isSelected
                                    ? 'bg-[#F97316] text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                                }
                            `}
                            aria-label={`Filter by ${category}`}
                            aria-pressed={isSelected}
                        >
                            <div className={`
                                ${isSelected ? 'text-white' : 'text-[#F97316]'}
                            `}>
                                <CategoryIcon category={category} />
                            </div>
                            <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                {category}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#F97316] hover:bg-[#EA580C] shadow-lg rounded-lg px-3 py-2 transition-all border-2 border-[#F97316] hover:border-[#EA580C] hover:shadow-xl"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

        </div>
    );
}

