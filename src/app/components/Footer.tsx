import Link from 'next/link';
import * as Separator from '@radix-ui/react-separator';
import { cn } from '@/app/lib/utils';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white dark:bg-gray-950 dark:border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">📚 Bookworm</h3>
            <p className="text-gray-400 dark:text-gray-300 mb-4">
              Your one-stop destination for all your reading needs. Discover, explore, 
              and enjoy thousands of books across all genres.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.175 1.219-5.175s-.311-.623-.311-1.544c0-1.445.839-2.524 1.883-2.524.888 0 1.317.664 1.317 1.46 0 .889-.567 2.219-.859 3.449-.244 1.031.517 1.871 1.533 1.871 1.84 0 3.254-1.94 3.254-4.743 0-2.481-1.784-4.216-4.331-4.216-2.951 0-4.688 2.214-4.688 4.499 0 .891.342 1.847.768 2.366.084.101.096.19.071.294-.077.315-.25 1.011-.284 1.153-.045.186-.145.226-.334.136-1.249-.581-2.03-2.407-2.03-3.874 0-3.269 2.375-6.27 6.848-6.27 3.598 0 6.389 2.563 6.389 5.985 0 3.575-2.252 6.448-5.378 6.448-1.05 0-2.037-.546-2.374-1.201 0 0-.52 1.978-.645 2.463-.233.897-.866 2.023-1.29 2.709.971.301 1.997.462 3.062.462 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator.Root className="bg-gray-800 dark:bg-gray-700 h-px w-full mt-8 mb-8" />
        <div className="text-center">
          <p className="text-gray-400 dark:text-gray-300">
            © {new Date().getFullYear()} Bookworm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}