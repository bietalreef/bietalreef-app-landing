import { Coins } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNavigate } from 'react-router';

export function WalletWidget() {
  const { balance, isLoading } = useWallet();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/wallet')}
      className="flex items-center gap-1.5 bg-gradient-to-l from-[#C8A86A]/15 to-[#C8A86A]/5 hover:from-[#C8A86A]/25 hover:to-[#C8A86A]/15 border border-[#C8A86A]/30 rounded-full px-2.5 py-1.5 md:px-3 md:py-1.5 transition-all group"
      title="محفظة ريف كوينز"
    >
      <span className="text-sm md:text-base">🪙</span>
      {isLoading ? (
        <div className="w-6 h-3 bg-[#C8A86A]/20 rounded animate-pulse" />
      ) : (
        <span
          className="text-[#A07D35] text-xs md:text-sm font-black group-hover:text-[#8B6914] transition-colors"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          {balance.toLocaleString('ar-EG')}
        </span>
      )}
    </button>
  );
}
