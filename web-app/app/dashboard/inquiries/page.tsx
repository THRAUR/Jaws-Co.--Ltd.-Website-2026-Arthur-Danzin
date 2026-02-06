/**
 * My Inquiries Page
 * View all submitted inquiries and their status
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from '../page.module.css';

export const metadata = {
  title: 'My Inquiries | Jaws Co., Ltd.',
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('email', user.email)
    .order('created_at', { ascending: false });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      rfq: 'Quote Request',
      sample: 'Sample Request',
      oem: 'OEM Inquiry',
      technical: 'Technical Support',
    };
    return labels[type] || type;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Inquiries</h1>
        <p>Track the status of your submitted inquiries</p>
      </header>

      {inquiries && inquiries.length > 0 ? (
        <div className={styles.section} style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Message</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        background: 'var(--black)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {getTypeLabel(inquiry.inquiry_type)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', maxWidth: '400px' }}>
                    <p style={{ margin: 0, lineHeight: 1.5 }}>
                      {inquiry.message.slice(0, 150)}
                      {inquiry.message.length > 150 ? '...' : ''}
                    </p>
                  </td>
                  <td style={{ padding: '1rem', color: '#666', whiteSpace: 'nowrap' }}>
                    {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`${styles.inquiryStatus} ${
                        inquiry.is_read ? styles.read : styles.unread
                      }`}
                    >
                      {inquiry.is_read ? 'Reviewed' : 'Pending Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.emptyState}>
            <p>You haven&apos;t submitted any inquiries yet.</p>
            <Link href="/quote" className={styles.ctaBtn}>
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
