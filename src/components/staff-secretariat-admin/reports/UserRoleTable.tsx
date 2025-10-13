// components/staff-secretariat-admin/reports/UserRoleTable.tsx
'use client';

interface UserRole {
  role: string;
  activeUsers: number;
  avgTime: string;
}

interface UserRoleTableProps {
  users: UserRole[];
}

export default function UserRoleTable({ users }: UserRoleTableProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h3 
        className="text-base sm:text-lg font-bold text-[#003366] mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Usage by User Role
      </h3>
      <p 
        className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Activity breakdown by user type
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#003366]">
            <tr>
              <th 
                className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                User Role
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Active Users
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white rounded-tr-lg"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Avg. Time
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.role} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td 
                  className="px-4 py-3 text-sm font-medium text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {user.role}
                </td>
                <td 
                  className="px-4 py-3 text-center text-sm font-semibold text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {user.activeUsers}
                </td>
                <td 
                  className="px-4 py-3 text-center text-sm font-semibold text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {user.avgTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div key={user.role} className="border-2 border-gray-200 rounded-lg p-4 bg-white">
            <p 
              className="font-bold text-[#003366] mb-3 text-base"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {user.role}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p 
                  className="text-xs font-medium text-gray-700 mb-1" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Active Users
                </p>
                <p 
                  className="text-lg font-bold text-[#003366]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {user.activeUsers}
                </p>
              </div>
              <div>
                <p 
                  className="text-xs font-medium text-gray-700 mb-1" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Avg. Time
                </p>
                <p 
                  className="text-lg font-bold text-[#003366]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {user.avgTime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
