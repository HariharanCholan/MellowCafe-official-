import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, cartCount } = useCart();
  const [pickupTime, setPickupTime] = useState('');

  // ✅ PAYMENT FUNCTION (NEW)
  const handlePayment = async () => {
    if (!pickupTime) {
      alert('Please select a pickup time.');
      return;
    }

    try {
      // 🔹 Create order in backend
      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const order = await res.json();

      // 🔹 Razorpay options
      const options = {
        key: "rzp_test_SVu1xxl1piYCFI", // 🔥 replace
        amount: order.amount,
        currency: "INR",
        name: "Mellow Café",
        description: "Food Order",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 🔹 Verify payment + save order + generate invoice
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                items: cartItems,
                totalAmount: cartTotal,
                userEmail: "testuser@example.com", // 🔥 replace with logged user
                pickupTime
              }),
            });

            const data = await verifyRes.json();

            if (data.success) {
              alert("Payment Successful 🎉");

              // 🔥 OPEN INVOICE
              window.open(data.invoiceUrl, "_blank");
            } else {
              alert("Payment verification failed ❌");
            }

          } catch (err) {
            console.error(err);
          }
        },

        theme: {
          color: "#ef4444",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
    }
  };

  // Pickup time options
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
      </Helmet>

      <div className="container mx-auto px-4 py-12">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/" className="flex items-center gap-2 text-red-500 mb-6">
            <ArrowLeft size={20} /> Continue Shopping
          </Link>

          <h1 className="text-4xl font-bold text-red-500">Your Cart</h1>
          <p className="text-gray-600">{cartCount} items</p>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-12 gap-8">

          {/* CART ITEMS */}
          <section className="lg:col-span-7">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-xl">Cart is empty</h2>
              </div>
            ) : (
              <Card>
                <CardContent className="divide-y p-0">
                  <AnimatePresence>
                    {cartItems.map(item => (
                      <motion.div key={item.id} className="flex justify-between p-4">

                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p>₹{item.price}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus />
                          </Button>

                          {item.quantity}

                          <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus />
                          </Button>

                          <p>₹{item.price * item.quantity}</p>

                          <Button onClick={() => removeFromCart(item.id)}>
                            <Trash2 />
                          </Button>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}
          </section>

          {/* SUMMARY */}
          {cartItems.length > 0 && (
            <section className="lg:col-span-5 bg-gray-100 p-6 rounded">

              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-4 flex justify-between">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>

              {/* PICKUP TIME */}
              <div className="mt-4">
                <label>Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                >
                  <option value="">Select time</option>
                  {getPickupTimeOptions().map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* 🔥 PAYMENT BUTTON */}
              <Button
                onClick={handlePayment}
                className="w-full mt-6 bg-red-500 text-white"
              >
                Pay & Place Order
              </Button>

            </section>
          )}

        </div>
      </div>
    </>
  );
};

export default CartPage;