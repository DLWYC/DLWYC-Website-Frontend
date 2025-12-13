import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Check, X, ChevronLeft, ChevronRight, Loader2, RefreshCw, Users, CheckCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Archdeaconries, getArchdeaconryCode } from '@/data/Archdeaconries';
import axios from 'axios';
import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from "react-toastify";
import RegistrationUnitTopNav from '@/components/AppTopNav/RegitrationUnitTopNav';

export const Route = createFileRoute('/registrationunit/')({
  component: EventCheckInPortal,
})

function EventCheckInPortal() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  // State management
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedArchdeaconry, setSelectedArchdeaconry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  
  // Loading states
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingCheckIns, setProcessingCheckIns] = useState(new Set());

  // Fetch all events on mount
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await axios.get(`${backendUrl}/api/registrationUnit/allEvents`);
        setEvents(response?.data?.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events. Please refresh the page.");
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchAllEvents();
  }, [backendUrl]);

  // Fetch attendees function (extracted for reuse)
  const fetchEventAttendees = useCallback(async (showRefreshIndicator = false) => {
    if (!selectedEvent) {
      setAttendees([]);
      return;
    }

    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoadingAttendees(true);
      }
      
      const response = await axios.get(
        `${backendUrl}/api/registrationUnit/eventAttendees/${selectedEvent}`
      );
      setAttendees(response?.data?.data || []);
      
      if (showRefreshIndicator) {
        toast.success("Attendees list refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching event attendees:", error);
      toast.error("Failed to load attendees. Please try again.");
      setAttendees([]);
    } finally {
      setIsLoadingAttendees(false);
      setIsRefreshing(false);
    }
  }, [selectedEvent, backendUrl]);

  // Fetch attendees when event changes
  useEffect(() => {
    fetchEventAttendees(false);
  }, [selectedEvent]);

  // Manual refresh handler
  const handleRefresh = useCallback(() => {
    fetchEventAttendees(true);
  }, [fetchEventAttendees]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!attendees.length) return { total: 0, checkedIn: 0, pending: 0 };
    
    const checkedIn = attendees.filter(a => a.eventDetails?.checkedInStatus).length;
    return {
      total: attendees.length,
      checkedIn,
      pending: attendees.length - checkedIn
    };
  }, [attendees]);

  // Optimized filtering with useMemo
  const filteredAttendees = useMemo(() => {
    if (!attendees.length) return [];
    
    return attendees.filter(attendee => {
      // Archdeaconry filter
      if (selectedArchdeaconry) {
        const archCode = getArchdeaconryCode(selectedArchdeaconry);
        if (!attendee.uniqueId?.includes(`/${archCode}/`)) {
          return false;
        }
      }
      
      // Search filter (flexible - searches in uniqueId, name, email)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const uniqueId = attendee.uniqueId?.toLowerCase() || '';
        const name = attendee.fullName?.toLowerCase() || '';
        const email = attendee.email?.toLowerCase() || '';
        
        if (!uniqueId.includes(query) && !name.includes(query) && !email.includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [attendees, searchQuery, selectedArchdeaconry]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
  const currentAttendees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendees, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedArchdeaconry, searchQuery, selectedEvent]);

  // Check-in handler with optimistic UI update
  const handleCheckIn = useCallback(async (userId) => {
    if (processingCheckIns.has(userId)) return;

    setProcessingCheckIns(prev => new Set(prev).add(userId));

    // Optimistic update
    setAttendees(prev => 
      prev.map(a => 
        a.userId === userId 
          ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: true } }
          : a
      )
    );

    try {
      await axios.patch(
        `${backendUrl}/api/registrationUnit/eventAttendees/${userId}/checkIn`,
        { eventTitle: selectedEvent }
      );
      
      toast.success("Attendee checked in successfully");
    } catch (error) {
      console.error("Error during check-in:", error);
      
      // Revert optimistic update on error
      setAttendees(prev => 
        prev.map(a => 
          a.userId === userId 
            ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: false } }
            : a
        )
      );
      
      toast.error("Failed to check in attendee. Please try again.");
    } finally {
      setProcessingCheckIns(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [backendUrl, selectedEvent, processingCheckIns]);

  // Un-check handler
  const handleUnCheck = useCallback(async (userId) => {
    if (processingCheckIns.has(userId)) return;

    setProcessingCheckIns(prev => new Set(prev).add(userId));

    // Optimistic update
    setAttendees(prev => 
      prev.map(a => 
        a.userId === userId 
          ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: false } }
          : a
      )
    );

    try {
      await axios.patch(
        `${backendUrl}/api/registrationUnit/eventAttendees/${userId}/undoCheckIn`,
        { eventTitle: selectedEvent }
      );
      
      toast.success("Check-in reversed successfully");
    } catch (error) {
      console.error("Error during un-check:", error);
      
      // Revert on error
      setAttendees(prev => 
        prev.map(a => 
          a.userId === userId 
            ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: true } }
            : a
        )
      );
      
      toast.error("Failed to reverse check-in. Please try again.");
    } finally {
      setProcessingCheckIns(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [backendUrl, selectedEvent, processingCheckIns]);

  // Selection handlers
  const allCurrentPageSelected = useMemo(() => 
    currentAttendees.length > 0 && 
    currentAttendees.every(a => selectedAttendees.includes(a.userId)),
    [currentAttendees, selectedAttendees]
  );

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedAttendees(prev => {
        const currentIds = currentAttendees.map(a => a.userId);
        return [...new Set([...prev, ...currentIds])];
      });
    } else {
      setSelectedAttendees(prev => 
        prev.filter(id => !currentAttendees.find(a => a.userId === id))
      );
    }
  }, [currentAttendees]);

  const handleSelectAttendee = useCallback((userId) => {
    setSelectedAttendees(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleBulkCheckIn = useCallback(async () => {
    if (!selectedAttendees.length) return;

    const attendeeIds = [...selectedAttendees];
    const total = attendeeIds.length;
    let completed = 0;

    setSelectedAttendees([]);

    toast.info(`Checking in ${total} attendees...`);

    try {
      for (const userId of attendeeIds) {
        await handleCheckIn(userId);
        completed++;
      }
      toast.success(`Successfully checked in ${completed} attendees`);
    } catch (error) {
      console.error("Error during bulk check-in:", error);
      toast.error(`Checked in ${completed} of ${total} attendees before error`);
    }
  }, [selectedAttendees, handleCheckIn]);

  // Pagination
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  // Event change handler
  const handleEventChange = useCallback((eventTitle) => {
    setSelectedEvent(eventTitle);
    setSelectedArchdeaconry('');
    setSearchQuery('');
    setSelectedAttendees([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <RegistrationUnitTopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Statistics Cards */}
        {selectedEvent && !isLoadingAttendees && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white">
            <div className="rounded-lg shadow-sm p-4 bg-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium ">Total Attendees</p>
                  <p className="text-2xl font-bold">{statistics.total}</p>
                </div>
                <Users className="w-8 h-8 " />
              </div>
            </div>
            
            <div className="rounded-lg shadow-sm p-4 bg-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium ">Checked In</p>
                  <p className="text-2xl font-bold">{statistics.checkedIn}</p>
                </div>
                <CheckCircle className="w-8 h-8 " />
              </div>
            </div>
            
            <div className="rounded-lg shadow-sm p-4 bg-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium ">Pending</p>
                  <p className="text-2xl font-bold">{statistics.pending}</p>
                </div>
                <Loader2 className="w-8 h-8 " />
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {selectedEvent && (
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoadingAttendees}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => handleEventChange(e.target.value)}
                disabled={isLoadingEvents}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {isLoadingEvents ? 'Loading events...' : 'Select an Event'}
                </option>
                {events.map(event => (
                  <option key={event._id} value={event.eventTitle}>
                    {event.eventTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Archdeaconry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archdeaconry
              </label>
              <select
                value={selectedArchdeaconry}
                onChange={(e) => setSelectedArchdeaconry(e.target.value)}
                disabled={!selectedEvent || isLoadingAttendees}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All Archdeaconries</option>
                {Archdeaconries.map(arch => (
                  <option key={arch} value={arch}>
                    {arch}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ID, name, or email"
                  disabled={!selectedEvent || isLoadingAttendees}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {selectedEvent && !isLoadingAttendees && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing <span className="font-semibold">{filteredAttendees.length}</span> of{' '}
                <span className="font-semibold">{attendees.length}</span> attendees
              </span>
              {selectedAttendees.length > 0 && (
                <Button
                  onClick={handleBulkCheckIn}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Check In Selected ({selectedAttendees.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allCurrentPageSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={currentAttendees.length === 0}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Full Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Payment Date</TableHead>
                  <TableHead className="font-semibold">Payment Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoadingAttendees ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                      <span className="text-gray-600">Loading attendees...</span>
                    </TableCell>
                  </TableRow>
                ) : currentAttendees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                      {selectedEvent 
                        ? "No attendees found matching your criteria" 
                        : "Please select an event to view attendees"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  currentAttendees.map((attendee) => {
                    const isProcessing = processingCheckIns.has(attendee.userId);
                    const isCheckedIn = attendee.eventDetails?.checkedInStatus;
                    
                    return (
                      <TableRow 
                        key={attendee.userId}
                        className={isCheckedIn ? 'bg-green-50' : 'hover:bg-gray-50'}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedAttendees.includes(attendee.userId)}
                            onCheckedChange={() => handleSelectAttendee(attendee.userId)}
                            disabled={isProcessing}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{attendee.fullName}</span>
                            <span className="text-xs text-gray-500">
                              ID: {attendee.uniqueId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {attendee.email}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {attendee.eventDetails?.paymentTime 
                            ? new Date(attendee.eventDetails.paymentTime).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={attendee.eventDetails?.paymentStatus === 'success' ? "default" : "secondary"}
                            className={
                              attendee.eventDetails?.paymentStatus === 'success' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'text-white bg-yellow-500 hover:bg-yellow-600'
                            }
                          >
                            {attendee.eventDetails?.paymentStatus || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!isCheckedIn ? (
                            <Button
                              onClick={() => handleCheckIn(attendee.userId)}
                              size="sm"
                              disabled={isProcessing}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4 mr-1" />
                              )}
                              Check In
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleUnCheck(attendee.userId)}
                              size="sm"
                              disabled={isProcessing}
                              variant="destructive"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <X className="w-4 h-4 mr-1" />
                              )}
                              Un-Check
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoadingAttendees && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}