import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import SplashPage from "@/pages/SplashPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/splash" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Main App with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />

          {/* PROFILE MUST BE INSIDE LAYOUT */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
