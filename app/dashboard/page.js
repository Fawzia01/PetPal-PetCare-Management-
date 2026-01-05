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
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [pets, setPets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    const token = localStorage.getItem('petpal_token');
    if (!userData || !token) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAllData(parsedUser.user_id, token);
      fetchUserData(parsedUser.user_id, token);
    }
  }, [router]);

  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAllData = async (userId, token) => {
    try {
      await Promise.all([
        fetchPets(userId, token),
        fetchActivities(userId, token),
        fetchNutrition(userId, token),
        fetchHealthRecords(userId, token),
        fetchReminders(userId, token),
        fetchWeeklyStats(userId, token)
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/pets/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPets(data);
        if (data.length > 0) setSelectedPet(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchActivities = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/activities/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchNutrition = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/nutrition/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNutrition(data);
        
        // Process nutrition data for pie chart
        const foodGroups = {};
        const colors = ['#6C4AB6', '#FF4FA3', '#8B5FD6', '#FF85C0', '#483D8B', '#9C6DD6', '#B794F6'];
        
        data.forEach(item => {
          const foodName = item.food_name || 'Other';
          const calories = parseFloat(item.calories) || 0;
          
          if (foodGroups[foodName]) {
            foodGroups[foodName] += calories;
          } else {
            foodGroups[foodName] = calories;
          }
        });
        
        const chartData = Object.entries(foodGroups)
          .map(([name, value], index) => ({
            name,
            value: Math.round(value),
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 7); // Top 7 food items
        
        setNutritionData(chartData.length > 0 ? chartData : [
          { name: 'No Data', value: 100, color: '#e0e0e0' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    }
  };

  const fetchHealthRecords = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/health/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHealthRecords(data);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
    }
  };

  const fetchReminders = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/reminders/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchWeeklyStats = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3001/activities/stats/weekly/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const formattedData = daysOfWeek.map(day => {
          const found = data.find(item => item.day === day);
          return {
            day: day,
            duration: found ? parseInt(found.duration) : 0,
            calories: found ? parseInt(found.duration) * 3 : 0
          };
        });
        setWeeklyActivity(formattedData);
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      setWeeklyActivity([
        { day: 'Mon', duration: 0, calories: 0 },
        { day: 'Tue', duration: 0, calories: 0 },
        { day: 'Wed', duration: 0, calories: 0 },
        { day: 'Thu', duration: 0, calories: 0 },
        { day: 'Fri', duration: 0, calories: 0 },
        { day: 'Sat', duration: 0, calories: 0 },
        { day: 'Sun', duration: 0, calories: 0 }
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    localStorage.removeItem('petpal_token');
    router.push('/login');
  };

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate stats
  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.date);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString();
  }).length;

  const todayMeals = nutrition.filter(n => {
    const mealDate = new Date(n.date);
    const today = new Date();
    return mealDate.toDateString() === today.toDateString();
  }).length;

  const upcomingReminders = reminders.filter(r => !r.completed).slice(0, 3);

  // Process health metrics from real data
  const healthMetrics = (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      last6Months.push({
        month: months[date.getMonth()],
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
        weight: 0,
        visits: 0
      });
    }
    
    // Count visits by month from health records
    healthRecords.forEach(record => {
      const recordDate = new Date(record.date);
      const monthData = last6Months.find(m => 
        m.monthIndex === recordDate.getMonth() && m.year === recordDate.getFullYear()
      );
      if (monthData) {
        monthData.visits++;
        // If the record has weight data, use it
        if (record.notes && record.notes.includes('kg')) {
          const weightMatch = record.notes.match(/(\d+\.?\d*)\s*kg/i);
          if (weightMatch) {
            monthData.weight = parseFloat(weightMatch[1]);
          }
        }
      }
    });
    
    // Fill in weight data (use pet's current weight or interpolate)
    const currentWeight = selectedPet?.weight || 30;
    let lastWeight = currentWeight;
    
    for (let i = last6Months.length - 1; i >= 0; i--) {
      if (last6Months[i].weight === 0) {
        last6Months[i].weight = lastWeight;
      } else {
        lastWeight = last6Months[i].weight;
      }
    }
    
    return last6Months.map(m => ({
      month: m.month,
      weight: parseFloat(Number(m.weight || 0).toFixed(1)),
      visits: m.visits
    }));
  })();

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
                  key={pet.p_id}
                  onClick={() => setSelectedPet(pet)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
                    selectedPet?.p_id === pet.p_id ? 'bg-white/30' : 'hover:bg-white/10'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white font-bold">
                    {pet.name.charAt(0).toUpperCase()}
                  </div>
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
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  {upcomingReminders.length > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {upcomingReminders.length}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        Upcoming Reminders
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{upcomingReminders.length} pending reminder{upcomingReminders.length !== 1 ? 's' : ''}</p>
                    </div>
                    
                    {upcomingReminders.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No upcoming reminders</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="p-3 space-y-2">
                        {upcomingReminders.map((reminder, index) => (
                          <Link
                            key={reminder.r_id}
                            href="/dashboard/reminders"
                            onClick={() => setShowNotifications(false)}
                            className={`block p-4 rounded-lg border-l-4 hover:bg-gray-50 transition ${
                              index === 0 ? 'bg-yellow-50 border-yellow-500' :
                              index === 1 ? 'bg-blue-50 border-blue-500' :
                              'bg-green-50 border-green-500'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Calendar className={`w-5 h-5 mt-0.5 ${
                                index === 0 ? 'text-yellow-600' :
                                index === 1 ? 'text-blue-600' :
                                'text-green-600'
                              }`} />
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{reminder.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{reminder.pet_name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <Link 
                        href="/dashboard/reminders"
                        onClick={() => setShowNotifications(false)}
                        className="block text-center text-purple-600 hover:text-purple-700 font-semibold text-sm"
                      >
                        View All Reminders →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name ? user.name.split(' ').slice(0, 2).join(' ') : 'User'}&background=8b5cf6&color=fff`}
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
                  <h3 className="text-3xl font-bold mt-1">{todayActivities}</h3>
                </div>
                <Activity className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-blue-100 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Total activities: {activities.length}
              </div>
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Meals Today</p>
                  <h3 className="text-3xl font-bold mt-1">{todayMeals}</h3>
                </div>
                <Utensils className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-pink-100">
                Total meals logged: {nutrition.length}
              </div>
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #2A1A3A, #6C4AB6)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm">Health Records</p>
                  <h3 className="text-3xl font-bold mt-1">{healthRecords.length}</h3>
                </div>
                <Heart className="w-12 h-12 text-white/80" />
              </div>
              <div className="mt-4 text-sm text-green-100">
                Reminders: {upcomingReminders.length} upcoming
              </div>
            </div>
          </div>

          {/* Selected Pet Detail */}
          {selectedPet && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-3xl border-4 border-purple-200">
                  {selectedPet.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPet.name}</h2>
                  <p className="text-gray-600">{selectedPet.breed || selectedPet.species} • {calculateAge(selectedPet.dob)} years old • {selectedPet.weight}kg</p>
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
                    label={({ name, value }) => `${name}: ${value} cal`}
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

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Reminders</h3>
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No upcoming reminders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.map((reminder, index) => (
                    <div key={reminder.r_id} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-yellow-50 border-yellow-500' :
                      index === 1 ? 'bg-blue-50 border-blue-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <Calendar className={`w-5 h-5 mt-0.5 ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{reminder.title}</p>
                        <p className="text-sm text-gray-600">{reminder.pet_name} • {reminder.date} at {reminder.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
