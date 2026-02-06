import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div>
                <span className={styles.brand}>JAWS CO., LTD.</span>
                <p className={styles.sub}>Taipei, Taiwan</p>
            </div>
            <div className={styles.right}>
                &copy; {new Date().getFullYear()} Jaws Co., Ltd.<br />
                ISO 9001 Certified
            </div>
        </footer>
    );
}
