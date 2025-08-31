'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import Button from './ui/Button';
import { cn } from '@/app/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const { user, isLoggedIn, logout: authLogout, isLoading } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authLogout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              📚 Bookworm
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu.Root className="relative hidden md:block">
            <NavigationMenu.List className="flex space-x-1">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/books"
                    className={cn(
                      "block select-none rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                      "dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                    )}
                  >
                    Books
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/categories"
                    className={cn(
                      "block select-none rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                      "dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                    )}
                  >
                    Categories
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-200 dark:hover:text-blue-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H3m4 7v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h10" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User actions */}
            {isLoggedIn ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-200 dark:hover:text-blue-400">
                    <Avatar.Root className="inline-flex h-8 w-8 select-none items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <Avatar.Fallback className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <span className="hidden sm:block">{user?.name || 'User'}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className={cn(
                      "min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md",
                      "dark:bg-gray-950 dark:border-gray-800",
                      "data-[state=open]:animate-in data-[state=closed]:animate-out",
                      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                      "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    )}
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/profile"
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                          "hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
                          "dark:text-gray-50"
                        )}
                      >
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link
                        href="/orders"
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                          "hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
                          "dark:text-gray-50"
                        )}
                      >
                        Orders
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenu.Item
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 text-red-600 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:text-red-400"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}