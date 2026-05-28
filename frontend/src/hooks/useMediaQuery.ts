import { useEffect, useState } from 'react';

/**
 * Custom hook for responsive design
 * Detects when window matches a media query
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Preset media query hooks
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 640px)');
export const useIsTablet = (): boolean => useMediaQuery('(max-width: 1024px)');
export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1025px)');
