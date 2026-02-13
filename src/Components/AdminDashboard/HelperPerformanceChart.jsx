import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', active: 12, completed: 28, pending: 8 },
  { name: 'Tue', active: 15, completed: 32, pending: 6 },
  { name: 'Wed', active: 18, completed: 35, pending: 5 },
  { name: 'Thu', active: 14, completed: 29, pending: 7 },
  { name: 'Fri', active: 22, completed: 42, pending: 3 },
  { name: 'Sat', active: 20, completed: 38, pending: 4 },
  { name: 'Sun', active: 16, completed: 31, pending: 6 },
];

const HelperPerformanceChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Helper Performance</h3>
        <p className="text-sm text-gray-500 mt-1">Weekly assignment statistics</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="completed" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="active" fill="#2563EB" radius={[8, 8, 0, 0]} />
          <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HelperPerformanceChart;
