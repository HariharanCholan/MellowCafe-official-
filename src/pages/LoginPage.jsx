import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Coffee } from "lucide-react";

import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Google Login Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("userEmail", data.user.email);
      toast({ title: "Logged in!", description: "Using Google" });
      navigate("/");
    } catch (err) {
      toast({
        title: "Google Login Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("userEmail", data.user.email);
      toast({ title: "Success!", description: "Login successful" });
      navigate("/");
    } catch (error) {
      toast({
        title: "Server Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Mellow Café</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader className="text-center">
              <Coffee className="mx-auto h-12 w-12 text-yellow-500" />
              <CardTitle className="text-3xl font-bold text-red-500">
                Welcome Back!
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">

                <div>
                  <Label>Email</Label>
                  <Input id="email" type="email" onChange={handleChange} required />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input id="password" type="password" onChange={handleChange} required />
                </div>

                <Button type="submit" className="w-full bg-red-500 text-white mt-4">
                  Login
                </Button>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-yellow-400 mt-2"
                >
                  Sign in with Google
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="text-center text-sm mt-3">
        Don't have an account?
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="underline text-red-500 ml-1"
        >
          Sign Up
        </button>
      </div>
    </>
  );
};

export default LoginPage;
