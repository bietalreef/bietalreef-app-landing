import { Coins } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNavigate } from 'react-router';
import { useTheme } from '../../contexts/ThemeContext';

export function WalletWidget() {
  const { balance, isLoading } = useWallet();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <button
      onClick={() => navigate('/wallet')}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 md:px-3 md:py-1.5 transition-all group ${
        isDark
          ? 'bg-gradient-to-l from-[#D4AF37]/20 to-[#D4AF37]/10 hover:from-[#D4AF37]/30 hover:to-[#D4AF37]/20 border border-[#D4AF37]/25'
          : 'bg-gradient-to-l from-[#C8A86A]/15 to-[#C8A86A]/5 hover:from-[#C8A86A]/25 hover:to-[#C8A86A]/15 border border-[#C8A86A]/30'
      }`}
      title="محفظة ريف كوينز"
    >
      <span className="text-sm md:text-base">🪙</span>
      {isLoading ? (
        <div className={`w-6 h-3 rounded animate-pulse ${isDark ? 'bg-[#D4AF37]/30' : 'bg-[#C8A86A]/20'}`} />
      ) : (
        <span
          className={`text-xs md:text-sm font-black transition-colors ${
            isDark
              ? 'text-[#D4AF37] group-hover:text-[#E8C84A]'
              : 'text-[#A07D35] group-hover:text-[#8B6914]'
          }`}
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          {balance.toLocaleString('ar-EG')}
        </span>
      )}
    </button>
  );
}