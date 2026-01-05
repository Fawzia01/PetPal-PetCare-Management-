'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PawPrint, Home, Plus, Activity, Heart, Calendar, 
  Bell, Settings, LogOut, Menu, X, Key, TestTube, 
  CheckCircle, XCircle, Loader, Save, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [apiSettings, setApiSettings] = useState({
    groqApiKey: '',
    selectedModel: 'llama-3.3-70b-versatile',
    testPrompt: 'Hello! Can you help me with pet health advice?'
  });

  const groqModels = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recommended)', description: 'Best for complex queries' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', description: 'Fast and reliable' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', description: 'Ultra-fast responses' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Great for detailed answers' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Efficient and accurate' }
  ];

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
      loadSettings();
    }
  }, [router]);

  const loadSettings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('petpal_user'));
      const token = localStorage.getItem('petpal_token');
      
      if (!userData || !token) return;
      
      const response = await fetch(`http://localhost:3001/api-settings/${userData.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // If endpoint doesn't exist (404), just use default settings
        if (response.status === 404) {
          console.warn('API settings endpoint not available, using default settings');
          return;
        }
        console.error('Failed to load settings:', response.status, response.statusText);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response content-type:', contentType);
        return;
      }
      
      const data = await response.json();
      if (data) {
        setApiSettings({
          groqApiKey: data.groq_api_key || '',
          selectedModel: data.groq_model || 'llama-3.3-70b-versatile',
          testPrompt: 'Hello! Can you help me with pet health advice?'
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('petpal_token');
      
      const response = await fetch('http://localhost:3001/api-settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.user_id,
          groq_api_key: apiSettings.groqApiKey,
          groq_model: apiSettings.selectedModel
        })
      });

      if (response.ok) {
        alert('✅ Settings saved successfully!');
      } else {
        alert('❌ Failed to save settings');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestApi = async () => {
    if (!apiSettings.groqApiKey) {
      alert('⚠️ Please enter your Groq API key first');
      return;
    }

    setTestingApi(true);
    setTestResult(null);

    try {
      const response = await fetch('http://localhost:3001/test-groq-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiSettings.groqApiKey,
          model: apiSettings.selectedModel,
          prompt: apiSettings.testPrompt
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Invalid response content-type: ${contentType}. Backend may not be running.`);
      }

      const data = await response.json();
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: data.response,
          model: data.model
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'API test failed'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Error connecting to API'
      });
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/10 backdrop-blur-lg text-white p-4 transition-all duration-300 flex flex-col`}>
        <div className="flex items-center justify-between mb-8">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <PawPrint className="w-8 h-8 text-yellow-300" />
              <span className="text-xl font-bold">PetPal</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/20 rounded-lg">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-2">
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
            {sidebarOpen && <span>Activity</span>}
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
            <Heart className="w-5 h-5" />
            {sidebarOpen && <span>AI Health Advisor</span>}
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg bg-white/20">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition mt-auto">
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                AI Settings
              </h1>
              <p className="text-gray-600 mt-1">Configure your Groq API for AI Health Advisor</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=User&background=6C4AB6&color=fff"
                alt="User"
                className="w-12 h-12 rounded-full border-2 border-[#6C4AB6]"
              />
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Get Your Free Groq API Key
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Groq provides ultra-fast AI inference for free. Get your API key from Groq Console.
              </p>
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Get API Key →
              </a>
            </div>

            {/* API Key Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Key className="w-6 h-6 text-[#6C4AB6]" />
                Groq API Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiSettings.groqApiKey}
                      onChange={(e) => setApiSettings({...apiSettings, groqApiKey: e.target.value})}
                      placeholder="gsk_..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Your API key is stored securely and encrypted
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Model
                  </label>
                  <select
                    value={apiSettings.selectedModel}
                    onChange={(e) => setApiSettings({...apiSettings, selectedModel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
                  >
                    {groqModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* API Test */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TestTube className="w-6 h-6 text-[#6C4AB6]" />
                Test API Connection
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Test Prompt
                  </label>
                  <textarea
                    value={apiSettings.testPrompt}
                    onChange={(e) => setApiSettings({...apiSettings, testPrompt: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent resize-none"
                    placeholder="Enter a test message..."
                  />
                </div>

                <button
                  onClick={handleTestApi}
                  disabled={testingApi || !apiSettings.groqApiKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {testingApi ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Testing API...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-5 h-5" />
                      Test API Connection
                    </>
                  )}
                </button>

                {testResult && (
                  <div className={`p-4 rounded-lg border-2 ${
                    testResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      {testResult.success ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-bold mb-1 ${
                          testResult.success ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {testResult.success ? 'API Test Successful! ✅' : 'API Test Failed ❌'}
                        </h4>
                        {testResult.success && testResult.model && (
                          <p className="text-sm text-green-700 mb-2">
                            Model: {testResult.model}
                          </p>
                        )}
                        <p className={`text-sm whitespace-pre-wrap ${
                          testResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {testResult.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex-1 bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

            {/* Models Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4">Available Models</h3>
              <div className="space-y-3">
                {groqModels.map(model => (
                  <div key={model.id} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-2 h-2 bg-[#6C4AB6] rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold text-gray-800">{model.name}</p>
                      <p className="text-sm text-gray-600">{model.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
