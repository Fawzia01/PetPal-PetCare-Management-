'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, PawPrint, MoreVertical, Calendar, User } from 'lucide-react';

export default function PetProfilesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPets, setSelectedPets] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Bagha',
      type: 'Dog',
      breed: 'German Shepherd',
      age: '3 years',
      owner: 'Rahim Ahmed',
      status: 'Active',
      lastVisit: '05/12/2025',
      healthStatus: 'Healthy',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Mini',
      type: 'Cat',
      breed: 'Persian',
      age: '2 years',
      owner: 'Karim Khan',
      status: 'Active',
      lastVisit: '03/12/2025',
      healthStatus: 'Under Treatment',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Tutul',
      type: 'Bird',
      breed: 'Parrot',
      age: '1 year',
      owner: 'Salma Begum',
      status: 'Active',
      lastVisit: '08/12/2025',
      healthStatus: 'Healthy',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?w=150&h=150&fit=crop'
    },
    {
      id: 4,
      name: 'Rocky',
      type: 'Dog',
      breed: 'Labrador',
      age: '4 years',
      owner: 'Jamal Uddin',
      status: 'Inactive',
      lastVisit: '01/11/2025',
      healthStatus: 'Observation',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop'
    }
  ]);

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || pet.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this pet profile?')) {
      setPets(pets.filter(pet => pet.id !== id));
    }
  };

  const handleSelectPet = (id) => {
    setSelectedPets(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-[#6C4AB6]">
          <p className="text-gray-500 text-sm font-medium">Total Pets</p>
          <p className="text-3xl font-bold text-[#6C4AB6]">{pets.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Active Pets</p>
          <p className="text-3xl font-bold text-green-600">
            {pets.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm font-medium">Under Treatment</p>
          <p className="text-3xl font-bold text-orange-600">
            {pets.filter(p => p.healthStatus === 'Under Treatment').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium">Inactive Pets</p>
          <p className="text-3xl font-bold text-red-600">
            {pets.filter(p => p.status === 'Inactive').length}
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
              placeholder="Search by pet or owner name..."
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
      </div>

      {/* Pets Grid (Replaces Table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3">
                <button className="bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-gray-600 hover:text-[#6C4AB6] transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm ${
                  pet.status === 'Active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {pet.status}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed} • {pet.age}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  pet.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' :
                  pet.healthStatus === 'Under Treatment' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {pet.healthStatus}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-[#6C4AB6]" />
                  <span>Owner: {pet.owner}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#6C4AB6]" />
                  <span>Last Visit: {pet.lastVisit}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(pet.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
