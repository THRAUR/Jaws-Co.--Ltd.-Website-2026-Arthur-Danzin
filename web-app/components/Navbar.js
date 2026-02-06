'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path ? styles.active : '';

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>JAWS <span>CO.</span></div>
            <div className={styles.links}>
                <Link href="/" className={isActive('/')}>Home</Link>
                <Link href="/products" className={isActive('/products')}>Products</Link>
                <Link href="/about" className={isActive('/about')}>About</Link>
                <Link href="/contact" className={isActive('/contact')}>Contact</Link>
            </div>
            <Link href="/contact" className={styles.cta}>Get a Quote</Link>
        </nav>
    );
}
