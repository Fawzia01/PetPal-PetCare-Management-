'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PawPrint, Home, Plus, Activity, Heart, Calendar, 
  Bell, Settings, LogOut, TrendingUp, ChevronRight,
  Utensils, Droplets, Moon, Sun
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - আসল implementation এ backend থেকে আসবে
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: 3,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      weight: 4.5,
      gender: 'Male'
    },
    {
      id: 2,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 5,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
      weight: 30,
      gender: 'Male'
    }
  ]);

  // Activity data for charts
  const weeklyActivity = [
    { day: 'Mon', duration: 45, calories: 120 },
    { day: 'Tue', duration: 60, calories: 180 },
    { day: 'Wed', duration: 30, calories: 90 },
    { day: 'Thu', duration: 75, calories: 220 },
    { day: 'Fri', duration: 90, calories: 280 },
    { day: 'Sat', duration: 120, calories: 350 },
    { day: 'Sun', duration: 80, calories: 240 }
  ];

  const nutritionData = [
    { name: 'Protein', value: 35, color: '#6C4AB6' },
    { name: 'Carbs', value: 30, color: '#FF4FA3' },
    { name: 'Fat', value: 20, color: '#8B5FD6' },
    { name: 'Fiber', value: 15, color: '#FF85C0' },
    { name: 'Vitamins', value: 10, color: '#483D8B' }
  ];

  const healthMetrics = [
    { month: 'Jan', weight: 29.5, visits: 2 },
    { month: 'Feb', weight: 29.8, visits: 1 },
    { month: 'Mar', weight: 30.0, visits: 1 },
    { month: 'Apr', weight: 30.2, visits: 3 },
    { month: 'May', weight: 30.0, visits: 1 },
    { month: 'Jun', weight: 30.0, visits: 2 }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
      setSelectedPet(pets[0]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 flex flex-col`} style={{background: 'linear-gradient(180deg, #2A1A3A 0%, #6C4AB6 100%)'}}>
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-3">
            <PawPrint className="w-8 h-8" />
            {sidebarOpen && <span className="font-bold text-xl">PetPal</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
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
          <Link href="/dashboard/nutrition" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
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
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>AI Health Advisor</span>}
          </Link>
        </nav>

        {/* Pet Profiles in Sidebar */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/20">
            <h3 className="text-xs font-semibold mb-3 text-white/70">MY PETS</h3>
            <div className="space-y-2">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                    selectedPet?.id === pet.id ? 'bg-white/30' : 'hover:bg-white/10'
                  }`}
                >
                  <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{pet.name}</div>
                    <div className="text-xs text-white/70">{pet.species}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/20">
          <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition w-full">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition w-full mt-2">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-600">Here's what's happening with your pets today</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <img 
                  src="https://ui-avatars.com/api/?name=Fawzi&background=8b5cf6&color=fff" 
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Pet Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Total Pets</p>
                  <h3 className="text-3xl font-bold mt-1">{pets.length}</h3>
                </div>
                <PawPrint className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-white/80">
                {pets.filter(p => p.species === 'Cat').length} Cats, {pets.filter(p => p.species === 'Dog').length} Dogs
              </div>
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Activities Today</p>
                  <h3 className="text-3xl font-bold mt-1">3</h3>
                </div>
                <Activity className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-blue-100 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12% from yesterday
              </div>
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Meals Today</p>
                  <h3 className="text-3xl font-bold mt-1">6</h3>
                </div>
                <Utensils className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-pink-100">
                All pets fed on schedule ✓
              </div>
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #2A1A3A, #6C4AB6)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Health Status</p>
                  <h3 className="text-3xl font-bold mt-1">Good</h3>
                </div>
                <Heart className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-green-100">
                Next checkup in 15 days
              </div>
            </div>
          </div>

          {/* Selected Pet Detail */}
          {selectedPet && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src={selectedPet.image} 
                  alt={selectedPet.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPet.name}</h2>
                  <p className="text-gray-600">{selectedPet.breed} • {selectedPet.age} years old • {selectedPet.weight}kg</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {selectedPet.species}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {selectedPet.gender}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/edit-pet" className="px-4 py-2 text-white rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2" style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}>
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-600 font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="duration" fill="url(#colorDuration)" name="Duration (min)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calories" fill="url(#colorCalories)" name="Calories Burned" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C4AB6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#8B5FD6" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4FA3" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#FF69B4" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Nutrition Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Nutrition Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Trends */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Health Trends (6 Months)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={healthMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#6C4AB6" strokeWidth={3} dot={{r: 4, fill: '#6C4AB6'}} activeDot={{r: 8}} name="Weight (kg)" />
                <Line yAxisId="right" type="monotone" dataKey="visits" stroke="#FF4FA3" strokeWidth={3} dot={{r: 4, fill: '#FF4FA3'}} activeDot={{r: 8}} name="Vet Visits" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions & Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dashboard/add-activity" className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Log Activity</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
                
                <Link href="/dashboard/add-meal" className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Add Meal</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link href="/dashboard/health-check" className="flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800">Health Check</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Reminders</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Vaccination Due</p>
                    <p className="text-sm text-gray-600">Max - Rabies vaccine in 15 days</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Grooming</p>
                    <p className="text-sm text-gray-600">Whiskers - Grooming scheduled tomorrow</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <Heart className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Regular Checkup</p>
                    <p className="text-sm text-gray-600">Both pets - Checkup in 2 weeks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
