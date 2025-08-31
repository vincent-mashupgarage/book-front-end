// Utility functions for the Bookworm application

// Format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Format date and time
export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

// Generate slug from title
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Calculate cart total
export const calculateCartTotal = (items: any[]): number => {
    return items.reduce((total, item) => {
        return total + (item.book?.price || 0) * item.quantity;
    }, 0);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Get auth token from localStorage (client-side only)
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// Class name utility for conditional classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};