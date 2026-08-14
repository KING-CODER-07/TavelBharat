import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';
import AdminAnalytics from '../components/AdminAnalytics';

export default async function AdminDashboard() {
  const [placesCount, statesCount, categoriesCount, inquiriesCount, recentInquiries, recentBookings] = await Promise.all([
    prisma.place.count(),
    prisma.state.count(),
    prisma.category.count(),
    prisma.inquiry.count(),
    prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.booking.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 10,
      include: { user: true, place: true }
    }),
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <div className={styles.grid}>
        <div className={`card ${styles.statCard}`}>
          <h3 className={styles.statLabel}>Total Places</h3>
          <div className={styles.statValue}>{placesCount}</div>
        </div>
        
        <div className={`card ${styles.statCard}`}>
          <h3 className={styles.statLabel}>Total States</h3>
          <div className={styles.statValue}>{statesCount}</div>
        </div>

        <div className={`card ${styles.statCard}`}>
          <h3 className={styles.statLabel}>Categories</h3>
          <div className={styles.statValue}>{categoriesCount}</div>
        </div>
        <div className={`card ${styles.statCard}`}>
          <h3 className={styles.statLabel}>Inquiries</h3>
          <div className={styles.statValue}>{inquiriesCount}</div>
        </div>
      </div>

      <div className={styles.section}>
        <AdminAnalytics />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Bookings</h2>
        <div className={`card ${styles.activityCard}`}>
          {recentBookings.length === 0 ? (
            <p className={styles.textMuted}>No bookings yet.</p>
          ) : (
            <table className="adminTable">
              <thead>
                <tr className="adminTableHeaderRow">
                  <th className="adminTableHeaderCell">Date</th>
                  <th className="adminTableHeaderCell">User</th>
                  <th className="adminTableHeaderCell">Place</th>
                  <th className="adminTableHeaderCell">Type</th>
                  <th className="adminTableHeaderCell">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="adminTableRow">
                    <td className="adminTableCell">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="adminTableCell">
                      <div className="adminInquiryName">{b.user.name}</div>
                      <div className="adminInquiryEmail">{b.user.email}</div>
                    </td>
                    <td className="adminTableCell">{b.place.name}</td>
                    <td className="adminTableCell">
                      <span className="adminInquiryTypeBadge">{b.type}</span>
                    </td>
                    <td className="adminTableCell">
                      <span className={`adminStatusBadge ${b.status === 'Pending' ? 'pending' : 'resolved'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Inquiries</h2>
        <div className={`card ${styles.activityCard}`}>
          {recentInquiries.length === 0 ? (
            <p className={styles.textMuted}>No inquiries yet.</p>
          ) : (
            <table className="adminTable">
              <thead>
                <tr className="adminTableHeaderRow">
                  <th className="adminTableHeaderCell">Date</th>
                  <th className="adminTableHeaderCell">Name</th>
                  <th className="adminTableHeaderCell">Type</th>
                  <th className="adminTableHeaderCell">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="adminTableRow">
                    <td className="adminTableCell">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="adminTableCell">
                      <div className="adminInquiryName">{inq.name}</div>
                      <div className="adminInquiryEmail">{inq.email}</div>
                    </td>
                    <td className="adminTableCell">
                      <span className="adminInquiryTypeBadge">{inq.inquiryType}</span>
                    </td>
                    <td className="adminTableCell">
                      <span className={`adminStatusBadge ${inq.status === 'Pending' ? 'pending' : 'resolved'}`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
