'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslation();
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
                <Link href="/" className={isActive('/')}>{t('nav.home')}</Link>
                <Link href="/products" className={isActive('/products')}>{t('nav.products')}</Link>
                <Link href="/about" className={isActive('/about')}>{t('nav.about')}</Link>
                <Link href="/news" className={isActive('/news')}>{t('nav.news')}</Link>
                <Link href="/contact" className={isActive('/contact')}>{t('nav.contact')}</Link>
            </div>
            <div className={styles.actions}>
                <LanguageSwitcher scope="public" />
                {!loading && (
                    user ? (
                        <div className={styles.userMenu}>
                            <Link href="/dashboard" className={styles.dashboardLink}>
                                {t('nav.myAccount')}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginLink}>
                            {t('nav.login')}
                        </Link>
                    )
                )}
                <Link href="/quote" className={styles.cta}>{t('nav.getQuote')}</Link>
            </div>
        </nav>
    );
}
