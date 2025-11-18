import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Archdeaconries, getArchdeaconryCode } from '@/data/Archdeaconries';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from "react-toastify";


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
        toast.error({
          title: "Error",
          description: "Failed to load events. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchAllEvents();
  }, [backendUrl, toast]);

  // Fetch attendees when event changes
  useEffect(() => {
    const fetchEventAttendees = async () => {
      if (!selectedEvent) {
        setAttendees([]);
        return;
      }

      try {
        setIsLoadingAttendees(true);
        const response = await axios.get(
          `${backendUrl}/api/registrationUnit/eventAttendees/${selectedEvent}`
        );
        setAttendees(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching event attendees:", error);
        toast.error({
          title: "Error",
          description: "Failed to load attendees. Please try again.",
          variant: "destructive",
        });
        setAttendees([]);
      } finally {
        setIsLoadingAttendees(false);
      }
    };

    fetchEventAttendees();
  }, [selectedEvent, backendUrl, toast]);

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
      
      // Search filter (last 4 digits)
      if (searchQuery) {
        const last4 = attendee.uniqueId?.slice(-4) || '';
        if (!last4.includes(searchQuery)) {
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
      
      toast.success( "Attendee checked in successfully");
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
  }, [backendUrl, selectedEvent, processingCheckIns, toast]);

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
  }, [backendUrl, selectedEvent, processingCheckIns, toast]);

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
    setSelectedAttendees([]);

    try {
      await Promise.all(
        attendeeIds.map(userId => handleCheckIn(userId))
      );
    } catch (error) {
      console.error("Error during bulk check-in:", error);
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
    <div className="h-full mt-5 font-rubik">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent bg-white disabled:opacity-50"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent bg-white disabled:opacity-50"
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
              Search by Last 4 Digits
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter last 4 digits"
                maxLength={4}
                disabled={!selectedEvent || isLoadingAttendees}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {selectedEvent && !isLoadingAttendees && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredAttendees.length} of {attendees.length} attendees
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentPageSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={currentAttendees.length === 0}
                />
              </TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingAttendees ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span>Loading attendees...</span>
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
                  <TableRow key={attendee.userId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.userId)}
                        onCheckedChange={() => handleSelectAttendee(attendee.userId)}
                        disabled={isProcessing}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{attendee.fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          ID: {attendee.uniqueId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {attendee.email}
                    </TableCell>
                    <TableCell className="text-sm">
                      {attendee.eventDetails?.paymentTime 
                        ? new Date(attendee.eventDetails.paymentTime).toLocaleDateString()
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={attendee.eventDetails?.paymentStatus === 'success' ? "default" : "secondary"}
                        className={
                          attendee.eventDetails?.paymentStatus === 'success' ? `bg-green-600 hover:bg-green-700 text-white ml-[20px]` : `text-white bg-yellow-500 hover:bg-yellow-600 ml-[20px]`
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

        {/* Pagination */}
        {totalPages > 1 && !isLoadingAttendees && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
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
                Page {currentPage} of {totalPages}
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
  );
}