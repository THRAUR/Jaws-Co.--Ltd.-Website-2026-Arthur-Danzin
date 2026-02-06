'use client';

/**
 * Register Page
 * New client registration with company details
 */
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company_name: '',
    job_title: '',
    phone: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            company_name: formData.company_name,
            job_title: formData.job_title,
            phone: formData.phone,
            country: formData.country,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>JAWS <span>CO.</span></div>
            <h1>Registration Successful!</h1>
          </div>
          <div className={styles.success}>
            <p>Please check your email to verify your account.</p>
            <p style={{ marginTop: '12px' }}>
              <Link href="/login">Return to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ maxWidth: '520px' }}>
        <div className={styles.header}>
          <div className={styles.logo}>JAWS <span>CO.</span></div>
          <h1>Create Account</h1>
          <p>Join us to manage your orders and inquiries</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="full_name" className={styles.label}>
                Full Name <span>*</span>
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={styles.input}
                placeholder="John Smith"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company_name" className={styles.label}>
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={styles.input}
                placeholder="Your Company"
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="job_title" className={styles.label}>
                Job Title
              </label>
              <input
                id="job_title"
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={styles.input}
                placeholder="Purchasing Manager"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="country" className={styles.label}>
              Country / Region
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">Select your country</option>
              <option value="US">United States</option>
              <option value="CN">China</option>
              <option value="TW">Taiwan</option>
              <option value="JP">Japan</option>
              <option value="KR">South Korea</option>
              <option value="DE">Germany</option>
              <option value="GB">United Kingdom</option>
              <option value="FR">France</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="SG">Singapore</option>
              <option value="MY">Malaysia</option>
              <option value="TH">Thailand</option>
              <option value="VN">Vietnam</option>
              <option value="IN">India</option>
              <option value="MX">Mexico</option>
              <option value="BR">Brazil</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.divider}>Account Credentials</div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Work Email <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password <span>*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password <span>*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
