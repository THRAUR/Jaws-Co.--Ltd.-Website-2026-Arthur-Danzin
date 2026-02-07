'use client';

import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

export default function AboutPage() {
    const t = useTranslation();

    return (
        <div className={styles.container}>
            <section className={styles.storyHero}>
                <h1>{t('about.heroTitle')}</h1>
                <p>{t('about.heroDescription')}</p>
            </section>

            <div className={styles.imageBlock}>
                Factory Floor Image / Assemblers working
            </div>

            <section className={styles.statsGrid}>
                <div className={styles.stat}>
                    <h2>{t('about.stats.years')}</h2>
                    <p>{t('about.stats.yearsLabel')}</p>
                </div>
                <div className={styles.stat}>
                    <h2>{t('about.stats.taiwan')}</h2>
                    <p>{t('about.stats.taiwanLabel')}</p>
                </div>
                <div className={styles.stat}>
                    <h2>{t('about.stats.iso')}</h2>
                    <p>{t('about.stats.isoLabel')}</p>
                </div>
            </section>

            <section className={styles.timeline}>
                <h2>{t('about.timeline.title')}</h2>
                <div className={styles.milestone}>
                    <span>1975</span>
                    <h3>{t('about.timeline.1975.title')}</h3>
                    <p>{t('about.timeline.1975.description')}</p>
                </div>
                <div className={styles.milestone}>
                    <span>1998</span>
                    <h3>{t('about.timeline.1998.title')}</h3>
                    <p>{t('about.timeline.1998.description')}</p>
                </div>
                <div className={styles.milestone}>
                    <span>2010</span>
                    <h3>{t('about.timeline.2010.title')}</h3>
                    <p>{t('about.timeline.2010.description')}</p>
                </div>
                <div className={styles.milestone}>
                    <span>2026</span>
                    <h3>{t('about.timeline.2026.title')}</h3>
                    <p>{t('about.timeline.2026.description')}</p>
                </div>
            </section>
        </div>
    );
}
