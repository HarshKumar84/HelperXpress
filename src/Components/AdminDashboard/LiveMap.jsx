import React from 'react';
import { MapPin, Activity } from 'lucide-react';

const LiveMap = () => {
  const helpers = [
    { id: 1, name: 'Alex', status: 'available', x: '20%', y: '30%', avatar: '👨' },
    { id: 2, name: 'Jessica', status: 'busy', x: '60%', y: '45%', avatar: '👩' },
    { id: 3, name: 'Robert', status: 'available', x: '75%', y: '60%', avatar: '👨' },
    { id: 4, name: 'Diana', status: 'busy', x: '45%', y: '75%', avatar: '👩' },
    { id: 5, name: 'James', status: 'available', x: '80%', y: '25%', avatar: '👨' },
  ];

  const getBgGradient = (status) => {
    return status === 'available'
      ? 'bg-gradient-to-br from-green-400 to-emerald-600'
      : 'bg-gradient-to-br from-red-400 to-rose-600';
  };

  const getStatusBg = (status) => {
    return status === 'available'
      ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
      : 'bg-red-100 border-red-300 text-red-700';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Live Helper Map</h3>
        <p className="text-sm text-gray-500 mt-1">Real-time helper location tracking</p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-96 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-gray-200 overflow-hidden mb-6">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>
        </div>

        {/* Helper Markers */}
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 group cursor-pointer"
            style={{ left: helper.x, top: helper.y }}
          >
            {/* Helper Avatar */}
            <div
              className={`w-10 h-10 rounded-full ${getBgGradient(helper.status)} flex items-center justify-center text-lg border-2 border-white shadow-lg group-hover:shadow-xl`}
            >
              {helper.avatar}
            </div>

            {/* Status Indicator */}
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                helper.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-10">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
                <p className="font-semibold">{helper.name}</p>
                <p className="text-xs text-gray-300 capitalize">{helper.status}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Info Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <MapPin size={48} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Live tracking active</p>
          </div>
        </div>
      </div>

      {/* Helper List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {helpers.map((helper) => (
          <div
            key={helper.id}
            className={`p-3 rounded-lg border-2 ${getStatusBg(helper.status)} text-center transition-all hover:shadow-md`}
          >
            <div className="text-2xl mb-2">{helper.avatar}</div>
            <p className="text-xs font-semibold text-gray-900 mb-1">{helper.name}</p>
            <div className="flex items-center justify-center gap-1 text-xs font-medium">
              <Activity size={12} />
              <span className="capitalize">{helper.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMap;
