import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { getCSSVar } from '../../utils/theme';

export default function TodoTrendsChart({ dateRange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const period = dateRange.preset === '7days' ? 7 : dateRange.preset === '90days' ? 90 : 30;
      const result = await analyticsAPI.getTodoTrends({ period });
      setData(result);
    } catch (error) {
      console.error('Failed to load todo trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading...</div>;
  if (data.length === 0) return <div className="chart-empty">No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={getCSSVar('--chart-grid')} />
        <XAxis dataKey="date" stroke={getCSSVar('--text-secondary')} />
        <YAxis stroke={getCSSVar('--text-secondary')} />
        <Tooltip
          contentStyle={{ backgroundColor: getCSSVar('--chart-tooltip-bg'), border: `1px solid ${getCSSVar('--chart-tooltip-border')}`, borderRadius: '8px', color: getCSSVar('--text-primary') }}
          cursor={{ fill: getCSSVar('--chart-cursor') }}
        />
        <Legend />
        <Line type="monotone" dataKey="created" stroke={getCSSVar('--primary-600')} name="Created" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
