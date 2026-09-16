import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Check, X, ChevronLeft, ChevronRight, Loader2, RefreshCw, Users, CheckCircle, Clock, Mail, CreditCard, Calendar, ScanLine, IdCard, History, Download, Store, QrCode } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Archdeaconries, getArchdeaconryCode } from '@/data/Archdeaconries';
import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from "react-toastify";
import RegistrationUnitTopNav from '@/components/AppTopNav/RegitrationUnitTopNav';
import { BACKEND_URL } from '@/lib/env';
import { toCsv, csvCell, downloadCsv } from '@/lib/csv';
import { parseQrPayload } from '@/lib/qr';
import QrScannerModal from '@/components/registrationunit/QrScannerModal';
import QrPassModal from '@/components/registrationunit/QrPassModal';

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
  @keyframes confirmPop {
    0% {
      opacity: 0;
      transform: scale(0.6);
    }
    60% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes checkDraw {
    from {
      stroke-dashoffset: 40;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

export const Route = createFileRoute('/registrationunit/')({
  component: EventCheckInPortal,
})

function EventCheckInPortal() {
  const backendUrl = BACKEND_URL

  // Per-station event wiring: a station opens its own URL like
  //   /registrationunit?event=Day%201%20Lunch
  // so the portal auto-selects that event for scanning. Falls back to the
  // last-used event stored on this machine.
  const search = useSearch({ from: Route.id, strict: false });
  const stationEvent = (search && search.event) || '';

  const [selectedEvent, setSelectedEvent] = useState(() => {
    try {
      return stationEvent || localStorage.getItem('dlw_rfid_event') || '';
    } catch {
      return stationEvent || '';
    }
  });

  // Persist the station event so it survives reloads on this machine.
  useEffect(() => {
    if (stationEvent) {
      try {
        localStorage.setItem('dlw_rfid_event', stationEvent);
      } catch {
        /* ignore */
      }
    }
  }, [stationEvent]);
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

  // RFID card scanning state
  const [rfidScan, setRfidScan] = useState('');
  const rfidScanRef = useRef('');
  const [assigningCardId, setAssigningCardId] = useState(null);
  // QR code scanning state
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrPassFor, setQrPassFor] = useState(null); // attendee whose pass is shown
  // Recent RFID scan history (from /rfid/logs)
  const [scanLogs, setScanLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // On-screen confirmation shown to the attendee after a successful tap.
  const [scanConfirm, setScanConfirm] = useState(null);
  const scanConfirmTimer = useRef(null);

  const showScanConfirm = useCallback((name, action, uid) => {
    setScanConfirm({ name, action, uid, at: Date.now() });
    if (scanConfirmTimer.current) clearTimeout(scanConfirmTimer.current);
    // Auto-dismiss so the next attendee can be scanned immediately.
    scanConfirmTimer.current = setTimeout(() => setScanConfirm(null), 3500);
  }, []);

  // Clean up the confirmation timer on unmount.
  useEffect(() => {
    return () => {
      if (scanConfirmTimer.current) clearTimeout(scanConfirmTimer.current);
    };
  }, []);

  // Kiosk mode keeps the scan box focused so you can tap cards continuously.
  const [autoFocus, setAutoFocus] = useState(() => {
    try {
      return localStorage.getItem('dlw_rfid_autofocus') !== 'off';
    } catch {
      return true;
    }
  });

  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const isFetchingRef = useRef(false);
  const rfidInputRef = useRef(null);
  const rfidAutoSubmitTimer = useRef(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  useEffect(() => {
    return () => {
      if (rfidAutoSubmitTimer.current) clearTimeout(rfidAutoSubmitTimer.current);
    };
  }, []);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await axios.get(`${backendUrl}/api/registrationUnit/allEvents`);
        const list = response?.data?.events || [];
        setEvents(list);

        // Auto-select the station/persisted event (or the first one) so the
        // portal is ready to scan without any clicks — for kiosk operation.
        let saved = stationEvent;
        if (!saved) {
          try {
            saved = localStorage.getItem('dlw_rfid_event') || '';
          } catch {
            saved = '';
          }
        }
        if (!saved && list.length) {
          saved = list[0].eventTitle;
          try {
            localStorage.setItem('dlw_rfid_event', saved);
          } catch {
            /* ignore */
          }
          setSelectedEvent(saved);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchAllEvents();
  }, [backendUrl, stationEvent]);

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

  // Summary/rollup of the recent scan feed.
  const scanStats = useMemo(() => {
    const stats = { total: scanLogs.length, checkedIn: 0, checkedOut: 0, wrong: 0, unknown: 0 };
    for (const log of scanLogs) {
      if (log.action === 'checkedIn') stats.checkedIn++;
      else if (log.action === 'checkedOut') stats.checkedOut++;
      else if (log.action === 'wrongEvent') stats.wrong++;
      else stats.unknown++;
    }
    return stats;
  }, [scanLogs]);

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

  /**
   * Normalize a scanned/pasted tag to an uppercase, colon-free UID.
   * e.g. " 12:34:AB:CD " -> "1234ABCD"
   */
  const normalizeUid = useCallback((raw) => {
    return (raw || '').toUpperCase().replace(/[^0-9A-F]/g, '');
  }, []);

  /**
   * Get the attendee record that a UID belongs to. Reads both `cardUID`
   * and `rfidTag` fields so it works no matter which name your backend uses.
   */
  const findAttendeeByUid = useCallback(
    (uid) => {
      const key = normalizeUid(uid);
      if (!key) return undefined;
      return attendees.find((a) => {
        const tag = normalizeUid(a?.cardUID || a?.rfidTag || '');
        return tag && tag === key;
      });
    },
    [attendees, normalizeUid]
  );

  /**
   * Handle a card scan. Works with a USB keyboard-wedge RFID reader (which
   * types the UID into the box and presses Enter) OR a manually typed/pasted
   * UID from the Raspberry Pi reader service. Toggles check-in/check-out.
   */
  const handleRfidSubmit = useCallback(() => {
    // Read the live value from a ref so fast "typed" scans still work.
    const scanned = (rfidScanRef.current || '').trim();
    if (rfidInputRef.current) {
      rfidInputRef.current.value = '';
      // Re-focus so the next card can be tapped immediately (kiosk flow).
      requestAnimationFrame(() => rfidInputRef.current?.focus());
    }

    if (!selectedEvent) {
      toast.error('Select an event before scanning a card');
      return;
    }
    if (!scanned) return;

    const attendee = findAttendeeByUid(scanned);
    if (!attendee) {
      toast.error('No attendee found for that card. Assign the card to someone first.');
      return;
    }

    if (attendee.eventDetails?.checkedInStatus) {
      handleUnCheck(attendee.userId);
      toast.info(`Checked out: ${attendee.fullName}`);
      showScanConfirm(attendee.fullName, 'checkedOut', scanned);
    } else {
      handleCheckIn(attendee.userId);
      toast.success(`Checked in: ${attendee.fullName}`);
      showScanConfirm(attendee.fullName, 'checkedIn', scanned);
    }
  }, [selectedEvent, findAttendeeByUid, handleCheckIn, handleUnCheck, showScanConfirm]);

  /**
   * Fetch recent RFID scan history so operators can see every tap live.
   */
  const fetchScanLogs = useCallback(async (showIndicator = false) => {
    try {
      if (showIndicator) setIsLoadingLogs(true);
      const response = await axios.get(`${backendUrl}/api/registrationUnit/rfid/logs`, {
        timeout: 10000,
      });
      if (response?.data?.data) setScanLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching scan logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [backendUrl]);

  // Load scan history on mount + keep it fresh alongside the attendee polling.
  useEffect(() => {
    fetchScanLogs(true);
    const id = setInterval(() => {
      if (!document.hidden) fetchScanLogs();
    }, 10000); // 10s refresh
    return () => clearInterval(id);
  }, [fetchScanLogs]);

  /**
   * Handle a QR pass scanned with the operator's phone (a connected camera
   * device would work too, but phones are the intended setup).
   * Sends the raw code to the backend, which resolves it (event ID + the
   * attendee's unique ID) and toggles check-in/check-out — then mirrors the
   * same on-screen confirmation + toast flow used for RFID card taps.
   */
  const handleQrScan = useCallback(
    async (rawText) => {
      const parsed = parseQrPayload(rawText);
      if (!parsed || !parsed.uniqueId) {
        toast.error('That QR code is not a DLWYC check-in code');
        return;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/api/registrationUnit/qr/scan`,
          { payload: rawText, eventTitle: selectedEvent },
          { timeout: 15000 }
        );
        const result = response.data || {};
        const data = result.data || {};

        if (result.action === 'checkedIn' || result.action === 'checkedOut') {
          // Keep the attendee list in sync with what the server just did.
          setAttendees((prev) =>
            prev.map((a) =>
              a.userId === data.userId
                ? {
                    ...a,
                    eventDetails: {
                      ...a.eventDetails,
                      checkedInStatus: data.eventDetails?.checkedInStatus,
                    },
                  }
                : a
            )
          );
          toast[result.action === 'checkedIn' ? 'success' : 'info'](
            `Checked ${result.action === 'checkedIn' ? 'in' : 'out'}: ${data.fullName}`
          );
          showScanConfirm(data.fullName, result.action, data.uniqueId);
          fetchScanLogs(); // refresh the recent-scans feed right away
        }
      } catch (error) {
        const msg =
          error.response?.data?.message || 'Could not process that QR code';
        toast.error(msg);
        console.error('Error processing QR scan:', error);
      }
    },
    [backendUrl, selectedEvent, showScanConfirm, fetchScanLogs]
  );

  /** Export the recent scan feed (audit trail) as CSV, with a summary header. */
  const handleExportScanLogs = useCallback(() => {
    const header = ['DLWYC — RFID Scan Audit Trail', ''];
    const summary = [
      ['Generated', new Date().toLocaleString()],
      ['Total scans', String(scanStats.total)],
      ['Checked in', String(scanStats.checkedIn)],
      ['Checked out', String(scanStats.checkedOut)],
      ['Unknown cards', String(scanStats.unknown)],
    ];
    const cols = ['Time', 'Action', 'Attendee', 'Card UID', 'Event', 'Message'];
    const body = scanLogs.map((log) => [
      log.at,
      log.action,
      log.fullName || '',
      log.uid || '',
      log.eventTitle || '',
      log.message || '',
    ]);

    const lines = [];
    lines.push(header.join(','));
    lines.push('');
    summary.forEach((row) => lines.push(row.map(csvCell).join(',')));
    lines.push('');
    lines.push(cols.join(','));
    body.forEach((row) => lines.push(row.map(csvCell).join(',')));

    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    downloadCsv(`dlwyc-scan-log-${stamp}.csv`, `${lines.join('\n')}\n`);
    toast.success(`Exported ${scanStats.total} scan record(s)`);
  }, [scanLogs, scanStats]);

  /**
   * Export the selected event's attendees + check-in status as CSV.
   * Respects the current archdeaconry + search filters and appends a totals row.
   */
  const handleExportCheckInReport = useCallback(() => {
    if (!selectedEvent) {
      toast.error('Select an event to export its check-in report');
      return;
    }
    const rowsToExport = filteredAttendees;
    const checkedIn = rowsToExport.filter((a) => a.eventDetails?.checkedInStatus).length;

    const header = ['Full Name', 'Unique ID', 'Email', 'Card UID', 'Archdeaconry', 'Checked In'];
    const rows = rowsToExport.map((a) => [
      a.fullName,
      a.uniqueId,
      a.email,
      a.cardUID || a.rfidTag || '',
      a.archdeaconry || '',
      a.eventDetails?.checkedInStatus ? 'Yes' : 'No',
    ]);
    const lines = [];
    lines.push(header.join(','));
    rows.forEach((r) => lines.push(r.map(csvCell).join(',')));
    lines.push('');
    lines.push(['Total', '', '', '', '', rowsToExport.length].map(csvCell).join(','));
    lines.push(['Checked In', '', '', '', '', checkedIn].map(csvCell).join(','));

    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    const filtered = selectedArchdeaconry || searchQuery ? '-filtered' : '';
    downloadCsv(
      `dlwyc-checkin-${(selectedEvent || 'event').replace(/\s+/g, '-')}${filtered}-${stamp}.csv`,
      `${lines.join('\n')}\n`
    );
    toast.success(`Exported ${rowsToExport.length} attendee(s)`);
  }, [selectedEvent, filteredAttendees, selectedArchdeaconry, searchQuery]);

  // Kiosk mode: keep the scan box focused so operators can tap card after card
  // without clicking the input each time. Only active while the RFID section
  // is open (QR scanning is the default and uses no input focus).
  useEffect(() => {
    if (!autoFocus || !rfidSectionOpen) return;
    const handler = () => {
      if (
        rfidInputRef.current &&
        document.activeElement !== rfidInputRef.current
      ) {
        rfidInputRef.current.focus();
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [autoFocus, rfidSectionOpen]);

  /**
   * Bind an RFID UID to an attendee so future scans resolve to them.
   * Calls a documented backend endpoint — update the URL if yours differs.
   */
  const handleAssignRfid = useCallback(
    async (userId, fullName) => {
      const uid = window.prompt(`Paste the card UID for ${fullName}:`);
      const normalized = normalizeUid(uid || '');
      if (!normalized) return;

      setAssigningCardId(userId);
      try {
        await axios.patch(
          `${backendUrl}/api/registrationUnit/eventAttendees/${userId}/rfid`,
          { cardUID: normalized }
        );
        toast.success(`Card ${normalized} assigned to ${fullName}`);
        fetchEventAttendees(true);
      } catch (error) {
        console.error('Error assigning RFID card:', error);
        toast.error('Could not assign card — check the backend /rfid endpoint exists.');
      } finally {
        setAssigningCardId(null);
      }
    },
    [backendUrl, normalizeUid, fetchEventAttendees]
  );

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
    try {
      localStorage.setItem('dlw_rfid_event', eventTitle);
    } catch {
      /* ignore */
    }
    setSelectedArchdeaconry('');
    setSearchQuery('');
    setSelectedAttendees([]);
  }, []);

  const toggleAutoFocus = useCallback(() => {
    setAutoFocus((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dlw_rfid_autofocus', next ? 'on' : 'off');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <RegistrationUnitTopNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Event Check-In</h1>
          <div className="flex items-center gap-3">
            {selectedEvent && (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-3 py-2">
                <span className="text-xs uppercase tracking-wide font-semibold">Station</span>
                <span className="text-sm font-semibold">{selectedEvent}</span>
              </div>
            )}
            <Link
              to="/registrationunit/stations"
              className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline"
            >
              <Store className="w-4 h-4" />
              Stations
            </Link>
          </div>
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

        {/* RFID Card + QR Code Scanner */}
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <ScanLine className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Check-In Scanner
                </h3>
                <p className="text-xs text-gray-500">
                  Default: scan the attendee's QR pass with your phone. The RFID card
                  scan is there for when a card reader is connected.
                </p>
              </div>
            </div>

            {/* QR — the default check-in method (operator's phone camera) */}
            <Button
              onClick={() => setQrScannerOpen(true)}
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              title="Scan an attendee's QR pass with this device's camera"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
              <span className="ml-2 text-xs font-normal opacity-80">— phone camera</span>
            </Button>

            {/* RFID card — secondary, for when a card reader is connected */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setRfidSectionOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800"
              >
                <IdCard className="w-3.5 h-3.5" />
                {rfidSectionOpen
                  ? 'Hide RFID card scan'
                  : 'RFID card scan (when a reader is connected)'}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    rfidSectionOpen ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {rfidSectionOpen && (
                <div className="mt-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <ScanLine className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input
                        ref={rfidInputRef}
                        type="text"
                        value={rfidScan}
                        onChange={(e) => {
                          setRfidScan(e.target.value);
                          rfidScanRef.current = e.target.value;
                          // Auto-submit for USB readers that don't send a terminator:
                          // if the box holds a complete UID and stops changing, submit.
                          if (rfidAutoSubmitTimer.current) clearTimeout(rfidAutoSubmitTimer.current);
                          const v = (e.target.value || '').trim();
                          if (/^[0-9A-Fa-f]{8,14}$/.test(v)) {
                            rfidAutoSubmitTimer.current = setTimeout(() => {
                              handleRfidSubmit();
                            }, 250);
                          }
                        }}
                        onKeyDown={(e) => {
                          // USB keyboard-wedge readers send Enter or Tab as the suffix.
                          if (e.key === 'Enter' || e.key === 'Tab') {
                            e.preventDefault();
                            if (rfidAutoSubmitTimer.current) clearTimeout(rfidAutoSubmitTimer.current);
                            handleRfidSubmit();
                          }
                        }}
                        placeholder="Tap card or paste UID — it submits automatically"
                        autoComplete="off"
                        autoFocus
                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                      />
                    </div>
                    <Button
                      onClick={handleRfidSubmit}
                      size="default"
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Submit Scan
                    </Button>
                  </div>

                  {/* Kiosk mode toggle */}
                  <label className="mt-3 flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                    <Checkbox
                      checked={autoFocus}
                      onCheckedChange={toggleAutoFocus}
                      className="rfid-ignore-focus"
                    />
                    Kiosk mode — keep the scanner focused so you can tap cards continuously.
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RFID Scan History */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <History className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Recent Scans</h3>
                <p className="text-xs text-gray-500">
                  Live feed of card + QR scans (refreshes every 10s).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportScanLogs}
                size="sm"
                variant="outline"
                disabled={scanLogs.length === 0}
                title="Download the recent scan feed as a CSV"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Export
              </Button>
              <Button
                onClick={() => fetchScanLogs(true)}
                size="sm"
                variant="outline"
                disabled={isLoadingLogs}
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {scanLogs.length === 0 ? (
            <div className="text-center py-6">
              <ScanLine className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No scans yet. Tap a card or scan a QR code to see activity here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              <div className="border rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{scanStats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="border rounded-lg p-3 text-center bg-green-50">
                <p className="text-2xl font-bold text-green-700">{scanStats.checkedIn}</p>
                <p className="text-xs text-gray-500">Checked In</p>
              </div>
              <div className="border rounded-lg p-3 text-center bg-amber-50">
                <p className="text-2xl font-bold text-amber-700">{scanStats.checkedOut}</p>
                <p className="text-xs text-gray-500">Checked Out</p>
              </div>
              <div className="border rounded-lg p-3 text-center bg-red-50">
                <p className="text-2xl font-bold text-red-700">{scanStats.wrong}</p>
                <p className="text-xs text-gray-500">Wrong Event</p>
              </div>
              <div className="border rounded-lg p-3 text-center bg-gray-50">
                <p className="text-2xl font-bold text-gray-600">{scanStats.unknown}</p>
                <p className="text-xs text-gray-500">Unknown</p>
              </div>
            </div>
          )}
          {scanLogs.length > 0 && (
            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {scanLogs.map((log, idx) => {
                  const isIn = log.action === 'checkedIn';
                  const isWrong = log.action === 'wrongEvent';
                  return (
                    <div
                      key={`${log.at}-${idx}`}
                      className="flex items-center gap-3 border rounded-lg px-3 py-2"
                    >
                      <Badge
                        variant="secondary"
                        className={`text-xs shrink-0 ${
                          isIn
                            ? 'bg-green-100 text-green-700'
                            : isWrong
                              ? 'bg-red-100 text-red-700'
                              : log.action === 'checkedOut'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isIn ? 'IN' : isWrong ? 'WRONG' : log.action === 'checkedOut' ? 'OUT' : 'UNKNOWN'}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 truncate font-medium">
                          {log.fullName || log.message || 'Unknown scan'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono truncate">
                          <span
                            className={`mr-1.5 rounded px-1 py-0.5 text-[10px] font-semibold ${
                              log.method === 'qr'
                                ? 'bg-violet-100 text-violet-700'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {log.method === 'qr' ? 'QR' : 'RFID'}
                          </span>
                          {log.uid}{log.eventTitle ? ` · ${log.eventTitle}` : ''}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(log.at).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

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
                  onClick={handleExportCheckInReport}
                  disabled={!selectedEvent || filteredAttendees.length === 0}
                  size="sm"
                  variant="outline"
                  title="Download this event's check-in report as a CSV"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Report
                </Button>
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

                        {/* RFID Tag + QR pass */}
                        <div className="flex items-center gap-2">
                          <IdCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          {attendee.cardUID || attendee.rfidTag ? (
                            <Badge
                              variant="secondary"
                              className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100"
                            >
                              {attendee.cardUID || attendee.rfidTag}
                            </Badge>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleAssignRfid(attendee.userId, attendee.fullName)
                              }
                              disabled={assigningCardId === attendee.userId}
                              className="text-[11px] text-indigo-600 hover:underline disabled:opacity-50"
                            >
                              {assigningCardId === attendee.userId
                                ? 'Assigning...'
                                : '+ Assign card'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setQrPassFor(attendee)}
                            className="ml-auto flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                            title="View / print this attendee's check-in QR code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            QR
                          </button>
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

      {/* QR scanner modal — the device's camera, in the browser (phones are
          the intended setup) */}
      <QrScannerModal
        open={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onScan={handleQrScan}
      />

      {/* Attendee QR pass modal (event ID + the attendee's unique ID) */}
      {qrPassFor && (
        <QrPassModal
          attendee={qrPassFor}
          eventId={events.find((e) => e.eventTitle === selectedEvent)?._id || selectedEvent}
          eventTitle={selectedEvent}
          onClose={() => setQrPassFor(null)}
        />
      )}

      {/* On-screen check-in/out confirmation (shown to the attendee) */}
      {scanConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center"
            style={{ animation: 'confirmPop 0.35s ease-out' }}
          >
            <div
              className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center ${
                scanConfirm.action === 'checkedIn' ? 'bg-green-100' : 'bg-amber-100'
              }`}
            >
              <svg viewBox="0 0 52 52" className="w-12 h-12">
                <circle
                  cx="26"
                  cy="26"
                  r="24"
                  fill="none"
                  className={scanConfirm.action === 'checkedIn' ? 'stroke-green-500' : 'stroke-amber-500'}
                  strokeWidth="3"
                />
                <path
                  fill="none"
                  className={scanConfirm.action === 'checkedIn' ? 'stroke-green-500' : 'stroke-amber-500'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l8 8 16-16"
                  style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: 'checkDraw 0.4s ease-out 0.15s both' }}
                />
              </svg>
            </div>

            <p className="text-lg font-bold text-gray-900">
              {scanConfirm.action === 'checkedIn' ? "You're checked in!" : "You've been checked out"}
            </p>
            <p className="text-sm text-gray-500 mt-1 mb-4">{scanConfirm.name}</p>

            <p className="text-xs text-gray-400 font-mono bg-gray-50 border rounded-lg px-3 py-2">
              {scanConfirm.uid}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}            </p>
          </div>
        </div>
      )}
    </div>
  );
}