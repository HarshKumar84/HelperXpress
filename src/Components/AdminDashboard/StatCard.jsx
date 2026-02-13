import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon, label, value, trend, color, title, change, changeType = 'up', bgColor = 'blue', delay = 0 }) => {
  // Support both old and new prop names for backward compatibility
  const displayLabel = label || title;
  const displayTrend = trend || change;
  
  // Map gradient colors to simple color names
  const colorMap = {
    'from-blue-500 to-cyan-500': 'blue',
    'from-green-500 to-emerald-500': 'emerald',
    'from-amber-500 to-orange-500': 'orange',
    'from-purple-500 to-pink-500': 'purple',
  };
  
  const displayColor = colorMap[color] || color || bgColor;

  const bgColorMap = {
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  const iconColorMap = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  const changeColorMap = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className={`${bgColorMap[displayColor] || bgColorMap[bgColor]} border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{displayLabel}</p>
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {value}
          </motion.h3>
          {displayTrend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={`flex items-center gap-1 w-fit px-3 py-1 rounded-full ${changeColorMap[changeType]}`}
            >
              {changeType === 'up' ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm font-semibold">{displayTrend}</span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
          className={`w-12 h-12 rounded-xl ${bgColorMap[displayColor] || bgColorMap[bgColor]} flex items-center justify-center ${iconColorMap[displayColor] || iconColorMap[bgColor]}`}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatCard;
