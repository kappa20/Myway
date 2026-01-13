import ModuleList from '../components/modules/ModuleList';
import ResourceList from '../components/resources/ResourceList';
import TodoList from '../components/todos/TodoList';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';

export default function Dashboard() {
  return (
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
  );
}
