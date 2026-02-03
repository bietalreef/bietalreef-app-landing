import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface WeyaakBubbleProps {
  onClick?: () => void;
  position?: 'fixed' | 'relative';
}

export function WeyaakBubble({ onClick, position = 'fixed' }: WeyaakBubbleProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`${position === 'fixed' ? 'fixed bottom-24 right-6' : ''} w-16 h-16 rounded-full bg-gradient-to-br from-[#4A90E2] via-[#4A90E2] to-[#56CCF2] shadow-2xl flex items-center justify-center z-40`}
      style={{ 
        boxShadow: '0 0 30px rgba(74, 144, 226, 0.5), 0 0 60px rgba(86, 204, 242, 0.4)'
      }}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        boxShadow: [
          '0 0 30px rgba(74, 144, 226, 0.5), 0 0 60px rgba(86, 204, 242, 0.4)',
          '0 0 40px rgba(74, 144, 226, 0.7), 0 0 80px rgba(86, 204, 242, 0.5)',
          '0 0 30px rgba(74, 144, 226, 0.5), 0 0 60px rgba(86, 204, 242, 0.4)',
        ]
      }}
      transition={{
        scale: { duration: 0.3 },
        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
    </motion.button>
  );
}