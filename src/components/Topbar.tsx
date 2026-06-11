import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useBrand } from '../hooks/useBrand';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/brand-twin': 'Brand Twin Builder',
  '/simulator': 'Campaign Simulator',
  '/content': 'Content Engine',
};

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const { brand } = useBrand();
  const title = PAGE_TITLES[location.pathname] || 'BUP SPARK';

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-ink/5 bg-cream sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-ink hover:text-amber transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-display font-extrabold text-xl md:text-2xl text-ink">
          {title}
        </h1>
      </div>
      
      {brand.name && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/5 border border-ink/10 text-xs font-bold text-ink">
          <span className="w-2 h-2 rounded-full bg-amber" />
          {brand.name}
        </div>
      )}
    </header>
  );
}
