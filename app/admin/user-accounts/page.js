'use client';

import { useState } from 'react';
import { Users, Search, Filter, Plus, Edit2, Trash2, UserCheck, UserX, Mail, Phone, Calendar, Shield, MoreVertical } from 'lucide-react';

export default function UserAccountsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rahim Ahmed',
      email: 'rahim@example.com',
      phone: '01712345678',
      role: 'User',
      status: 'Active',
      joinDate: '01/01/2025',
      totalPets: 2,
      lastActive: '10/12/2025',
      verified: true,
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Karim Khan',
      email: 'karim@example.com',
      phone: '01812345678',
      role: 'User',
      status: 'Active',
      joinDate: '15/01/2025',
      totalPets: 1,
      lastActive: '09/12/2025',
      verified: true,
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Salma Begum',
      email: 'salma@example.com',
      phone: '01912345678',
      role: 'Premium',
      status: 'Active',
      joinDate: '10/02/2025',
      totalPets: 3,
      lastActive: '10/12/2025',
      verified: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      id: 4,
      name: 'Jamal Uddin',
      email: 'jamal@example.com',
      phone: '01612345678',
      role: 'User',
      status: 'Suspended',
      joinDate: '05/03/2025',
      totalPets: 1,
      lastActive: '01/12/2025',
      verified: false,
      image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop'
    },
    {
      id: 5,
      name: 'Fatema Khatun',
      email: 'fatema@example.com',
      phone: '01512345678',
      role: 'Premium',
      status: 'Active',
      joinDate: '20/02/2025',
      totalPets: 4,
      lastActive: '09/12/2025',
      verified: true,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user account?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return user;
    }));
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#6C4AB6] mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#FF4FA3]" />
          User Accounts Management
        </h1>
        <p className="text-gray-600">View, edit and manage all user accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-[#6C4AB6]">
          <p className="text-gray-500 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-[#6C4AB6]">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-medium">Active Users</p>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-medium">Suspended</p>
          <p className="text-3xl font-bold text-red-600">
            {users.filter(u => u.status === 'Suspended').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-[#FF4FA3]">
          <p className="text-gray-500 text-sm font-medium">Premium Users</p>
          <p className="text-3xl font-bold text-[#FF4FA3]">
            {users.filter(u => u.role === 'Premium').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm font-medium">Verified</p>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.verified).length}
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
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6C4AB6] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6C4AB6] hover:bg-[#5a3d9a] text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-purple-200"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-[#6C4AB6] font-semibold">
              {selectedUsers.length} users selected
            </span>
            <div className="flex gap-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">
                Activate
              </button>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded text-sm">
                Suspend
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Grid (Replaces Table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#FF4FA3] p-0.5"
                    />
                    {user.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                        <UserCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                      user.role === 'Premium' ? 'bg-[#FF4FA3]/10 text-[#FF4FA3]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Mail className="w-4 h-4 text-[#6C4AB6]" />
                  {user.email}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Phone className="w-4 h-4 text-[#6C4AB6]" />
                  {user.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 text-[#6C4AB6]" />
                  Joined: {user.joinDate}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => viewUserDetails(user)}
                    className="p-2 text-[#6C4AB6] hover:bg-purple-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-500">
              <span>{user.totalPets} Pets Registered</span>
              <span>Last Active: {user.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No users found</p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <input type="text" placeholder="Full Name" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <input type="tel" placeholder="Phone Number" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <input type="password" placeholder="Password" className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" />
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none">
                <option>Select User Role</option>
                <option>User</option>
                <option>Premium</option>
                <option>Admin</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none">
                <option>Select Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-[#6C4AB6] rounded" />
                  <span className="text-sm text-gray-700">Email Verified</span>
                </label>
              </div>
              <textarea placeholder="Detailed Notes (Optional)" className="border border-gray-300 rounded-lg px-4 py-2 col-span-2 focus:ring-2 focus:ring-[#6C4AB6] outline-none" rows="3"></textarea>
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

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-6 mb-8">
              <img 
                src={selectedUser.image} 
                alt={selectedUser.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-[#FF4FA3]"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.role === 'Premium' ? 'bg-[#FF4FA3]/10 text-[#FF4FA3]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Phone</h3>
                <p className="text-lg text-gray-800">{selectedUser.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Verification</h3>
                <p className="text-lg text-gray-800">{selectedUser.verified ? 'Verified ✓' : 'Unverified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Join Date</h3>
                <p className="text-lg text-gray-800">{selectedUser.joinDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Last Active</h3>
                <p className="text-lg text-gray-800">{selectedUser.lastActive}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Total Pets</h3>
                <p className="text-lg text-gray-800">{selectedUser.totalPets} pets</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Edit
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
