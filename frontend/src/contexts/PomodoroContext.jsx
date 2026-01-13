import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { pomodoroAPI } from '../services/api';

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
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const intervalRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

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

  const handleTimerComplete = async () => {
    setIsRunning(false);

    // Save completed session
    if (currentSessionId && sessionStartTimeRef.current) {
      const actualDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      try {
        await pomodoroAPI.completeSession(currentSessionId, {
          actual_duration: actualDuration,
          completed_at: new Date().toISOString(),
          status: 'completed',
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
      setCurrentSessionId(null);
      sessionStartTimeRef.current = null;
    }

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

  const start = async () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Create session record in database
    try {
      const moduleId = selectedTodo?.module_id || null;
      const todoId = selectedTodo?.id || null;
      const session = await pomodoroAPI.createSession({
        module_id: moduleId,
        todo_id: todoId,
        session_type: mode,
        planned_duration: DURATIONS[mode],
      });
      setCurrentSessionId(session.id);
      sessionStartTimeRef.current = Date.now();
    } catch (error) {
      console.error('Failed to create session:', error);
    }

    setIsRunning(true);
  };

  const pause = async () => {
    setIsRunning(false);

    // Update session with current duration
    if (currentSessionId && sessionStartTimeRef.current) {
      const actualDuration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
      try {
        await pomodoroAPI.updateSession(currentSessionId, {
          actual_duration: actualDuration,
        });
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }
  };

  const reset = async () => {
    setIsRunning(false);

    // Mark session as cancelled if not completed
    if (currentSessionId) {
      try {
        const actualDuration = sessionStartTimeRef.current
          ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
          : 0;
        await pomodoroAPI.completeSession(currentSessionId, {
          actual_duration: actualDuration,
          status: 'cancelled',
        });
      } catch (error) {
        console.error('Failed to cancel session:', error);
      }
      setCurrentSessionId(null);
      sessionStartTimeRef.current = null;
    }

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
