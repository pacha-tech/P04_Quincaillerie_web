import SearchPage from '@/src/components/ui/client/SearchPage';

interface SearchProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function AuthSearchPage({ searchParams }: SearchProps) {
    const params = await searchParams;
    const query = params.q || "";

    // Affiche le MÊME design, mais protégé par le Layout "authenticated" (avec sidebar)
    return <SearchPage query={query} />;
}