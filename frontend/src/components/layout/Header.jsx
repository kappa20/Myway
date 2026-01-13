import { Link, useLocation } from 'react-router-dom';
import { isDemoMode } from '../../services/api';

export default function Header() {
  const location = useLocation();
  const demoMode = isDemoMode();

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
        </nav>
      </div>
    </header>
  );
}
