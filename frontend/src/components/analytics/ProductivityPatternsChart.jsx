import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';

export default function ProductivityPatternsChart() {
  const [data, setData] = useState({ hourly: [], daily: [] });
  const [view, setView] = useState('hourly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await analyticsAPI.getProductivityPatterns();

      // Transform hourly data
      const hourlyData = result.hourly.map(item => ({
        hour: `${item.hour.toString().padStart(2, '0')}:00`,
        sessions: item.session_count,
        hours: parseFloat((item.total_duration / 3600).toFixed(1)),
      }));

      // Transform daily data
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dailyData = result.daily.map(item => ({
        day: dayNames[item.day_of_week],
        sessions: item.session_count,
        hours: parseFloat((item.total_duration / 3600).toFixed(1)),
      }));

      setData({ hourly: hourlyData, daily: dailyData });
    } catch (error) {
      console.error('Failed to load productivity patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading...</div>;

  const chartData = view === 'hourly' ? data.hourly : data.daily;
  const xKey = view === 'hourly' ? 'hour' : 'day';

  return (
    <div className="productivity-patterns">
      <div className="pattern-controls">
        <button
          className={view === 'hourly' ? 'active' : ''}
          onClick={() => setView('hourly')}
        >
          By Hour
        </button>
        <button
          className={view === 'daily' ? 'active' : ''}
          onClick={() => setView('daily')}
        >
          By Day
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} />
          <YAxis label={{ value: 'Sessions', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="sessions" fill="#4F46E5" name="Sessions" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
