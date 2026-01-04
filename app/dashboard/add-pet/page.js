'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Home, Plus, Activity, Heart, Utensils, Bell, LogOut, Bot, Upload } from 'lucide-react';
import Link from 'next/link';

export default function AddPet() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    species: 'Cat',
    breed: '',
    age: '',
    weight: '',
    gender: 'Male',
    dob: '',
    med_note: ''
  });

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('petpal_user');
    const storedToken = localStorage.getItem('petpal_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    localStorage.removeItem('petpal_token');
    router.push('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login first');
      router.push('/login');
      return;
    }

    try {
      // Use FormData to send file + data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('species', formData.species);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('weight', formData.weight);
      formDataToSend.append('med_note', formData.med_note);
      
      // Add file if selected
      if (profilePic) {
        formDataToSend.append('profile_pic', profilePic);
      }

      const res = await fetch('http://localhost:3001/pets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        },
        body: formDataToSend
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to add pet');
        return;
      }

      alert(`Pet ${data.name} added successfully!`);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 text-white flex flex-col" style={{ background: 'linear-gradient(180deg, #2A1A3A 0%, #6C4AB6 100%)' }}>
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <PawPrint className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PetPal</h1>
              <p className="text-xs text-white/70">Care & Track</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/add-pet" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 transition">
            <Plus className="w-5 h-5" />
            <span>Add Pet</span>
          </Link>
          <Link href="/dashboard/activity" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Activity className="w-5 h-5" />
            <span>Activity</span>
          </Link>
          <Link href="/dashboard/nutrition" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Utensils className="w-5 h-5" />
            <span>Nutrition</span>
          </Link>
          <Link href="/dashboard/health" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Heart className="w-5 h-5" />
            <span>Health</span>
          </Link>
          <Link href="/dashboard/reminders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Bell className="w-5 h-5" />
            <span>Reminders</span>
          </Link>
          <Link href="/dashboard/ai-advisor" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Bot className="w-5 h-5" />
            <span>AI Health Advisor</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{background: 'linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 50%, #E1BEE7 100%)'}}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Add New Pet</h1>
              <p className="text-gray-600">Fill in your pet's information</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)' }}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <PawPrint className="w-16 h-16 text-white" />
                  )}
                </div>
                <label className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter pet name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Cat">Cat</option>
                    <option value="Dog">Dog</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter breed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter weight"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
                  <textarea
                    value={formData.med_note}
                    onChange={(e) => setFormData({ ...formData, med_note: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Optional notes"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)' }}
                >
                  Add Pet
                </button>
                <Link
                  href="/dashboard"
                  className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
