export default function DateRangeFilter({ value, onChange }) {
  const presets = [
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'Last 90 days', value: '90days' },
    { label: 'All time', value: 'all' },
  ];

  return (
    <div className="date-range-filter">
      {presets.map(preset => (
        <button
          key={preset.value}
          className={value.preset === preset.value ? 'active' : ''}
          onClick={() => onChange({ preset: preset.value })}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
