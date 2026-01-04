'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const API_URL = "http://localhost:3001";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token and user info
      localStorage.setItem('petpal_token', data.token);
      localStorage.setItem(
        'petpal_user',
        JSON.stringify({
          email: data.email,
          name: data.name,
          user_id: data.user_id
        })
      );


      alert("Login successful!");
      router.push("/dashboard"); // redirect after login
    } catch (err) {
      console.error("Login error:", err);
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{background: 'linear-gradient(135deg, #F3E5F5 0%, #FCE4EC 100%)'}}>
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}>
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome to PetPal</h1>
            <p className="text-gray-600 mt-2">Your pet's health companion</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{background: 'linear-gradient(135deg, #6C4AB6 0%, #FF4FA3 100%)'}}>
        <div className="text-white text-center">
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop" 
              alt="Happy pets"
              className="rounded-full w-64 h-64 object-cover mx-auto shadow-2xl border-8 border-white/20"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Care for Your Pets
          </h2>
          <p className="text-xl text-blue-100">
            Track health, nutrition, and activities all in one place
          </p>
        </div>
      </div>
    </div>
  );
}
