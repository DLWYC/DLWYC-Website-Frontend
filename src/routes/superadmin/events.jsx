import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Bell, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  BarChart3,
  Activity,
  DollarSign,
  UserCheck
} from 'lucide-react';

export const Route = createFileRoute('/superadmin/events')({
  component: RouteComponent,
})

function RouteComponent() {
      const [events, setEvents] = useState([
    {
      id: 1,
      eventTitle: "Mind Education",
      eventDate: "2025-09-20",
      eventLocation: "AVMCC",
      eventTime: "10:00am - 4:00pm",
      eventDescription: "Come Prepared to be empowered",
      registrations: 45,
      status: 'upcoming'
    },
    {
      id: 2,
      eventTitle: "Youth Leadership Summit",
      eventDate: "2025-10-15",
      eventLocation: "Main Chapel",
      eventTime: "2:00pm - 6:00pm",
      eventDescription: "Developing future leaders",
      registrations: 32,
      status: 'upcoming'
    }
  ]);

  return( 
     <div className="border border-red-500 font-rubik">
          <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{events.length} total events</p>
              <button
               //  onClick={openCreateModal}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create New Event
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event?.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event?.eventTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event?.eventDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {event?.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Time:</span> {event?.eventTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Location:</span> {event?.eventLocation}
                      </p>
                      <p className="text-sm text-gray-700">{event?.eventDescription}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-semibold text-gray-700">
                          {event?.registrations} Registrations
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                         //  onClick={() => handleEdit(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                         //  onClick={() => handleDelete(event?.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
     </div>
  )
}
