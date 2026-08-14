'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import GlobalSearchBar from './GlobalSearchBar';
import ThemeToggle from './ThemeToggle';
import AuthNav from './AuthNav';
import type { SessionPayload } from '@/lib/auth';

// Clean SVG Vector Icons for Menu
const Icons = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  explore: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
  ),
  states: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  ),
  themes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
  ),
  itineraries: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      <line x1="12" y1="11" x2="12" y2="17"></line>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  ),
  students: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  ),
  partner: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  menu: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  )
};

// All 20 States & UTs in TravelBharat
const ALL_STATES = [
  { name: 'Rajasthan', id: 'rajasthan', icon: '🏰' },
  { name: 'Kerala', id: 'kerala', icon: '🌴' },
  { name: 'Ladakh', id: 'ladakh', icon: '🏔️' },
  { name: 'Goa', id: 'goa', icon: '🏖️' },
  { name: 'Uttarakhand', id: 'uttarakhand', icon: '🌲' },
  { name: 'Himachal Pradesh', id: 'himachal', icon: '❄️' },
  { name: 'Uttar Pradesh', id: 'up', icon: '🕌' },
  { name: 'Tamil Nadu', id: 'tamil-nadu', icon: '🛕' },
  { name: 'Karnataka', id: 'karnataka', icon: '🐘' },
  { name: 'Delhi', id: 'delhi', icon: '🏛️' },
  { name: 'Maharashtra', id: 'maharashtra', icon: '🌆' },
  { name: 'Gujarat', id: 'gujarat', icon: '🦁' },
  { name: 'West Bengal', id: 'west-bengal', icon: '🐅' },
  { name: 'Sikkim', id: 'sikkim', icon: '⛰️' },
  { name: 'Meghalaya', id: 'meghalaya', icon: '🌧️' },
  { name: 'Assam', id: 'assam', icon: '🦏' },
  { name: 'Andhra Pradesh', id: 'andhra-pradesh', icon: '🌅' },
  { name: 'Telangana', id: 'telangana', icon: '💎' },
  { name: 'Punjab', id: 'punjab', icon: '🌾' },
  { name: 'Odisha', id: 'odisha', icon: '🌊' }
];

// All 5 Themes in TravelBharat
const ALL_THEMES = [
  { name: 'Heritage & History', id: '660e84000000000000000002', count: 15, icon: '🕌', desc: 'Forts, Palaces, UNESCO World Heritage Monuments' },
  { name: 'Nature & Wildlife', id: '660e84000000000000000003', count: 12, icon: '🌿', desc: 'National Parks, Hill Stations & Pristine Lakes' },
  { name: 'Spiritual & Pilgrim', id: '660e84000000000000000001', count: 14, icon: '🕉️', desc: 'Sacred Temples, Ghats & Meditation Sanctuaries' },
  { name: 'Adventure Sports', id: '660e84000000000000000004', count: 10, icon: '🧗', desc: 'Trekking, River Rafting, Scuba & Paragliding' },
  { name: 'Cultural Traditions', id: '660e84000000000000000005', count: 9, icon: '🎭', desc: 'Folk Festivals, Culinary Trails & Crafts' }
];

