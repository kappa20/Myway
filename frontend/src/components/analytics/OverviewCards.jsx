export default function OverviewCards({ data }) {
  const formatDuration = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const completionRate = data.totalTodos.count > 0
    ? ((data.completedTodos.count / data.totalTodos.count) * 100).toFixed(1)
    : 0;

  const cards = [
    {
      title: 'Total Modules',
      value: data.totalModules.count,
      icon: '📚',
      color: 'blue',
    },
    {
      title: 'Total Focus Time',
      value: formatDuration(data.totalFocusTime.total),
      icon: '⏱️',
      color: 'purple',
    },
    {
      title: 'Today\'s Focus Time',
      value: formatDuration(data.todayFocusTime.total),
      icon: '🔥',
      color: 'orange',
    },
    {
      title: 'Todo Completion Rate',
      value: `${completionRate}%`,
      icon: '✅',
      color: 'green',
    },
  ];

  return (
    <div className="overview-cards">
      {cards.map((card, index) => (
        <div key={index} className={`overview-card ${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
