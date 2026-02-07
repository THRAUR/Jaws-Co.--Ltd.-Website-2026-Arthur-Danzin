'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import styles from './page.module.css';

export default function Home() {
    const t = useTranslation();

    return (
        <main>
            <header className={styles.hero}>
                <div className={styles.videoOverlay}></div>
                {/* VIDEO LOOP: Enhanced attributes for reliable autoplay */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.videoBg}
                    poster="https://via.placeholder.com/1920x1080?text=Video+Poster"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-white-abstract-technology-lines-background-27464-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className={styles.heroText}>
                    <h1>{t('home.heroTitle')}</h1>
                    <p>{t('home.heroSubtitle')}</p>
                    <div className={styles.actions}>
                        <Link href="/products" className={styles.btn}>{t('home.viewCatalog')}</Link>
                        <Link href="/about" className={`${styles.btn} ${styles.btnSec}`}>{t('home.ourStory')}</Link>
                    </div>
                </div>
            </header>

            {/* WHY US - Animated Counters Section */}
            <section className={styles.whyUs}>
                <div className={styles.whyContainer}>
                    <div className={styles.statBox}>
                        <h2>{t('home.stats.years')}</h2>
                        <p>{t('home.stats.yearsLabel')}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>{t('home.stats.taiwan')}</h2>
                        <p>{t('home.stats.taiwanLabel')}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>{t('home.stats.iso')}</h2>
                        <p>{t('home.stats.isoLabel')}</p>
                    </div>
                </div>
            </section>

            {/* FEATURED SERIES */}
            <section className={styles.ftGrid}>
                {/* Placeholder for Feature Image */}
                <div className={styles.ftImgPlaceholder}>
                    <span className={styles.phTextBig}>
                        FEATURED IMAGE<br />
                        0.5mm FPC Connector Series<br />
                        (High-res macro shot suggested)
                    </span>
                </div>

                <div className={styles.ftContent}>
                    <h2>{t('home.featured.title')}</h2>
                    <p>{t('home.featured.description')}</p>
                    <Link href="/products?category=0.5%20mm" className={styles.ftLink}>{t('home.featured.link')}</Link>
                </div>
            </section>

            {/* INDUSTRIES SERVED - New Section */}
            <section className={styles.industries}>
                <div className={styles.indHeader}>
                    <h2>{t('home.industries.title')}</h2>
                    <p>{t('home.industries.subtitle')}</p>
                </div>
                <div className={styles.indGrid}>
                    <div className={styles.indCard}>
                        <h3>{t('home.industries.automotive')}</h3>
                        <p>{t('home.industries.automotiveDesc')}</p>
                    </div>
                    <div className={styles.indCard}>
                        <h3>{t('home.industries.industrial')}</h3>
                        <p>{t('home.industries.industrialDesc')}</p>
                    </div>
                    <div className={styles.indCard}>
                        <h3>{t('home.industries.consumer')}</h3>
                        <p>{t('home.industries.consumerDesc')}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
