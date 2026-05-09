"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMenuByRole } from '@/src/constant/menuConfig';
import { UserRole } from '@/src/types/auth';
import {
  Menu, X, Home, ShoppingCart, Heart, User, Settings, Box,
  TrendingUp, BarChart2, Store, Info, Mail, LogOut, ScrollText, LayoutDashboard, Tag , History,MessageSquare
} from 'lucide-react';
import { LocationProvider } from '@/src/hooks/LocationContext';
import { useAuth } from '@/src/hooks/AuthContext'; 
import { useCart } from '@/src/hooks/CartContext'; 
import LogoutModal from './LogoutModal';
import { useCommande } from '@/src/hooks/CommandeContext';

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string; strokeWidth?: number }>> = {
  grid: (props) => <BarChart2 {...props} />,
  layoutDashboard: (props) => <LayoutDashboard {...props} />,
  tag: (props) => <Tag {...props} />,
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
  history: (props) => <History {...props} />,
  messageSquare: (props) => < MessageSquare {...props}/>
};

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const { role, logout } = useAuth();
  const { items } = useCart(); 
  const { count } = useCommande();

  const activeRole = (role || "VISITEUR") as UserRole;
  const menuItems = getMenuByRole(activeRole);
  
  const uniqueStoresCount = new Set(items.map(item => item.idQuincaillerie)).size;

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    setIsOpen(isDesktop);
  }, [pathname, setIsOpen]);

  const renderIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName];
    return Icon ? <Icon size={20} strokeWidth={2.5} /> : <span>📌</span>;
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <LocationProvider>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-app-card/80 backdrop-blur-2xl border-r border-app-secondary/10
          flex flex-col transition-transform duration-300 ease-out z-[60] 
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          md:translate-x-0 md:shadow-none
        `}
      >
        
        {/* Header de la Sidebar */}
        <div className="pt-8 pb-6 px-6 relative">
          <button 
            onClick={closeSidebar}
            className="md:hidden absolute top-4 right-4 p-2 text-app-secondary hover:text-app-primary bg-app-surface rounded-full"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-xl bg-black text-white font-black text-lg shadow-lg shadow-black/10">
              BX
            </div>
            <h1 className="text-2xl font-black tracking-tight text-app-primary flex items-center gap-2">
              Brixel
              <span className="text-[10px] font-bold bg-app-surface px-2 py-0.5 rounded-full text-app-secondary mt-1">v1.0</span>
            </h1>
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) closeSidebar();
                }}
                className={`
                  relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden
                  ${isActive 
                    ? 'bg-app-accent/10 text-app-accent font-bold' 
                    : 'text-app-secondary font-medium hover:bg-app-surface/50 hover:text-app-primary'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-app-accent rounded-l-full shadow-sm" />
                )}

                <span className="relative text-xl group-hover:scale-110 transition-transform duration-200">
                  {renderIcon(item.icon)}
                  
                  {item.icon === 'shopping-cart' && uniqueStoresCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-app-card shadow-sm">
                      {uniqueStoresCount}
                    </span>
                  )}
                  {item.icon === 'logs' && count > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-app-card shadow-sm">
                      {count}
                    </span>
                  )}
                </span>

                <span className="text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Pied de la Sidebar : Bouton de Déconnexion */}
        <div className="p-4 mt-auto border-t border-app-surface/50">
          <button
            onClick={() => {
              setShowLogoutModal(true);
              if (window.innerWidth < 768) closeSidebar();
            }}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-red-500 font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-600 group cursor-pointer"
          >
            <LogOut size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm tracking-wide">Déconnexion</span>
          </button>
        </div>
      </aside>
      
      {/* Modal de Confirmation */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </LocationProvider>
  );
}