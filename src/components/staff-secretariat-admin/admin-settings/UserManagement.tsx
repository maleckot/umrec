// components/staff-secretariat-admin/admin-settings/UserManagement.tsx
'use client';

import { useState } from 'react';
import { Search, Plus, X, ChevronDown, Edit2, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
  email?: string;
  contactNumber?: string;
  code?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Juan Dela Cruz', role: 'Reviewer', status: 'Active', email: 'juan@example.com', contactNumber: '09123456789', code: 'REC-001' },
    { id: '2', name: 'Choi Seungcheol', role: 'Staff', status: 'Inactive', email: 'choi@example.com', contactNumber: '09234567890', code: 'STF-001' },
    { id: '3', name: 'Jeon Wonwoo', role: 'Officer', status: 'Active', email: 'jeon@example.com', contactNumber: '09345678901', code: 'OFF-001' },
    { id: '4', name: 'Lee Seokmin', role: 'Reviewer', status: 'Active', email: 'lee@example.com', contactNumber: '09456789012', code: 'REC-002' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    code: '',
    contactNumber: '',
    email: '',
    password: '',
    role: 'Reviewer',
    status: 'Active'
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (roleFilter === 'All Roles' || user.role === roleFilter) &&
    (statusFilter === 'All Status' || user.status === statusFilter)
  );

  const handleDeleteConfirm = (id: string) => {
    setDeleteUserId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (deleteUserId) {
      setUsers(users.filter(u => u.id !== deleteUserId));
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleAddUser = () => {
    setShowAddModal(false);
    setNewUser({
      firstName: '',
      lastName: '',
      code: '',
      contactNumber: '',
      email: '',
      password: '',
      role: 'Reviewer',
      status: 'Active'
    });
    alert('User added successfully!');
  };

  const handleUpdateUser = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    alert('User updated successfully!');
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 max-w-full overflow-hidden">
      <h2 
        className="text-base sm:text-lg md:text-xl font-bold text-[#003366] mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        User Management
      </h2>
      <p 
        className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Manage reviewers, staff, and officers
      </p>

        {/* Search and Filters */}
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
    <input
      type="text"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
    />
  </div>
  <div className="relative">
    <select
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      className="w-full sm:w-auto appearance-none px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 bg-[#003366] text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
    >
      <option>All Roles</option>
      <option>Reviewer</option>
      <option>Staff</option>
      <option>Officer</option>
    </select>
    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
  </div>
  <div className="relative">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="w-full sm:w-auto appearance-none px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 bg-[#003366] text-white rounded-lg text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
    >
      <option>All Status</option>
      <option>Active</option>
      <option>Inactive</option>
    </select>
    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
  </div>
</div>

      {/* Add User Button */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Users
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#003366] text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full">
          <thead className="bg-[#003366]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Name
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Role
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white rounded-tr-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {user.name}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {user.role}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {user.status}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2 sm:space-y-3 mb-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border-2 border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-semibold text-[#003366] text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {user.name}
                </p>
                <p className="text-xs text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {user.role} • {user.status}
                </p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleEdit(user)}
                  className="p-1.5 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteConfirm(user.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Showing 1 to 4 of 42 results
        </p>
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#003366] text-white rounded text-xs sm:text-sm font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-medium ${
                currentPage === page ? 'bg-[#003366] text-white' : 'bg-white text-[#003366] border border-gray-300'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {page}
            </button>
          ))}
          <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-[#003366] text-white rounded text-xs sm:text-sm font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-base sm:text-lg font-bold text-[#003366] mb-3 sm:mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Confirm Delete
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteUserId(null);
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Add New User
              </h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Code
                  </label>
                  <input
                    type="text"
                    value={newUser.code}
                    onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={newUser.contactNumber}
                    onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <option>Reviewer</option>
                    <option>Staff</option>
                    <option>Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[#003366] text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Edit User: {selectedUser.name}
              </h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name.split(' ')[0]}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.name.split(' ').slice(1).join(' ')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Contact Number
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser.contactNumber}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Role
                  </label>
                  <select
                    defaultValue={selectedUser.role}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <option>Reviewer</option>
                    <option>Staff</option>
                    <option>Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Status
                  </label>
                  <select
                    defaultValue={selectedUser.status}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-[#003366] text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
