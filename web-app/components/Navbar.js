'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Check current user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const isActive = (path) => pathname === path ? styles.active : '';

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>JAWS <span>CO.</span></div>
            <div className={styles.links}>
                <Link href="/" className={isActive('/')}>Home</Link>
                <Link href="/products" className={isActive('/products')}>Products</Link>
                <Link href="/about" className={isActive('/about')}>About</Link>
                <Link href="/news" className={isActive('/news')}>News</Link>
                <Link href="/contact" className={isActive('/contact')}>Contact</Link>
            </div>
            <div className={styles.actions}>
                {!loading && (
                    user ? (
                        <div className={styles.userMenu}>
                            <Link href="/dashboard" className={styles.dashboardLink}>
                                My Account
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginLink}>
                            Login
                        </Link>
                    )
                )}
                <Link href="/quote" className={styles.cta}>Get a Quote</Link>
            </div>
        </nav>
    );
}
