import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Users, Eye } from 'lucide-react';

const LiveActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      assignment: <CheckCircle className="w-4 h-4 text-blue-400" />,
      completion: <CheckCircle className="w-4 h-4 text-green-400" />,
      review: <Eye className="w-4 h-4 text-amber-400" />,
      alert: <AlertCircle className="w-4 h-4 text-red-400" />,
    };
    return icons[type] || <Users className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <motion.div
      className="activity-feed glass-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3>Live Activity Feed</h3>
      <div className="activity-list">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="activity-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-details">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-helper">{activity.helper}</span>
              </div>
              <motion.span
                className="activity-time"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {activity.timestamp.getMinutes()}m
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LiveActivityFeed;
