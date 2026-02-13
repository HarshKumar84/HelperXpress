import React from 'react';
import { Clock, MapPin, User, CheckCircle, AlertCircle } from 'lucide-react';

const BookingRequestsPanel = () => {
  const requests = [
    {
      id: 1,
      service: 'Plumbing - Leak Repair',
      location: 'Downtown, 2.3 km',
      customer: 'John Doe',
      time: '2 mins ago',
      status: 'pending',
      avatar: '👨',
    },
    {
      id: 2,
      service: 'Electrical - Wiring',
      location: 'East Side, 1.8 km',
      customer: 'Sarah Smith',
      time: '5 mins ago',
      status: 'assigned',
      avatar: '👩',
    },
    {
      id: 3,
      service: 'Cleaning - Office Space',
      location: 'Central Park, 3.1 km',
      customer: 'Mike Johnson',
      time: '8 mins ago',
      status: 'in_progress',
      avatar: '👨',
    },
    {
      id: 4,
      service: 'AC Repair - Maintenance',
      location: 'North District, 4.2 km',
      customer: 'Emma Wilson',
      time: '12 mins ago',
      status: 'pending',
      avatar: '👩',
    },
    {
      id: 5,
      service: 'Plumbing - Installation',
      location: 'West End, 2.8 km',
      customer: 'David Brown',
      time: '15 mins ago',
      status: 'assigned',
      avatar: '👨',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'assigned':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'in_progress':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={16} />;
      case 'assigned':
        return <Clock size={16} />;
      case 'in_progress':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Real-Time Booking Requests</h3>
          <p className="text-sm text-gray-500 mt-1">Live queue of incoming requests</p>
        </div>
        <div className="px-3 py-1 bg-red-50 border border-red-200 rounded-full">
          <span className="text-sm font-bold text-red-700">{requests.length} Active</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-lg flex-shrink-0">
              {request.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">{request.service}</h4>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <span className="capitalize">{request.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span>{request.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{request.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-500">{request.time}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {request.status === 'pending' && (
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0">
                Assign
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequestsPanel;
