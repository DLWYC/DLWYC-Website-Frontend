import { createFileRoute } from '@tanstack/react-router'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Check, X, ChevronLeft, ChevronRight, Loader2, RefreshCw, Users, CheckCircle, Clock, Mail, CreditCard, Calendar } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Archdeaconries, getArchdeaconryCode } from '@/data/Archdeaconries';
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from "react-toastify";
import RegistrationUnitTopNav from '@/components/AppTopNav/RegitrationUnitTopNav';

// Add fadeIn animation styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export const Route = createFileRoute('/registrationunit/')({
  component: EventCheckInPortal,
})

function EventCheckInPortal() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedArchdeaconry, setSelectedArchdeaconry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [displayedItems, setDisplayedItems] = useState(12); // For lazy loading
  
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingCheckIns, setProcessingCheckIns] = useState(new Set());

  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const isFetchingRef = useRef(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await axios.get(`${backendUrl}/api/registrationUnit/allEvents`);
        setEvents(response?.data?.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchAllEvents();
  }, [backendUrl]);

  const fetchEventAttendees = useCallback(async (showRefreshIndicator = false, silent = false) => {
    if (!selectedEvent) {
      setAttendees([]);
      return;
    }

    // Prevent concurrent requests
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }

    // Rate limiting: prevent requests within 10 seconds of last fetch
    // Backend allows 100 requests per 15 minutes (900 seconds)
    // So max 1 request per 9 seconds to stay safe
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    const minInterval = 10000; // 10 seconds between requests
    
    if (timeSinceLastFetch < minInterval && !showRefreshIndicator) {
      console.log(`Rate limited: ${Math.round(timeSinceLastFetch/1000)}s since last fetch (minimum ${minInterval/1000}s)`);
      return;
    }

    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;

    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else if (!silent) {
        setIsLoadingAttendees(true);
      }
      
      const response = await axios.get(
        `${backendUrl}/api/registrationUnit/eventAttendees/${selectedEvent}`,
        {
          timeout: 25000, // 25 second timeout (less than backend's 30s)
        }
      );
      
      if (response?.data?.data) {
        setAttendees(response.data.data);
        setLastRefreshTime(new Date());
        if (showRefreshIndicator) {
          toast.success("List refreshed");
        }
        console.log(`✓ Fetched ${response.data.data.length} attendees`);
      } else {
        console.warn("No data received from server");
        if (!silent) {
          toast.warning("No attendees data received");
        }
      }
    } catch (error) {
      console.error("Error fetching event attendees:", error);
      
      // Don't clear attendees if we already have data
      if (!silent || attendees.length === 0) {
        if (error.code === 'ECONNABORTED') {
          toast.error("Request timeout - Server is busy");
        } else if (error.response?.status === 429) {
          console.warn("⚠️ Rate limit hit - backing off");
          toast.warning("Too many requests - Waiting before next refresh");
          // Back off for 30 seconds
          lastFetchTimeRef.current = Date.now() + 20000;
        } else if (error.response?.status === 404) {
          toast.error("Event not found");
          setAttendees([]);
        } else if (error.response?.status >= 500) {
          toast.error("Server error - Will retry automatically");
        } else if (error.code === 'ERR_NETWORK') {
          if (!silent) {
            toast.error("Network error - Check your connection");
          }
        } else if (!silent) {
          toast.error("Failed to load attendees");
        }
      }
    } finally {
      setIsLoadingAttendees(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [selectedEvent, backendUrl, attendees.length]);

  useEffect(() => {
    fetchEventAttendees(false);
  }, [selectedEvent]);

  // Setup auto-refresh polling with page visibility handling
  useEffect(() => {
    if (selectedEvent) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Initial fetch
      const startPolling = () => {
        // 30 second interval to stay well under rate limit
        // Backend: 100 requests per 15 min = ~1 request per 9 seconds max
        // Using 30 seconds gives plenty of headroom for other requests
        pollingIntervalRef.current = setInterval(() => {
          // Only fetch if page is visible
          if (!document.hidden) {
            fetchEventAttendees(false, true);
          }
        }, 30000); // 30 seconds
      };

      startPolling();

      // Handle page visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // Page became visible - refresh data after a delay
          console.log("Page visible - scheduling refresh");
          setTimeout(() => {
            fetchEventAttendees(false, true);
          }, 2000); // Wait 2 seconds before fetching
          
          // Restart polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          startPolling();
        } else {
          // Page hidden - stop polling to save resources
          console.log("Page hidden - pausing auto-refresh");
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [selectedEvent, fetchEventAttendees]);

  const handleRefresh = useCallback(() => {
    fetchEventAttendees(true);
  }, [fetchEventAttendees]);

  const statistics = useMemo(() => {
    if (!attendees.length) return { total: 0, checkedIn: 0, pending: 0 };
    const checkedIn = attendees.filter(a => a.eventDetails?.checkedInStatus).length;
    return {
      total: attendees.length,
      checkedIn,
      pending: attendees.length - checkedIn
    };
  }, [attendees]);

  const filteredAttendees = useMemo(() => {
    if (!attendees.length) return [];
    
    return attendees.filter(attendee => {
      if (selectedArchdeaconry) {
        const archCode = getArchdeaconryCode(selectedArchdeaconry);
        if (!attendee.uniqueId?.includes(`/${archCode}/`)) {
          return false;
        }
      }
      
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

  const totalPages = Math.ceil(filteredAttendees.length / itemsPerPage);
  const currentAttendees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAttendees, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedArchdeaconry, searchQuery, selectedEvent]);

  const handleCheckIn = useCallback(async (userId) => {
    if (processingCheckIns.has(userId)) return;

    setProcessingCheckIns(prev => new Set(prev).add(userId));

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
      
      toast.success("Checked in successfully");
      // Optimistic update already applied - no need to refetch immediately
      // User can manually refresh if they want to verify
    } catch (error) {
      console.error("Error during check-in:", error);
      
      setAttendees(prev => 
        prev.map(a => 
          a.userId === userId 
            ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: false } }
            : a
        )
      );
      
      toast.error("Check-in failed");
    } finally {
      setProcessingCheckIns(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [backendUrl, selectedEvent, processingCheckIns, fetchEventAttendees]);

  const handleUnCheck = useCallback(async (userId) => {
    if (processingCheckIns.has(userId)) return;

    setProcessingCheckIns(prev => new Set(prev).add(userId));

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
      
      toast.success("Check-in reversed");
      // Optimistic update already applied - no need to refetch immediately
      // User can manually refresh if they want to verify
    } catch (error) {
      console.error("Error during un-check:", error);
      
      setAttendees(prev => 
        prev.map(a => 
          a.userId === userId 
            ? { ...a, eventDetails: { ...a.eventDetails, checkedInStatus: true } }
            : a
        )
      );
      
      toast.error("Failed to reverse check-in");
    } finally {
      setProcessingCheckIns(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [backendUrl, selectedEvent, processingCheckIns, fetchEventAttendees]);

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
      toast.success(`Checked in ${completed} attendees`);
    } catch (error) {
      console.error("Error during bulk check-in:", error);
      toast.error(`Checked in ${completed} of ${total}`);
    }
  }, [selectedAttendees, handleCheckIn]);

  const handleBulkUnCheck = useCallback(async () => {
    if (!selectedAttendees.length) return;

    const attendeeIds = [...selectedAttendees];
    const total = attendeeIds.length;
    let completed = 0;

    setSelectedAttendees([]);
    toast.info(`Reversing check-in for ${total} attendees...`);

    try {
      for (const userId of attendeeIds) {
        await handleUnCheck(userId);
        completed++;
      }
      toast.success(`Reversed check-in for ${completed} attendees`);
    } catch (error) {
      console.error("Error during bulk un-check:", error);
      toast.error(`Reversed ${completed} of ${total}`);
    }
  }, [selectedAttendees, handleUnCheck]);

  // Lazy loading - gradually increase displayed items
  useEffect(() => {
    if (currentAttendees.length > 0) {
      setDisplayedItems(4); // Start with 4 items
      
      const loadMoreItems = () => {
        setDisplayedItems(prev => {
          const next = prev + 4;
          return next >= currentAttendees.length ? currentAttendees.length : next;
        });
      };

      // Load 4 more items every 100ms until all are loaded
      const intervals = [];
      const totalBatches = Math.ceil(currentAttendees.length / 4);
      
      for (let i = 1; i < totalBatches; i++) {
        const timer = setTimeout(loadMoreItems, i * 100);
        intervals.push(timer);
      }

      return () => {
        intervals.forEach(timer => clearTimeout(timer));
      };
    }
  }, [currentAttendees.length, currentPage]);

  // Get only the items to display (for lazy loading)
  const displayedAttendees = useMemo(() => {
    return currentAttendees.slice(0, displayedItems);
  }, [currentAttendees, displayedItems]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handleEventChange = useCallback((eventTitle) => {
    setSelectedEvent(eventTitle);
    setSelectedArchdeaconry('');
    setSearchQuery('');
    setSelectedAttendees([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <RegistrationUnitTopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Check-In</h1>
        </div>

        {/* Statistics */}
        {selectedEvent && !isLoadingAttendees && (
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Checked In</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.checkedIn}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 rounded-lg p-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <select
                value={selectedEvent}
                onChange={(e) => handleEventChange(e.target.value)}
                disabled={isLoadingEvents}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{isLoadingEvents ? 'Loading...' : 'Select Event'}</option>
                {events.map(event => (
                  <option key={event._id} value={event.eventTitle}>
                    {event.eventTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedArchdeaconry}
                onChange={(e) => setSelectedArchdeaconry(e.target.value)}
                disabled={!selectedEvent || isLoadingAttendees}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">All Archdeaconries</option>
                {Archdeaconries.map(arch => (
                  <option key={arch} value={arch}>{arch}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                disabled={!selectedEvent || isLoadingAttendees}
                className="w-full px-3 py-2 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {selectedEvent && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={allCurrentPageSelected}
                  onCheckedChange={handleSelectAll}
                  disabled={currentAttendees.length === 0}
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    {filteredAttendees.length} attendees
                  </span>
                  {lastRefreshTime && (
                    <span className="text-xs text-gray-400">
                      Last updated: {lastRefreshTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedAttendees.length > 0 && (
                  <>
                    <Button
                      onClick={handleBulkCheckIn}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Check In ({selectedAttendees.length})
                    </Button>
                    <Button
                      onClick={handleBulkUnCheck}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Undo ({selectedAttendees.length})
                    </Button>
                  </>
                )}
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="sm"
                  variant="outline"
                  title="Refresh attendee list (10s cooldown)"
                >
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Attendee Cards */}
        <div className="bg-white rounded-lg shadow-sm border">
          <ScrollArea className="lg:h-[600px] h-[400px] p-4">
            {isLoadingAttendees ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                  <span className="text-gray-600">Loading attendees...</span>
                </div>
              </div>
            ) : currentAttendees.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium mb-1">
                    {selectedEvent ? "No attendees found" : "Select an event"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedEvent ? "Try adjusting your filters" : "Choose an event to view attendees"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedAttendees.map((attendee, index) => {
                  const isProcessing = processingCheckIns.has(attendee.userId);
                  const isCheckedIn = attendee.eventDetails?.checkedInStatus;
                  
                  return (
                    <div
                      key={attendee.userId}
                      className={`relative border rounded-lg p-4 transition-all animate-fadeIn ${
                        isCheckedIn 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white hover:shadow-md'
                      }`}
                      style={{
                        animationDelay: `${index * 30}ms`,
                        opacity: 0,
                        animation: `fadeIn 0.3s ease-in forwards ${index * 30}ms`
                      }}
                    >
                      {/* Checkbox */}
                      <div className="absolute top-3 left-3">
                        <Checkbox
                          checked={selectedAttendees.includes(attendee.userId)}
                          onCheckedChange={() => handleSelectAttendee(attendee.userId)}
                          disabled={isProcessing}
                        />
                      </div>

                      {/* Status Badge */}
                      {isCheckedIn && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="mt-6 space-y-3">
                        {/* Name */}
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {attendee.fullName}
                          </h3>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {attendee.uniqueId}
                          </p>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 truncate">
                            {attendee.email}
                          </p>
                        </div>

                        {/* Payment Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <p className="text-sm text-gray-600">
                            {attendee.eventDetails?.paymentTime 
                              ? new Date(attendee.eventDetails.paymentTime).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })
                              : '—'
                            }
                          </p>
                        </div>

                        {/* Payment Status */}
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <Badge 
                            variant={attendee.eventDetails?.paymentStatus === 'success' ? "default" : "secondary"}
                            className={`text-xs ${
                              attendee.eventDetails?.paymentStatus === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {attendee.eventDetails?.paymentStatus || 'Pending'}
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          {!isCheckedIn ? (
                            <Button
                              onClick={() => handleCheckIn(attendee.userId)}
                              size="sm"
                              disabled={isProcessing}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4 mr-1.5" />
                              )}
                              Check In
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleUnCheck(attendee.userId)}
                              size="sm"
                              disabled={isProcessing}
                              variant="outline"
                              className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                              ) : (
                                <X className="w-4 h-4 mr-1.5" />
                              )}
                              Undo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

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

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

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