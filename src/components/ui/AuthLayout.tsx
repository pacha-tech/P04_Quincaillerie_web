"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, TrendingDown, ShieldCheck, Smartphone, Building2, Banknote } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const slogans = [
  {
    icon: MapPin,
    title: "Proximité & Géolocalisation",
    description: "Détectez votre position en un clic et trouvez instantanément les quincailleries ouvertes les plus proches de votre chantier."
  },
  {
    icon: TrendingDown,
    title: "Comparateur de Prix Direct",
    description: "Comparez les prix des matériaux essentiels (ciment, fer, plomberie) et optimisez votre budget de construction."
  },
  {
    icon: ShieldCheck,
    title: "Disponibilité des Stocks",
    description: "Consultez en temps réel l'état des stocks dans chaque boutique pour éviter les déplacements inutiles."
  },
  {
    icon: Smartphone,
    title: "Consultation sans Inscription",
    description: "Explorer nos differents catalogues de produits et quincailleries sans creation de compte."
  },
  {
    icon: Banknote,
    title: "Payement securisé",
    description: "Payer vos commandes en toute securité via les operateurs locaux Orange Money et Mobile Money"
  },
  {
    icon: Building2,
    title: "Espace Vendeur Dédié",
    description: "Créez votre boutique virtuelle, gérez vos stocks facilement et développez votre clientèle locale en toute simplicité."
  }
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slogans.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FB] relative overflow-x-hidden font-sans">


      <div className="absolute top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-1.5 group">
          <div className="w-20 h-20 transform group-hover:scale-105 transition-all duration-300">
            <img src="/logo.png" alt="BX Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black text-[#1A1A2E] tracking-tight group-hover:text-[#E94560] transition-colors duration-200">
            Brixel
          </span>
        </Link>
      </div>

      <div className="hidden md:flex md:w-[45%] lg:w-[50%] relative bg-[#1A1A2E] overflow-hidden items-center justify-center p-12 lg:p-20 text-white">

        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#1a1a2e] to-[#2e1022] opacity-95" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#f97316]/10 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#E94560]/15 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 w-full max-w-md flex flex-col justify-between h-full pt-16">
          <div className="my-auto space-y-10">

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-[#E94560] tracking-wide w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E94560] animate-pulse" />
              Écosystème Matériaux
            </div>

            <div className="relative min-h-[220px] flex flex-col justify-center overflow-hidden">
              {slogans.map((slogan, index) => {
                const Icon = slogan.icon;
                const isActive = index === activeSlide;
                return (
                  <div
                    key={index}
                    className={`transition-all duration-1000 ease-in-out transform absolute w-full flex flex-col ${isActive
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                      : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
                      }`}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#E94560] shadow-inner">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                      {slogan.title}
                    </h2>
                    <p className="text-gray-300 text-base leading-relaxed font-light">
                      {slogan.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-4">
              {slogans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full cursor-pointer transition-all duration-500 ${index === activeSlide ? 'w-8 bg-[#E94560]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>

          </div>

          <div className="text-xs text-white/30 font-medium tracking-wider">
            &copy; {new Date().getFullYear()} BRIXEL. TOUS DROITS RÉSERVÉS.
          </div>
        </div>

      </div>

      <div className="w-full md:w-[55%] lg:w-[50%] flex items-center justify-center p-4 sm:p-8 md:p-12 min-h-screen pt-24 md:pt-12 bg-[#F8F9FB]">
        <div className="w-full max-w-lg flex flex-col items-center">
          {children}
        </div>
      </div>

    </div>
  );
}
