'use client';

import { useState } from 'react';
import { Settings, Save, Key, Server, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApiConfiguration() {
  const [providers, setProviders] = useState({
    primary: 'gemini',
    secondary: 'groq',
    tertiary: 'openrouter'
  });

  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    groq: '',
    openrouter: ''
  });

  const [status, setStatus] = useState({
    gemini: 'connected',
    groq: 'connected',
    openrouter: 'not_configured'
  });

  const handleProviderChange = (level, value) => {
    setProviders(prev => ({
      ...prev,
      [level]: value
    }));
  };

  const handleKeyChange = (provider, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleSave = () => {
    // Logic to save configuration would go here
    alert('Configuration saved successfully!');
  };

  const providerOptions = [
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'groq', label: 'Groq' },
    { value: 'openrouter', label: 'OpenRouter' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#6C4AB6] mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#FF4FA3]" />
          API Configuration
        </h1>
        <p className="text-gray-600">Manage AI model providers and API keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Provider Priority Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#6C4AB6]" />
              Provider Priority
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Select the order of AI providers. The system will attempt to use the primary provider first, 
              then fall back to secondary and tertiary if needed.
            </p>

            <div className="space-y-4">
              {/* Primary Provider */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <label className="block text-sm font-semibold text-[#6C4AB6] mb-2">
                  Primary Provider (1st Choice)
                </label>
                <select
                  value={providers.primary}
                  onChange={(e) => handleProviderChange('primary', e.target.value)}
                  className="w-full p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent bg-white"
                >
                  {providerOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Secondary Provider */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Secondary Provider (Backup)
                </label>
                <select
                  value={providers.secondary}
                  onChange={(e) => handleProviderChange('secondary', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent bg-white"
                >
                  {providerOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Tertiary Provider */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tertiary Provider (Fallback)
                </label>
                <select
                  value={providers.tertiary}
                  onChange={(e) => handleProviderChange('tertiary', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent bg-white"
                >
                  {providerOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* API Keys Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-[#6C4AB6]" />
              API Keys
            </h2>
            <div className="space-y-4">
              {['gemini', 'groq', 'openrouter'].map((provider) => (
                <div key={provider} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-semibold text-gray-700 capitalize">
                        {provider === 'openrouter' ? 'OpenRouter' : provider} API Key
                      </label>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        status[provider] === 'connected' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {status[provider] === 'connected' ? 'Connected' : 'Not Configured'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={apiKeys[provider]}
                        onChange={(e) => handleKeyChange(provider, e.target.value)}
                        placeholder={`Enter your ${provider} API key`}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
                      />
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status & Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">API Gateway Active</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Rate Limiting Enabled</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-[#6C4AB6]" />
                <span className="text-gray-600">Secure Key Storage</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-800 mb-1">Note</h4>
                <p className="text-sm text-blue-700">
                  API keys are stored securely and encrypted. Make sure to rotate your keys periodically for better security.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}