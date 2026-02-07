import { motion } from 'motion/react';
import { UserCircle, Briefcase, Building2, Wrench, ArrowRight, ArrowLeft } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { UserType, ProviderType } from '../../App';

interface UserTypePageProps {
  onBack: () => void;
  onSelectUserType: (type: UserType) => void;
  onSelectProviderType: (type: ProviderType) => void;
  selectedUserType: UserType;
}

export function UserTypePage({ onBack, onSelectUserType, onSelectProviderType, selectedUserType }: UserTypePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-[600px] relative"
    >
      {/* Outer glow effects */}
      <motion.div
        className="absolute inset-0 rounded-[48px] opacity-25"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(218, 165, 32, 0.25), transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-[48px] opacity-20"
        style={{
          background: 'radial-gradient(circle at 70% 80%, rgba(52, 211, 153, 0.2), transparent 60%)',
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      {/* Main card */}
      <motion.div
        className="relative backdrop-blur-2xl bg-white/30 rounded-[48px] p-12 border border-white/40"
        style={{
          boxShadow: `
            0 40px 80px rgba(0, 0, 0, 0.12),
            0 20px 40px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(255, 255, 255, 0.2),
            0 0 0 1px rgba(218, 165, 32, 0.1),
            0 0 0 2px rgba(52, 211, 153, 0.08)
          `,
        }}
      >
        {/* Holographic effects */}
        <div className="absolute inset-0 rounded-[48px] overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-[200px] h-[200px]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            animate={{
              x: [0, 80, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onBack}
            className="absolute top-0 right-0 p-2 text-amber-900/60 hover:text-amber-900 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="scale-75">
              <BietAlreefLogo />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 
              className="text-3xl mb-2 bg-gradient-to-r from-amber-800 via-amber-700 to-green-700 bg-clip-text text-transparent"
              style={{ fontFamily: 'serif' }}
            >
              {selectedUserType ? 'اختر نوع الحساب' : 'من أنت؟'}
            </h1>
            <p className="text-sm text-amber-900/70">
              {selectedUserType ? 'حدد نوع مزود الخدمة' : 'اختر نوع حسابك للمتابعة'}
            </p>
          </motion.div>

          {/* User Type Selection */}
          {!selectedUserType && (
            <div className="space-y-4">
              {/* Client Option */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onClick={() => onSelectUserType('client')}
                className="relative w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 to-emerald-500/15 rounded-[20px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4 p-6 bg-white/50 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-lg transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl">
                    <UserCircle className="w-8 h-8 text-green-700" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-amber-900 mb-1">أنا عميل</h3>
                    <p className="text-sm text-amber-900/60">أبحث عن مقاول أو خدمة بناء</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-amber-900/40 group-hover:text-amber-900 transition-colors" />
                </div>
              </motion.button>

              {/* Provider Option */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onClick={() => onSelectUserType('provider')}
                className="relative w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 to-yellow-500/15 rounded-[20px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4 p-6 bg-white/50 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-lg transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80">
                  <div className="p-3 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl">
                    <Briefcase className="w-8 h-8 text-amber-700" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-amber-900 mb-1">أنا مزود خدمة</h3>
                    <p className="text-sm text-amber-900/60">شركة أو حرفي يقدم خدمات البناء</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-amber-900/40 group-hover:text-amber-900 transition-colors" />
                </div>
              </motion.button>
            </div>
          )}

          {/* Provider Type Selection */}
          {selectedUserType === 'provider' && (
            <div className="space-y-4">
              {/* Company with License */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                onClick={() => onSelectProviderType('company')}
                className="relative w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 to-emerald-500/15 rounded-[20px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4 p-6 bg-white/50 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-lg transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl">
                    <Building2 className="w-8 h-8 text-green-700" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-amber-900 mb-1">شركة برخصة</h3>
                    <p className="text-sm text-amber-900/60">شركة مسجلة بسجل تجاري ورخصة</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-amber-900/40 group-hover:text-amber-900 transition-colors" />
                </div>
              </motion.button>

              {/* Craftsman */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onClick={() => onSelectProviderType('craftsman')}
                className="relative w-full group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 to-yellow-500/15 rounded-[20px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4 p-6 bg-white/50 backdrop-blur-xl rounded-[20px] border border-white/60 shadow-lg transition-all duration-300 group-hover:bg-white/70 group-hover:border-white/80">
                  <div className="p-3 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl">
                    <Wrench className="w-8 h-8 text-amber-700" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-amber-900 mb-1">حرفي - عامل ماهر</h3>
                    <p className="text-sm text-amber-900/60">فرد متخصص في مجال البناء</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-amber-900/40 group-hover:text-amber-900 transition-colors" />
                </div>
              </motion.button>

              {/* Back to user type */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => onSelectUserType(null)}
                className="w-full text-center text-sm text-amber-900/60 hover:text-amber-900 transition-colors py-2"
              >
                ← العودة لاختيار نوع الحساب
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
