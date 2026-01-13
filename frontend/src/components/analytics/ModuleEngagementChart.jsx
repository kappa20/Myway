import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';

export default function ModuleEngagementChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await analyticsAPI.getModuleEngagement();
      setData(result);
    } catch (error) {
      console.error('Failed to load engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="chart-loading">Loading...</div>;
  if (data.length === 0) return <div className="chart-empty">No modules yet</div>;

  const maxScore = Math.max(...data.map(m => m.engagement_score || 0), 1);

  return (
    <div className="engagement-chart">
      {data.map((module, index) => (
        <div key={module.id} className="engagement-row">
          <div className="engagement-rank">#{index + 1}</div>
          <div className="engagement-info">
            <div className="module-name" style={{ borderLeftColor: module.color || '#4F46E5' }}>
              {module.name}
            </div>
            <div className="engagement-bar">
              <div
                className="engagement-progress"
                style={{
                  width: `${(module.engagement_score / maxScore) * 100}%`,
                  backgroundColor: module.color || '#4F46E5',
                }}
              />
            </div>
            <div className="engagement-stats">
              <span>{module.todo_count} todos</span>
              <span>{module.resource_count} resources</span>
              <span>{module.session_count} sessions</span>
            </div>
          </div>
          <div className="engagement-score">{module.engagement_score.toFixed(0)}</div>
        </div>
      ))}
    </div>
  );
}
