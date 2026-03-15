import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import OverviewCards from '../components/analytics/OverviewCards';
import PomodoroByModuleChart from '../components/analytics/PomodoroByModuleChart';
import ModuleEngagementChart from '../components/analytics/ModuleEngagementChart';
import TodoTrendsChart from '../components/analytics/TodoTrendsChart';
import ProductivityPatternsChart from '../components/analytics/ProductivityPatternsChart';
import DateRangeFilter from '../components/analytics/DateRangeFilter';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ preset: '30days' });

  useEffect(() => {
    loadOverview();
  }, [dateRange]);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const period = dateRange.preset === '7days' ? 7 : dateRange.preset === '90days' ? 90 : 30;
      const data = await analyticsAPI.getOverview({ period });
      setOverview(data);
    } catch (err) {
      console.error('Failed to load overview:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="error-message">
          Failed to load analytics: {error}
          <button onClick={loadOverview} className="btn-primary" style={{ marginLeft: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className="analytics-content">
        {/* Overview Cards */}
        <section className="overview-section">
          <OverviewCards data={overview} />
        </section>

        {/* Charts Grid */}
        <div className="charts-grid">
          <section className="chart-section">
            <h3>Focus Time by Module</h3>
            <PomodoroByModuleChart dateRange={dateRange} />
          </section>

          <section className="chart-section">
            <h3>Module Engagement Ranking</h3>
            <ModuleEngagementChart />
          </section>

          <section className="chart-section full-width">
            <h3>Todo Completion Trends</h3>
            <TodoTrendsChart dateRange={dateRange} />
          </section>

          <section className="chart-section full-width">
            <h3>Productivity Patterns</h3>
            <ProductivityPatternsChart />
          </section>
        </div>
      </div>
    </div>
  );
}
