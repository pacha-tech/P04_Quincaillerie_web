'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Navigation, Star, Sparkles, Percent, Store } from 'lucide-react';
import { useLocation } from '@/src/hooks/LocationContext';
import PromotionsSection from '@/src/components/ui/client/PromotionSection';
import CategorySection from '@/src/components/ui/client/CategorySection';
import PourVousSection from '@/src/components/ui/client/PourVous';
import ScopeFilter from '@/src/components/ui/client/ScopeFilter';

const getMockQuincailleries = (userLat?: number | null, userLng?: number | null) => {
  // Coordonnées par défaut (Douala, Cameroun) si la géolocalisation n'est pas dispo
  const baseLat = userLat ?? 4.0511;
  const baseLng = userLng ?? 9.7085;

  return [
    {
      idQuincaillerie: "q-1",
      name: "Bricolage Plus",
      city: "Douala",
      quartier: "Akwa",
      phone: "+237 677 889 900",
      averageRating: 4.8,
      photoUrl: "https://images.unsplash.com/photo-1590402421685-65d1d640ffdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.0004, // ~50m
      longitude: baseLng + 0.0004,
      description: "Votre quincaillerie de confiance pour tous vos outils de qualité."
    },
    {
      idQuincaillerie: "q-2",
      name: "Sofa Quincaillerie",
      city: "Yaoundé",
      quartier: "Mvan",
      phone: "+237 699 112 233",
      averageRating: 4.5,
      photoUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat - 0.002, // ~250m
      longitude: baseLng + 0.002,
      description: "Grand choix de ciments, fers à béton, peintures et matériaux de construction."
    },
    {
      idQuincaillerie: "q-3",
      name: "Quincaillerie de l'Ouest",
      city: "Bafoussam",
      quartier: "Djeleng",
      phone: "+237 655 443 322",
      averageRating: 4.2,
      photoUrl: "https://images.unsplash.com/photo-1513828742140-ccaa34f3a537?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.006, // ~700m
      longitude: baseLng - 0.005,
      description: "Outils de plomberie, électricité, et quincaillerie générale."
    },
    {
      idQuincaillerie: "q-4",
      name: "Brixel Depot",
      city: "Douala",
      quartier: "Bonapriso",
      phone: "+237 688 776 655",
      averageRating: 4.9,
      photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.025, // ~3.5km
      longitude: baseLng - 0.02,
      description: "Leader dans l'importation de robinetterie haut de gamme et carrelages."
    },
    {
      idQuincaillerie: "q-5",
      name: "Quincaillerie Centrale",
      city: "Douala",
      quartier: "Bali",
      phone: "+237 671 223 344",
      averageRating: 4.7,
      photoUrl: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat - 0.0006, // ~80m
      longitude: baseLng - 0.0003,
      description: "Quincaillerie générale, outillage et peinture professionnelle."
    },
    {
      idQuincaillerie: "q-6",
      name: "Outils & Co",
      city: "Douala",
      quartier: "Deido",
      phone: "+237 695 887 766",
      averageRating: 4.6,
      photoUrl: "https://images.unsplash.com/photo-1530124560676-b000b32943af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.003, // ~400m
      longitude: baseLng - 0.002,
      description: "Vente de tournevis, marteaux, perceuses et équipements électriques de pointe."
    },
    {
      idQuincaillerie: "q-7",
      name: "La Maison du Bricoleur",
      city: "Douala",
      quartier: "Bonamoussadi",
      phone: "+237 651 998 877",
      averageRating: 4.4,
      photoUrl: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat - 0.012, // ~1.5km
      longitude: baseLng + 0.01,
      description: "Matériaux de construction et outillage de jardinage au meilleur prix."
    },
    {
      idQuincaillerie: "q-8",
      name: "Plomberie Pro",
      city: "Douala",
      quartier: "Kotto",
      phone: "+237 670 112 233",
      averageRating: 4.3,
      photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.035, // ~4.5km
      longitude: baseLng + 0.02,
      description: "Tuyaux, raccords, robinets et tous accessoires de plomberie professionnelle."
    },
    {
      idQuincaillerie: "q-9",
      name: "Électricité Express",
      city: "Douala",
      quartier: "Yassa",
      phone: "+237 680 445 566",
      averageRating: 4.5,
      photoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat - 0.09, // ~12km
      longitude: baseLng - 0.08,
      description: "Câbles électriques, disjoncteurs, ampoules LED et matériel de sécurité."
    },
    {
      idQuincaillerie: "q-10",
      name: "Bâtiment Moderne",
      city: "Douala",
      quartier: "Logbessou",
      phone: "+237 691 556 677",
      averageRating: 4.6,
      photoUrl: "https://images.unsplash.com/photo-1590402421685-65d1d640ffdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.1, // ~14km
      longitude: baseLng + 0.1,
      description: "Matériaux de gros œuvre, ciment Lafarge, fers à béton de toutes dimensions."
    },
    {
      idQuincaillerie: "q-11",
      name: "Quincaillerie du Rail",
      city: "Edéa",
      quartier: "Gare",
      phone: "+237 660 778 899",
      averageRating: 4.1,
      photoUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat + 0.28, // ~35km
      longitude: baseLng - 0.25,
      description: "Quincaillerie de gros pour vos chantiers ferroviaires et industriels."
    },
    {
      idQuincaillerie: "q-12",
      name: "Brixel Prestige",
      city: "Kribi",
      quartier: "Plage",
      phone: "+237 673 889 900",
      averageRating: 4.9,
      photoUrl: "https://images.unsplash.com/photo-1513828742140-ccaa34f3a537?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      latitude: baseLat - 0.38, // ~45km
      longitude: baseLng + 0.3,
      description: "Matériaux haut de gamme pour résidences de standing et villas de vacances."
    }
  ];
};

