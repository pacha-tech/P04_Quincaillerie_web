"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  Building2,
  Package,
  FileText,
  Smartphone,
  Wallet,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
  Sparkles,
  Zap
} from 'lucide-react';

const SLIDES = [
  {
    image: "/hero_construction_site.png",
    tagline: "Bâtir le futur ensemble",
    title: "Vos matériaux de construction en quelques clics",
    description: "Brixel connecte particuliers et professionnels aux quincailleries locales. Recherchez vos articles, comparez les prix et vérifiez les stocks en temps réel.",
    ctaText: "Explorer en mode visiteur",
    ctaLink: "/visiteur"
  },
  {
    image: "/hero_construction_materials.png",
    tagline: "Prix & Stocks Transparents",
    title: "Comparez les prix en direct et évitez les tracas",
    description: "Consultez en temps réel les tarifs exacts et la disponibilité des matériaux de construction. Ne perdez plus de temps dans les allées des magasins.",
    ctaText: "Comparer les tarifs",
    ctaLink: "/visiteur"
  },
  {
    image: "/hero_construction_tools1.png",
    tagline: "Logistique & Paiement Faciles",
    title: "Creer un compte en quelques clics pour Commandez et payez par Mobile Money & Orange Money",
    description: "Payez en toute sécurité via Orange Money ou MTN Mobile Money, puis récupérez vos articles en magasin ou faites-vous livrer directement sur le chantier.",
    ctaText: "Explorer en mode visiteur",
    ctaLink: "/visiteur"
  },
  {
    image: "/hero_construction_tools2.png",
    tagline: "Management Faciles",
    title: "Gerer facilement vos stocks, vos commandes et vos promotions",
    description: "Inserer des produits , faire une promotion , consulter vos statistiques, valider les commandes en quelques clics",
    ctaText: "Explorer en mode visiteur",
    ctaLink: "/visiteur"
  }
];

const CLIENT_FEATURES = [
  {
    icon: MapPin,
    title: "Géolocalisation de Chantier",
    desc: "Détectez votre position GPS en un clic et visualisez instantanément les quincailleries ouvertes les plus proches.",
    tag: "Proximité",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10"
  },
  {
    icon: TrendingDown,
    title: "Comparateur de Prix Direct",
    desc: "Comparez les prix des matériaux (ciment, fer, plomberie) entre différentes boutiques pour optimiser votre budget.",
    tag: "Économie",
    colorClass: "text-green-600",
    bgClass: "bg-green-500/10"
  },
  {
    icon: ShieldCheck,
    title: "Vérification des Stocks",
    desc: "Consultez en temps réel les quantités disponibles dans chaque boutique pour éviter les déplacements inutiles.",
    tag: "Disponibilité",
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10"
  },
  {
    icon: Smartphone,
    title: "Commande sans Inscription",
    desc: "Utilisez l'application en mode visiteur. Préparez votre panier et passez commande sans l'obligation de créer un compte.",
    tag: "Liberté",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-500/10"
  },
  {
    icon: Wallet,
    title: "Mobile Money Sécurisé",
    desc: "Réglez vos achats directement en ligne via Orange Money ou MTN Mobile Money avec validation sécurisée.",
    tag: "Paiement Rapide",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10"
  },
  {
    icon: MessageSquare,
    title: "Messagerie en Temps Réel",
    desc: "Discutez en direct avec les gérants de quincailleries pour négocier, demander des précisions ou obtenir de l'aide technique.",
    tag: "Relation Directe",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10"
  }
];

