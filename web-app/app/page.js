import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
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
                    <h1>The Gold Standard<br />in <i>Connector</i> Prowess.</h1>
                    <p>Combining 50 years of Taiwanese manufacturing heritage with modern precision engineering. We connect the world&apos;s most demanding technologies.</p>
                    <div className={styles.actions}>
                        <Link href="/products" className={styles.btn}>View Catalog</Link>
                        <Link href="/about" className={`${styles.btn} ${styles.btnSec}`}>Our Story</Link>
                    </div>
                </div>
            </header>

            {/* WHY US - Animated Counters Section */}
            <section className={styles.whyUs}>
                <div className={styles.whyContainer}>
                    <div className={styles.statBox}>
                        <h2>50+</h2>
                        <p>Years Experience</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>100%</h2>
                        <p>Made in Taiwan</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>ISO</h2>
                        <p>9001 Certified</p>
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
                    <h2>0.5mm Series</h2>
                    <p>Our flagship FPC/FFC connectors designed for high-density applications. Featuring robust locking mechanisms and superior conductivity.</p>
                    <Link href="/products?category=0.5%20mm" className={styles.ftLink}>Explore Specs</Link>
                </div>
            </section>

            {/* INDUSTRIES SERVED - New Section */}
            <section className={styles.industries}>
                <div className={styles.indHeader}>
                    <h2>Industries Served</h2>
                    <p>Powering the next generation of devices.</p>
                </div>
                <div className={styles.indGrid}>
                    <div className={styles.indCard}>
                        <h3>Automotive</h3>
                        <p>In-vehicle infotainment and sensors.</p>
                    </div>
                    <div className={styles.indCard}>
                        <h3>Industrial</h3>
                        <p>Robotics and automation control.</p>
                    </div>
                    <div className={styles.indCard}>
                        <h3>Consumer</h3>
                        <p>Laptops, tablets, and wearables.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
