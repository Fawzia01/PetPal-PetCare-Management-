'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MapPin, Clock, PawPrint, Home, Activity as ActivityIcon, Heart, Bell, LogOut, Bot, Utensils } from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ActivityLog() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, pet: 'Max', type: 'Walk', duration: 45, distance: 3.2, date: '2025-12-06', time: '07:00' },
    { id: 2, pet: 'Whiskers', type: 'Play', duration: 30, distance: 0, date: '2025-12-06', time: '10:00' },
    { id: 3, pet: 'Max', type: 'Run', duration: 60, distance: 5.5, date: '2025-12-05', time: '18:00' }
  ]);
  const [newActivity, setNewActivity] = useState({
    pet: 'Max',
    type: 'Walk',
    duration: '',
    distance: '',
    date: new Date().toISOString().split('T')[0],
    time: ''
  });

  const activityTypes = ['Walk', 'Run', 'Play', 'Training', 'Swimming', 'Fetch'];

  const weeklyData = [
    { day: 'Mon', duration: 45 },
    { day: 'Tue', duration: 60 },
    { day: 'Wed', duration: 30 },
    { day: 'Thu', duration: 75 },
    { day: 'Fri', duration: 90 },
    { day: 'Sat', duration: 120 },
    { day: 'Sun', duration: 80 }
  ];

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

  const handleAddActivity = (e) => {
    e.preventDefault();
    setActivities([...activities, { ...newActivity, id: Date.now(), distance: parseFloat(newActivity.distance) || 0, duration: parseInt(newActivity.duration) }]);
    setNewActivity({ pet: 'Max', type: 'Walk', duration: '', distance: '', date: new Date().toISOString().split('T')[0], time: '' });
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
          <Link href="/dashboard/activity" className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
            <ActivityIcon className="w-5 h-5" />
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
                Activity Log
              </h1>
              <p className="text-gray-600 mt-1">Track your pet's physical activities</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white rounded-lg transition flex items-center gap-2"
              style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
            >
              <Plus className="w-5 h-5" />
              Log Activity
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
        {/* Add Activity Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ActivityIcon className="w-6 h-6 text-purple-600" />
              Log New Activity
            </h3>
            <form onSubmit={handleAddActivity} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-purple-200 cursor-pointer hover:opacity-80 transition relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop"
                    alt="Activity"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <label className="mt-3 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 transition text-sm font-medium">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <select
                value={newActivity.pet}
                onChange={(e) => setNewActivity({ ...newActivity, pet: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="Max">Max</option>
                <option value="Whiskers">Whiskers</option>
              </select>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="Walk">Walk</option>
                <option value="Run">Run</option>
                <option value="Play">Play</option>
                <option value="Training">Training</option>
                <option value="Swimming">Swimming</option>
                <option value="Fetch">Fetch</option>
              </select>
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <input
                type="number"
                step="0.1"
                placeholder="Distance (km)"
                value={newActivity.distance}
                onChange={(e) => setNewActivity({ ...newActivity, distance: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <input
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <button
                type="submit"
                className="md:col-span-2 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
              >
                Save Activity
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)'}}>
            <p className="text-white/90 text-sm">Total Activities</p>
            <h3 className="text-3xl font-bold mt-1">{activities.length}</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)'}}>
            <p className="text-white/90 text-sm">Total Duration</p>
            <h3 className="text-3xl font-bold mt-1">{activities.reduce((sum, a) => sum + a.duration, 0)} min</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
            <p className="text-white/90 text-sm">Distance Covered</p>
            <h3 className="text-3xl font-bold mt-1">{activities.reduce((sum, a) => sum + a.distance, 0).toFixed(1)} km</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #2A1A3A, #6C4AB6)'}}>
            <p className="text-white/90 text-sm">Most Active</p>
            <h3 className="text-3xl font-bold mt-1">Max</h3>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity Overview</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="url(#activityGradient)" name="Duration (minutes)" />
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C4AB6" stopOpacity={0.9}/>
                  <stop offset="50%" stopColor="#9C6DD6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#FF4FA3" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <img 
                      src={activity.pet === 'Max' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=50&h=50&fit=crop' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop'}
                      alt={activity.pet}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{activity.pet} - {activity.type}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.duration} min
                      </span>
                      {activity.distance > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {activity.distance} km
                        </span>
                      )}
                      <span>{activity.date} at {activity.time}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.type === 'Walk' ? 'bg-blue-100 text-blue-700' :
                  activity.type === 'Run' ? 'bg-purple-100 text-purple-700' :
                  'bg-pink-100 text-pink-700'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
