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
  const [activities, setActivities] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] = useState({
    p_id: '',
    type: 'Walk',
    duration: '',
    distance: '',
    date: new Date().toISOString().split('T')[0],
    time: ''
  });
  const [weeklyData, setWeeklyData] = useState([]);

  const activityTypes = ['Walk', 'Run', 'Play', 'Training', 'Swimming', 'Fetch'];

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    const token = localStorage.getItem('petpal_token');
    if (!userData || !token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchPets(JSON.parse(userData).user_id, token);
      fetchActivities(JSON.parse(userData).user_id, token);
      fetchWeeklyStats(JSON.parse(userData).user_id, token);
    }
  }, [router]);

  const fetchPets = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/pets/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPets(data);
        if (data.length > 0) {
          setNewActivity(prev => ({ ...prev, p_id: data[0].p_id }));
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchActivities = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/activities/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const fetchWeeklyStats = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/activities/stats/weekly/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Format data for the chart - ensure all 7 days are present
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const formattedData = daysOfWeek.map(day => {
          const found = data.find(item => item.day === day);
          return {
            day: day,
            duration: found ? parseInt(found.duration) : 0
          };
        });
        setWeeklyData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      // Set default empty data if fetch fails
      setWeeklyData([
        { day: 'Mon', duration: 0 },
        { day: 'Tue', duration: 0 },
        { day: 'Wed', duration: 0 },
        { day: 'Thu', duration: 0 },
        { day: 'Fri', duration: 0 },
        { day: 'Sat', duration: 0 },
        { day: 'Sun', duration: 0 }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('petpal_token');
    
    try {
      const response = await fetch('http://localhost:3001/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          p_id: newActivity.p_id,
          type: newActivity.type,
          duration: parseInt(newActivity.duration),
          distance: parseFloat(newActivity.distance) || 0,
          date: newActivity.date,
          time: newActivity.time
        })
      });

      if (response.ok) {
        const data = await response.json();
        fetchActivities(user.user_id, token);
        fetchWeeklyStats(user.user_id, token);
        setNewActivity({ 
          p_id: pets.length > 0 ? pets[0].p_id : '', 
          type: 'Walk', 
          duration: '', 
          distance: '', 
          date: new Date().toISOString().split('T')[0], 
          time: '' 
        });
        setShowForm(false);
      } else {
        console.error('Failed to add activity');
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
                <div key={pet.p_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white font-bold">
                    {pet.name.charAt(0).toUpperCase()}
                  </div>
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
                value={newActivity.p_id}
                onChange={(e) => setNewActivity({ ...newActivity, p_id: e.target.value })}
                className="px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select a pet</option>
                {pets.map(pet => (
                  <option key={pet.p_id} value={pet.p_id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
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
            <h3 className="text-3xl font-bold mt-1">{activities.reduce((sum, a) => sum + (a.duration || 0), 0)} min</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
            <p className="text-white/90 text-sm">Distance Covered</p>
            <h3 className="text-3xl font-bold mt-1">{activities.reduce((sum, a) => sum + (parseFloat(a.distance) || 0), 0).toFixed(1)} km</h3>
          </div>
          <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #2A1A3A, #6C4AB6)'}}>
            <p className="text-white/90 text-sm">Active Pets</p>
            <h3 className="text-3xl font-bold mt-1">{pets.length}</h3>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Activity Overview</h3>
          {weeklyData.length > 0 && weeklyData.some(d => d.duration > 0) ? (
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
          ) : (
            <div className="text-center py-16 text-gray-500">
              <ActivityIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No activity data for this week yet</p>
              <p className="text-sm mt-2">Start logging activities to see your weekly progress!</p>
            </div>
          )}
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activities</h3>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activities logged yet. Start tracking your pet's activities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.a_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <ActivityIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{activity.pet_name} - {activity.type}</h4>
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
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
