'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Home, Plus, Activity, Heart, Utensils, Bell, LogOut, Bot, Calendar, Trash2, Check } from 'lucide-react';
import Link from 'next/link';

export default function Reminders() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, pet: 'Max', type: 'Vaccination', title: 'Rabies Vaccine Due', date: '2025-12-21', time: '10:00', repeat: 'Annually', completed: false },
    { id: 2, pet: 'Whiskers', type: 'Grooming', title: 'Fur Grooming Session', date: '2025-12-07', time: '14:00', repeat: 'Monthly', completed: false },
    { id: 3, pet: 'Max', type: 'Medication', title: 'Heartworm Medicine', date: '2025-12-10', time: '09:00', repeat: 'Monthly', completed: false },
    { id: 4, pet: 'Whiskers', type: 'Food', title: 'Refill Cat Food', date: '2025-12-06', time: '18:00', repeat: 'Weekly', completed: true }
  ]);
  const [newReminder, setNewReminder] = useState({
    pet: 'Max',
    type: 'Vaccination',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    repeat: 'Daily',
    completed: false
  });

  const pets = [
    { name: 'Max', species: 'Dog', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop' },
    { name: 'Whiskers', species: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=80&h=80&fit=crop' }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    if (!userData) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  const toggleComplete = (id) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    setReminders([...reminders, { ...newReminder, id: Date.now() }]);
    setNewReminder({ pet: 'Max', type: 'Vaccination', title: '', date: new Date().toISOString().split('T')[0], time: '', repeat: 'Daily', completed: false });
    setShowForm(false);
  };

  const upcomingReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 text-white flex flex-col" style={{ background: 'linear-gradient(180deg, #2A1A3A 0%, #6C4AB6 100%)' }}>
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/add-pet" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
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
          <Link href="/dashboard/reminders" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 transition">
            <Bell className="w-5 h-5" />
            <span>Reminders</span>
          </Link>
          <Link href="/dashboard/ai-advisor" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <Bot className="w-5 h-5" />
            <span>AI Health Advisor</span>
          </Link>
        </nav>

        {/* Pets Section */}
        <div className="p-4 border-t border-white/20">
          <p className="text-xs text-white/70 mb-3 uppercase tracking-wide">Your Pets</p>
          <div className="space-y-2">
            {pets.map((pet) => (
              <div key={pet.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{pet.name}</p>
                  <p className="text-xs text-white/70">{pet.species}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reminders</h1>
              <p className="text-gray-600">Never miss important pet care tasks</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)' }}
            >
              <Plus className="w-5 h-5" />
              New Reminder
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Upcoming</p>
                  <h3 className="text-3xl font-bold mt-1">{upcomingReminders.length}</h3>
                </div>
                <Bell className="w-12 h-12 text-white/70" />
              </div>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Completed</p>
                  <h3 className="text-3xl font-bold mt-1">{completedReminders.length}</h3>
                </div>
                <Check className="w-12 h-12 text-white/70" />
              </div>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #9C6DD6, #B794F6)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">This Week</p>
                  <h3 className="text-3xl font-bold mt-1">5</h3>
                </div>
                <Calendar className="w-12 h-12 text-white/70" />
              </div>
            </div>
          </div>

        {/* Add Reminder Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-600" />
              Create New Reminder
            </h3>
            <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center border-4 border-yellow-200 cursor-pointer hover:opacity-80 transition relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1501627965107-9c5e572d8085?w=200&h=200&fit=crop"
                    alt="Reminder"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <label className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-200 transition text-sm font-medium">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <select
                value={newReminder.pet}
                onChange={(e) => setNewReminder({ ...newReminder, pet: e.target.value })}
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
                <option value="Max">Max</option>
                <option value="Whiskers">Whiskers</option>
              </select>
              <select
                value={newReminder.type}
                onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
                <option value="Vaccination">Vaccination</option>
                <option value="Grooming">Grooming</option>
                <option value="Medication">Medication</option>
                <option value="Food">Food</option>
              </select>
              <input
                type="text"
                placeholder="Reminder Title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                className="md:col-span-2 px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
              <select
                value={newReminder.repeat}
                onChange={(e) => setNewReminder({ ...newReminder, repeat: e.target.value })}
                className="md:col-span-2 px-4 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Annually">Annually</option>
              </select>
              <button
                type="submit"
                className="md:col-span-2 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
              >
                Create Reminder
              </button>
            </form>
          </div>
        )}

        {/* Upcoming Reminders */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Upcoming Reminders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upcomingReminders.map(reminder => (
              <div 
                key={reminder.id} 
                className={`bg-gradient-to-br rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 ${
                  reminder.type === 'Vaccination' ? 'from-yellow-50 to-yellow-100 border-yellow-300 hover:border-yellow-500' :
                  reminder.type === 'Grooming' ? 'from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500' :
                  reminder.type === 'Medication' ? 'from-red-50 to-red-100 border-red-300 hover:border-red-500' :
                  'from-green-50 to-green-100 border-green-300 hover:border-green-500'
                }`}>
                {/* Reminder Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={reminder.type === 'Vaccination' ? 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop' : 
                         reminder.type === 'Grooming' ? 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop' :
                         reminder.type === 'Medication' ? 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop' :
                         'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop'}
                    alt={reminder.type}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-4 py-2 rounded-full text-3xl shadow-lg ${
                    reminder.type === 'Vaccination' ? 'bg-yellow-500' :
                    reminder.type === 'Grooming' ? 'bg-blue-500' :
                    reminder.type === 'Medication' ? 'bg-red-500' :
                    'bg-green-500'
                  }`}>
                    {reminder.type === 'Vaccination' ? '💉' : 
                     reminder.type === 'Grooming' ? '✂️' : 
                     reminder.type === 'Medication' ? '💊' : '🍽️'}
                  </div>
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    reminder.type === 'Vaccination' ? 'bg-yellow-500 text-white' :
                    reminder.type === 'Grooming' ? 'bg-blue-500 text-white' :
                    reminder.type === 'Medication' ? 'bg-red-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {reminder.repeat}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h4 className="text-white text-xl font-bold">{reminder.title}</h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Pet Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <img 
                      src={reminder.pet === 'Max' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop'}
                      alt={reminder.pet}
                      className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div>
                      <p className="text-lg font-bold text-gray-800">{reminder.pet}</p>
                      <p className="text-sm text-gray-500">{reminder.type}</p>
                    </div>
                  </div>

                  {/* Reminder Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">Date</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{reminder.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🕐</span>
                        </div>
                        <span className="text-sm text-gray-600">Time</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{reminder.time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">🔁</span>
                        </div>
                        <span className="text-sm text-gray-600">Repeat</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{reminder.repeat}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => toggleComplete(reminder.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-100 hover:bg-green-200 rounded-lg transition text-green-700 font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Complete
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-100 hover:bg-red-200 rounded-lg transition text-red-700 font-medium"
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

        {/* Completed Reminders */}
        {completedReminders.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Completed</h3>
            <div className="space-y-3">
              {completedReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg opacity-60">
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={reminder.pet === 'Max' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=50&h=50&fit=crop' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop'}
                      alt={reminder.pet}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 line-through">{reminder.title}</h4>
                      <p className="text-sm text-gray-600">{reminder.pet} • {reminder.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
