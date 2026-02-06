'use client';

/**
 * Translation Component
 * Simple wrapper for translating text content
 *
 * Usage:
 *   <T k="nav.home" />
 *   <T k="home.heroTitle" />
 *   <T k="some.key" fallback="Default text" />
 */

import { useTranslation } from '@/lib/i18n/context';

interface TProps {
  /** Translation key in dot notation (e.g., "nav.home") */
  k: string;
  /** Optional fallback text if key not found */
  fallback?: string;
}

export default function T({ k, fallback }: TProps) {
  const t = useTranslation();
  return <>{t(k, fallback)}</>;
}
