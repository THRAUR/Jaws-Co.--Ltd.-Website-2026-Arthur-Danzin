'use client';

/**
 * Contact Page
 * Inquiry form with backend submission
 */
import { useState } from 'react';
import styles from './page.module.css';

type InquiryType = 'rfq' | 'sample' | 'oem' | 'technical';

interface FormData {
  name: string;
  email: string;
  inquiry_type: InquiryType;
  message: string;
}

const inquiryTypeLabels: Record<InquiryType, string> = {
  rfq: 'Request for Quote',
  sample: 'Product Sample',
  oem: 'Custom OEM',
  technical: 'Technical Support',
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    inquiry_type: 'rfq',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      inquiry_type: 'rfq',
      message: '',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoCol}>
        <h1>Start a Project</h1>
        <p>
          Our engineering team is ready to assist with your connector requirements.
          Reach out for quotes, samples, or custom design consultations.
        </p>

        <div className={styles.contactDetail}>
          <h4>Headquarters</h4>
          <p>
            No. 8, Lane 2, Section 2, Example Road,
            <br />
            Taipei City 110, Taiwan (R.O.C.)
          </p>
        </div>
        <div className={styles.contactDetail}>
          <h4>Email</h4>
          <p>sales@jaws.com.tw</p>
        </div>
        <div className={styles.contactDetail}>
          <h4>Phone</h4>
          <p>+886-2-1234-5678</p>
        </div>
      </div>

      <div className={styles.formCol}>
        {submitted ? (
          <div className={styles.successMessage}>
            <h2>Thank You!</h2>
            <p>
              Your inquiry has been sent successfully. Our team will contact you
              within 24 hours.
            </p>
            <button onClick={handleReset} className={styles.resetBtn}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@email.com"
              required
            />

            <label htmlFor="inquiry_type">Inquiry Type</label>
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

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project requirements..."
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
