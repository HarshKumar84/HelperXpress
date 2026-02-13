import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DemandHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const generateHeatmapPoints = () => {
      const points = [];
      const zones = ['Downtown', 'Uptown', 'Midtown', 'Riverside', 'Harbor'];
      
      for (let i = 0; i < 5; i++) {
        points.push({
          id: i,
          zone: zones[i],
          demand: Math.floor(Math.random() * 100),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        });
      }
      return points;
    };

    setHeatmapData(generateHeatmapPoints());
    const interval = setInterval(() => {
      setHeatmapData(generateHeatmapPoints());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHeatmapColor = (demand) => {
    if (demand > 80) return '#ef4444';
    if (demand > 60) return '#f59e0b';
    if (demand > 40) return '#3b82f6';
    return '#10b981';
  };

  const getIntensityLabel = (demand) => {
    if (demand > 80) return 'High';
    if (demand > 60) return 'Medium';
    if (demand > 40) return 'Low';
    return 'Very Low';
  };

  return (
    <motion.div
      className="heatmap-card glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="heatmap-header">
        <MapPin className="w-5 h-5" />
        <h3>Geographic Demand</h3>
      </div>

      <div className="heatmap-container">
        <svg className="heatmap-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Grid background */}
          <rect width="100" height="100" fill="rgba(255,255,255,0.02)" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

          {/* Heatmap points */}
          {heatmapData.map((point) => (
            <motion.g key={point.id}>
              {/* Glow effect */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={point.demand / 150 + 3}
                fill={getHeatmapColor(point.demand)}
                opacity="0.3"
                animate={{
                  r: [point.demand / 150 + 3, point.demand / 150 + 5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Main point */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={point.demand / 200 + 1.5}
                fill={getHeatmapColor(point.demand)}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        {heatmapData.map((point) => (
          <motion.div
            key={point.id}
            className="legend-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="legend-color"
              style={{ backgroundColor: getHeatmapColor(point.demand) }}
            />
            <span className="legend-text">
              {point.zone}: <strong>{getIntensityLabel(point.demand)}</strong>
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DemandHeatmap;
