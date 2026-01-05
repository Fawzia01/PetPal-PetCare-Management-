'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, PawPrint, Activity, AlertCircle, TrendingUp, DollarSign, LogOut } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    activeUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    // Check if admin is logged in
    const user = localStorage.getItem('petpal_user');
    const isAdmin = localStorage.getItem('petpal_is_admin');

    if (!isAdmin || !user) {
      router.push('/admin-login');
      return;
    }

    setIsAuthenticated(true);
    const userData = JSON.parse(user);
    setAdminName(userData.name || 'Admin');

    // Fetch admin stats
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('petpal_token');
      const res = await fetch('http://localhost:3001/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal_token');
    localStorage.removeItem('petpal_user');
    localStorage.removeItem('petpal_is_admin');
    router.push('/admin-login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Mock Data for Charts
  const activityData = [
    { name: 'Mon', users: 400, pets: 240 },
    { name: 'Tue', users: 300, pets: 139 },
    { name: 'Wed', users: 200, pets: 980 },
    { name: 'Thu', users: 278, pets: 390 },
    { name: 'Fri', users: 189, pets: 480 },
    { name: 'Sat', users: 239, pets: 380 },
    { name: 'Sun', users: 349, pets: 430 },
  ];

  const petTypeData = [
    { name: 'Dogs', value: 45 },
    { name: 'Cats', value: 35 },
    { name: 'Birds', value: 10 },
    { name: 'Others', value: 10 },
  ];

  const COLORS = ['#6C4AB6', '#FF4FA3', '#82ca9d', '#ffc658'];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-[#6C4AB6]',
      change: '+12% from last month'
    },
    {
      title: 'Total Pets',
      value: stats.totalPets.toLocaleString(),
      icon: PawPrint,
      color: 'bg-[#FF4FA3]',
      change: '+8% from last month'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      color: 'bg-blue-500',
      change: '+5% from last week'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+15% from last month'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome, {adminName}</h2>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Header Section with Image */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-[#6C4AB6] to-[#FF4FA3] shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=400&fit=crop" 
            alt="Admin Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100 text-lg">Welcome back, Administrator. Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6C4AB6]" />
            User & Pet Activity
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C4AB6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6C4AB6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4FA3" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF4FA3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#6C4AB6" fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="pets" stroke="#FF4FA3" fillOpacity={1} fill="url(#colorPets)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pet Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Pet Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={petTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {petTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#6C4AB6] font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">New User Registration</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
                <span className="text-xs font-medium text-[#6C4AB6] bg-purple-50 px-2 py-1 rounded">New</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Server Load</span>
                <span className="text-green-600 font-medium">24%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[24%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Database Usage</span>
                <span className="text-blue-600 font-medium">45%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">API Latency</span>
                <span className="text-[#6C4AB6] font-medium">120ms</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6C4AB6] w-[15%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
