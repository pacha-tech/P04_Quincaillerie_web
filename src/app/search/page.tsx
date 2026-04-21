import SearchPage from '@/src/components/ui/client/SearchPage';

interface SearchProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PublicSearchPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Affiche le design dans le Layout de base (sans sidebar)
  return <SearchPage query={query} />;
}