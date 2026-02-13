import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Users, Clock, Zap, MapPin, Star,
  AlertCircle, CheckCircle, Clock3, Activity, Settings
} from 'lucide-react';
import './AdminDashboard.css';
import StatCard from './StatCard';
import LiveActivityFeed from './LiveActivityFeed';
import HelperAssignmentFlow from './HelperAssignmentFlow';
import DemandHeatmap from './DemandHeatmap';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedToday: 0,
    averageRating: 0,
    helperUtilization: 0,
  });

  const [bookingData, setBookingData] = useState([]);
  const [helperPerformance, setHelperPerformance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [liveMetrics, setLiveMetrics] = useState({
    avgMatchScore: 0,
    eta15MinCompliance: 0,
    helperOnlineCount: 0,
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeBookings: Math.floor(Math.random() * 50) + 20,
        completedToday: Math.floor(Math.random() * 100) + 50,
        averageRating: (Math.random() * 2 + 3).toFixed(1),
        helperUtilization: Math.floor(Math.random() * 30) + 65,
      }));

      setBookingData([
        { time: '12 AM', bookings: Math.floor(Math.random() * 20) },
        { time: '4 AM', bookings: Math.floor(Math.random() * 10) },
        { time: '8 AM', bookings: Math.floor(Math.random() * 35) },
        { time: '12 PM', bookings: Math.floor(Math.random() * 45) },
        { time: '4 PM', bookings: Math.floor(Math.random() * 50) },
        { time: '8 PM', bookings: Math.floor(Math.random() * 40) },
        { time: '11 PM', bookings: Math.floor(Math.random() * 25) },
      ]);

      setHelperPerformance([
        { name: 'Plumbing', value: Math.floor(Math.random() * 30) + 60 },
        { name: 'Electrical', value: Math.floor(Math.random() * 30) + 55 },
        { name: 'Cleaning', value: Math.floor(Math.random() * 35) + 50 },
        { name: 'AC Repair', value: Math.floor(Math.random() * 25) + 70 },
      ]);

      setLiveMetrics({
        avgMatchScore: (Math.random() * 15 + 85).toFixed(1),
        eta15MinCompliance: Math.floor(Math.random() * 15) + 85,
        helperOnlineCount: Math.floor(Math.random() * 50) + 120,
      });

      // Simulate activity updates
      const newActivity = {
        id: Date.now(),
        type: ['assignment', 'completion', 'review', 'alert'][Math.floor(Math.random() * 4)],
        message: getRandomActivityMessage(),
        timestamp: new Date(),
        helper: `Helper ${Math.floor(Math.random() * 100)}`,
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRandomActivityMessage = () => {
    const messages = [
      'Booking auto-assigned with 92% match score',
      'Service completed in 18 minutes',
      'New 5-star review received',
      'Helper acceptance rate improved',
      'Real-time location update',
      'Payment processed successfully',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="admin-dashboard">
      {/* Header Section */}
      <motion.header
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1>Smart Helper System</h1>
          <p>Real-time Auto-Assignment & Analytics</p>
        </div>
        <motion.button
          className="header-settings-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={20} />
        </motion.button>
      </motion.header>

      {/* Main Stats Grid */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          label="Active Bookings"
          value={stats.activeBookings}
          trend="+12%"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Completed Today"
          value={stats.completedToday}
          trend="+8%"
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          label="Avg Rating"
          value={stats.averageRating}
          trend="+0.2"
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Helper Utilization"
          value={`${stats.helperUtilization}%`}
          trend="+5%"
          color="from-purple-500 to-pink-500"
        />
      </motion.div>

      {/* ETA Guarantee Indicator */}
      <motion.div
        className="eta-guarantee-section glass-card"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="eta-header">
          <Clock3 className="w-5 h-5" />
          <h3>15-Minute ETA Guarantee</h3>
          <div className="compliance-badge">
            <span className="compliance-value">{liveMetrics.eta15MinCompliance}%</span>
            <span className="compliance-label">Compliance</span>
          </div>
        </div>
        <motion.div
          className="eta-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${liveMetrics.eta15MinCompliance}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="main-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* AI Match Score Display */}
          <motion.div
            className="ai-match-section glass-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="match-header">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3>AI Match Score</h3>
            </div>
            <motion.div
              className="match-score-display"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="score-circle">
                <motion.span
                  className="score-value"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {liveMetrics.avgMatchScore}%
                </motion.span>
                <span className="score-label">Match Quality</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Booking Assignment Flow */}
          <HelperAssignmentFlow />
        </div>

        {/* Middle Column */}
        <div className="middle-column">
          {/* Booking Trends Chart */}
          <motion.div
            className="chart-card glass-card"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h3>Booking Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={bookingData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.95)', border: '1px solid rgba(59, 130, 246, 0.3)' }} />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Live Activity Feed */}
          <LiveActivityFeed activities={activities} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Service Category Performance */}
        <motion.div
          className="chart-card glass-card"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h3>Service Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={helperPerformance}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {helperPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.95)', border: '1px solid rgba(59, 130, 246, 0.3)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Demand Heatmap */}
        <DemandHeatmap />

        {/* Helpers Online */}
        <motion.div
          className="helpers-online glass-card"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="online-header">
            <Users className="w-5 h-5" />
            <h3>Helpers Online</h3>
          </div>
          <motion.div
            className="online-count"
            key={liveMetrics.helperOnlineCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {liveMetrics.helperOnlineCount}
          </motion.div>
          <motion.div
            className="online-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
