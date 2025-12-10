'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, PawPrint, Home, Activity, Heart, Bell, LogOut, Bot, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function Nutrition() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meals, setMeals] = useState([
    { id: 1, pet: 'Whiskers', foodName: 'Royal Canin', quantity: '100g', date: '2025-12-06', time: '08:00', calories: 350 },
    { id: 2, pet: 'Max', foodName: 'Pedigree', quantity: '200g', date: '2025-12-06', time: '08:30', calories: 480 },
    { id: 3, pet: 'Whiskers', foodName: 'Wet Food', quantity: '50g', date: '2025-12-06', time: '14:00', calories: 150 }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    pet: 'Whiskers',
    foodName: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    calories: ''
  });

  const pets = [
    {
      id: 1,
      name: 'Whiskers',
      species: 'Cat',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Max',
      species: 'Dog',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    setMeals([...meals, { ...newMeal, id: Date.now() }]);
    setNewMeal({ pet: 'Whiskers', foodName: '', quantity: '', date: '', time: '', calories: '' });
    setShowForm(false);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 flex flex-col`} style={{background: 'linear-gradient(180deg, #2A1A3A 0%, #6C4AB6 100%)'}}>
        <div className="p-6 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-3">
            <PawPrint className="w-8 h-8" />
            {sidebarOpen && <span className="font-bold text-xl">PetPal</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link href="/dashboard/add-pet" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Plus className="w-5 h-5" />
            {sidebarOpen && <span>Add Pet</span>}
          </Link>
          <Link href="/dashboard/activity" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Activity className="w-5 h-5" />
            {sidebarOpen && <span>Activity Log</span>}
          </Link>
          <Link href="/dashboard/nutrition" className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
            <Utensils className="w-5 h-5" />
            {sidebarOpen && <span>Nutrition</span>}
          </Link>
          <Link href="/dashboard/health" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Heart className="w-5 h-5" />
            {sidebarOpen && <span>Health Records</span>}
          </Link>
          <Link href="/dashboard/reminders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Bell className="w-5 h-5" />
            {sidebarOpen && <span>Reminders</span>}
          </Link>
          <Link href="/dashboard/ai-advisor" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Bot className="w-5 h-5" />
            {sidebarOpen && <span>AI Health Advisor</span>}
          </Link>
        </nav>

        {sidebarOpen && (
          <div className="p-4 border-t border-white/20">
            <h3 className="text-xs font-semibold mb-3 text-white/70">MY PETS</h3>
            <div className="space-y-2">
              {pets.map(pet => (
                <div key={pet.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                  <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{pet.name}</p>
                    <p className="text-xs text-white/70">{pet.species}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition text-red-300"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Nutrition Tracking
              </h1>
              <p className="text-gray-600 mt-1">Monitor your pet's diet and calories</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white rounded-lg transition flex items-center gap-2"
              style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
            >
              <Plus className="w-5 h-5" />
              Add Meal
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)'}}>
            <p className="text-white/90 text-sm">Today's Meals</p>
            <h3 className="text-3xl font-bold mt-1">{meals.length}</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)'}}>
            <p className="text-white/90 text-sm">Total Calories</p>
            <h3 className="text-3xl font-bold mt-1">{meals.reduce((sum, m) => sum + parseInt(m.calories), 0)}</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
            <p className="text-white/90 text-sm">Avg per Meal</p>
            <h3 className="text-3xl font-bold mt-1">{Math.round(meals.reduce((sum, m) => sum + parseInt(m.calories), 0) / meals.length)}</h3>
          </div>
        </div>

        {/* Add Meal Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center border-4 border-green-200 cursor-pointer hover:opacity-80 transition relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop"
                    alt="Food"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <label className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer hover:bg-green-200 transition text-sm font-medium">
                  Upload Food Photo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newMeal.pet}
                onChange={(e) => setNewMeal({ ...newMeal, pet: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Whiskers">Whiskers</option>
                <option value="Max">Max</option>
              </select>
              <input
                type="text"
                placeholder="Food Name"
                value={newMeal.foodName}
                onChange={(e) => setNewMeal({ ...newMeal, foodName: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Quantity (e.g., 100g)"
                value={newMeal.quantity}
                onChange={(e) => setNewMeal({ ...newMeal, quantity: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="date"
                value={newMeal.date}
                onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="md:col-span-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Save Meal
              </button>
              </div>
            </form>
          </div>
        )}

        {/* Meals List - Card Layout */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Meal Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div 
                key={meal.id} 
                className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
              >
                {/* Food Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={meal.pet === 'Max' ? 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop' : 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'}
                    alt="Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-purple-600">{meal.calories} kcal</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h4 className="text-white text-xl font-bold">{meal.foodName}</h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Pet Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-100">
                    <img 
                      src={meal.pet === 'Max' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop'}
                      alt={meal.pet}
                      className="w-14 h-14 rounded-full object-cover border-3 border-purple-300 shadow-md"
                    />
                    <div>
                      <p className="text-lg font-bold text-gray-800">{meal.pet}</p>
                      <p className="text-sm text-gray-500">{meal.pet === 'Max' ? 'Dog' : 'Cat'}</p>
                    </div>
                  </div>

                  {/* Meal Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Utensils className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-600">Quantity</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{meal.quantity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📅</span>
                        </div>
                        <span className="text-sm text-gray-600">Date</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{meal.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🕐</span>
                        </div>
                        <span className="text-sm text-gray-600">Time</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{meal.time}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-purple-100">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-blue-600 font-medium">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
