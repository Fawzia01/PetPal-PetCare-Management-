'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, PawPrint, MoreVertical, Calendar, User } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function PetProfilesManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPets, setSelectedPets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pets, setPets] = useState([]);
  const [petTreatments, setPetTreatments] = useState({});
  const [treatmentCount, setTreatmentCount] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);

  // Fetch pets from backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('petpal_token');
        if (!token) {
          router.push('/admin-login');
          return;
        }

        const res = await fetch(`${API_BASE}/admin/pets`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/admin-login');
            return;
          }
          throw new Error(`Failed to fetch pets: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const allPets = Array.isArray(data) ? data : data.pets || [];
        
        // Only set active pets
        const activePets = allPets.filter(pet => pet.status !== 'Inactive');
        setPets(activePets);
        
        // Fetch treatments for pets under treatment
        await fetchTreatmentsForPets(activePets, token);
        
        // Fetch health records counts
        await fetchHealthRecordsCounts(token);
      } catch (err) {
        console.error('Error fetching pets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [router]);

  const fetchTreatmentsForPets = async (activePets, token) => {
    try {
      const treatments = {};
      
      for (const pet of activePets) {
        if (pet.health_status === 'Under Treatment') {
          const res = await fetch(`${API_BASE}/health/pet/${pet.p_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const healthRecords = await res.json();
            // Get the most recent treatment record
            const treatmentRecord = healthRecords.find(r => r.type === 'Treatment');
            if (treatmentRecord) {
              treatments[pet.p_id] = treatmentRecord;
            }
          }
        }
      }
      
      setPetTreatments(treatments);
    } catch (err) {
      console.error('Error fetching treatments:', err);
    }
  };

  const fetchHealthRecordsCounts = async (token) => {
    try {
      // Fetch all health records to count treatments and healthy pets
      const res = await fetch(`${API_BASE}/health/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const allHealthRecords = await res.json();
        
        // Count records with type = 'Treatment'
        const treatments = allHealthRecords.filter(r => r.type === 'Treatment').length;
        setTreatmentCount(treatments);
        
        // Count records with condition = 'good' or 'healthy' (case-insensitive)
        const healthy = allHealthRecords.filter(r => 
          r.condition && (r.condition.toLowerCase() === 'good' || r.condition.toLowerCase() === 'healthy')
        ).length;
        setHealthyCount(healthy);
      }
    } catch (err) {
      console.error('Error fetching health records counts:', err);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = 
      (pet.name && pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.owner_name && pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.species && pet.species.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const petType = pet.species || pet.type;
    const matchesFilter = filterType === 'all' || petType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this pet profile?')) {
      try {
        const token = localStorage.getItem('petpal_token');
        const res = await fetch(`${API_BASE}/admin/pets/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          setPets(pets.filter(pet => pet.p_id !== id));
        } else {
          alert('Failed to delete pet');
        }
      } catch (err) {
        console.error('Error deleting pet:', err);
        alert('Error deleting pet');
      }
    }
  };

  const handleSelectPet = (id) => {
    setSelectedPets(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleEditPet = (petId) => {
    router.push(`/admin/pet-profiles/edit/${petId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#6C4AB6] mb-2 flex items-center gap-3">
          <PawPrint className="w-8 h-8 text-[#FF4FA3]" />
          Pet Profiles Management
        </h1>
        <p className="text-gray-600">View, edit and manage all pet profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-[#6C4AB6]">
          <p className="text-gray-500 text-sm font-medium">Total Pets</p>
          <p className="text-3xl font-bold text-[#6C4AB6]">{loading ? '-' : pets.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium">Under Treatment</p>
          <p className="text-3xl font-bold text-orange-600">
            {loading ? '-' : treatmentCount}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Healthy Pets</p>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '-' : healthyCount}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by pet name, owner name, or species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-200"
          >
            <Plus className="w-5 h-5" />
            Add New Pet
          </button>

          {/* Export Button */}
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {selectedPets.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[#6C4AB6] font-semibold">
              {selectedPets.length} pets selected
            </span>
            <div className="flex gap-2">
              <button className="bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white px-4 py-1 rounded text-sm">
                Bulk Edit
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm">
                Bulk Delete
              </button>
            </div>
          </div>
        )}
        
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Search Results:</span> {filteredPets.length} pet(s) found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Pets Grid (Replaces Table) */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <p>Loading pets...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.p_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={pet.profile_pic || 'https://images.unsplash.com/photo-1587300411107-ec7b9be36b5e?w=150&h=150&fit=crop'} 
                  alt={pet.name} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1587300411107-ec7b9be36b5e?w=150&h=150&fit=crop'}}
                />
                <div className="absolute top-3 right-3">
                  <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-[#6C4AB6] transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    pet.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                  }`}>
                    {pet.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{pet.name}</h3>
                    <p className="text-sm text-gray-500">{pet.breed || 'N/A'} • {pet.species || 'N/A'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    pet.health_status === 'Healthy' ? 'bg-green-100 text-green-700' :
                    pet.health_status === 'Under Treatment' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {pet.health_status || 'Healthy'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-[#6C4AB6]" />
                    <span>Owner: {pet.owner_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-[#6C4AB6]" />
                    <span>Gender: {pet.gender || 'N/A'}</span>
                  </div>
                  {pet.health_status === 'Under Treatment' && petTreatments[pet.p_id] && (
                    <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                      <p className="text-xs text-orange-600 font-semibold">Treatment: {petTreatments[pet.p_id].condition}</p>
                      <p className="text-xs text-orange-600">Note: {petTreatments[pet.p_id].note}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/pet-profiles/edit/${pet.p_id}`)}
                    className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(pet.p_id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPets.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <PawPrint className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No pet profiles found</p>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Pet Profile</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input type="text" placeholder="Pet Name" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none">
                <option>Select Pet Type</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
              </select>
              <input type="text" placeholder="Breed" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <input type="text" placeholder="Age" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <input type="text" placeholder="Owner Name" className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <textarea placeholder="Details" className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" rows="3"></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white rounded-lg transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
