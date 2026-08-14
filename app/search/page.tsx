import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './search.module.css';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stateId?: string; cityId?: string; categoryId?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const stateId = params.stateId || '';
  const cityId = params.cityId || '';
  const categoryId = params.categoryId || '';
  
  let categories: any[] = [];
  let states: any[] = [];
  let cities: any[] = [];
  let places: any[] = [];
  try {
    [categories, states, cities] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.state.findMany({ orderBy: { name: 'asc' } }),
      prisma.city.findMany({ orderBy: { name: 'asc' } })
    ]);
    
    places = await prisma.place.findMany({
      where: (query || stateId || cityId || categoryId) ? {
        OR: query ? [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { state: { name: { contains: query, mode: 'insensitive' } } },
          { city: { name: { contains: query, mode: 'insensitive' } } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ] : undefined,
        stateId: stateId ? stateId : undefined,
        cityId: cityId ? cityId : undefined,
        categoryId: categoryId ? categoryId : undefined,
      } : undefined,
      include: {
        state: true,
        category: true,
        city: true
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Database connection failed during SSR search:", error);
  }

  if (query && places.length >= 0) {
    // Log the search query in the background
    await prisma.searchLog.create({
      data: { query }
    }).catch(e => console.error("Failed to log search:", e));
  }

  return (
    <div className={`container ${styles.searchPage}`}>
      <h1 className={`${styles.pageTitle} text-gradient-emerald`}>The Great Indian Sanctuary Directory</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', marginTop: '-1rem', fontSize: '1.05rem' }}>
        Search across 60 curated destinations, 20 sovereign states, and 5 timeless travel themes.
      </p>
      
      <form className={styles.searchForm}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Where is your heart calling you next? (e.g. Amber Fort, Alleppey, Pangong Tso)..." 
            className={`input-field ${styles.searchInput}`}
            style={{ flex: '1 1 250px' }}
          />
          <select name="stateId" defaultValue={stateId} className={`input-field ${styles.searchInput}`} style={{ flex: '1 1 150px' }}>
            <option value="">All Sovereign States &amp; UTs</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="cityId" defaultValue={cityId} className={`input-field ${styles.searchInput}`} style={{ flex: '1 1 150px' }}>
            <option value="">All Heritage Cities</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <select name="categoryId" defaultValue={categoryId} className={`input-field ${styles.searchInput}`} style={{ flex: '1 1 150px' }}>
            <option value="">All Curated Themes</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary" style={{ flex: '0 0 auto' }}>Search Sanctuaries</button>
        </div>
      </form>

      <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Explore By Signature Theme:</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/search" className={`btn btn-outline`} style={{ borderRadius: 'var(--radius-full)', fontSize: '0.85rem', padding: '0.4rem 1.1rem' }}>
            All Collections
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/search?categoryId=${cat.id}`} className={`btn btn-outline`} style={{ borderRadius: 'var(--radius-full)', fontSize: '0.85rem', padding: '0.4rem 1.1rem' }}>
              ✨ {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className={`${styles.searchResultsHeading} text-gradient-gold`}>
          {(query || stateId || cityId || categoryId) ? `Found ${places.length} Sanctuary Destinations Matching Your Trail` : `The Complete TravelBharat Collection (${places.length} Sanctuary Destinations)`}
        </h2>
        
        <div className={styles.resultsGrid}>
          {places.map(place => {
            let images = [];
            try {
              images = place.imageUrls ? JSON.parse(place.imageUrls) : [];
            } catch (e) {
              console.error("Invalid JSON in place.imageUrls:", place.imageUrls);
            }
            const mainImage = images.length > 0 ? images[0] : null;

            return (
              <Link href={`/places/${place.id}`} key={place.id} className={styles.resultLink}>
                <div className={`card ${styles.placeCard}`} style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {mainImage && (
                    <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', overflow: 'hidden' }}>
                      <img src={mainImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', color: '#F59E0B', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                        ★ 4.9
                      </div>
                    </div>
                  )}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className={styles.placeCardMeta}>
                        📍 {place.city?.name ? `${place.city.name}, ` : ''}{place.state.name} &bull; {place.category.name}
                      </div>
                      <h3 className={styles.placeCardTitle} style={{ marginTop: '0.5rem' }}>{place.name}</h3>
                      <p className={styles.placeCardDescription}>{place.description.substring(0, 110)}...</p>
                    </div>
                    <div style={{ marginTop: '1.25rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                      Explore Destination &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
