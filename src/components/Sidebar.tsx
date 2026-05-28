import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, SlidersHorizontal, BarChart3, PenTool, Users, Heart, LogOut, Sparkles, Book } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutGrid },
  { path: '/brand-twin', label: 'Brand Twin Builder', icon: SlidersHorizontal },
  { path: '/simulator', label: 'Campaign Simulator', icon: BarChart3 },
  { path: '/content', label: 'Content Engine', icon: PenTool },
  { path: '/creators', label: 'Creator Match', icon: Users },
  { path: '/health', label: 'Brand Health', icon: Heart },
  { path: '/docs', label: 'Technical Docs', icon: Book },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const { user, logout } = useAuth();
  const [logoError, setLogoError] = useState(false);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-[232px] bg-ink text-cream z-50
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 p-6 font-display font-bold text-xl tracking-wide text-amber">
          {!logoError ? (
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-8 w-8 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Sparkles className="text-amber" size={24} />
          )}
          <span>BUP SPARK</span>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-amber/10 text-amber' : 'text-muted hover:bg-ink2 hover:text-cream'}
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-ink2">
          <div className="bg-ink2 rounded-xl p-3 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-full bg-amber/20 text-amber flex items-center justify-center font-bold text-sm uppercase">
                {user?.name?.slice(0, 2) || 'BU'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate text-cream">{user?.name || "BUP Spark"}</span>
                <span className="text-xs text-muted truncate">{user?.email || "Brand Platform"}</span>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
