import { ModuleProvider } from './contexts/ModuleContext';
import { TodoProvider } from './contexts/TodoContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import Header from './components/layout/Header';
import ModuleList from './components/modules/ModuleList';
import ResourceList from './components/resources/ResourceList';
import TodoList from './components/todos/TodoList';
import PomodoroTimer from './components/pomodoro/PomodoroTimer';
import './App.css';

function App() {
  return (
    <ModuleProvider>
      <TodoProvider>
        <PomodoroProvider>
          <div className="app">
            <Header />

            <div className="app-layout">
              <div className="left-panel">
                <ModuleList />
              </div>

              <div className="center-panel">
                <ResourceList />
                <TodoList />
              </div>

              <div className="right-panel">
                <PomodoroTimer />
              </div>
            </div>
          </div>
        </PomodoroProvider>
      </TodoProvider>
    </ModuleProvider>
  );
}

export default App;
