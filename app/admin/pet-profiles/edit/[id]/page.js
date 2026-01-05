'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function EditPetProfile() {
  const router = useRouter();
  const params = useParams();
  const petId = params.id;

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    date_of_birth: '',
    weight: '',
    health_status: 'Healthy',
    medical_notes: '',
    owner_name: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        // Wait for petId to be available
        if (!petId) {
          console.log('Waiting for petId...');
          return;
        }

        const token = localStorage.getItem('petpal_token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }
        
        // Fetch all pets and find the specific one
        const res = await fetch(`${API_BASE}/admin/pets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch pets: ${res.status} ${res.statusText}`);
        }

        const allPets = await res.json();
        const petsArray = Array.isArray(allPets) ? allPets : allPets.pets || [];
        const petData = petsArray.find(p => String(p.p_id) === String(petId));

        if (!petData) {
          throw new Error('Pet not found');
        }
        
        setFormData({
          name: petData.name || '',
          species: petData.species || '',
          breed: petData.breed || '',
          gender: petData.gender || '',
          date_of_birth: petData.date_of_birth || '',
          weight: petData.weight || '',
          health_status: petData.health_status || 'Healthy',
          medical_notes: petData.medical_notes || '',
          owner_name: petData.owner_name || ''
        });
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('petpal_token');
      
      if (!token) {
        setError('Authentication token not found');
        setSaving(false);
        return;
      }
      
      // Map frontend field names to backend field names
      const updateData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        dob: formData.date_of_birth,  // Backend expects 'dob'
        weight: formData.weight,
        med_note: formData.medical_notes,  // Backend expects 'med_note'
        health_status: formData.health_status
      };

      const res = await fetch(`${API_BASE}/admin/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to update pet profile: ${res.status}. ${errorData.message || 'Unknown error'}`);
      }

      // Success - redirect back to pet profiles
      router.push('/admin/pet-profiles');
    } catch (err) {
      console.error('Error saving pet:', err);
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#6C4AB6] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-[#6C4AB6] hover:text-[#5a3d9a] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Profiles
      </button>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Pet Profile</h1>
          <p className="text-gray-600 mb-8">Update pet information below</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              Error: {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Pet Name & Species */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="Enter pet name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Species *
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Hamster">Hamster</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Breed & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="Enter breed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Date of Birth & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                  placeholder="Enter weight"
                />
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owner Name
              </label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
                placeholder="Enter owner name"
              />
            </div>

            {/* Health Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Health Status
              </label>
              <select
                name="health_status"
                value={formData.health_status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none"
              >
                <option value="Healthy">Healthy</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="At Risk">At Risk</option>
              </select>
            </div>

            {/* Medical Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medical Notes
              </label>
              <textarea
                name="medical_notes"
                value={formData.medical_notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent outline-none resize-none"
                placeholder="Enter any medical notes or allergies..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-[#6C4AB6] hover:bg-[#5a3d9a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
