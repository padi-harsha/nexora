import { useApp } from '../context/AppContext';

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="anim-rise rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg shadow-lg">{t.message}</div>
      ))}
    </div>
  );
}
