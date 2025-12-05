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
      
    </div>
  );
}
