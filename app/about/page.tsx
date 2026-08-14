import Image from 'next/image';
import styles from './about.module.css';
import { MotionDiv, MotionH1, MotionP, MotionSection } from '../components/MotionDiv';

export const metadata = {
  title: 'About Us | TravelBharat Corporate',
  description: 'Learn about TravelBharat\'s mission to provide premium corporate and leisure travel experiences across India.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <MotionH1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${styles.heroTitle} text-gradient-emerald`}
          >
            The Heritage &amp; Vision of TravelBharat
          </MotionH1>
          <MotionP 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            Pioneering luxury travel discovery and heritage preservation across India&apos;s 20 sovereign states and 60 sanctuary destinations.
          </MotionP>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.contentSection}>
        <div className={`container ${styles.missionGrid}`}>
          <MotionDiv 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.missionText}
          >
            <h2 className="text-gradient-gold">Our Royal Charter &amp; Mission</h2>
            <p>
              At TravelBharat, we believe that travel is more than just reaching a destination—it&apos;s an artistic awakening, a cultural communion, and an enduring legacy.
            </p>
            <p>
              Founded with the vision of preserving and showcasing India&apos;s architectural wonders, wildlife sanctuaries, and timeless spiritual ghats, we curate bespoke expeditions tailored to the highest global standards of luxury and authenticity.
            </p>
          </MotionDiv>
          <MotionDiv 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.missionImage}
          >
            <Image 
              src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2070" 
              alt="Our Mission" 
              fill 
              style={{ objectFit: 'cover' }} 
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </MotionDiv>
        </div>
      </section>

      {/* Stats Section */}
      <MotionSection 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={styles.statsSection}
      >
        <div className={`container ${styles.statsGrid}`}>
          <div className={styles.statItem}>
            <h3 className="text-gradient-emerald">20+</h3>
            <p>Sovereign States &amp; UTs</p>
          </div>
          <div className={styles.statItem}>
            <h3 className="text-gradient-sapphire">60+</h3>
            <p>Sanctuary Destinations</p>
          </div>
          <div className={styles.statItem}>
            <h3 className="text-gradient-coral">15k+</h3>
            <p>Elite Explorers</p>
          </div>
          <div className={styles.statItem}>
            <h3 className="text-gradient-gold">24/7</h3>
            <p>AI &amp; Private Concierge</p>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
