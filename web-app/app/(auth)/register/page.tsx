'use client';

/**
 * Register Page
 * New client registration with company details
 */
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const t = useTranslation();
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
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError(t('auth.passwordTooShort'));
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
      setError(err instanceof Error ? err.message : t('auth.error'));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>JAWS <span>CO.</span></div>
            <h1>{t('auth.registrationSuccess')}</h1>
          </div>
          <div className={styles.success}>
            <p>{t('auth.checkEmail')}</p>
            <p style={{ marginTop: '12px' }}>
              <Link href="/login">{t('auth.returnToLogin')}</Link>
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
          <h1>{t('auth.createAccount')}</h1>
          <p>{t('auth.joinUs')}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="full_name" className={styles.label}>
                {t('auth.fullName')} <span>*</span>
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.fullNamePlaceholder')}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company_name" className={styles.label}>
                {t('auth.companyName')}
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.companyPlaceholder')}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="job_title" className={styles.label}>
                {t('auth.jobTitle')}
              </label>
              <input
                id="job_title"
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.jobTitlePlaceholder')}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>
                {t('auth.phoneNumber')}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.phonePlaceholder')}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="country" className={styles.label}>
              {t('auth.countryRegion')}
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">{t('auth.selectCountry')}</option>
              <option value="US">{t('countries.US')}</option>
              <option value="CN">{t('countries.CN')}</option>
              <option value="TW">{t('countries.TW')}</option>
              <option value="JP">{t('countries.JP')}</option>
              <option value="KR">{t('countries.KR')}</option>
              <option value="DE">{t('countries.DE')}</option>
              <option value="GB">{t('countries.GB')}</option>
              <option value="FR">{t('countries.FR')}</option>
              <option value="CA">{t('countries.CA')}</option>
              <option value="AU">{t('countries.AU')}</option>
              <option value="SG">{t('countries.SG')}</option>
              <option value="MY">{t('countries.MY')}</option>
              <option value="TH">{t('countries.TH')}</option>
              <option value="VN">{t('countries.VN')}</option>
              <option value="IN">{t('countries.IN')}</option>
              <option value="MX">{t('countries.MX')}</option>
              <option value="BR">{t('countries.BR')}</option>
              <option value="OTHER">{t('countries.OTHER')}</option>
            </select>
          </div>

          <div className={styles.divider}>{t('auth.accountCredentials')}</div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              {t('auth.workEmail')} <span>*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                {t('auth.password')} <span>*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.minCharacters')}
                required
                autoComplete="new-password"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                {t('auth.confirmPassword')} <span>*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? t('auth.creatingAccount') : t('auth.createAccountBtn')}
          </button>
        </form>

        <div className={styles.footer}>
          {t('auth.hasAccount')}{' '}
          <Link href="/login">{t('auth.signInLink')}</Link>
        </div>
      </div>
    </div>
  );
}
