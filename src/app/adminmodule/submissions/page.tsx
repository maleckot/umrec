// app/adminmodule/submissions/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const itemsPerPage = 10;

  // Expanded sample data (50 items)
  const allSubmissionsData = [
    {
      id: 'SUB-2025-001',
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      date: '07-24-2025',
      status: 'Under Verification',
    },
    {
      id: 'SUB-2025-002',
      title: 'Effectiveness of Online Learning Platforms in Higher Education',
      date: '08-03-2025',
      status: 'Under Classification',
    },
    {
      id: 'SUB-2025-003',
      title: 'Impact of Social Media on Student Mental Health and Academic Performance',
      date: '08-15-2025',
      status: 'Waiting for Reviewers',
    },
    {
      id: 'SUB-2025-004',
      title: 'Analysis of Cybersecurity Threats in Cloud Computing Environments',
      date: '08-20-2025',
      status: 'Under Review',
    },
    {
      id: 'SUB-2025-005',
      title: 'Machine Learning Approaches for Early Disease Detection in Medical Imaging',
      date: '09-01-2025',
      status: 'Under Revision',
    },
    {
      id: 'SUB-2025-006',
      title: 'Sustainable Urban Planning: Green Infrastructure Implementation Strategies',
      date: '09-05-2025',
      status: 'Review Complete',
    },
    {
      id: 'SUB-2025-007',
      title: 'Blockchain Technology Applications in Supply Chain Management',
      date: '09-10-2025',
      status: 'Under Verification',
    },
    {
      id: 'SUB-2025-008',
      title: 'The Role of Artificial Intelligence in Personalized Education',
      date: '09-12-2025',
      status: 'Under Classification',
    },
    {
      id: 'SUB-2025-009',
      title: 'Climate Change Adaptation Strategies for Coastal Communities',
      date: '09-15-2025',
      status: 'Under Review',
    },
    {
      id: 'SUB-2025-010',
      title: 'Investigating the Effects of Remote Work on Employee Productivity',
      date: '09-18-2025',
      status: 'Waiting for Reviewers',
    },
    // Add more dummy data
    ...Array.from({ length: 40 }, (_, i) => ({
      id: `SUB-2025-${String(i + 11).padStart(3, '0')}`,
      title: `Research Study ${i + 11}: Various Topics in Science and Technology`,
      date: `09-${String(Math.floor(i / 3) + 20).padStart(2, '0')}-2025`,
      status: ['Under Verification', 'Under Classification', 'Waiting for Reviewers', 'Under Review', 'Under Revision', 'Review Complete'][i % 6],
    })),
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Verification':
        return 'text-blue-600 bg-blue-50';
      case 'Under Classification':
        return 'text-amber-600 bg-amber-50';
      case 'Waiting for Reviewers':
        return 'text-orange-600 bg-orange-50';
      case 'Under Review':
        return 'text-purple-600 bg-purple-50';
      case 'Under Revision':
        return 'text-pink-600 bg-pink-50';
      case 'Review Complete':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...allSubmissionsData];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All Statuses') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) {
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          return itemDate <= end;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'Oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'A-Z':
          return a.title.localeCompare(b.title);
        case 'Z-A':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, statusFilter, sortBy, startDate, endDate]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, startDate, endDate]);

  const columns = [
    {
      key: 'title',
      label: 'TITLE',
      align: 'left' as const,
    },
    {
      key: 'date',
      label: 'DATE',
      align: 'center' as const,
      render: (value: string) => (
        <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </span>
      ),
    },
  ];

const handleRowClick = (row: any) => {
  router.push(`/adminmodule/submissions/details?id=${row.id}&status=${encodeURIComponent(row.status)}`);
};
  const resultsText = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredAndSortedData.length)} of ${filteredAndSortedData.length} results`;

  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submissions" activeNav="submissions">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh' }}>
        {/* Search Bar */}
        <SearchBar
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Sort Dropdown */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Under Classification">Under Classification</option>
              <option value="Waiting for Reviewers">Waiting for Reviewers</option>
              <option value="Under Review">Under Review</option>
              <option value="Under Revision">Under Revision</option>
              <option value="Review Complete">Review Complete</option>
            </select>
          </div>

          {/* Date Range - Start Date */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Date Range
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd / mm / yyyy"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text';
                }}
                className="w-full px-3 sm:px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Date Range - End Date */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              to
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd / mm / yyyy"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text';
                }}
                className="w-full px-3 sm:px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <DataTable
              columns={columns}
              data={currentPageData}
              onRowClick={handleRowClick}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            resultsText={resultsText}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
