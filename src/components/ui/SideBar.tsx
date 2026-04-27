"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  ScrollText,
} from 'lucide-react';
import { LocationProvider } from '@/src/hooks/LocationContext';
import { useAuth } from '@/src/hooks/AuthContext'; 
import { useCart } from '@/src/hooks/CartContext'; 
import LogoutModal from './LogoutModal';
import { log } from 'console';

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
  logOut: (props) => <LogOut {...props} />,
  logs: (props) => <ScrollText {...props} />,
};

export default function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal , setShowLogoutModal] = useState(false);
  
  const { role , logout} = useAuth();
  const { items } = useCart(); 

  const activeRole = (role || "VISITEUR") as UserRole;
  const menuItems = getMenuByRole(activeRole);

  
  const uniqueStoresCount = new Set(items.map(item => item.idQuincaillerie)).size;

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    setIsOpen(isDesktop);
  }, [pathname]);

  const renderIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon size={20} /> : <span>📌</span>;
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <LocationProvider>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-app-card border border-app-secondary/20 hover:bg-app-surface transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} className="text-app-primary" /> : <Menu size={24} className="text-app-primary" />}
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-app-card border-r border-app-secondary/20
          flex flex-col shadow-lg transition-transform duration-300 ease-in-out
          z-[60] 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        
        <div className="p-6 border-b border-app-secondary/20">
          <h1 className="text-2xl font-bold text-app-accent">BRIXEL</h1>
          <p className="text-xs text-app-secondary mt-1">v1.0</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const isLogout = item.id === 'logout';
            return (
              <Link
                key={item.id}
                href={isLogout ? '#' : item.href}
                onClick={(e) => {
                  if(isLogout){
                    e.preventDefault();
                    setShowLogoutModal(true);
                  }
                  if (window.innerWidth < 768) closeSidebar();
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  group cursor-pointer
                  ${
                    isActive
                      ? 'bg-app-accent/10 text-app-accent font-semibold shadow-sm'
                      : 'text-app-secondary hover:bg-app-surface hover:text-app-primary'
                  }
                `}
              >
                <span className="relative text-xl group-hover:scale-110 transition-transform duration-200">
                  {renderIcon(item.icon)}
                  
                  {item.icon === 'shopping-cart' && uniqueStoresCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-app-card shadow-sm">
                      {uniqueStoresCount}
                    </span>
                  )}
                </span>

                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-6 bg-app-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ... (Footer de la sidebar inchangé) ... */}
        <div className="px-4 py-3 border-t border-app-secondary/20 bg-app-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-app-accent rounded-full flex items-center justify-center text-app-card text-sm font-bold uppercase">
              {activeRole.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-app-primary capitalize">
                {activeRole}
              </p>
              <p className="text-xs text-app-secondary truncate">
                Connecté
              </p>
            </div>
          </div>
        </div>
      </aside>
      
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </LocationProvider>
  );
}