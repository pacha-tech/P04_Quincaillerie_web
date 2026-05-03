'use client';

import { useState } from "react";
import SideBar from "@/src/components/ui/SideBar";
import RoleGuard from "../../../components/ui/RoleGuard";
import { Menu, Search, Bell, Store } from "lucide-react";

export default function VendeurLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRole="VENDEUR">
      <div className="flex h-screen bg-app-surface w-full relative overflow-hidden">        
        <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-64 w-[280px]`}>
          <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>
        
      
        <main className="flex-1 flex flex-col w-full max-w-full transition-all duration-300 md:ml-0 h-full min-h-screen overflow-y-auto">
          
          <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-app-secondary/10 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-app-surface text-app-primary transition"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-app-primary rounded-lg flex items-center justify-center shadow-inner">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg text-app-primary hidden md:block">BatiBoutique</span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button className="p-2 rounded-full hover:bg-app-surface text-app-secondary transition-colors md:hidden">
                <Search className="w-5 h-5" />
              </button>
              <button className="relative p-2 rounded-full hover:bg-app-surface transition-colors cursor-pointer">
                <Bell className="w-6 h-6 md:w-7 md:h-7 text-app-primary" />
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">3</span>
              </button>
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-app-surface border border-app-secondary/20 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img src="https://i.pravatar.cc/150?img=11" alt="Profil" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>

        </main>
      </div>
    </RoleGuard>
  );
}