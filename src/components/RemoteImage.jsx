import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function RemoteImage({ src, alt = '', className = '' }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);
  if (!src || bad) {
    return (
      <div className={`flex items-center justify-center bg-surface2 text-muted ${className}`}>
        <ImageOff size={22} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />;
}
