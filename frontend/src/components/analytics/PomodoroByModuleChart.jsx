import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { getCSSVar } from '../../utils/theme';

export default function PomodoroByModuleChart({ dateRange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

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
        <CartesianGrid strokeDasharray="3 3" stroke={getCSSVar('--chart-grid')} />
        <XAxis dataKey="name" stroke={getCSSVar('--text-secondary')} />
        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} stroke={getCSSVar('--text-secondary')} />
        <Tooltip
          contentStyle={{ backgroundColor: getCSSVar('--chart-tooltip-bg'), border: `1px solid ${getCSSVar('--chart-tooltip-border')}`, borderRadius: '8px', color: getCSSVar('--text-primary') }}
          cursor={{ fill: getCSSVar('--chart-cursor') }}
        />
        <Legend />
        <Bar dataKey="hours" fill={getCSSVar('--primary-600')} name="Focus Hours" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
