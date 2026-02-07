'use client';

/**
 * Get a Quote Page
 * Focused RFQ (Request for Quote) form for product inquiries
 */
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  product_details: string;
  quantity: string;
  message: string;
}

export default function QuotePage() {
  const t = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_details: '',
    quantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Compose message with all quote details
    const fullMessage = `
QUOTE REQUEST

Company: ${formData.company || 'N/A'}
Phone: ${formData.phone || 'N/A'}

Product/Part Numbers:
${formData.product_details}

Quantity: ${formData.quantity}

Additional Notes:
${formData.message || 'None'}
    `.trim();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          inquiry_type: 'rfq',
          message: fullMessage,
        }),
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
      company: '',
      email: '',
      phone: '',
      product_details: '',
      quantity: '',
      message: '',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('quote.title')}</h1>
        <p>{t('quote.description')}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>1</div>
            <div>
              <h3>{t('quote.steps.submit')}</h3>
              <p>{t('quote.steps.submitDesc')}</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>2</div>
            <div>
              <h3>{t('quote.steps.receive')}</h3>
              <p>{t('quote.steps.receiveDesc')}</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>3</div>
            <div>
              <h3>{t('quote.steps.order')}</h3>
              <p>{t('quote.steps.orderDesc')}</p>
            </div>
          </div>
        </div>

        <div className={styles.formWrapper}>
          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>&#10003;</div>
              <h2>{t('quote.success.title')}</h2>
              <p>{t('quote.success.message')}</p>
              <button onClick={handleReset} className={styles.resetBtn}>
                {t('quote.success.reset')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">{t('quote.form.fullName')} <span>{t('quote.required')}</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('quote.form.fullNamePlaceholder')}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="company">{t('quote.form.company')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('quote.form.companyPlaceholder')}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="email">{t('quote.form.email')} <span>{t('quote.required')}</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('quote.form.emailPlaceholder')}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">{t('quote.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('quote.form.phonePlaceholder')}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="product_details">{t('quote.form.productDetails')} <span>{t('quote.required')}</span></label>
                <textarea
                  id="product_details"
                  name="product_details"
                  rows={3}
                  value={formData.product_details}
                  onChange={handleChange}
                  placeholder={t('quote.form.productDetailsPlaceholder')}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="quantity">{t('quote.form.quantity')} <span>{t('quote.required')}</span></label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder={t('quote.form.quantityPlaceholder')}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="message">{t('quote.form.additionalRequirements')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('quote.form.additionalRequirementsPlaceholder')}
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? t('quote.form.submitting') : t('quote.form.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
