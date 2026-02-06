import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins, ArrowDownCircle, ArrowUpCircle, Clock, ChevronLeft,
  Sparkles, Zap, Crown, Gift, RefreshCw, TrendingUp, Wrench, ShieldCheck
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { toast } from 'sonner@2.0.3';

type WalletTab = 'overview' | 'history' | 'buy';

interface CoinPackage {
  id: string;
  coins: number;
  price: string;
  bonus: number;
  popular?: boolean;
  icon: any;
  gradient: string;
}

export function WalletScreen() {
  const { balance, isLoading, ledger, ledgerLoading, fetchBalance, fetchLedger, topUpCoins, spendCoins } = useWallet();
  const [activeTab, setActiveTab] = useState<WalletTab>('overview');
  const [buyingPackage, setBuyingPackage] = useState<string | null>(null);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const coinPackages: CoinPackage[] = [
    { id: 'starter', coins: 50, price: '25 د.إ', bonus: 0, icon: Zap, gradient: 'from-blue-400 to-blue-600' },
    { id: 'basic', coins: 120, price: '50 د.إ', bonus: 20, icon: Sparkles, gradient: 'from-emerald-400 to-emerald-600' },
    { id: 'popular', coins: 300, price: '100 د.إ', bonus: 50, popular: true, icon: Crown, gradient: 'from-amber-400 to-orange-500' },
    { id: 'pro', coins: 700, price: '200 د.إ', bonus: 150, icon: Gift, gradient: 'from-purple-400 to-purple-600' },
  ];

  const handleBuyPackage = async (pkg: CoinPackage) => {
    setBuyingPackage(pkg.id);
    try {
      const totalCoins = pkg.coins + pkg.bonus;
      const result = await topUpCoins(totalCoins, `شراء باقة ${pkg.coins} كوينز`);
      if (result.success) {
        toast.success(`تم شحن ${totalCoins} كوينز بنجاح!`, {
          description: `الرصيد الجديد: ${balance + totalCoins} كوينز`,
        });
        fetchLedger();
      } else {
        toast.error(result.error || 'فشل في شراء الباقة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الشراء');
    } finally {
      setBuyingPackage(null);
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'earn': return <ArrowDownCircle className="w-5 h-5 text-emerald-500" />;
      case 'spend': return <ArrowUpCircle className="w-5 h-5 text-red-500" />;
      case 'adjust': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'earn': return 'text-emerald-600';
      case 'spend': return 'text-red-500';
      case 'adjust': return 'text-blue-600';
      default: return 'text-gray-500';
    }
  };

  const getEntryLabel = (type: string) => {
    switch (type) {
      case 'earn': return 'إيداع';
      case 'spend': return 'خصم';
      case 'adjust': return 'تعديل';
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  const tabs: { id: WalletTab; label: string }[] = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'history', label: 'السجل' },
    { id: 'buy', label: 'شراء كوينز' },
  ];

  // Stats
  const totalEarned = ledger.filter(e => e.type === 'earn' || e.type === 'adjust').reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const totalSpent = ledger.filter(e => e.type === 'spend').reduce((sum, e) => sum + Math.abs(e.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-8" dir="rtl">
      {/* Hero Balance Section */}
      <div className="bg-gradient-to-bl from-[#C8A86A] via-[#B8944A] to-[#A07D35] px-6 pt-8 pb-12 rounded-b-[32px] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-16 translate-y-16" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                محفظة ريف
              </h1>
            </div>
            <button
              onClick={() => { fetchBalance(); fetchLedger(); }}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              title="تحديث"
            >
              <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Balance Display */}
          <div className="text-center py-4">
            <p className="text-white/70 text-sm mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>رصيدك الحالي</p>
            <motion.div
              key={balance}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="animate-pulse bg-white/20 h-14 w-40 rounded-2xl" />
              ) : (
                <>
                  <span className="text-5xl md:text-6xl text-white font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {balance.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-2xl">🪙</span>
                </>
              )}
            </motion.div>
            <p className="text-white/60 text-xs mt-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
              عملات ريف كوينز
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>إجمالي الإيداع</span>
              </div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {totalEarned.toLocaleString('ar-EG')}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wrench className="w-4 h-4 text-orange-300" />
                <span className="text-orange-300 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>إجمالي الاستخدام</span>
              </div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {totalSpent.toLocaleString('ar-EG')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-5">
        <div className="bg-white rounded-2xl shadow-lg p-1.5 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white shadow-md'
                  : 'text-[#1F3D2B]/60 hover:bg-[#F5EEE1]'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* What are Reef Coins */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#C8A86A]/10 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🪙</span>
                  </div>
                  <h3 className="text-[#1F3D2B] font-bold text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    ما هي عملات ريف؟
                  </h3>
                </div>
                <p className="text-[#1F3D2B]/70 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  عملات ريف هي رصيدك المسبق الدفع لاستخدام أدوات الذكاء الاصطناعي في بيت الريف.
                  اشحن رصيدك واستخدم الأدوات بسهولة — حاسبات البناء، تصميم الغرف، التحليل المالي والمزيد.
                </p>
              </div>

              {/* How to use */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-[#1F3D2B] font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  كيف تستخدم الكوينز؟
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', icon: '💰', title: 'اشحن رصيدك', desc: 'اختر باقة كوينز وادفع' },
                    { step: '2', icon: '🛠️', title: 'استخدم الأدوات', desc: 'كل أداة لها تكلفة محددة بالكوينز' },
                    { step: '3', icon: '📊', title: 'تابع رصيدك', desc: 'سجل كامل لجميع العمليات' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C8A86A]/20 to-[#C8A86A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#1F3D2B] font-semibold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.title}</p>
                        <p className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tool Prices */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="text-[#1F3D2B] font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  أسعار الأدوات
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'حاسبة البناء', cost: 5 },
                    { name: 'تصميم الغرف', cost: 15 },
                    { name: 'التحليل المالي', cost: 10 },
                    { name: 'مخطط المشروع', cost: 20 },
                    { name: 'مقارنة الأسعار', cost: 5 },
                    { name: 'تصميم الواجهات', cost: 25 },
                  ].map((tool, i) => (
                    <div key={i} className="bg-[#F5EEE1]/50 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-[#1F3D2B] text-xs font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{tool.name}</span>
                      <span className="text-[#C8A86A] text-xs font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{tool.cost} 🪙</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Note */}
              <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-800 text-sm font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>محفظة آمنة</p>
                  <p className="text-emerald-600 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    جميع العمليات محمية ومشفرة. لا يمكن التعديل على الرصيد إلا من خلال السيرفر.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── History ── */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {ledgerLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : ledger.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-[#1F3D2B]/10 mx-auto mb-4" />
                  <p className="text-[#1F3D2B]/40 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    لا توجد عمليات بعد
                  </p>
                  <p className="text-[#1F3D2B]/30 text-sm mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    ابدأ بشحن رصيدك لاستخدام الأدوات
                  </p>
                </div>
              ) : (
                ledger.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        entry.type === 'earn' ? 'bg-emerald-50' :
                        entry.type === 'spend' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        {getEntryIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                            entry.type === 'earn' ? 'bg-emerald-100 text-emerald-700' :
                            entry.type === 'spend' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'
                          }`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {getEntryLabel(entry.type)}
                          </span>
                          <span className="text-[#1F3D2B]/40 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                        <p className="text-[#1F3D2B]/70 text-sm mt-1 truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {entry.reason}
                        </p>
                      </div>
                      <span className={`font-bold text-lg ${getEntryColor(entry.type)}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {entry.amount > 0 ? '+' : ''}{entry.amount}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* ── Buy Coins ── */}
          {activeTab === 'buy' && (
            <motion.div
              key="buy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-[#1F3D2B]/60 text-sm text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
                اختر الباقة المناسبة واشحن رصيدك
              </p>

              <div className="grid grid-cols-2 gap-3">
                {coinPackages.map((pkg) => {
                  const Icon = pkg.icon;
                  return (
                    <motion.button
                      key={pkg.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBuyPackage(pkg)}
                      disabled={buyingPackage === pkg.id}
                      className={`relative bg-white rounded-2xl p-4 shadow-sm border-2 transition-all text-right ${
                        pkg.popular 
                          ? 'border-[#C8A86A] shadow-[0_4px_20px_rgba(200,168,106,0.3)]' 
                          : 'border-transparent hover:border-[#C8A86A]/30'
                      } ${buyingPackage === pkg.id ? 'opacity-50' : ''}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white text-xs px-3 py-0.5 rounded-full font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          الأكثر طلباً
                        </div>
                      )}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-3 mx-auto`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-black text-[#1F3D2B] text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {pkg.coins}
                      </p>
                      <p className="text-[#1F3D2B]/50 text-xs text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>كوينز</p>
                      {pkg.bonus > 0 && (
                        <p className="text-emerald-600 text-xs text-center font-bold mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          + {pkg.bonus} مجاناً
                        </p>
                      )}
                      <div className="mt-3 bg-gradient-to-l from-[#C8A86A] to-[#A07D35] text-white text-sm py-2 rounded-xl text-center font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {buyingPackage === pkg.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto" />
                        ) : (
                          pkg.price
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Note */}
              <div className="bg-amber-50 rounded-2xl p-4 text-center">
                <p className="text-amber-700 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  ⚠️ حالياً يتم الشحن مباشرة للتجربة. ربط بوابة الدفع قريباً.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
