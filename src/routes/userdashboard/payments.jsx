import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
  Filter,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../../lib/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';





export const Route = createFileRoute('/userdashboard/payments')({
  component: ViewPayment,
})



const ViewPayment = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const {userPaymentRecord, refetch} = useAuth()
  const data  = userPaymentRecord;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [copiedId, setCopiedId] = useState(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false);
    


// Refresh function to refetch data


  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    userName: true,
    userId: true,
    code: true,
    status: true,
  });

  // Define columns configuration
  const allColumns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      width: '80px',
      render: (value) => <div className="font-[400] text-gray-900">#{value}</div>
    },
    { 
      key: 'userName', 
      label: 'Full Name', 
      sortable: true,
      render: (value) => <div className="font-[400] text-gray-900">{value}</div>
    },
    { 
      key: 'userId', 
      label: 'Unique ID', 
      sortable: true,
      render: (value) => <div className="font-[400] text-gray-900">{value}</div>
    },
    { 
      key: 'code', 
      label: 'Payment Code', 
      sortable: true,
      render: (value) => <div className="text-gray-700  text-[15px]">{value}</div>
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value) => {
        const statusColors = {
          Used: 'bg-green-100 text-green-700',
          'Not Used': 'bg-yellow-100 text-yellow-700',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}>
            {value}
          </span>
        );
      }
    },
  ];

  // Get only visible columns
  const columns = allColumns.filter(col => visibleColumns[col.key]);

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const filteredData = useMemo(() => {
  if (!data || !Array.isArray(data)) return []; // ← Add this check
  if (!searchTerm) return data;

  return data.filter((row) => {
    return allColumns.some((column) => {
      const value = row[column.key];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
}, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
     if (!filteredData || filteredData.length === 0) return []; // ← Add this check
  if (!sortConfig.key) return filteredData;

  const sorted = [...filteredData].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return sorted;
  }, [filteredData, sortConfig]);

  console.log("Sorted Data", sortedData)

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Copy payment code to clipboard
  const handleCopycode = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy payment code');
    }
  };

  // Export to CSV
  const handleExport = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };




      const handleRefresh = async () => {
      setIsRefreshing(true);
      
      try {
        await refetch();
        toast.success('Data refreshed successfully!');
      } catch (error) {
        console.error('Failed to refresh data:', error);
        toast.error('Failed to refresh data');
      } finally {
        setIsRefreshing(false);
      }
    };


  return (
    <div className="w-full lg:p-6 py-4 bg-gray-50 font-inter">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="lg:px-6 px-4 py-4 border-b border-gray-200">
          <div className="lg:flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Payment Data</h2>
              <p className="text-[15px] text-gray-500 mt-1">
                View and manage payment records
              </p>
            </div>

            <div className="flex items-center lg:justify-between lg:gap-5 gap-3 lg:mt-0 mt-2">
            <button onClick={handleRefresh} disabled={isRefreshing} 
            className="flex items-center gap-2 lg:px-4 lg:py-2 px-[25px] py-[7px] text-white rounded-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ backgroundColor: '#091e54' }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <p className='lg:flex hidden'>{isRefreshing ? 'Refreshing...' : 'Refresh'}</p>
          </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 lg:px-4 lg:py-2 px-[25px] py-[7px] text-white rounded-sm hover:bg-opacity-90 transition-colors"
              style={{ backgroundColor: '#091e54' }}
            >
              <Download className="w-4 h-4" />
              <p className="lg:flex hidden">Export CSV</p>
            </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="lg:px-6 px-4 py-4 border-b border-gray-200">
          <div className="lg:flex grid flex-wrap items-center gap-4">
            {/* Global Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': '#091e54' }}
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Selector */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Columns
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showColumnSelector && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <div className="px-3 py-2 text-[15px] font-medium text-gray-700 border-b border-gray-200">
                      Show/Hide Columns
                    </div>
                    {allColumns.map((column) => (
                      <label
                        key={column.key}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key]}
                          onChange={() => toggleColumn(column.key)}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          style={{ accentColor: '#091e54' }}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {visibleColumns[column.key] ? (
                            <Eye className="w-4 h-4 text-gray-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-[15px] text-gray-700">{column.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-gray-600">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ '--tw-ring-color': '#091e54' }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    style={{ width: column.width }}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        column.sortable ? 'cursor-pointer  select-none' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.label}
                      {column.sortable && (
                        <span className="text-gray-400">
                          {getSortIcon(column.key)}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-[15px]">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap ">
                        {column.render 
                          ? column.render(row[column.key], row) 
                          : row[column.key]
                        }
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        className="flex items-center gap-2 px-3 py-1 text-[15px] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        style={{ backgroundColor: copiedId === row._id ? '#10b981' : '#091e54' }}
                        onClick={() => handleCopycode(row.code, row._id)}
                        title="Copy Payment Code"
                      >
                        {copiedId === row.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy ID
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="lg:px-6 px-4 py-4 border-t border-gray-200">
          <div className="lg:flex grid items-center justify-between gap-4">
            {/* Pagination Info */}
            <div className="text-[15px] text-gray-600">
              Showing{' '}
              <span className="font-medium">{sortedData.length > 0 ? startIndex : 0}</span>{' '}
              to{' '}
              <span className="font-medium">{endIndex}</span>{' '}
              of{' '}
              <span className="font-medium">{sortedData.length}</span>{' '}
              results
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4">
                <span className="text-[15px] text-gray-600">Page</span>
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ '--tw-ring-color': '#091e54' }}
                  min="1"
                  max={totalPages}
                />
                <span className="text-[15px] text-gray-600">
                  of {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
