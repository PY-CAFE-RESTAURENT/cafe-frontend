'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, ClipboardDocumentListIcon, HomeIcon, Cog6ToothIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon as ShoppingCartSolidIcon } from '@heroicons/react/24/solid';

export default function Navigation() {
    const pathname = usePathname();
    const { cart } = useCart();

    const totalItems = cart?.total_items || 0;

    const navItems = [
        {
            name: 'Menu',
            href: '/menu',
            icon: HomeIcon,
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: ShoppingCartIcon,
            solidIcon: ShoppingCartSolidIcon,
            badge: totalItems > 0 ? totalItems : undefined,
        },
        {
            name: 'Manage Orders',
            href: '/admin/orders',
            icon: Cog6ToothIcon,
        },
        {
            name: 'Track Order',
            href: '/track',
            icon: ClipboardDocumentListIcon,
        },
        {
            name: 'Dev Status',
            href: '/dev-status',
            icon: InformationCircleIcon,
        },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200" role="navigation" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto   px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link href="/menu" className="flex items-center space-x-2" aria-label="Cafe - Go to menu">
                            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center" aria-hidden="true">
                                <span className="text-white font-bold text-sm">SA</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">sASWALs Cafe</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = isActive && item.solidIcon ? item.solidIcon : item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'text-amber-600 bg-amber-50'
                                        : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-label={`${item.badge} items in cart`}>
                                            <span aria-hidden="true">{item.badge > 99 ? '99+' : item.badge}</span>
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = isActive && item.solidIcon ? item.solidIcon : item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative p-2 rounded-md transition-colors ${isActive
                                        ? 'text-amber-600 bg-amber-50'
                                        : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    aria-label={item.name}
                                >
                                    <Icon className="w-6 h-6" />
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-label={`${item.badge} items in cart`}>
                                            <span aria-hidden="true">{item.badge > 99 ? '99+' : item.badge}</span>
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}