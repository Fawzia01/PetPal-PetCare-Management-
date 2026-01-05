'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, Save, Calendar, Weight, Heart, Activity, PawPrint 
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';

const API_BASE = 'http://localhost:3001';

export default function EditPetProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    dob: '',
    weight: '',
    med_note: '',
    profile_pic: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('petpal_user');
    const token = localStorage.getItem('petpal_token');
    
    if (!userData || !token) {
      router.push('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchPets(parsedUser.user_id, token);
    }
  }, [router]);

  const fetchPets = async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE}/pets/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPets(data);
        
        if (data.length > 0) {
          // Select first pet by default
          setSelectedPetId(data[0].p_id);
          loadPetData(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadPetData = (pet) => {
    setFormData({
      name: pet.name || '',
      species: pet.species || 'Dog',
      breed: pet.breed || '',
      gender: pet.gender || 'Male',
      dob: pet.dob ? pet.dob.split('T')[0] : '',
      weight: pet.weight || '',
      med_note: pet.med_note || '',
      profile_pic: pet.profile_pic || ''
    });
    
    if (pet.profile_pic) {
      setImagePreview(`${API_BASE}/${pet.profile_pic}`);
    } else {
      setImagePreview(null);
    }
  };

  const handlePetChange = (petId) => {
    const pet = pets.find(p => p.p_id === parseInt(petId));
    if (pet) {
      setSelectedPetId(pet.p_id);
      loadPetData(pet);
      setImageFile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPetId) {
      alert('Please select a pet to edit');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('petpal_token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('species', formData.species);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('weight', formData.weight);
      formDataToSend.append('med_note', formData.med_note);
      
      if (imageFile) {
        formDataToSend.append('profile_pic', imageFile);
      }
      
      const response = await fetch(`${API_BASE}/pets/${selectedPetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        alert('Pet profile updated successfully!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert('Failed to update pet: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Error updating pet profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pet data...</p>
        </div>
      </div>
    );
  }

  if (!user || pets.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No pets found. Please add a pet first.</p>
          <Link href="/dashboard/add-pet" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg">
            Add Pet
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="flex min-h-screen" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* Sidebar */}
      <Sidebar currentPage="edit-pet" />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-[#6C4AB6] mb-2">Edit Pet Profile</h1>
            <p className="text-gray-600">Update your pet's information and preferences</p>
            
            {/* Pet Selector */}
            {pets.length > 1 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet to Edit</label>
                <select
                  value={selectedPetId || ''}
                  onChange={(e) => handlePetChange(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
                >
                  {pets.map(pet => (
                    <option key={pet.p_id} value={pet.p_id}>{pet.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Image & Basic Info */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden group">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full p-1 bg-gradient-to-br from-[#6C4AB6] to-[#FF4FA3]">
                <img 
                  src={imagePreview || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'} 
                  alt="Pet Preview" 
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                />
                <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden"
                  />
                </label>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{formData.name || 'Pet Name'}</h3>
              <p className="text-[#FF4FA3] font-medium">{formData.breed} {formData.species}</p>
              
              <label className="mt-4 text-sm text-[#6C4AB6] font-semibold hover:underline cursor-pointer inline-block">
                Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#6C4AB6]" />
                Vital Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Weight (kg)</label>
                  <div className="relative mt-1">
                    <input 
                      type="number" 
                      step="0.1"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none transition-all"
                      required
                    />
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Age</label>
                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      value={formData.dob ? `${calculateAge(formData.dob)} years` : 'N/A'}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                <PawPrint className="w-6 h-6 text-[#FF4FA3]" />
                General Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                  <select 
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input 
                    type="text" 
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none bg-white"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes / Bio</label>
                <textarea 
                  name="med_note"
                  value={formData.med_note}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none resize-none"
                  placeholder="Any medical conditions, allergies, medications, or special care instructions..."
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button 
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                style={{background: 'linear-gradient(135deg, #6C4AB6, #FF4FA3)'}}
              >
                {loading ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}