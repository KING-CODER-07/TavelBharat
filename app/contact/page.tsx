import styles from './contact.module.css';
import ContactForm from './ContactForm';
import { Suspense } from 'react';
import { MotionDiv, MotionSection } from '../components/MotionDiv';

export const metadata = {
  title: 'Contact Us | TravelBharat Corporate',
  description: 'Get in touch with TravelBharat for premium corporate and leisure travel bookings.',
};

export default function ContactPage() {
  return (
    <MotionSection 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.contactSection}
    >
      <div className={`container ${styles.contactGrid}`}>
        
        {/* Contact Info */}
        <MotionDiv 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={styles.infoCard}
        >
          <h2 className="text-gradient-gold">Royal Concierge &amp; Headquarters</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Our travel historians, private flight advisors, and corporate planners are at your disposal.
          </p>
          
          <div className={styles.infoItem}>
            <h4>Corporate Headquarters</h4>
            <p>Mahamanapuri Colony, Varanasi, 221005<br />Uttar Pradesh<br />India</p>
          </div>

          <div className={styles.infoItem}>
            <h4>Direct Concierge</h4>
            <p>Phone: +91 8881951223, 7067396671<br />Email: corporate@travelbharat.in</p>
          </div>

          <div className={styles.infoItem}>
            <h4>Concierge Hours</h4>
            <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)<br />Saturday: 10:00 AM - 2:00 PM (IST)<br />Sunday: Closed</p>
          </div>
        </MotionDiv>

        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading form...</div>}>
          <MotionDiv 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <ContactForm />
          </MotionDiv>
        </Suspense>

      </div>
    </MotionSection>
  );
}
