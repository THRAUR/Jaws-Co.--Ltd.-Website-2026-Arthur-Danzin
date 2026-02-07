'use client';

/**
 * Contact Page
 * Inquiry form with backend submission
 */
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

type InquiryType = 'sample' | 'oem' | 'technical';

interface FormData {
  name: string;
  email: string;
  inquiry_type: InquiryType;
  message: string;
}

export default function ContactPage() {
  const t = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    inquiry_type: 'technical',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inquiryTypeLabels: Record<InquiryType, string> = {
    sample: t('contact.form.sample'),
    oem: t('contact.form.oem'),
    technical: t('contact.form.technical'),
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      inquiry_type: 'technical',
      message: '',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoCol}>
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.description')}</p>

        <div className={styles.contactDetail}>
          <h4>{t('contact.headquarters')}</h4>
          <p>{t('contact.address')}</p>
        </div>
        <div className={styles.contactDetail}>
          <h4>{t('contact.email')}</h4>
          <p>sales@jaws.com.tw</p>
        </div>
        <div className={styles.contactDetail}>
          <h4>{t('contact.phone')}</h4>
          <p>+886-2-1234-5678</p>
        </div>
      </div>

      <div className={styles.formCol}>
        {submitted ? (
          <div className={styles.successMessage}>
            <h2>{t('contact.success.title')}</h2>
            <p>{t('contact.success.message')}</p>
            <button onClick={handleReset} className={styles.resetBtn}>
              {t('contact.success.reset')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <label htmlFor="name">{t('contact.form.name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('contact.form.namePlaceholder')}
              required
            />

            <label htmlFor="email">{t('contact.form.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('contact.form.emailPlaceholder')}
              required
            />

            <label htmlFor="inquiry_type">{t('contact.form.inquiryType')}</label>
            <select
              id="inquiry_type"
              name="inquiry_type"
              value={formData.inquiry_type}
              onChange={handleChange}
            >
              {Object.entries(inquiryTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <label htmlFor="message">{t('contact.form.message')}</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder={t('contact.form.messagePlaceholder')}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
