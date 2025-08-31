export interface User {
    id: string;
    email: string;
    name: string;
    address?: string;
    role: 'customer' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    price: number;
    stock_quantity: number;
    isbn?: string;
    publisher?: string;
    publication_date?: string;
    page_count?: number;
    language: string;
    slug: string;
    category_id: number;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number;
    book_id: number;
    book?: Book;
    quantity: number;
    created_at: string;
    updated_at: string;
}

export interface Cart {
    id: number;
    user_id: number;
    cart_items?: CartItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    book_id: number;
    book?: Book;
    quantity: number;
    price_at_purchase: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    user?: User;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address?: string;
    order_items?: OrderItem[];
    created_at: string;
    updated_at: string;
}


export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
    details?: string[]
}

export interface PaginationMeta {
    current_page: number;
    total_pages: number;
    total_count: number;
}

export interface BooksResponse {
    books: Book[];
    meta: PaginationMeta;
}