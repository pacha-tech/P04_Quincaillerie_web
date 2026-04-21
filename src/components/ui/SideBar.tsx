
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMenuByRole } from '@/src/constant/menuConfig';
import { UserRole } from '@/src/types/auth';
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Heart,
  User,
  Settings,
  Box,
  TrendingUp,
  BarChart2,
  Store,
  Info,
  Mail,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  grid: (props) => <BarChart2 {...props} />,
  'shopping-cart': (props) => <ShoppingCart {...props} />,
  heart: (props) => <Heart {...props} />,
  user: (props) => <User {...props} />,
  settings: (props) => <Settings {...props} />,
  box: (props) => <Box {...props} />,
  'trending-up': (props) => <TrendingUp {...props} />,
  'bar-chart-2': (props) => <BarChart2 {...props} />,
  store: (props) => <Store {...props} />,
  home: (props) => <Home {...props} />,
  info: (props) => <Info {...props} />,
  mail: (props) => <Mail {...props} />,
};

const getRoleFromPath = (pathname: string): UserRole => {
  if (pathname.startsWith('/authenticated/client')) return 'client';
  if (pathname.startsWith('/authenticated/vendeur')) return 'vendeur';
    return 'visiteur';
};

export default function SideBar() {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname || '/');
  const [isOpen, setIsOpen] = useState(false);

  // Synchroniser l'état après le montage côté client
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    setIsOpen(isDesktop);
  }, []);

  const menuItems = getMenuByRole(role);

  const renderIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon size={20} /> : <span>📌</span>;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };


  return (<>
      {/* Hamburger Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

     <aside
            className={`
                fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
                flex flex-col shadow-lg transition-transform duration-300 ease-in-out
                z-[60] 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}
      >
        
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            BRIXEL
          </h1>
          <p className="text-xs text-gray-500 mt-1">v1.0</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                /*
                onClick={() => {
                    if (window.innerWidth < 768) closeSidebar();
                }}
                    */
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  group cursor-pointer
                  ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {renderIcon(item.icon)}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-orange-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info (Placeholder) */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 capitalize">
                {role}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Mode développement
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}