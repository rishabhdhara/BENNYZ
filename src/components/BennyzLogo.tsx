import React from 'react';

interface BennyzLogoProps {
  variant?: 'dark' | 'light' | 'gold' | 'ink';
  className?: string;
  height?: number;
}

const WORDMARK_SRC: Record<NonNullable<BennyzLogoProps['variant']>, string> = {
  dark: '/logo-wordmark-dark.png',
  light: '/logo-wordmark-light.png',
  gold: '/logo-wordmark-gold.png',
  ink: '/logo-wordmark-ink.png',
};

const CREST_SRC: Record<'dark' | 'light' | 'gold', string> = {
  dark: '/logo-crest-dark.png',
  light: '/logo-crest-light.png',
  gold: '/logo-crest-gold.png',
};

/**
 * Official BENNYZ horizontal serif wordmark featuring the signature NN shirt-collar crest.
 */
export const BennyzLogo: React.FC<BennyzLogoProps> = ({
  variant = 'dark',
  className = '',
  height = 30,
}) => {
  return (
    <img
      src={WORDMARK_SRC[variant]}
      alt="BENNYZ"
      style={{ height: `${height}px` }}
      className={`w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
};

/**
 * Official BENNYZ NN shirt-collar crest monogram for labels, favicons, and luxury detailing.
 */
export const BennyzMonogram: React.FC<Omit<BennyzLogoProps, 'variant'> & { variant?: 'dark' | 'light' | 'gold' }> = ({
  variant = 'dark',
  className = '',
  height = 36,
}) => {
  return (
    <img
      src={CREST_SRC[variant]}
      alt="BENNYZ Crest Monogram"
      style={{ height: `${height}px` }}
      className={`w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
};
