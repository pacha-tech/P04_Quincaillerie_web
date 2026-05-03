import Link from 'next/link';
import { 
  ArrowRight, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Hammer, 
  Building2, 
  ChevronRight,
  Package,
  FileText,
  Smartphone
} from 'lucide-react';

// Liste des avantages pour générer le carrousel facilement
const FEATURES = [
  {
    id: 1,
    title: "Géolocalisation",
    desc: "Trouvez les quincailleries ouvertes les plus proches de votre chantier.",
    icon: MapPin,
    iconColor: "text-app-accent",
    iconBg: "bg-app-accent/10"
  },
  {
    id: 2,
    title: "Prix Transparents",
    desc: "Comparez les prix des matériaux et évitez les mauvaises surprises.",
    icon: ShieldCheck,
    iconColor: "text-green-600",
    iconBg: "bg-green-500/10"
  },
  {
    id: 3,
    title: "Gain de temps",
    desc: "Préparez votre panier à l'avance et passez juste récupérer vos articles.",
    icon: Clock,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10"
  },
  {
    id: 4,
    title: "Large Choix",
    desc: "Accédez à un vaste catalogue couvrant du gros œuvre aux finitions.",
    icon: Package,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-500/10"
  },
  {
    id: 5,
    title: "Devis Simplifiés",
    desc: "Générez et comparez des devis rapidement pour optimiser votre budget.",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10"
  },
  {
    id: 6,
    title: "100% Mobile",
    desc: "Une interface fluide pensée pour être utilisée directement sur le terrain.",
    icon: Smartphone,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-app-surface font-sans text-app-primary selection:bg-app-accent/20">
      
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />


      <nav className="fixed top-0 left-0 right-0 z-50 bg-app-surface/80 backdrop-blur-md border-b border-app-primary/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="mx-auto w-10 h-10 bg-app-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-white text-xl font-bold -rotate-3">BX</span>
            </div>
            <span className="text-xl font-black tracking-tight">Brixel</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-app-secondary">
            <Link href="#features" className="hover:text-app-accent transition-colors">Fonctionnalités</Link>
            <Link href="#quincailleries" className="hover:text-app-accent transition-colors">Quincailleries</Link>
            <Link href="/panier" className="hover:text-app-accent transition-colors">Mon Panier</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden sm:block text-sm font-bold text-app-primary hover:text-app-accent transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              href="/visiteur" 
              className="px-6 py-2.5 bg-app-primary text-white text-sm font-bold rounded-full hover:bg-black/80 transition-all shadow-md active:scale-95"
            >
              Explorer
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Texte de gauche */}
          <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-app-accent/10 border border-app-accent/20 mb-6">
              <span className="h-2 w-2 rounded-full bg-app-accent animate-pulse"></span>
              <span className="text-xs font-bold text-app-accent uppercase tracking-wider">La révolution du bâtiment</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-app-primary">
              Vos matériaux de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">
                construction
              </span>, <br />
              sans tracas.
            </h1>
            
            <p className="text-base md:text-lg text-app-secondary leading-relaxed mb-10 max-w-lg">
              Brixel connecte les professionnels et les particuliers aux meilleures quincailleries locales. Trouvez vos produits, comparez les prix et vérifiez les stocks en temps réel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="#" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-app-accent text-white rounded-full font-bold shadow-[0_8px_30px_rgba(6,81,237,0.3)] hover:shadow-[0_8px_40px_rgba(6,81,237,0.4)] hover:-translate-y-1 transition-all active:scale-95"
              >
                <Search className="h-5 w-5" />
                Rechercher un produit
              </Link>
              <Link 
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-app-card text-app-primary rounded-full font-bold border border-app-primary/10 hover:border-app-primary/20 hover:bg-app-surface transition-all active:scale-95"
              >
                Explorer les boutiques
              </Link>
            </div>
          </div>

          {/* Illustration de droite (Visuel abstrait/Mockup) */}
          <div className="relative h-[400px] md:h-[500px] w-full lg:w-[110%] bg-app-card rounded-[3rem] border border-app-primary/5 shadow-2xl shadow-app-primary/5 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-app-surface to-app-card"></div>
            
            {/* Cercles décoratifs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-app-accent/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* Mockup de la carte quincaillerie */}
            <div className="relative z-10 w-full max-w-sm bg-app-card rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-app-surface animate-[bounce_10s_ease-in-out_infinite]">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-app-surface flex items-center justify-center text-app-secondary">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-app-primary text-lg">Quincaillerie Centrale</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-app-secondary font-medium">Ouvert • Mvan</span>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-app-surface mb-4"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-app-secondary mb-1">Ciment CPJ 35</p>
                  <p className="font-black text-green-600 text-xl">4 800 FCFA</p>
                </div>
                <button className="h-10 w-10 rounded-full bg-app-primary text-white flex items-center justify-center shadow-md">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* FEATURES SECTION (Ruban défilant infini) */}
      <section id="features" className="py-20 bg-app-card border-y border-app-primary/5">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-app-primary tracking-tight mb-4">Pourquoi choisir Brixel ?</h2>
            <p className="text-app-secondary text-sm md:text-base">Nous simplifions la vie des artisans, des chefs de chantier et des bricoleurs en centralisant l'offre locale de manière intelligente.</p>
          </div>
        </div>

        {/* Conteneur principal du défilement */}
        <div className="relative w-full overflow-hidden flex items-center py-4">
          
          {/* Flou gauche (Fondu) */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-app-card to-transparent z-10 pointer-events-none"></div>
          
          {/* Ruban animé */}
          {/* On duplique la liste des avantages pour que le défilement semble infini */}
          <div className="flex w-max animate-marquee gap-4 md:gap-6">
            {[...FEATURES, ...FEATURES].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="shrink-0 w-[200px] md:w-[260px] bg-app-surface rounded-[1.5rem] p-5 md:p-6 border border-app-primary/5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg}`}>
                    <Icon className={`h-5 w-5 md:h-6 md:w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-app-primary mb-2">{feature.title}</h3>
                  <p className="text-[10px] md:text-xs text-app-secondary leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Flou droit (Fondu) */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-app-card to-transparent z-10 pointer-events-none"></div>

        </div>
      </section>

      {/* CTA / FOOTER SIMPLE */}
      <footer className="py-24 bg-app-primary text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">Prêt à construire avec nous ?</h2>
          <p className="text-white/60 mb-10 text-lg">Rejoignez des milliers d'utilisateurs qui optimisent leurs achats de matériaux de construction au quotidien.</p>
          <Link 
            href="#" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-app-accent text-white rounded-full font-bold shadow-[0_8px_30px_rgba(6,81,237,0.3)] hover:scale-105 transition-all"
          >
            Trouver un produit
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </footer>

    </div>
  );
}