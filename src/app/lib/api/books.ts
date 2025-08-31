// src/services/api/booksService.ts
import { apiClient } from './base';
import { Book, BooksResponse } from '@/app/types';

export interface BooksQueryParams {
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
}

export interface CreateBookData {
  title: string;
  author: string;
  description?: string;
  price: number;
  stock_quantity: number;
  isbn?: string;
  publisher?: string;
  publication_date?: string;
  page_count?: number;
  language?: string;
  category_id: number;
}

export interface UpdateBookData extends Partial<CreateBookData> { }

const BOOKS_ENDPOINT = '/books';

export const getBooks = async (params?: BooksQueryParams): Promise<BooksResponse> => {
  const response = await apiClient.get<BooksResponse>(BOOKS_ENDPOINT, { params });
  return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
  const response = await apiClient.get<Book>(`${BOOKS_ENDPOINT}/${id}`);
  return response.data;
};

export const getBookBySlug = async (slug: string): Promise<Book> => {
  const response = await apiClient.get<Book>(`${BOOKS_ENDPOINT}/slug/${slug}`);
  return response.data;
};

export const createBook = async (bookData: CreateBookData): Promise<Book> => {
  const response = await apiClient.post<Book>(BOOKS_ENDPOINT, { book: bookData });
  return response.data;
};

export const updateBook = async (id: number, bookData: UpdateBookData): Promise<Book> => {
  const response = await apiClient.put<Book>(`${BOOKS_ENDPOINT}/${id}`, { book: bookData });
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await apiClient.delete(`${BOOKS_ENDPOINT}/${id}`);
};

export const getBooksByCategory = async (categoryId: number, params?: Omit<BooksQueryParams, 'category_id'>): Promise<BooksResponse> => {
  return getBooks({ ...params, category_id: categoryId });
};

export const searchBooks = async (query: string, params?: Omit<BooksQueryParams, 'search'>): Promise<BooksResponse> => {
  return getBooks({ ...params, search: query });
};

// Maintain backward compatibility with the original service object
export const booksService = {
  getAll: getBooks,
  getById: getBookById,
  getBySlug: getBookBySlug,
  create: createBook,
  update: updateBook,
  delete: deleteBook,
  getByCategory: getBooksByCategory,
  search: searchBooks,
};

export default booksService;