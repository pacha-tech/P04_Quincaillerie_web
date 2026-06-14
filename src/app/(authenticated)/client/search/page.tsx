import SearchPage from '@/src/components/ui/client/SearchPage';
import { SearchResultsServerWrapper } from '@/src/components/ui/client/SearchResultsServerWrapper';
import SearchSkeleton from '@/src/components/ui/client/SearchSkeleton';
import { Suspense } from 'react';

interface SearchProps {
    searchParams: Promise<{ q?: string; lat?: string; lng?: string; scope?: string }>;
}

export default async function AuthSearchPage({ searchParams }: SearchProps) {
    const params = await searchParams;
    const query = params.q || "";
    const lat = params.lat ? Number(params.lat) : null;
    const lng = params.lng ? Number(params.lng) : null;
    const scope = params.scope || "1km";

    const isWaitingForGPS = (lat === null || lng === null);

    return (
        <SearchPage query={query}>
            <Suspense key={`${query}-${scope}`} fallback={<SearchSkeleton />}>
                {isWaitingForGPS ? (
                    <SearchSkeleton />
                ): (
                    <SearchResultsServerWrapper query={query} lat={lat} lng={lng} scope={scope} />
                )}
            </Suspense>
        </SearchPage>
    );
}