import React from 'react';

interface BennyzLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  height?: number;
}

/**
 * Custom geometric BENNYZ SVG wordmark.
 * Drawn with bespoke vector letterforms featuring angled cuts on N, Y, and Z
 * and architectural inner counters — zero system fonts or generic icons.
 */
export const BennyzLogo: React.FC<BennyzLogoProps> = ({
  variant = 'dark',
  className = '',
  height = 24,
}) => {
  const fill = variant === 'dark' ? '#171717' : '#EDE6D9';
  const accent = variant === 'dark' ? '#92785F' : '#B8A58C';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 264 42"
      height={height}
      className={className}
      role="img"
      aria-label="BENNYZ"
    >
      {/* B */}
      <path
        d="M4 5H24.5C30.4 5 34.2 8.2 34.2 13.3C34.2 16.9 32.1 19.6 28.7 20.6C32.8 21.5 35.4 24.7 35.4 29C35.4 34.6 31.1 38 24.4 38H4V5ZM11.8 18.2H22.2C25.1 18.2 26.8 16.7 26.8 14.4C26.8 12.1 25.1 10.7 22.2 10.7H11.8V18.2ZM11.8 32.1H23.1C26.2 32.1 27.9 30.6 27.9 28.1C27.9 25.6 26.1 24 23.1 24H11.8V32.1Z"
        fill={fill}
      />
      {/* E */}
      <path
        d="M46 5H74.5V11.3H53.8V18.2H71.4V24.3H53.8V31.7H75V38H46V5Z"
        fill={fill}
      />
      {/* N (with signature diagonal stem cut) */}
      <path
        d="M85.5 5H93.8L111.2 27.6V5H118.8V38H110.9L93.1 14.9V38H85.5V5Z"
        fill={fill}
      />
      {/* N */}
      <path
        d="M130.5 5H138.8L156.2 27.6V5H163.8V38H155.9L138.1 14.9V38H130.5V5Z"
        fill={fill}
      />
      {/* Y (architectural angular fork) */}
      <path
        d="M172.2 5H181.1L191.5 21.4L201.9 5H210.5L195.4 28V38H187.6V28L172.2 5Z"
        fill={fill}
      />
      {/* Z (sharp extended tail + registration bar) */}
      <path
        d="M218.5 5H252.5V11.1L228.8 31.7H253.2V38H217.5V31.9L241.3 11.3H218.5V5Z"
        fill={fill}
      />
      {/* Subtle architectural registration dot/bar beneath Z */}
      <rect x="256" y="32" width="5" height="6" fill={accent} />
    </svg>
  );
};

/**
 * Compact BZ Monogram for Favicon, Woven Labels, Packaging Seals & Social Profile.
 */
export const BennyzMonogram: React.FC<BennyzLogoProps> = ({
  variant = 'dark',
  className = '',
  height = 36,
}) => {
  const bg = variant === 'dark' ? '#171717' : '#EDE6D9';
  const fg = variant === 'dark' ? '#EDE6D9' : '#171717';
  const accent = '#92785F';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      height={height}
      width={height}
      className={className}
      role="img"
      aria-label="BENNYZ Monogram"
    >
      <rect width="64" height="64" fill={bg} />
      {/* B */}
      <path
        d="M10 15H23.2C27.2 15 29.8 17.3 29.8 20.9C29.8 23.4 28.4 25.3 26.1 26C28.9 26.7 30.7 28.9 30.7 32C30.7 36 27.7 38.5 23.1 38.5H10V15ZM15.4 24.2H21.7C23.6 24.2 24.7 23.2 24.7 21.6C24.7 20.1 23.6 19.1 21.7 19.1H15.4V24.2ZM15.4 34.4H22.2C24.3 34.4 25.5 33.4 25.5 31.6C25.5 29.9 24.3 28.8 22.2 28.8H15.4V34.4Z"
        fill={fg}
      />
      {/* Z */}
      <path
        d="M34.5 15H54V19.6L41.2 33.9H54.3V38.5H34V33.9L46.8 19.6H34.5V15Z"
        fill={fg}
      />
      {/* Architectural bottom hairline */}
      <rect x="10" y="46" width="44" height="2" fill={accent} />
    </svg>
  );
};
