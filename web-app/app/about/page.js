import styles from './page.module.css';

export const metadata = {
    title: 'About Jaws Co., Ltd.',
    description: 'Learn about our 50-year history of manufacturing excellence in Taipei.',
};

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <section className={styles.storyHero}>
                <h1>Manufacturing Excellence<br />Since 1975.</h1>
                <p>Jaws Co., Ltd. is not just a distributor; we are a dedicated manufacturer based in Taipei, Taiwan. In an industry flooded with generic components, we stand apart by offering <b>traceability, material purity, and custom design capabilities</b> that others cannot match.</p>
            </section>

            <div className={styles.imageBlock}>
                Factory Floor Image / Assemblers working
            </div>

            <section className={styles.statsGrid}>
                <div className={styles.stat}>
                    <h2>50+</h2>
                    <p>Years of Experience</p>
                </div>
                <div className={styles.stat}>
                    <h2>100%</h2>
                    <p>Made in Taiwan</p>
                </div>
                <div className={styles.stat}>
                    <h2>ISO</h2>
                    <p>9001:2015 Certified</p>
                </div>
            </section>

            <section className={styles.timeline}>
                <h2>Our Journey</h2>
                <div className={styles.milestone}>
                    <span>1975</span>
                    <h3>Founded in Taipei, Taiwan.</h3>
                    <p>Started as a small mold-making workshop.</p>
                </div>
                <div className={styles.milestone}>
                    <span>1998</span>
                    <h3>Expansion to FPC Connectors</h3>
                    <p>Launched the first generation of flexible circuit connectors.</p>
                </div>
                <div className={styles.milestone}>
                    <span>2010</span>
                    <h3>ISO 9001 Certification</h3>
                    <p>Formalized our commitment to international quality standards.</p>
                </div>
                <div className={styles.milestone}>
                    <span>2026</span>
                    <h3>The New Digital Era</h3>
                    <p>Launching our new digital platform to serve global engineers.</p>
                </div>
            </section>
        </div>
    );
}
