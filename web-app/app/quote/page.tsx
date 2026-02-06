'use client';

/**
 * Get a Quote Page
 * Focused RFQ (Request for Quote) form for product inquiries
 */
import { useState } from 'react';
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
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
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
        <h1>Request a Quote</h1>
        <p>
          Get competitive pricing on our precision connectors. Fill out the form below
          and our sales team will respond within 24 business hours.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>1</div>
            <div>
              <h3>Submit Request</h3>
              <p>Provide your product requirements and quantities</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>2</div>
            <div>
              <h3>Receive Quote</h3>
              <p>Our team will prepare competitive pricing within 24 hours</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>3</div>
            <div>
              <h3>Place Order</h3>
              <p>Confirm your order and we'll begin production</p>
            </div>
          </div>
        </div>

        <div className={styles.formWrapper}>
          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>&#10003;</div>
              <h2>Quote Request Received!</h2>
              <p>
                Thank you for your interest. Our sales team will review your requirements
                and send you a detailed quote within 24 business hours.
              </p>
              <button onClick={handleReset} className={styles.resetBtn}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="name">Full Name <span>*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="email">Email Address <span>*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="product_details">Product / Part Numbers <span>*</span></label>
                <textarea
                  id="product_details"
                  name="product_details"
                  rows={3}
                  value={formData.product_details}
                  onChange={handleChange}
                  placeholder="List the product names or part numbers you're interested in..."
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="quantity">Estimated Quantity <span>*</span></label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 1,000 units or 5,000-10,000 units"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="message">Additional Requirements</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any special requirements, certifications needed, delivery timeline, etc."
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
