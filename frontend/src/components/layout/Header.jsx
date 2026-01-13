import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <h1>Myway</h1>
          <p className="tagline">Student Module Management</p>
        </div>

        <nav className="header-nav">
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Dashboard
          </Link>
          <Link
            to="/analytics"
            className={location.pathname === '/analytics' ? 'nav-link active' : 'nav-link'}
          >
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}
