import { Link, useLocation } from 'react-router-dom';
import { isDemoMode } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const location = useLocation();
  const demoMode = isDemoMode();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1>Myway</h1>
          <p className="tagline">Student Module Management</p>
          {demoMode && (
            <span className="demo-badge">DEMO MODE</span>
          )}
        </div>

        <nav className="header-nav">
          <Link
            to={demoMode ? "/?demo=true" : "/"}
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </Link>
          <Link
            to={demoMode ? "/analytics?demo=true" : "/analytics"}
            className={location.pathname === '/analytics' ? 'nav-link active' : 'nav-link'}
          >
            Analytics
          </Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
          </button>
        </nav>
      </div>
    </header>
  );
}
