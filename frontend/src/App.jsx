import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ModuleProvider } from './contexts/ModuleContext';
import { TodoProvider } from './contexts/TodoContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import Header from './components/layout/Header';
import AIChatWidget from './components/ai/AIChatWidget';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ModuleProvider>
        <TodoProvider>
          <PomodoroProvider>
            <div className="app">
              <Header />

              <div className="app-routes">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </div>
              <AIChatWidget />
            </div>
          </PomodoroProvider>
        </TodoProvider>
      </ModuleProvider>
    </ThemeProvider>
  );
}

export default App;
