import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { Coffee } from "lucide-react";

// ✅ Firebase imports needed for Signup + OTP
import { auth, provider, initRecaptcha, signInWithPhoneNumber } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  /* ---------------------------------------------------
      INITIALIZE RECAPTCHA (SAFE)
  ----------------------------------------------------- */
  useEffect(() => {
  initRecaptcha("signup-recaptcha");
}, []);


  /* ---------------------------------------------------
      INPUT CHANGE HANDLER
  ----------------------------------------------------- */
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------------------------------------------------
      GOOGLE SIGN UP
  ----------------------------------------------------- */
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Google Signup Successful" });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Google Signup Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ---------------------------------------------------
      SEND OTP
  ----------------------------------------------------- */
  const sendOTP = async () => {
    if (formData.phone.length !== 10) {
      toast({ title: "Enter valid 10-digit phone", variant: "destructive" });
      return;
    }

    try {
      // Ensure captcha is available
      if (!window.signupCaptcha) {
        toast({ title: "Captcha not ready", variant: "destructive" });
        return;
      }

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + formData.phone,
        window.signupCaptcha
      );

      setConfirmationResult(result);
      setOtpSent(true);

      toast({ title: "OTP Sent", description: "Check your phone." });
    } catch (err) {
      toast({
        title: "Failed to send OTP",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  /* ---------------------------------------------------
      VERIFY OTP
  ----------------------------------------------------- */
  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Phone Verified ✔" });
      setOtpSent(false);
    } catch {
      toast({ title: "Invalid OTP", variant: "destructive" });
    }
  };

  /* ---------------------------------------------------
      REGISTER USER
  ----------------------------------------------------- */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast({
        title: "Accept terms to continue",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Registration Failed",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Account Created 🎉" });
      navigate("/login");
    } catch {
      toast({ title: "Server Error", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Mellow Café</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader className="text-center">
              <Coffee className="mx-auto h-12 w-12 text-yellow-500" />
              <CardTitle className="text-3xl font-bold text-red-500">
                Create Your Account
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">

                <div>
                  <Label>Name</Label>
                  <Input id="name" onChange={handleChange} required />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input id="email" type="email" onChange={handleChange} required />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      placeholder="10-digit phone"
                      onChange={handleChange}
                      required
                    />
                    <Button type="button" onClick={sendOTP}>
                      Send OTP
                    </Button>
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <Label>Enter OTP</Label>
                    <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <Button className="w-full mt-2" type="button" onClick={verifyOTP}>
                      Verify
                    </Button>
                  </div>
                )}

                <div id="signup-recaptcha" className="my-3" />

                <div>
                  <Label>Password</Label>
                  <Input id="password" type="password" onChange={handleChange} required />
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <Input id="confirmPassword" type="password" onChange={handleChange} required />
                </div>

                <div className="flex items-center gap-2">
                  <input id="agree" type="checkbox" onChange={handleChange} />
                  <Label htmlFor="agree" className="text-sm">
                    I agree to Terms & Conditions
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-red-500 text-white">
                  Register
                </Button>

                <Button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full bg-yellow-400"
                >
                  Sign up with Google
                </Button>
              </form>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already have an account?
                  <button
                    className="underline text-red-500 ml-1"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
