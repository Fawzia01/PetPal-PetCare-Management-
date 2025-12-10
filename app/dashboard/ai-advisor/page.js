'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PawPrint, Home, Plus, Activity, Heart, Calendar, 
  Bell, Settings, LogOut, Send, Bot, User
} from 'lucide-react';
import Link from 'next/link';

export default function AIHealthAdvisor() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Health Advisor. I can help you with:\n\n• Pet health concerns and symptoms\n• Nutrition recommendations\n• Exercise and activity suggestions\n• Vaccination schedules\n• General pet care advice\n\nHow can I assist your pet today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: 3,
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 5,
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    router.push('/login');
  };

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple response logic - in real app, this would call an AI API
    if (lowerMessage.includes('cough') || lowerMessage.includes('sneezing')) {
      return 'Coughing or sneezing can indicate:\n\n1. **Upper Respiratory Infection**: Common in cats, especially in multi-pet households\n2. **Allergies**: Environmental or food-related\n3. **Kennel Cough**: If your dog has been around other dogs\n\n**Recommendations:**\n• Monitor for fever or lethargy\n• Ensure plenty of fresh water\n• Keep them warm and comfortable\n• If symptoms persist for more than 2-3 days, consult your vet\n\nWould you like specific advice for your pet\'s breed or age?';
    } else if (lowerMessage.includes('not eating') || lowerMessage.includes('appetite')) {
      return 'Loss of appetite can be concerning. Here are common causes:\n\n1. **Stress or Anxiety**: Changes in environment\n2. **Dental Problems**: Painful teeth or gums\n3. **Digestive Issues**: Upset stomach or nausea\n4. **Illness**: Various health conditions\n\n**Immediate Steps:**\n• Try offering their favorite treats\n• Ensure fresh water is available\n• Check for dental issues\n• Monitor for vomiting or diarrhea\n\n⚠️ **See a vet if:**\n• Not eating for more than 24 hours (cats) or 48 hours (dogs)\n• Signs of lethargy or weakness\n• Vomiting or diarrhea present\n\nWould you like nutrition tips to improve appetite?';
    } else if (lowerMessage.includes('vomit') || lowerMessage.includes('diarrhea')) {
      return 'Vomiting or diarrhea requires attention:\n\n**Possible Causes:**\n• Dietary indiscretion (ate something unusual)\n• Food intolerance or allergy\n• Parasites\n• Infection or illness\n\n**Home Care:**\n1. Fast for 12-24 hours (water only)\n2. Gradually reintroduce bland food (boiled chicken & rice)\n3. Monitor hydration levels\n4. Keep them comfortable\n\n🚨 **Seek immediate vet care if:**\n• Blood in vomit or stool\n• Multiple episodes in short time\n• Signs of dehydration\n• Lethargy or weakness\n• Abdominal pain\n\nShould I provide a hydration monitoring guide?';
    } else if (lowerMessage.includes('weight') || lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
      return 'Maintaining healthy weight is crucial! Here\'s a comprehensive guide:\n\n**Ideal Weight Management:**\n• **Dogs**: Should have visible waist, ribs felt easily\n• **Cats**: Should see waist from above, feel ribs without pressure\n\n**Nutrition Tips:**\n1. **Portion Control**: Measure food accurately\n2. **Quality Food**: Choose high-protein, low-carb options\n3. **Regular Feeding**: 2 meals/day for dogs, 3-4 for cats\n4. **Limit Treats**: No more than 10% of daily calories\n\n**Exercise Recommendations:**\n• Dogs: 30-60 min daily walk\n• Cats: 15-20 min interactive play\n\nWould you like a personalized meal plan for your pet?';
    } else if (lowerMessage.includes('vaccine') || lowerMessage.includes('vaccination')) {
      return 'Vaccination schedule is essential for prevention:\n\n**Core Vaccines for Dogs:**\n• Rabies (annual or 3-year)\n• DHPP: Distemper, Hepatitis, Parvovirus, Parainfluenza\n• Start at 6-8 weeks, boosters every 3-4 weeks\n\n**Core Vaccines for Cats:**\n• Rabies (annual or 3-year)\n• FVRCP: Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia\n• Start at 6-8 weeks, boosters every 3-4 weeks\n\n**Non-Core (based on lifestyle):**\n• Lyme disease (dogs in endemic areas)\n• FeLV (cats with outdoor access)\n• Bordetella (kenneled dogs)\n\n📅 **Set up a reminder** in your dashboard for upcoming vaccinations!\n\nWould you like help creating a vaccination schedule?';
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('activity')) {
      return 'Regular exercise is vital for pet health:\n\n**Dogs:**\n• **Puppies**: 5 min per month of age, twice daily\n• **Adults**: 30-120 min depending on breed\n• **Seniors**: Gentle walks, swimming\n\n**Activity Ideas:**\n✅ Walking, running, hiking\n✅ Fetch, frisbee\n✅ Agility training\n✅ Swimming (great for joints)\n\n**Cats:**\n• **Daily**: 15-30 min interactive play\n• **Activities**: Laser pointer, feather wand, puzzle toys\n• **Enrichment**: Cat trees, window perches\n\n**Benefits:**\n• Weight management\n• Mental stimulation\n• Reduced behavioral issues\n• Stronger bond with you\n\nTrack activities in your Activity Log for best results!';
    } else if (lowerMessage.includes('behavior') || lowerMessage.includes('aggressive') || lowerMessage.includes('barking')) {
      return 'Behavioral issues often have underlying causes:\n\n**Common Problems & Solutions:**\n\n🐕 **Excessive Barking:**\n• Identify triggers (boredom, anxiety, alerts)\n• Provide mental stimulation\n• Training: "Quiet" command\n• Address separation anxiety\n\n😾 **Aggression:**\n• Fear-based or territorial\n• Consult professional trainer\n• Never punish aggressive behavior\n• Create safe spaces\n\n🏃 **Hyperactivity:**\n• Increase exercise\n• Mental enrichment activities\n• Consistent routine\n• Training classes\n\n**When to Seek Professional Help:**\n• Sudden behavior changes\n• Aggressive toward people/pets\n• Destructive behavior\n• Excessive anxiety\n\nWould you like training exercise recommendations?';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! 👋 I\'m here to help with all your pet health questions. Whether it\'s about:\n\n• Health symptoms and concerns\n• Nutrition and diet\n• Exercise and activities\n• Vaccinations\n• Behavioral issues\n• General pet care\n\nJust ask me anything about your pet\'s health and wellbeing!';
    } else {
      return 'Thank you for your question! While I can provide general guidance on:\n\n• Common health symptoms\n• Nutrition and diet recommendations\n• Exercise and activity suggestions\n• Vaccination schedules\n• Behavioral tips\n• General wellness advice\n\nPlease note: I\'m an AI assistant providing general information. For specific medical concerns or emergencies, always consult with a licensed veterinarian.\n\n**Would you like to know about:**\n• Pet nutrition and diet?\n• Exercise routines?\n• Common health issues?\n• Vaccination schedules?\n\nFeel free to ask me anything specific!';
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(message);
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
          <Link href="/dashboard/activity" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Activity className="w-5 h-5" />
            {sidebarOpen && <span>Activity Log</span>}
          </Link>
          <Link href="/dashboard/nutrition" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            <Heart className="w-5 h-5" />
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
          <Link href="/dashboard/ai-advisor" className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{background: 'linear-gradient(90deg, #6C4AB6, #FF4FA3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                AI Health Advisor
              </h1>
              <p className="text-gray-600 mt-1">Get instant health advice for your pets</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <img
                src="https://ui-avatars.com/api/?name=User&background=6C4AB6&color=fff"
                alt="User"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{background: 'linear-gradient(135deg, #F3E5F5 0%, #FCE4EC 100%)'}}>
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-3xl ${chat.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  chat.role === 'user' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-purple-600 to-purple-800'
                }`}>
                  {chat.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  chat.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-800 shadow-md'
                }`}>
                  <p className="whitespace-pre-line">{chat.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-3xl">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-purple-800">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-white shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your pet's health, nutrition, symptoms, or general care..."
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Try asking: "My cat is sneezing", "Weight loss tips", "Vaccination schedule", or "Exercise recommendations"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
