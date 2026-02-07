'use client';

/**
 * Inquiry List Component
 * Displays and manages customer inquiries
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import type { Inquiry } from '@/types/database';
import styles from './page.module.css';

interface InquiryListProps {
  initialInquiries: Inquiry[];
}

export function InquiryList({ initialInquiries }: InquiryListProps) {
  const router = useRouter();
  const t = useTranslation();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    rfq: 'RFQ',
    sample: t('dashboard.type.sample'),
    oem: 'OEM',
    technical: t('dashboard.type.technical'),
  };

  const getFormSource = (inquiryType: string): { label: string; color: string } => {
    if (inquiryType === 'rfq') {
      return { label: t('dashboard.source.quoteForm'), color: '#C5A059' }; // gold
    }
    return { label: t('dashboard.source.contactForm'), color: '#2563eb' }; // blue
  };

  const handleToggle = async (inquiry: Inquiry) => {
    // Toggle expansion
    if (expandedId === inquiry.id) {
      setExpandedId(null);
    } else {
      setExpandedId(inquiry.id);

      // Mark as read if unread
      if (!inquiry.is_read) {
        const supabase = createClient();
        await supabase
          .from('inquiries')
          .update({ is_read: true })
          .eq('id', inquiry.id);

        setInquiries(
          inquiries.map((i) =>
            i.id === inquiry.id ? { ...i, is_read: true } : i
          )
        );
      }
    }
  };

  const handleMarkUnread = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from('inquiries')
      .update({ is_read: false })
      .eq('id', id);

    setInquiries(
      inquiries.map((i) =>
        i.id === id ? { ...i, is_read: false } : i
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.inquiries.confirmDelete'))) return;

    const supabase = createClient();
    const { error } = await supabase.from('inquiries').delete().eq('id', id);

    if (error) {
      alert(`Error deleting inquiry: ${error.message}`);
    } else {
      setInquiries(inquiries.filter((i) => i.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  if (inquiries.length === 0) {
    return (
      <div className={styles.empty}>
        {t('admin.inquiries.empty')}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className={`${styles.card} ${!inquiry.is_read ? styles.unread : ''}`}
        >
          <div
            className={styles.cardHeader}
            onClick={() => handleToggle(inquiry)}
          >
            <div className={styles.cardInfo}>
              <div className={styles.name}>
                {!inquiry.is_read && <span className={styles.newDot} />}
                {inquiry.name}
              </div>
              <div className={styles.email}>{inquiry.email}</div>
            </div>
            <div className={styles.meta}>
              <div className={styles.date}>
                {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <span
                style={{
                  background: getFormSource(inquiry.inquiry_type).color,
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  marginRight: '6px',
                }}
              >
                {getFormSource(inquiry.inquiry_type).label}
              </span>
              <span className={`${styles.typeBadge} ${styles[inquiry.inquiry_type]}`}>
                {typeLabels[inquiry.inquiry_type] || inquiry.inquiry_type}
              </span>
            </div>
          </div>

          {expandedId === inquiry.id && (
            <div className={styles.cardBody}>
              <div className={styles.message}>{inquiry.message}</div>
              <div className={styles.cardActions}>
                <a
                  href={`mailto:${inquiry.email}?subject=Re: ${typeLabels[inquiry.inquiry_type]} Inquiry - Jaws Co., Ltd.`}
                  className={styles.replyBtn}
                >
                  {t('admin.inquiries.replyViaEmail')}
                </a>
                {inquiry.is_read && (
                  <button
                    onClick={() => handleMarkUnread(inquiry.id)}
                    className={styles.markBtn}
                  >
                    {t('admin.inquiries.markUnread')}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(inquiry.id)}
                  className={styles.deleteBtn}
                >
                  {t('admin.inquiries.delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
