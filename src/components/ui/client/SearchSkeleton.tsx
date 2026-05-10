{/*
import { Loader2 } from "lucide-react";

export default function SearchSkeleton() {
    return (
        <div className="flex flex-col gap-8 px-4 md:px-6 mt-6 md:mt-8 w-full animate-pulse">
   
            <div className="flex flex-col gap-4">
    
                <div className="h-6 w-48 bg-app-surface border border-app-secondary/10 rounded-md"></div>
       
                <div className="flex overflow-hidden gap-3 md:gap-4">
                    {[1, 2, 3 , 4 , 5 , 6].map((i) => (
                        <div key={i} className="shrink-0 w-[200px] md:w-[220px] h-[280px] bg-app-card border border-app-surface rounded-2xl md:rounded-3xl flex flex-col p-4">
                            <div className="w-full h-24 bg-app-surface rounded-xl mb-4"></div>
                            <div className="h-4 w-3/4 bg-app-surface rounded mb-2"></div>
                            <div className="h-3 w-1/2 bg-app-surface rounded mb-4"></div>
                            <div className="mt-auto flex justify-between items-center">
                                <div className="h-5 w-16 bg-app-surface rounded"></div>
                                <div className="h-8 w-20 bg-app-surface rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        
            <div className="flex justify-center mt-4">
                <Loader2 className="animate-spin text-app-secondary/50 h-8 w-8" />
            </div>
        </div>
    );
}
    */}

    import { Loader2 } from "lucide-react";

export default function SearchSkeleton() {
    return (
        <div className="w-full flex flex-col gap-8 animate-pulse">
            
            {/* Faux compteur de résultats */}
            <div className="pb-2 border-b border-app-surface flex items-center">
                <div className="h-4 w-32 bg-app-surface rounded-md"></div>
            </div>

            {/* Fausse section Produit 1 */}
            <div className="flex flex-col gap-5">
                {/* Faux Titre Produit & Badge */}
                <div className="flex items-center gap-3">
                    <div className="h-6 w-48 bg-app-surface rounded-md"></div>
                    <div className="h-5 w-20 bg-app-surface rounded-full"></div>
                </div>
                
                {/* Fausses Cartes (Scroll Horizontal) */}
                <div className="flex overflow-hidden gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="shrink-0 w-[200px] md:w-[220px] h-[280px] bg-white border border-app-surface rounded-2xl p-4 flex flex-col">
                            {/* Image Placeholder */}
                            <div className="w-full h-28 bg-app-surface rounded-xl mb-4"></div>
                            {/* Texte Placeholders */}
                            <div className="h-4 w-full bg-app-surface rounded mb-2"></div>
                            <div className="h-4 w-2/3 bg-app-surface rounded mb-4"></div>
                            
                            {/* Footer de la carte */}
                            <div className="mt-auto flex justify-between items-end">
                                <div className="h-5 w-16 bg-app-surface rounded"></div>
                                <div className="h-8 w-20 bg-app-surface rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Spinner doux au centre pour l'attente */}
            <div className="flex justify-center mt-8">
                <Loader2 className="animate-spin text-app-secondary/30 h-6 w-6" />
            </div>
        </div>
    );
}