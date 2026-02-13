import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, changeType = 'up', bgColor = 'blue', delay = 0 }) => {
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
      className={`${bgColorMap[bgColor]} border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <motion.h3
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {value}
          </motion.h3>
          {change && (
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
              <span className="text-sm font-semibold">{change}</span>
            </motion.div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
          className={`w-12 h-12 rounded-xl ${bgColorMap[bgColor]} flex items-center justify-center ${iconColorMap[bgColor]}`}
        >
          <Icon size={24} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatCard;
