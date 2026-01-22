'use client';

import { useState } from 'react';
import { Edit2, Trash2, Search, Filter } from 'lucide-react';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
     { id: '1', full_name: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', role: 'Reviewer', availability_status: 'Available' },
     { id: '2', full_name: 'Prof. Michael Chen', email: 'm.chen@example.com', role: 'Staff', availability_status: 'Busy' },
     { id: '3', full_name: 'Jessica Davis', email: 'j.davis@example.com', role: 'Secretariat', availability_status: 'Available' },
  ]);

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Updated text color to gray-900 and placeholder to gray-500
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
           </div>
           <div className="flex gap-2 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-sm">
                <Filter size={16} /> Filter
             </button>
             <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#101C50] text-white rounded-xl hover:bg-blue-900 font-bold text-sm">
                Add User
             </button>
           </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#101C50] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-[#101C50]">
                  {user.full_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    user.availability_status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    user.availability_status === 'Busy' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-gray-50 text-gray-600 border border-gray-100'
                  }`}>
                    {user.availability_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#101C50] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="text-sm font-bold text-[#101C50]">{user.full_name}</h3>
                   <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    user.availability_status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-gray-50 text-gray-600 border-gray-100'
                }`}>
                   {user.availability_status}
                </span>
             </div>
             <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                   {user.role}
                </span>
                <div className="flex gap-2">
                   <button className="p-1.5 text-gray-500 hover:text-[#101C50] bg-gray-50 rounded-md">
                      <Edit2 size={14} />
                   </button>
                   <button className="p-1.5 text-gray-500 hover:text-red-600 bg-gray-50 rounded-md">
                      <Trash2 size={14} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
