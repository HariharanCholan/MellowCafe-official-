import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Helmet } from 'react-helmet';
    import { useCart } from '@/contexts/CartContext';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

    const CartPage = () => {
      const { cartItems, cartTotal, updateQuantity, removeFromCart, cartCount } = useCart();
      const navigate = useNavigate();
      const [pickupTime, setPickupTime] = useState('');

      const handlePlaceOrder = () => {
        if (!pickupTime) {
          alert('Please select a pickup time.');
          return;
        }
        navigate('/order-confirmation');
      };

      const getPickupTimeOptions = () => {
        const options = [];
        const now = new Date();
        for (let i = 1; i <= 4; i++) {
          const pickupDate = new Date(now.getTime() + i * 60 * 60 * 1000);
          options.push(pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        return options;
      };

      return (
        <>
          <Helmet>
            <title>Your Cart - Mellow Café</title>
            <meta name="description" content="Review your order and proceed to checkout." />
          </Helmet>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/" className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold mb-8">
                <ArrowLeft size={20} />
                Continue Shopping
              </Link>
              <h1 className="text-4xl font-extrabold text-red-500 tracking-tight">Your Cart</h1>
              <p className="mt-2 text-lg text-gray-600">{cartCount} items ready for you.</p>
            </motion.div>

            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
              <section className="lg:col-span-7">
                {cartItems.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 border-2 border-dashed rounded-lg">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
                    <Button asChild className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Link to="/">Start Ordering</Link>
                    </Button>
                  </motion.div>
                ) : (
                  <Card>
                    <CardContent className="p-0 divide-y">
                      <AnimatePresence>
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                            className="flex items-center justify-between p-4"
                          >
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">₹{item.price}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-md">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="font-semibold w-20 text-right">₹{item.price * item.quantity}</p>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => removeFromCart(item.id)}>
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                )}
              </section>

              {cartItems.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-16 rounded-lg bg-gray-50 p-6 lg:col-span-5 lg:mt-0"
                >
                  <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">₹{cartTotal}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <p className="text-base font-medium text-gray-900">Order total</p>
                      <p className="text-base font-medium text-gray-900">₹{cartTotal}</p>
                    </div>
                    <div className="space-y-2 pt-4">
                      <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700">Pickup Time</label>
                      <select
                        id="pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>Select a time</option>
                        {getPickupTimeOptions().map(time => <option key={time} value={time}>{time}</option>)}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Please pick up your order within 4 hours of your selected time.</p>
                    </div>
                  </div>
                  <Button onClick={handlePlaceOrder} disabled={!pickupTime} className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white">
                    Place Order
                  </Button>
                </motion.section>
              )}
            </div>
          </div>
        </>
      );
    };

    export default CartPage;