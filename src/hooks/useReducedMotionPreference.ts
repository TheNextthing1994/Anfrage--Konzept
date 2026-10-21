import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
export const readReducedMotionPreference = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
const getServerSnapshot = () => false;
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

/** Keep the canvas and its popovers in sync with live OS preference changes. */
export const useReducedMotionPreference = () =>
  useSyncExternalStore(subscribe, readReducedMotionPreference, getServerSnapshot);
