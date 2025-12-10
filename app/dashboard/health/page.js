'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Home, Plus, Activity, Heart, Utensils, Bell, LogOut, Bot, Stethoscope, Syringe, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HealthRecords() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState([
    { id: 1, pet: 'Max', type: 'Vaccination', condition: 'Rabies Vaccine', note: 'Annual booster', date: '2025-11-15', vet: 'Dr. Smith' },
    { id: 2, pet: 'Whiskers', type: 'Checkup', condition: 'Regular Checkup', note: 'All vitals normal', date: '2025-10-20', vet: 'Dr. Johnson' },
    { id: 3, pet: 'Max', type: 'Treatment', condition: 'Ear Infection', note: 'Prescribed antibiotics', date: '2025-09-05', vet: 'Dr. Smith' }
  ]);
  const [newRecord, setNewRecord] = useState({
    pet: 'Max',
    type: 'Checkup',
    condition: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
    vet: ''
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

  const handleAddRecord = (e) => {
    e.preventDefault();
    setRecords([...records, { ...newRecord, id: Date.now() }]);
    setNewRecord({ pet: 'Max', type: 'Checkup', condition: '', note: '', date: new Date().toISOString().split('T')[0], vet: '' });
    setShowForm(false);
  };

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
          <Link href="/dashboard/health" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 transition">
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
              <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Health Records</h1>
              <p className="text-gray-600">Track medical history and appointments</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)' }}
            >
              <Plus className="w-5 h-5" />
              Add Record
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Add Record Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Add Health Record
              </h3>
              <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col items-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center border-4 border-red-200 cursor-pointer hover:opacity-80 transition relative group">
                    <img 
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop"
                      alt="Medical"
                      className="w-28 h-28 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <label className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg cursor-pointer hover:bg-red-200 transition text-sm font-medium">
                    Upload Document
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
                <select
                  value={newRecord.pet}
                  onChange={(e) => setNewRecord({ ...newRecord, pet: e.target.value })}
                  className="px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="Max">Max</option>
                  <option value="Whiskers">Whiskers</option>
                </select>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                  className="px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="Vaccination">Vaccination</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Treatment">Treatment</option>
                </select>
                <input
                  type="text"
                  placeholder="Condition/Procedure"
                  value={newRecord.condition}
                  onChange={(e) => setNewRecord({ ...newRecord, condition: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Doctor/Veterinarian Name"
                  value={newRecord.vet}
                  onChange={(e) => setNewRecord({ ...newRecord, vet: e.target.value })}
                  className="px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <textarea
                  placeholder="Notes"
                  value={newRecord.note}
                  onChange={(e) => setNewRecord({ ...newRecord, note: e.target.value })}
                  className="md:col-span-2 px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  required
                />
                <button
                  type="submit"
                  className="md:col-span-2 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                  style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
                >
                  Save Record
                </button>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Records</p>
                  <h3 className="text-3xl font-bold mt-1">{records.length}</h3>
                </div>
                <Heart className="w-12 h-12 text-white/70" />
              </div>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Vaccinations</p>
                  <h3 className="text-3xl font-bold mt-1">{records.filter(r => r.type === 'Vaccination').length}</h3>
                </div>
                <Syringe className="w-12 h-12 text-white/70" />
              </div>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #9C6DD6, #B794F6)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Checkups</p>
                  <h3 className="text-3xl font-bold mt-1">{records.filter(r => r.type === 'Checkup').length}</h3>
                </div>
                <Stethoscope className="w-12 h-12 text-white/70" />
              </div>
            </div>
          </div>

        {/* Records Cards */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Medical History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <div 
                key={record.id} 
                className={`bg-gradient-to-br rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 ${
                  record.type === 'Vaccination' ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400' :
                  record.type === 'Checkup' ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400' :
                  'from-red-50 to-red-100 border-red-200 hover:border-red-400'
                }`}>
                {/* Medical Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={record.type === 'Vaccination' ? 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop' : 
                         record.type === 'Checkup' ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop' :
                         'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop'}
                    alt={record.type}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-4 py-2 rounded-full text-3xl shadow-lg ${
                    record.type === 'Vaccination' ? 'bg-blue-500' :
                    record.type === 'Checkup' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}>
                    {record.type === 'Vaccination' ? '💉' : record.type === 'Checkup' ? '🩺' : '💊'}
                  </div>
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    record.type === 'Vaccination' ? 'bg-blue-500 text-white' :
                    record.type === 'Checkup' ? 'bg-green-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {record.type}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h4 className="text-white text-xl font-bold">{record.condition}</h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Pet Info */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <img 
                      src={record.pet === 'Max' ? 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop'}
                      alt={record.pet}
                      className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div>
                      <p className="text-lg font-bold text-gray-800">{record.pet}</p>
                      <p className="text-sm text-gray-500">{record.pet === 'Max' ? 'Golden Retriever' : 'Persian Cat'}</p>
                    </div>
                  </div>

                  {/* Record Details */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Note</p>
                      <p className="text-sm font-medium text-gray-800">{record.note}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">👨‍⚕️</span>
                        </div>
                        <span className="text-sm text-gray-600">Doctor</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{record.vet}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📅</span>
                        </div>
                        <span className="text-sm text-gray-600">Date</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{record.date}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition text-blue-700 font-medium">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-100 hover:bg-red-200 rounded-lg transition text-red-700 font-medium">
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
