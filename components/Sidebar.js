'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  PawPrint, Home, Plus, Activity, Heart, 
  Bell, LogOut, Bot, Utensils, Shield, Users, BookOpen, Lock, Settings
} from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ currentPage = 'dashboard' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Check if user is in admin section
  const isAdmin = pathname?.startsWith('/admin');

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

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} text-white transition-all duration-300 flex flex-col`} style={{background: 'linear-gradient(180deg, #2A1A3A 0%, #6C4AB6 100%)'}}>
      <div className="p-6 flex items-center justify-between border-b border-white/20">
        <div className="flex items-center gap-3">
          <PawPrint className="w-8 h-8" />
          {sidebarOpen && <span className="font-bold text-xl">PetPal</span>}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {isAdmin ? (
          // Admin Navigation
          <>
            <Link href="/admin" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${pathname === '/admin' ? 'bg-white/20' : ''}`}>
              <Home className="w-5 h-5" />
              {sidebarOpen && <span>Admin Dashboard</span>}
            </Link>
            <Link href="/admin/pet-profiles" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${pathname === '/admin/pet-profiles' ? 'bg-white/20' : ''}`}>
              <PawPrint className="w-5 h-5" />
              {sidebarOpen && <span>Pet Profiles</span>}
            </Link>
            <Link href="/admin/user-accounts" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${pathname === '/admin/user-accounts' ? 'bg-white/20' : ''}`}>
              <Users className="w-5 h-5" />
              {sidebarOpen && <span>User Accounts</span>}
            </Link>
            <Link href="/admin/api-config" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${pathname === '/admin/api-config' ? 'bg-white/20' : ''}`}>
              <Bot className="w-5 h-5" />
              {sidebarOpen && <span>API Configuration</span>}
            </Link>
            <Link href="/admin/settings" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${pathname === '/admin/settings' ? 'bg-white/20' : ''}`}>
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
            
            {sidebarOpen && (
              <div className="pt-4 mt-4 border-t border-white/20">
                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition text-white/70">
                  <Home className="w-5 h-5" />
                  <span>Go to User Dashboard</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          // User Navigation
          <>
            <Link href="/dashboard" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'dashboard' ? 'bg-white/20' : ''}`}>
              <Home className="w-5 h-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link href="/dashboard/add-pet" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'add-pet' ? 'bg-white/20' : ''}`}>
              <Plus className="w-5 h-5" />
              {sidebarOpen && <span>Add Pet</span>}
            </Link>
            <Link href="/dashboard/activity" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'activity' ? 'bg-white/20' : ''}`}>
              <Activity className="w-5 h-5" />
              {sidebarOpen && <span>Activity Log</span>}
            </Link>
            <Link href="/dashboard/nutrition" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'nutrition' ? 'bg-white/20' : ''}`}>
              <Utensils className="w-5 h-5" />
              {sidebarOpen && <span>Nutrition</span>}
            </Link>
            <Link href="/dashboard/health" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'health' ? 'bg-white/20' : ''}`}>
              <Heart className="w-5 h-5" />
              {sidebarOpen && <span>Health Records</span>}
            </Link>
            <Link href="/dashboard/reminders" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'reminders' ? 'bg-white/20' : ''}`}>
              <Bell className="w-5 h-5" />
              {sidebarOpen && <span>Reminders</span>}
            </Link>
            <Link href="/dashboard/ai-advisor" className={`flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition ${currentPage === 'ai-advisor' ? 'bg-white/20' : ''}`}>
              <Bot className="w-5 h-5" />
              {sidebarOpen && <span>AI Health Advisor</span>}
            </Link>
            
            {sidebarOpen && (
              <div className="pt-4 mt-4 border-t border-white/20">
                <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition text-yellow-300">
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </>
        )}
      </nav>

      {sidebarOpen && !isAdmin && (
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
  );
}
