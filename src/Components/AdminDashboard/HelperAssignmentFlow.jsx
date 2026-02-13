import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, CheckCircle } from 'lucide-react';

const HelperAssignmentFlow = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const generateAssignment = () => {
      const services = ['Plumbing', 'Electrical', 'Cleaning', 'AC Repair'];
      const statuses = ['matching', 'assigned', 'en_route', 'arrived'];
      
      return {
        id: Math.random(),
        service: services[Math.floor(Math.random() * services.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        eta: Math.floor(Math.random() * 15) + 1,
        matchScore: (Math.random() * 15 + 85).toFixed(1),
      };
    };

    const interval = setInterval(() => {
      setAssignments(prev => [generateAssignment(), ...prev.slice(0, 2)]);
    }, 4000);

    setAssignments([generateAssignment(), generateAssignment()]);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      matching: 'text-blue-400',
      assigned: 'text-green-400',
      en_route: 'text-amber-400',
      arrived: 'text-purple-400',
    };
    return colors[status] || 'text-cyan-400';
  };

  const getStatusLabel = (status) => {
    const labels = {
      matching: 'Matching',
      assigned: 'Assigned',
      en_route: 'En Route',
      arrived: 'Arrived',
    };
    return labels[status] || status;
  };

  return (
    <motion.div
      className="assignment-flow glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3>Real-Time Assignments</h3>
      <div className="assignment-list">
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            className="assignment-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            layoutId={`assignment-${assignment.id}`}
          >
            <div className="assignment-service">
              <span className="service-icon">
                {assignment.service === 'Plumbing' && '🔧'}
                {assignment.service === 'Electrical' && '⚡'}
                {assignment.service === 'Cleaning' && '🧹'}
                {assignment.service === 'AC Repair' && '❄️'}
              </span>
              <span className="service-name">{assignment.service}</span>
            </div>

            <div className="assignment-status">
              <motion.span
                className={`status-badge ${getStatusColor(assignment.status)}`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getStatusLabel(assignment.status)}
              </motion.span>
            </div>

            <div className="assignment-metrics">
              <div className="metric">
                <Clock size={14} />
                <span>{assignment.eta}m</span>
              </div>
              <div className="metric score">
                <span className="score-value">{assignment.matchScore}%</span>
              </div>
            </div>

            <motion.div
              className="assignment-progress"
              initial={{ width: '20%' }}
              animate={{ width: '90%' }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HelperAssignmentFlow;
