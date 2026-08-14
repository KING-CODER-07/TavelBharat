import { getSession } from '@/lib/auth';
import Navbar from './components/Navbar';
import TravelAssistant from './components/TravelAssistant';
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: {
    template: "%s | TravelBharat",
    default: "TravelBharat - Explore India State by State",
  },
  description: "A centralized tourism information web platform that provides state-wise and city-wise details of tourist destinations across India.",
  openGraph: {
    title: "TravelBharat",
    description: "Premium corporate and leisure travel experiences across the incredible landscape of India.",
    url: "https://travelbharat.com",
    siteName: "TravelBharat",
    images: [
      {
        url: "/images/destinations/taj-mahal.jpg", // fallback
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelBharat",
    description: "Premium corporate and leisure travel experiences across India.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body suppressHydrationWarning>
        {/* Live Changing Chromatic Aurora & Mesh Orb Background */}
        <div className="bg-blobs" aria-hidden="true">
          <div className="aurora-beam"></div>
          <div className="blob-1"></div>
          <div className="blob-2"></div>
          <div className="blob-3"></div>
          <div className="blob-4"></div>
        </div>

        <Navbar session={session} />

        <main className="main-content">
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={`container ${styles.footerGrid}`}>
            <div className={styles.footerCol}>
              <h3 className={`${styles.footerLogo} text-gradient-emerald`}><span className={styles.highlight}>Travel</span>Bharat</h3>
              <p className={styles.footerDesc} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>India&apos;s sovereign authority in bespoke luxury expeditions, palace sanctuaries, and corporate heritage retreats.</p>
            </div>
            <div className={styles.footerCol}>
              <h4 className={`${styles.footerHeading} text-gradient-gold`}>The Sovereign Houses</h4>
              <Link href="/about" className={styles.footerLink}>About TravelBharat</Link>
              <Link href="/careers" className={styles.footerLink}>Royal Fellowships &amp; Careers</Link>
              <Link href="/contact" className={styles.footerLink}>Private Concierge</Link>
            </div>
            <div className={styles.footerCol}>
              <h4 className={`${styles.footerHeading} text-gradient-sapphire`}>Charter &amp; Governance</h4>
              <Link href="/privacy" className={styles.footerLink}>Sanctuary Privacy Policy</Link>
              <Link href="/terms" className={styles.footerLink}>Expedition Terms &amp; Charter</Link>
              <Link href="/admin" className={styles.footerLink}>Executive Portal</Link>
            </div>
            <div className={styles.footerCol}>
              <h4 className={`${styles.footerHeading} text-gradient-coral`}>The Royal Dispatch</h4>
              <p className={styles.footerDesc} style={{ color: 'var(--text-secondary)' }}>Receive confidential travel briefs, newly opened royal retreats, and seasonal cultural invitations.</p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Your Executive Email" className={`input-field ${styles.newsletterInput}`} required />
                <button type="button" className={`btn btn-secondary ${styles.newsletterBtn}`}>Request Dispatch</button>
              </form>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} TravelBharat Private Luxury Expeditions &amp; Corporate Retreats. Sovereign Rights Reserved.</p>
          </div>
        </footer>

        <TravelAssistant />
      </body>
    </html>
  );
}
