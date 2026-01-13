import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';

export default function PomodoroByModuleChart({ dateRange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await analyticsAPI.getPomodoroByModule(dateRange);

      // Transform data for chart
      const chartData = result.map(item => ({
        name: item.name,
        hours: parseFloat((item.total_duration / 3600).toFixed(1)),
        sessions: item.session_count,
        color: item.color,
      }));

      setData(chartData);
    } catch (error) {
      console.error('Failed to load pomodoro data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading...</div>;
  if (data.length === 0) return <div className="chart-empty">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
        />
        <Legend />
        <Bar dataKey="hours" fill="#4F46E5" name="Focus Hours" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
