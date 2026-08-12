import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Store, Calendar, MapPin, Loader2, RefreshCw, ScanLine } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '@/lib/env';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/registrationunit/stations')({
  component: StationSelector,
})

/**
 * Station Selector — a one-click launchpad for food stations / checkpoints.
 *
 * Each event becomes a "station" card. Clicking "Open this station" opens the
 * Registration Unit check-in portal in a new tab already locked onto that
 * event via ?event=<title>, so each laptop is wired to the right event with
 * zero typing.
 */
function StationSelector() {
  const backendUrl = BACKEND_URL;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async (showIndicator = false) => {
    try {
      if (showIndicator) setIsLoading(true);
      const response = await axios.get(`${backendUrl}/api/registrationUnit/allEvents`, {
        timeout: 15000,
      });
      setEvents(response?.data?.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openStation = (eventTitle) => {
    const url = `/registrationunit?event=${encodeURIComponent(eventTitle)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 rounded-lg p-2">
              <Store className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Station Selector</h1>
          </div>
          <p className="text-sm text-gray-500">
            Open a check-in portal pre-set to a specific event (food line, session, gate).
            Each button opens the portal in a new tab locked onto that event.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{events.length}</span> station{events.length === 1 ? '' : 's'} available
          </p>
          <Button
            onClick={() => fetchEvents(true)}
            size="sm"
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-500" />
              <span className="text-gray-600">Loading stations...</span>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg border text-center py-16">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-900 font-medium mb-1">No events found</p>
            <p className="text-sm text-gray-500">Create events to set up stations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg border shadow-sm p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <ScanLine className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wide text-indigo-600 font-semibold">
                    Station
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                  {event.eventTitle}
                </h3>

                <div className="space-y-1 mb-4">
                  {event.date && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  )}
                  {event.location && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {event.location}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => openStation(event.eventTitle)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 mt-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Open this station
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Back to portal */}
        <div className="mt-8">
          <Link
            to="/registrationunit"
            className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            ← Back to check-in portal
          </Link>
        </div>
      </div>
    </div>
  );
}
