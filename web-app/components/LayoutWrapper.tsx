'use client';

/**
 * Layout Wrapper Component
 * Conditionally renders Navbar and Footer based on current route
 * Hides them on admin routes
 * Provides i18n context for public pages
 */
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { LanguageProvider } from '@/lib/i18n/context';
import { SCOPE_LANGUAGES } from '@/lib/i18n/config';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const hideNavFooter = isAdminRoute || isDashboardRoute;

  // Determine which scope to use for language options
  const getScope = () => {
    if (isAdminRoute) return SCOPE_LANGUAGES.admin;
    if (isDashboardRoute) return SCOPE_LANGUAGES.dashboard;
    return SCOPE_LANGUAGES.public;
  };

  return (
    <LanguageProvider allowedLanguages={getScope()}>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </LanguageProvider>
  );
}
