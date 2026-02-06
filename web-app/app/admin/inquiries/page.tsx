/**
 * Admin Inquiries Page
 * View and manage customer inquiries
 */
import { createClient } from '@/lib/supabase/server';
import { InquiryList } from './InquiryList';
import styles from './page.module.css';

export default async function AdminInquiries() {
  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  // Count unread
  const unreadCount = inquiries?.filter((i) => !i.is_read).length || 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inquiries</h1>
          <p className={styles.subtitle}>
            {unreadCount > 0 ? (
              <>
                <span className={styles.unreadBadge}>{unreadCount} new</span> inquiry{unreadCount !== 1 ? 'ies' : 'y'}
              </>
            ) : (
              'Customer messages and requests'
            )}
          </p>
        </div>
      </header>

      {error ? (
        <div className={styles.error}>Error loading inquiries: {error.message}</div>
      ) : (
        <InquiryList initialInquiries={inquiries || []} />
      )}
    </div>
  );
}
