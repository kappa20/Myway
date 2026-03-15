import { usePomodoro } from '../../contexts/PomodoroContext';

export default function TimerControls() {
  const { isRunning, mode, start, pause, reset, switchMode, TIMER_MODES, sessionsCompleted } = usePomodoro();

  return (
    <div className="timer-controls">
      <div className="timer-buttons">
        {!isRunning ? (
          <button onClick={start} className="btn-primary btn-large">
            Start
          </button>
        ) : (
          <button onClick={pause} className="btn-secondary btn-large">
            Pause
          </button>
        )}
        <button onClick={reset} className="btn-secondary">
          Reset
        </button>
      </div>

      <div className="mode-switcher">
        <button
          onClick={() => switchMode(TIMER_MODES.WORK)}
          className={`mode-btn ${mode === TIMER_MODES.WORK ? 'active' : ''}`}
        >
          Work
        </button>
        <button
          onClick={() => switchMode(TIMER_MODES.SHORT_BREAK)}
          className={`mode-btn ${mode === TIMER_MODES.SHORT_BREAK ? 'active' : ''}`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode(TIMER_MODES.LONG_BREAK)}
          className={`mode-btn ${mode === TIMER_MODES.LONG_BREAK ? 'active' : ''}`}
        >
          Long Break
        </button>
      </div>

      <div className="session-counter">
        <p>Sessions completed: {sessionsCompleted}</p>
      </div>
    </div>
  );
}
