'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Mail, Lock, User, Phone, Eye, EyeOff, MapPin } from 'lucide-react';
import Link from 'next/link';

const API_URL = "http://localhost:3001";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("password", formData.password);
      if (profilePic) data.append("profile_pic", profilePic);

      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: data
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend API error - invalid response');
      }

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Signup failed");
        return;
      }

      localStorage.setItem(
        "petpal_user",
        JSON.stringify({ name: result.user.name, email: result.user.email, id: result.user.user_id })
      );

      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{background: 'linear-gradient(135deg, #6C4AB6 0%, #FF4FA3 100%)'}}>
        <div className="text-white text-center">
          <div className="mb-8 flex justify-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=250&h=250&fit=crop" 
              alt="Cat"
              className="rounded-full w-40 h-40 object-cover shadow-2xl border-4 border-white/20"
            />
            <img 
              src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=250&h=250&fit=crop" 
              alt="Dog"
              className="rounded-full w-40 h-40 object-cover shadow-2xl border-4 border-white/20 mt-8"
            />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Join PetPal Family
          </h2>
          <p className="text-xl text-purple-100">
            Start your journey to better pet care today
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{background: 'linear-gradient(135deg, #F3E5F5 0%, #FCE4EC 100%)'}}>
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}>
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your phone"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create password"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
