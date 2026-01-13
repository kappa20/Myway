import { createContext, useContext, useState, useEffect, useRef } from 'react';

const PomodoroContext = createContext();

const TIMER_MODES = {
  WORK: 'work',
  SHORT_BREAK: 'short_break',
  LONG_BREAK: 'long_break',
};

const DURATIONS = {
  [TIMER_MODES.WORK]: 25 * 60,
  [TIMER_MODES.SHORT_BREAK]: 5 * 60,
  [TIMER_MODES.LONG_BREAK]: 15 * 60,
};

export function PomodoroProvider({ children }) {
  const [mode, setMode] = useState(TIMER_MODES.WORK);
  const [timeLeft, setTimeLeft] = useState(DURATIONS[TIMER_MODES.WORK]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === TIMER_MODES.WORK
          ? 'Work session complete! Time for a break.'
          : 'Break is over! Ready to work?',
        icon: '/vite.svg',
      });
    }

    // Auto-switch mode
    if (mode === TIMER_MODES.WORK) {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);

      // Long break after 4 work sessions
      if (newSessions % 4 === 0) {
        switchMode(TIMER_MODES.LONG_BREAK);
      } else {
        switchMode(TIMER_MODES.SHORT_BREAK);
      }
    } else {
      switchMode(TIMER_MODES.WORK);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  };

  const start = () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const startWithTodo = (todo) => {
    setSelectedTodo(todo);
    switchMode(TIMER_MODES.WORK);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    mode,
    timeLeft,
    isRunning,
    selectedTodo,
    sessionsCompleted,
    TIMER_MODES,
    start,
    pause,
    reset,
    switchMode,
    startWithTodo,
    formatTime,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return context;
}
