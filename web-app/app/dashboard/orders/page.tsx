/**
 * Orders Page
 * View order history and status
 */
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from '../page.module.css';

export const metadata = {
  title: 'My Orders | Jaws Co., Ltd.',
};

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fff3e0', text: '#ef6c00' },
  confirmed: { bg: '#e3f2fd', text: '#1976d2' },
  processing: { bg: '#e8f5e9', text: '#2e7d32' },
  shipped: { bg: '#f3e5f5', text: '#7b1fa2' },
  delivered: { bg: '#e8f5e9', text: '#1b5e20' },
  cancelled: { bg: '#ffebee', text: '#c62828' },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Orders</h1>
        <p>Track your order history and status</p>
      </header>

      {orders && orders.length > 0 ? (
        <div className={styles.section} style={{ padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Order #</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Items</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Total</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusStyle = statusColors[order.status] || statusColors.pending;
                const items = order.items as { product_name: string; quantity: number }[];

                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {order.order_number}
                    </td>
                    <td style={{ padding: '1rem', color: '#666' }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {order.total_amount
                        ? `${order.currency} ${order.total_amount.toLocaleString()}`
                        : 'TBD'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.section}>
          <div className={styles.emptyState}>
            <p>You don&apos;t have any orders yet.</p>
            <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '8px' }}>
              Orders will appear here once you&apos;ve placed them through our sales team.
            </p>
            <Link href="/quote" className={styles.ctaBtn} style={{ marginTop: '1rem' }}>
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