function getDistanceInKm(lat1?: number | null, lon1?: number | null, lat2?: number, lon2?: number): number | null {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateDistanceStr(lat?: number | null, lng?: number | null, storeLat?: number, storeLng?: number) {
  const distance = getDistanceInKm(lat, lng, storeLat, storeLng);
  if (distance == null) return null;
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)} km`;
}

export default function ClientDashboard() {
  return (
    <Suspense fallback={<div className="animate-pulse h-screen bg-app-surface" />}>
      <ClientDashboardInner />
    </Suspense>
  );
}

function ClientDashboardInner() {
  const searchParams = useSearchParams();
  const scope = searchParams.get('scope') || 'ville';
  const [activeTab, setActiveTab] = useState<'pourVous' | 'enPromo' | 'quincailleries'>('pourVous');
  const { latitude, longitude } = useLocation();

  const tabs = [
    { key: 'pourVous', label: 'Pour vous', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { key: 'enPromo', label: 'En promotion', icon: <Percent className="h-3.5 w-3.5" /> },
    { key: 'quincailleries', label: 'Quincailleries', icon: <Store className="h-3.5 w-3.5" /> },
  ] as const;

  const rawQuincailleries = getMockQuincailleries(latitude, longitude);

  const filteredQuincailleries = rawQuincailleries.filter((store) => {
    if (latitude == null || longitude == null) return true;
    const dist = getDistanceInKm(latitude, longitude, store.latitude, store.longitude);
    if (dist == null) return true;

    switch (scope) {
      case '100m':
        return dist <= 0.1;
      case '500m':
        return dist <= 0.5;
      case '1km':
        return dist <= 1.0;
      case '5km':
        return dist <= 5.0;
      case 'ville':
        return dist <= 20.0;
      case 'region':
        return dist <= 60.0;
      default:
        return true;
    }
  });

  return (
    <div className="flex flex-col gap-2.5 pb-4">

      {/* ── CATÉGORIES ─────────────────────────────────── */}
      <CategorySection />

      {/* ── ONGLETS + FILTRE DE PROXIMITÉ FUSIONNÉS (STICKY) ── */}
      <div className="sticky top-0 z-30 bg-app-surface -mx-4 md:-mx-6 px-4 md:px-6 py-2.5 border-b border-app-secondary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-0.5">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${activeTab === key
                  ? 'bg-app-accent text-white shadow-sm'
                  : 'text-app-secondary hover:text-app-primary hover:bg-app-primary/5'
                  }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          <div className="shrink-0 overflow-x-auto scrollbar-none">
            <ScopeFilter />
          </div>
        </div>
      </div>

      {/* ── CONTENU ───────────────────────────────────────── */}
      <div className="animate-in fade-in duration-200">

        {activeTab === 'pourVous' && (
          <PourVousSection scope={scope} />
        )}

        {activeTab === 'enPromo' && (
          <div className="space-y-4">
            {/* Bannière compacte */}
            <div className="bg-gradient-to-r from-app-accent to-app-primary rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black mb-0.5">🔥 Jusqu'à -30% ce mois-ci</h2>
                <p className="text-[11px] opacity-85">Sur les outils électriques</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl">⚡</span>
                <button className="bg-white text-app-accent px-3 py-1.5 rounded-lg font-bold text-[11px] transition active:scale-95 whitespace-nowrap">
                  Voir les offres
                </button>
              </div>
            </div>
            <PromotionsSection scope={scope} />
          </div>
        )}

        {activeTab === 'quincailleries' && (
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-app-primary">Quincailleries partenaires</h2>
              <p className="text-[11px] text-app-secondary">Boutiques partenaires à proximité</p>
            </div>

            {filteredQuincailleries.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-app-surface rounded-2xl">
                <p className="text-app-secondary text-xs italic">Aucune quincaillerie partenaire à proximité pour cette distance.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredQuincailleries.map((store) => {
                  const distanceStr = calculateDistanceStr(latitude, longitude, store.latitude, store.longitude);
                  return (
                    <div
                      key={store.idQuincaillerie}
                      className="group bg-app-card border border-app-primary/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image */}
                      <div className="relative h-32 w-full overflow-hidden bg-app-surface">
                        <img
                          src={store.photoUrl}
                          alt={store.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm text-[11px] font-black text-app-primary">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {store.averageRating}
                        </div>
                        {distanceStr && (
                          <div className="absolute bottom-2 left-2 bg-app-accent text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            À {distanceStr}
                          </div>
                        )}
                      </div>

                      {/* Corps */}
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-sm font-bold text-app-primary group-hover:text-app-accent transition-colors leading-tight">
                          {store.name}
                        </h3>
                        <p className="text-[11px] text-app-secondary line-clamp-1">{store.description}</p>
                        <div className="flex items-center gap-1 text-[11px] text-app-secondary">
                          <MapPin className="h-3 w-3 text-app-accent shrink-0" />
                          <span>{store.quartier}, {store.city}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-3 pb-3 flex gap-1.5">
                        <a
                          href={`tel:${store.phone}`}
                          className="flex-1 bg-app-surface hover:bg-app-primary/5 border border-app-primary/10 text-app-primary text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          Appeler
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-app-accent hover:bg-app-accent/90 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors shadow-sm"
                        >
                          <Navigation className="h-3 w-3" />
                          Itinéraire
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}