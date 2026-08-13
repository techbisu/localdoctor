import { searchHealthcare, getSpecializations } from '@/server/actions/search';
import { SearchFilters } from '@/components/search-filters';
import { DoctorCard } from '@/components/doctor-card';
import { PharmacyCard } from '@/components/pharmacy-card';
import { LabCard } from '@/components/lab-card';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
interface SearchPageProps {
    searchParams: Promise<{
        query?: string;
        type?: string;
        lat?: string;
        lng?: string;
        city?: string;
        specialization?: string;
    }>;
}
export const metadata: Metadata = {
    title: 'Search Healthcare Providers | HealthFind',
    description: 'Find doctors, pharmacies, and labs near you.',
};
async function SearchResults({ searchParams }: {
    searchParams: SearchPageProps['searchParams'];
}) {
    const sp = await searchParams;
    const results = await searchHealthcare({
        query: sp.query,
        type: sp.type || 'all',
        lat: sp.lat ? parseFloat(sp.lat) : undefined,
        lng: sp.lng ? parseFloat(sp.lng) : undefined,
        city: sp.city,
        specialization: sp.specialization,
    });
    if (results.length === 0) {
        return (<div className='text-center py-20'>
        <h3 className='text-lg font-semibold mb-2'>No results found</h3>
        <p className='text-muted-foreground'>Try adjusting your search or increasing the search radius.</p>
      </div>);
    }
    return (<div className='space-y-4'>
      {results.map((result: any) => {
            if (result.type === 'doctor')
                return <DoctorCard key={result.id} doctor={result}/>;
            if (result.type === 'pharmacy')
                return <PharmacyCard key={result.id} pharmacy={result}/>;
            if (result.type === 'lab')
                return <LabCard key={result.id} lab={result}/>;
            return null;
        })}
    </div>);
}
export default async function SearchPage({ searchParams }: SearchPageProps) {
    const sp = await searchParams;
    const specializations = await getSpecializations();
    return (<div className='container py-8'>
      <div className='grid md:grid-cols-[280px_1fr] gap-8'>
        <aside className='hidden md:block'>
          <SearchFilters specializations={specializations}/>
        </aside>
        <div>
          <h1 className='text-2xl font-bold mb-6'>
            Search Results
            {sp.query && <span className='text-muted-foreground font-normal'> for &quot;{sp.query}&quot;</span>}
          </h1>
          <Suspense fallback={<div className='space-y-4'>
                {[...Array(3)].map((_, i) => (<Skeleton key={i} className='h-40 w-full'/>))}
              </div>}>
            <SearchResults searchParams={searchParams}/>
          </Suspense>
        </div>
      </div>
    </div>);
}
