'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, PawPrint, Home, Activity, Heart, Bell, LogOut, Bot, Utensils, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Nutrition() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [meals, setMeals] = useState([]);
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const [newMeal, setNewMeal] = useState({
    p_id: '',
    food_name: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    food_pic: null
  });

  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    const userToken = localStorage.getItem('petpal_token');
    
    if (!userData || !userToken) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setToken(userToken);
      fetchPets(parsedUser.user_id, userToken);
      fetchMeals(parsedUser.user_id, userToken);
    }
  }, [router]);

  const fetchPets = async (userId, authToken) => {
    try {
      const response = await fetch(`${API_BASE}/pets/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPets(data);
        if (data.length > 0) {
          setNewMeal(prev => ({ ...prev, p_id: data[0].p_id }));
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const fetchMeals = async (userId, authToken) => {
    try {
      const response = await fetch(`${API_BASE}/nutrition/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('petpal_user');
    localStorage.removeItem('petpal_token');
    router.push('/login');
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion('');
    setShowSuggestion(false);

    try {
      const formData = new FormData();
      formData.append('p_id', newMeal.p_id);
      formData.append('food_name', newMeal.food_name);
      formData.append('quantity', newMeal.quantity);
      formData.append('date', newMeal.date);
      if (newMeal.food_pic) {
        formData.append('food_pic', newMeal.food_pic);
      }

      console.log('Adding meal...');

      // Add meal with AI calorie calculation
      const response = await fetch(`${API_BASE}/nutrition`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const newMealData = await response.json();
        console.log('Meal added:', newMealData);
        
        // Get AI diet suggestion
        console.log('Fetching AI suggestion...');
        try {
          const suggestionResponse = await fetch(`${API_BASE}/nutrition/suggest`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              food_name: newMeal.food_name,
              quantity: newMeal.quantity
            })
          });

          if (suggestionResponse.ok) {
            const suggestionData = await suggestionResponse.json();
            console.log('AI Suggestion:', suggestionData);
            setSuggestion(suggestionData.suggestion);
            setShowSuggestion(true);
          } else {
            console.error('Failed to get suggestion');
          }
        } catch (err) {
          console.error('Error getting suggestion:', err);
        }

        // Refresh meals
        await fetchMeals(user.user_id, token);
        
        // Reset form
        setNewMeal({
          p_id: pets[0]?.p_id || '',
          food_name: '',
          quantity: '',
          date: new Date().toISOString().split('T')[0],
          food_pic: null
        });
        setShowForm(false);
        alert('Meal added successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to add meal: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Error adding meal. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mealId) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;

    try {
      const response = await fetch(`${API_BASE}/nutrition/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchMeals(user.user_id, token);
        alert('Meal deleted successfully!');
      } else {
        alert('Failed to delete meal');
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewMeal({ ...newMeal, food_pic: e.target.files[0] });
    }
  };

  if (!user) return null;

  const totalCalories = meals.reduce((sum, m) => sum + (parseFloat(m.calories) || 0), 0);
  const avgCalories = meals.length > 0 ? Math.round(totalCalories / meals.length) : 0;

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
          <Link href="/dashboard/nutrition" className="flex items-center gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition">
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

        {sidebarOpen && pets.length > 0 && (
          <div className="p-4 border-t border-white/20">
            <h3 className="text-xs font-semibold mb-3 text-white/70">MY PETS</h3>
            <div className="space-y-2">
              {pets.map(pet => (
                <div key={pet.p_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <PawPrint className="w-5 h-5" />
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
                Nutrition Tracking
              </h1>
              <p className="text-gray-600 mt-1">Monitor your pet's diet and calories</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 text-white rounded-lg transition flex items-center gap-2"
              style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
            >
              <Plus className="w-5 h-5" />
              Add Meal
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #6C4AB6, #8B5FD6)'}}>
              <p className="text-white/90 text-sm">Today's Meals</p>
              <h3 className="text-3xl font-bold mt-1">{meals.length}</h3>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #FF4FA3, #FF69B4)'}}>
              <p className="text-white/90 text-sm">Total Calories</p>
              <h3 className="text-3xl font-bold mt-1">{Math.round(totalCalories)}</h3>
            </div>
            <div className="rounded-xl p-6 text-white shadow-lg" style={{background: 'linear-gradient(135deg, #9C6DD6, #B794F6)'}}>
              <p className="text-white/90 text-sm">Avg per Meal</p>
              <h3 className="text-3xl font-bold mt-1">{avgCalories}</h3>
            </div>
          </div>

          {/* AI Diet Suggestion */}
          {showSuggestion && suggestion && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    🤖 AI Diet Suggestion
                    <Bot className="w-5 h-5 text-purple-600" />
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                </div>
                <button
                  onClick={() => setShowSuggestion(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Add Meal Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Meal (AI will calculate calories automatically)</h3>
              <form onSubmit={handleAddMeal} className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center border-4 border-green-200 cursor-pointer hover:opacity-80 transition relative group">
                    {newMeal.food_pic ? (
                      <img 
                        src={URL.createObjectURL(newMeal.food_pic)}
                        alt="Food"
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200&h=200&fit=crop"
                        alt="Food"
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <label className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer hover:bg-green-200 transition text-sm font-medium">
                    Upload Food Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={newMeal.p_id}
                    onChange={(e) => setNewMeal({ ...newMeal, p_id: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Pet</option>
                    {pets.map(pet => (
                      <option key={pet.p_id} value={pet.p_id}>{pet.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Food Name"
                    value={newMeal.food_name}
                    onChange={(e) => setNewMeal({ ...newMeal, food_name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity (in grams)"
                    value={newMeal.quantity}
                    onChange={(e) => setNewMeal({ ...newMeal, quantity: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <input
                    type="date"
                    value={newMeal.date}
                    onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        AI Calculating Calories...
                      </>
                    ) : (
                      'Save Meal'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Meals List - Card Layout */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Meal Records</h3>
            {meals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No meals recorded yet</p>
                <p className="text-sm">Add your first meal to start tracking!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal, index) => (
                  <div 
                    key={meal.log_id || `meal-${index}`}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300"
                  >
                    {/* Food Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={meal.food_pic ? `${API_BASE}/${meal.food_pic}` : 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'}
                        alt="Food"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-bold text-purple-600">{Math.round(meal.calories)} kcal</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h4 className="text-white text-xl font-bold">{meal.food_name}</h4>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Pet Info */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-100">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                          <PawPrint className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-800">{meal.pet_name}</p>
                          <p className="text-sm text-gray-500">Pet</p>
                        </div>
                      </div>

                      {/* Meal Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Utensils className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm text-gray-600">Quantity</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{meal.quantity}g</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">📅</span>
                            </div>
                            <span className="text-sm text-gray-600">Date</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{new Date(meal.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-purple-100">
                        <button
                          onClick={() => handleDelete(meal.log_id)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg transition text-red-600 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
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
