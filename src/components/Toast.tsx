import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'motion/react';

export function ToastContainer() {
  const toasts = useToast();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              pointer-events-auto bg-ink text-cream px-4 py-3 rounded-lg shadow-lg text-sm border-l-4 min-w-[280px]
              ${t.type === 'ok' ? 'border-green' : t.type === 'warn' ? 'border-amber' : 'border-coral'}
            `}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
