import { useEffect } from 'react';

export default function useOutsideClick(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [ref, handler, active]);
}
