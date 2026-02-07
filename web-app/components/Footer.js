'use client';

import { useTranslation } from '@/lib/i18n/context';
import styles from './Footer.module.css';

export default function Footer() {
    const t = useTranslation();

    return (
        <footer className={styles.footer}>
            <div>
                <span className={styles.brand}>{t('footer.brand')}</span>
                <p className={styles.sub}>{t('footer.location')}</p>
            </div>
            <div className={styles.right}>
                &copy; {new Date().getFullYear()} {t('footer.copyright')}<br />
                {t('footer.isoCertified')}
            </div>
        </footer>
    );
}