export default function Navbar({ session }: { session: SessionPayload | null }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll listener for dynamic island elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.navContainer}>
          {/* Logo + India Live Pulse Status Badge */}
          <Link href="/" className={styles.logoGroup} onClick={() => setMenuOpen(false)}>
            <span className={styles.logo}>TravelBharat</span>
            <div className={styles.pulseBadge} title="Best time to visit India: October to March">
              <span className={styles.pulseDot} />
              <span>LIVE: Oct–Mar Peak Season</span>
            </div>
          </Link>

          {/* Center Search Container for Menu Style Minimalist Bar */}
          <div className={styles.centerSearchContainer}>
            <GlobalSearchBar />
            <span className={styles.shortcutBadge} title="Keyboard Shortcut">⌘K</span>
          </div>

          {/* Right Utilities & HERO MENU STYLE BUTTON */}
          <div className={styles.navActions}>
            <ThemeToggle />
            <AuthNav session={session} />

            <Link href="/admin" className={`${styles.partnerBtn} ${styles.partnerBtnDesktop}`}>
              {Icons.partner}
              <span>Partner Portal</span>
            </Link>

            {/* HERO EXECUTIVE "MENU STYLE" BUTTON */}
            <button
              type="button"
              className={`${styles.menuStyleBtn} ${menuOpen ? styles.menuStyleBtnActive : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close Master Menu' : 'Open Master Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <>
                  <span>✕</span>
                  <span>Close</span>
                </>
              ) : (
                <>
                  {Icons.menu}
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* GRAND 3-COLUMN "MENU STYLE" EXECUTIVE MODAL */}
      {menuOpen && (
        <div className={styles.menuStyleOverlay} onClick={() => setMenuOpen(false)} role="dialog" aria-modal="true">
          <div className={styles.menuStyleModal} onClick={(e) => e.stopPropagation()}>
            {/* Header of Menu Modal */}
            <div className={styles.menuStyleHeader}>
              <div className={styles.menuStyleTitle}>
                <span>✨ TravelBharat Master Menu</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  • 60 Destinations • 20 States • 5 Themes
                </span>
              </div>
              <button
                type="button"
                className={styles.closeMenuBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* 3-Column Luxury Directory Grid */}
            <div className={styles.menuColumns}>
              {/* Column 1: Primary Navigation */}
              <div className={styles.menuColumn}>
                <div className={styles.menuColumnTitle}>
                  <span>🧭 Navigation &amp; Discovery</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <Link
                    href="/"
                    className={`${styles.menuLinkItem} ${isActive('/') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.home}
                      <span>Home Overview</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/search"
                    className={`${styles.menuLinkItem} ${isActive('/search') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.explore}
                      <span>Explore 60 Destinations</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/states"
                    className={`${styles.menuLinkItem} ${isActive('/states') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.states}
                      <span>State &amp; UT Explorer (20)</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/categories"
                    className={`${styles.menuLinkItem} ${isActive('/categories') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.themes}
                      <span>Travel Themes Catalog (5)</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/itineraries"
                    className={`${styles.menuLinkItem} ${isActive('/itineraries') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.itineraries}
                      <span>Curated Signature Trails</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                  <Link
                    href="/students"
                    className={`${styles.menuLinkItem} ${isActive('/students') ? styles.menuLinkItemActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {Icons.students}
                      <span>Student Hub &amp; Academic Tours</span>
                    </span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Column 2: 5 Travel Theme Collections */}
              <div className={styles.menuColumn}>
                <div className={styles.menuColumnTitle}>
                  <span>🎨 Travel Theme Collections</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {ALL_THEMES.map((theme) => (
                    <Link
                      key={theme.id}
                      href={`/search?categoryId=${theme.id}`}
                      className={styles.themeCard}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span style={{ fontSize: '1.45rem' }}>{theme.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{theme.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                            {theme.count} places
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {theme.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 3: All 20 States & Union Territories */}
              <div className={styles.menuColumn}>
                <div className={styles.menuColumnTitle}>
                  <span>🗺️ All 20 States &amp; UTs Directory</span>
                </div>
                <div className={styles.stateTagCloud}>
                  {ALL_STATES.map((state) => (
                    <Link
                      key={state.id}
                      href="/states"
                      className={styles.stateTag}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{state.icon}</span>
                      <span>{state.name}</span>
                    </Link>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', background: 'rgba(59, 130, 246, 0.12)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3B82F6', marginBottom: '2px' }}>
                    ✈️ Custom India Trip Planner
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Need a personalized itinerary for your family, group, or honeymoon? Try our instant booking assistant on any destination page!
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Bar of Menu Style Modal */}
            <div className={styles.menuStyleFooter}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, color: '#10B981', fontSize: '0.88rem' }}>
                <span>💬 24/7 AI Travel Concierge Active</span>
                <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  — Click the floating chat icon bottom-right for instant travel recommendations!
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', fontWeight: 600 }}>
                <Link href="/about" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                  About TravelBharat
                </Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                  Contact &amp; Support
                </Link>
                <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ color: '#3B82F6', textDecoration: 'none' }}>
                  Partner Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Thumb Dock for Mobile/Tablet (< 1080px) */}
      <nav className={styles.mobileBottomDock} aria-label="Mobile Bottom Navigation">
        <Link href="/" className={`${styles.dockItem} ${isActive('/') ? styles.dockItemActive : ''}`}>
          {Icons.home}
          <span>Home</span>
        </Link>
        <Link href="/search" className={`${styles.dockItem} ${isActive('/search') ? styles.dockItemActive : ''}`}>
          {Icons.explore}
          <span>Explore</span>
        </Link>
        <Link href="/states" className={`${styles.dockItem} ${isActive('/states') ? styles.dockItemActive : ''}`}>
          {Icons.states}
          <span>States</span>
        </Link>
        <Link href="/itineraries" className={`${styles.dockItem} ${isActive('/itineraries') ? styles.dockItemActive : ''}`}>
          {Icons.itineraries}
          <span>Trails</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={`${styles.dockItem} ${menuOpen ? styles.dockItemActive : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          title="Toggle Master Menu"
        >
          {Icons.menu}
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
}
