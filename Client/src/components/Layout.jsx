import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Coffee, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const Layout = () => {
  const { cartCount } = useCart();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-red-500"
            >
              <Coffee className="h-8 w-8 text-yellow-500" />
              <span>Mellow Café</span>
            </Link>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center space-x-4">

              {/* CART */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-yellow-100 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-red-500" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* PROFILE ICON */}
              <Link to="/profile">
                <div className="h-10 w-10 rounded-full overflow-hidden border hover:bg-yellow-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              </Link>

              {/* LOGOUT */}
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-red-500"
              >
                Logout
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Mellow Café. All Rights Reserved.
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Deliciously yours, since 2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
