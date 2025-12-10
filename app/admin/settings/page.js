'use client';

import { useState } from 'react';
import { Settings, Moon, Sun, Lock, Trash2, Shield, Bell, Globe, Save } from 'lucide-react';

export default function AdminSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    alert("Password reset functionality would go here.");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion functionality would go here.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#6C4AB6] mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#FF4FA3]" />
          Settings
        </h1>
        <p className="text-gray-600">Manage your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - General Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Appearance & Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#6C4AB6]" />
              Appearance & Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Theme Mode</h3>
                    <p className="text-sm text-gray-500">{darkMode ? 'Dark mode is active' : 'Light mode is active'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] focus:ring-offset-2 ${darkMode ? 'bg-[#6C4AB6]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email updates and alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4AB6]"></div>
                </label>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Language</h3>
                    <p className="text-sm text-gray-500">Select your preferred language</p>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-[#6C4AB6] focus:border-[#6C4AB6] block p-2.5"
                >
                  <option value="en">English</option>
                  <option value="bn">Bengali</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#6C4AB6]" />
              Security & Password
            </h2>
            
            <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Danger Zone */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-semibold text-red-800 mb-1">Delete Account</h3>
                <p className="text-sm text-red-600 mb-4">Permanently remove your account and all of its data.</p>
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}