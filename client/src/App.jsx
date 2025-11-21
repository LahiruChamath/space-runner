import { Outlet, Link, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white">
      <NavBar />

      <main className="flex-1">
        <div className={pathname === '/game' ? '' : 'container py-8'}>
          <Outlet />
        </div>
      </main>

      <footer className="py-6 text-center text-white/50 text-sm">
        Built for CIS046-3 •{' '}
        <Link className="underline" to="/leaderboards">
          Leaderboards
        </Link>
      </footer>
    </div>
  );
}
