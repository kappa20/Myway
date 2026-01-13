import { usePomodoro } from '../../contexts/PomodoroContext';
import TimerControls from './TimerControls';

export default function PomodoroTimer() {
  const { mode, timeLeft, selectedTodo, formatTime, TIMER_MODES } = usePomodoro();

  const getProgress = () => {
    const durations = {
      [TIMER_MODES.WORK]: 25 * 60,
      [TIMER_MODES.SHORT_BREAK]: 5 * 60,
      [TIMER_MODES.LONG_BREAK]: 15 * 60,
    };
    const total = durations[mode];
    return ((total - timeLeft) / total) * 100;
  };

  const getModeLabel = () => {
    switch (mode) {
      case TIMER_MODES.WORK:
        return 'Work Session';
      case TIMER_MODES.SHORT_BREAK:
        return 'Short Break';
      case TIMER_MODES.LONG_BREAK:
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case TIMER_MODES.WORK:
        return '#EF4444';
      case TIMER_MODES.SHORT_BREAK:
        return '#10B981';
      case TIMER_MODES.LONG_BREAK:
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <h3>Pomodoro Timer</h3>
        <span className="mode-label" style={{ color: getModeColor() }}>
          {getModeLabel()}
        </span>
      </div>

      {selectedTodo && (
        <div className="selected-todo">
          <span className="todo-label">Working on:</span>
          <p>{selectedTodo.title}</p>
        </div>
      )}

      <div className="timer-display">
        <div className="timer-circle" style={{ '--progress': `${getProgress()}%` }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getModeColor()}
              strokeWidth="10"
              strokeDasharray="565.48"
              strokeDashoffset={565.48 * (1 - getProgress() / 100)}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>
      </div>

      <TimerControls />
    </div>
  );
}
