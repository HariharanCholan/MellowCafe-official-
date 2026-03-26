import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  // ⬅️ Make sure CartContext provides these
  const { addToCart, clearCart, setCartItems } = useCart() || {};

  // Fetch profile data
  const fetchProfile = async () => {
    const res = await fetch(`http://localhost:5000/api/profile/${email}`);
    const data = await res.json();
    setProfile(data.profile);
  };

  // Fetch order data
  const fetchOrders = async () => {
    const res = await fetch(`http://localhost:5000/api/profile/orders/${email}`);
    const data = await res.json();
    setOrders(data.orders || []);

    // Favourite dishes calculation
    const counts = {};
    data.orders?.forEach(order => {
      order.items.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    setFavourites(sorted);
  };

  useEffect(() => {
    if (email) {
      fetchProfile();
      fetchOrders();
    }
  }, [email]);

  if (!profile) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  /* ------------------------ REORDER: replace cart with this order ------------------------ */
 /* ------------------------ REORDER: replace cart with this order ------------------------ */
const handleReorder = (items) => {
  clearCart();

  items.forEach((item) => {
    const formatted = {
      id: `${item.name}-${item.price}`,     // stable & unique
      name: item.name,
      price: item.price,
      option: null,
      quantity: item.quantity || 1,
    };

    addToCart(formatted);  // CartContext merges automatically
  });

  alert("Order has been reordered & added to your cart!");
  navigate("/cart");
};




  /* ----------------------- INCLUDE ALL: add on top of existing cart ---------------------- */
 const handleIncludeAll = (items) => {
  items.forEach((item) => {
    const formatted = {
      id: `${item.name}-${item.price}`,   // stable ID
      name: item.name,
      price: item.price,
      option: null,
      quantity: item.quantity || 1,
    };

    addToCart(formatted);
  });

  alert("Items added to cart!");
};


  return (
    <>
      <Helmet>
        <title>Profile - Mellow Café</title>
      </Helmet>

      <div className="min-h-screen bg-yellow-50 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden border">
              {profile.picture ? (
                <img src={profile.picture} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                  {profile.name[0]}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-red-500 mt-4">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.phone && <p className="text-gray-600">{profile.phone}</p>}
          </div>

          {/* FAVOURITE DISHES */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-yellow-600 mb-3">Favourite Dishes</h2>
            {favourites.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {favourites.map((dish, index) => (
                  <li key={index}>{dish}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No favourite dishes yet.</p>
            )}
          </div>

          {/* ORDER HISTORY TAB */}
          <div className="mt-6">
            <button
              onClick={() => setShowOrders(!showOrders)}
              className="w-full text-left px-4 py-3 bg-yellow-200 rounded-md font-bold text-gray-800 hover:bg-yellow-300 transition"
            >
              {showOrders ? "Hide Order History" : "Show Order History"}
            </button>

            {showOrders && (
              <div className="mt-4 space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500">You have no orders yet.</p>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">

                      <p className="font-semibold text-red-500">
                        Order Total: ₹{order.total}
                      </p>

                      <p className="text-sm text-gray-600">
                        Date: {new Date(order.timestamp).toLocaleString()}
                      </p>

                      <ul className="text-gray-700 mt-2">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleReorder(order.items)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reorder
                        </button>

                        <button
                          onClick={() => handleIncludeAll(order.items)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Include All to Cart
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;
