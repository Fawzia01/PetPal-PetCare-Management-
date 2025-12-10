'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PawPrint, Camera, Save, X, Calendar, Weight, Activity, Heart, 
  ChevronLeft, User, Mail, Phone, MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function EditPetProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Mock initial data
  const [formData, setFormData] = useState({
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: '3',
    weight: '4.5',
    gender: 'Male',
    color: 'White',
    microchip: '982000123456789',
    birthday: '2022-05-15',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    bio: 'Loves sleeping in sunny spots and chasing laser pointers. Very picky about food.',
    allergies: 'None',
    medications: 'None'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-[#6C4AB6]"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#6C4AB6]">Edit Pet Profile</h1>
            <p className="text-gray-600">Update your pet's information and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Image & Basic Info */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden group">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-[#6C4AB6] to-[#FF4FA3]">
                <img 
                  src={formData.image} 
                  alt="Pet Preview" 
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{formData.name}</h3>
              <p className="text-[#FF4FA3] font-medium">{formData.breed} {formData.species}</p>
              
              <button type="button" className="mt-4 text-sm text-[#6C4AB6] font-semibold hover:underline">
                Change Photo
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6C4AB6]" />
                Vital Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Weight (kg)</label>
                  <div className="relative mt-1">
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none transition-all"
                    />
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Age (years)</label>
                  <div className="relative mt-1">
                    <input 
                      type="number" 
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none transition-all"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <PawPrint className="w-6 h-6 text-[#FF4FA3]" />
                General Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                  <select 
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none bg-white"
                  >
                    <option>Cat</option>
                    <option>Dog</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input 
                    type="text" 
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color/Markings</label>
                  <input 
                    type="text" 
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Microchip ID</label>
                  <input 
                    type="text" 
                    name="microchip"
                    value={formData.microchip}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Notes</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none resize-none"
                ></textarea>
              </div>
            </div>

            {/* Health Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <Heart className="w-6 h-6 text-red-500" />
                Health Information
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <input 
                    type="text" 
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                    placeholder="e.g. Chicken, Pollen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <input 
                    type="text" 
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                    placeholder="e.g. Heartworm prevention"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
              >
                {loading ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}