const VENDEUR_FEATURES = [
  {
    icon: Building2,
    title: "Boutique Virtuelle Dédiée",
    desc: "Créez votre vitrine avec votre logo, adresse, horaires d'ouverture et géolocalisation pour attirer les acheteurs.",
    tag: "Visibilité",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10"
  },
  {
    icon: Package,
    title: "Gestion d'Inventaire Intuitive",
    desc: "Ajoutez vos articles de quincaillerie, mettez à jour vos prix et gérez vos stocks en temps réel très simplement.",
    tag: "Contrôle",
    colorClass: "text-green-600",
    bgClass: "bg-green-500/10"
  },
  {
    icon: ArrowUpDown,
    title: "Historique des Flux de Stock",
    desc: "Suivez chaque entrée et sortie de stock. Soyez alerté des risques de rupture pour planifier vos réapprovisionnements.",
    tag: "Logistique",
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10"
  },
  {
    icon: TrendingUp,
    title: "Statistiques & Ventes",
    desc: "Suivez votre chiffre d'affaires, analysez vos meilleures ventes et le panier moyen avec des graphiques simples.",
    tag: "Croissance",
    colorClass: "text-purple-600",
    bgClass: "bg-purple-500/10"
  },
  {
    icon: FileText,
    title: "Validation des Commandes",
    desc: "Validez les commandes reçues, préparez les paniers et scannez les bons lors du retrait client ou de la livraison.",
    tag: "Efficacité",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10"
  },
  {
    icon: Sparkles,
    title: "Campagnes de Promotions",
    desc: "Créez des offres flash ou des réductions ciblées sur des produits spécifiques pour écouler vos surstocks rapidement.",
    tag: "Marketing",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'client' | 'vendeur'>('client');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div className="min-h-screen bg-app-surface font-sans text-app-primary selection:bg-app-accent/20 overflow-x-hidden">

      {/* Dynamic Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* FLOATING HEADER OVERLAY */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[#0c0c17]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-20 h-20 transform group-hover:scale-105 transition-all duration-300">
              <img src="/logo.png" alt="BX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Brixel
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-white/80">
            <a href="#features" className="hover:text-white hover:scale-105 transition-all duration-200">Fonctionnalités</a>
            <Link href="/visiteur" className="hover:text-white hover:scale-105 transition-all duration-200">Boutiques</Link>
            {/*<Link href="/visiteur" className="hover:text-white hover:scale-105 transition-all duration-200">Mon Panier</Link>*/}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-bold text-white hover:text-app-accent hover:scale-105 transition-all duration-200"
            >
              Se connecter
            </Link>
            <Link
              href="/visiteur"
              className="px-6 py-2.5 bg-app-accent text-white text-sm font-bold rounded-full hover:bg-app-accent/90 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(233,69,96,0.4)]"
            >
              Explorer en Invité
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO SLIDER SECTION */}
      <header className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-app-primary">

        {/* Slide Track */}
        <div
          className="flex w-full h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className="w-full h-full shrink-0 relative flex items-center"
            >
              {/* Background Image with Ken Burns Effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${currentSlide === index ? 'scale-110' : 'scale-100'
                  }`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />

              {/* Text Content */}
              <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
                <div className="max-w-3xl">

                  {/* Tagline capsule */}
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-app-accent/25 border border-app-accent/30 text-xs font-bold tracking-wider uppercase mb-6 animate-fade-in text-white shadow-inner">
                    <span className="h-2 w-2 rounded-full bg-app-accent animate-pulse"></span>
                    {slide.tagline}
                  </span>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.15] mb-6 tracking-tight drop-shadow-lg text-white">
                    {slide.title.split(' ').map((word, i) => {
                      if (word.toLowerCase() === 'brixel' || word.toLowerCase() === 'matériaux' || word.toLowerCase() === 'direct' || word.toLowerCase() === 'sans') {
                        return <span key={i} className="text-app-accent">{word} </span>;
                      }
                      return word + ' ';
                    })}
                  </h1>

                  {/* Description */}
                  <p className="text-base md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl drop-shadow font-medium">
                    {slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-app-accent text-white rounded-full font-bold shadow-[0_8px_30px_rgba(233,69,96,0.4)] hover:bg-app-accent/90 hover:-translate-y-0.5 transition-all active:scale-95 text-base"
                    >
                      {slide.ctaText}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/25 hover:border-white/40 transition-all backdrop-blur-sm active:scale-95 text-base"
                    >
                      Créer un compte
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/35 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer border border-white/5 active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/35 hover:bg-black/60 text-white transition-all backdrop-blur-sm cursor-pointer border border-white/5 active:scale-90"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators/Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3.5 z-30">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === index ? 'w-10 bg-app-accent' : 'w-2.5 bg-white/45 hover:bg-white/80'
                }`}
            />
          ))}
        </div>

      </header>

      {/* STATS SECTION */}
      <section className="py-16 bg-app-primary text-white border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-app-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div>
            <p className="text-4xl md:text-5xl font-black text-app-accent mb-2">150+</p>
            <p className="text-xs md:text-sm text-white/60 font-bold uppercase tracking-wider">Quincailleries Partenaires</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">20 000+</p>
            <p className="text-xs md:text-sm text-white/60 font-bold uppercase tracking-wider">Matériaux Référencés</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-app-accent mb-2">0 FCFA</p>
            <p className="text-xs md:text-sm text-white/60 font-bold uppercase tracking-wider">Frais de Compte Visiteur</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">98%</p>
            <p className="text-xs md:text-sm text-white/60 font-bold uppercase tracking-wider">Clients Satisfaits</p>
          </div>
        </div>
      </section>

      {/* SYSTEM CAPABILITIES SECTION */}
      <section id="features" className="py-24 bg-app-surface relative">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-app-accent/10 border border-app-accent/20 text-xs font-bold text-app-accent uppercase tracking-wider mb-4">
              <Zap className="h-3 w-3" />
              Écosystème Complet
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-app-primary tracking-tight mb-4 leading-tight">
              Tout ce dont vous avez besoin pour vos chantiers
            </h2>
            <p className="text-app-secondary text-sm md:text-base leading-relaxed">
              Brixel regroupe les fonctionnalités clés pour simplifier les achats des constructeurs tout en offrant des outils de gestion puissants pour les commerçants du bâtiment.
            </p>
          </div>

          {/* Tabs Control */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-1.5 bg-app-card border border-app-primary/5 rounded-2xl shadow-md relative">
              <button
                onClick={() => setActiveTab('client')}
                className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${activeTab === 'client'
                  ? 'bg-app-accent text-white shadow-lg'
                  : 'text-app-secondary hover:text-app-primary'
                  }`}
              >
                <Smartphone className="h-4.5 w-4.5" />
                Pour les Acheteurs
              </button>
              <button
                onClick={() => setActiveTab('vendeur')}
                className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${activeTab === 'vendeur'
                  ? 'bg-app-primary text-white shadow-lg'
                  : 'text-app-secondary hover:text-app-primary'
                  }`}
              >
                <Building2 className="h-4.5 w-4.5" />
                Pour les Quincailleries
              </button>
            </div>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'client' ? CLIENT_FEATURES : VENDEUR_FEATURES).map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className="bg-app-card rounded-[2rem] p-8 border border-app-primary/5 hover:border-app-accent/20 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(233,69,96,0.06)] transition-all duration-500 relative overflow-hidden group cursor-default"
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-app-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Icon with Ring effect */}
                  <div className="relative mb-6 inline-flex">
                    <div className="absolute inset-0 rounded-2xl bg-app-accent/10 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 animate-pulse" />
                    <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center ${feat.bgClass} ${feat.colorClass} shadow-inner`}>
                      <Icon className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Benefit Tag */}
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-app-surface text-app-secondary mb-3.5 border border-app-primary/5">
                    {feat.tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-app-primary mb-3 group-hover:text-app-accent transition-colors duration-300">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-app-secondary leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA CONVERSION SECTION */}
      <section className="py-28 bg-gradient-to-br from-app-primary to-[#0c0c17] text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,69,96,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block text-[11px] font-black tracking-widest text-app-accent uppercase px-3.5 py-1 rounded-full bg-app-accent/10 border border-app-accent/20 mb-6">
            LANCER L'EXPÉRIENCE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Prêt à simplifier vos achats de chantier ?
          </h2>
          <p className="text-white/70 mb-10 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Profitez de la liberté d'acheter sans compte ou configurez votre propre boutique de quincaillerie dès maintenant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/visiteur"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-app-accent text-white rounded-full font-bold shadow-[0_8px_30px_rgba(233,69,96,0.3)] hover:scale-105 transition-all text-base"
            >
              Explorer sans compte
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/15 hover:border-white/30 transition-all text-base"
            >
              Créer un compte professionnel
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#0c0c17] border-t border-white/5 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white/50 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="BX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-white tracking-tight">Brixel</span>
            <span className="text-xs font-medium">• © {new Date().getFullYear()} Tous droits réservés.</span>
          </div>
          <div className="flex gap-6 text-xs font-semibold">
            <Link href="/visiteur" className="hover:text-white transition-colors">Visiteur</Link>
            <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Inscription</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}