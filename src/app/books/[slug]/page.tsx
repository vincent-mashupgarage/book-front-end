'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book } from '@/app/types';
import { booksService, cartsService } from '@/app/lib/api';
import Button from '@/app/components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { useAuth } from '@/app/contexts/AuthContext';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchBook(params.slug as string);
    }
  }, [params.slug]);

  const fetchBook = async (slug: string) => {
    try {
      const bookData = await booksService.getBySlug(slug);
      setBook(bookData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch book:', err);
      setError('Book not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;

    if (!isLoggedIn || !user) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      // Use the actual logged-in user's ID
      const userId = parseInt(user.id);
      
      // Get or create user's cart
      let cart;
      try {
        cart = await cartsService.getUserCart(userId);
      } catch {
        cart = await cartsService.createCart(userId);
      }

      // Add item to cart
      await cartsService.addToCart(cart.id, {
        book_id: book.id,
        quantity: quantity,
      });

      alert('Book added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add book to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Book not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Book Cover</span>
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              by {book.author}
            </p>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              {formatCurrency(book.price)}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {book.stock_quantity > 0 ? (
              <>
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 font-medium">
                  In Stock ({book.stock_quantity} available)
                </span>
              </>
            ) : (
              <>
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-red-600 font-medium">
                  Out of Stock
                </span>
              </>
            )}
          </div>

          {/* Add to Cart */}
          {book.stock_quantity > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: Math.min(book.stock_quantity, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                isLoading={addingToCart}
                className="w-full sm:w-auto"
              >
                Add to Cart
              </Button>
            </div>
          )}

          {/* Book Information */}
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {book.isbn && (
                  <div>
                    <span className="font-medium text-gray-700">ISBN:</span>
                    <span className="ml-2 text-gray-600">{book.isbn}</span>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <span className="font-medium text-gray-700">Publisher:</span>
                    <span className="ml-2 text-gray-600">{book.publisher}</span>
                  </div>
                )}
                {book.publication_date && (
                  <div>
                    <span className="font-medium text-gray-700">Published:</span>
                    <span className="ml-2 text-gray-600">{formatDate(book.publication_date)}</span>
                  </div>
                )}
                {book.page_count && (
                  <div>
                    <span className="font-medium text-gray-700">Pages:</span>
                    <span className="ml-2 text-gray-600">{book.page_count}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Language:</span>
                  <span className="ml-2 text-gray-600">{book.language}</span>
                </div>
                {book.category && (
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{book.category.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {book.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}