'use client';

/**
 * Profile Page
 * View and edit user profile information
 */
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  job_title: string | null;
  phone: string | null;
  country: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    job_title: '',
    phone: '',
    country: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || '',
            company_name: data.company_name || '',
            job_title: data.job_title || '',
            phone: data.phone || '',
            country: data.country || '',
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: formData.full_name,
        company_name: formData.company_name || null,
        job_title: formData.job_title || null,
        phone: formData.phone || null,
        country: formData.country || null,
      })
      .eq('id', profile?.id);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>My Profile</h1>
        <p>Manage your personal information</p>
      </header>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              value={profile?.email || ''}
              className={styles.input}
              disabled
            />
            <p className={styles.hint}>Email cannot be changed</p>
          </div>

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
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company_name" className={styles.label}>Company Name</label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="job_title" className={styles.label}>Job Title</label>
              <input
                id="job_title"
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.label}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="country" className={styles.label}>Country / Region</label>
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

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
