import { motion } from 'motion/react';
import { Phone, MapPin, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { UserType, ProviderType } from '../../App';
import { useState } from 'react';

interface VerificationPageProps {
  onBack: () => void;
  userType: UserType;
  providerType: ProviderType;
}

export function VerificationPage({ onBack, userType, providerType }: VerificationPageProps) {
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [licenseUploaded, setLicenseUploaded] = useState(false);

  const isProvider = userType === 'provider';
  const isCompany = providerType === 'company';

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
              التوثيق والتحقق
            </h1>
            <p className="text-sm text-amber-900/70">
              {isProvider ? 'أكمل بيانات التوثيق لمزود الخدمة' : 'أكمل بياناتك للمتابعة'}
            </p>
          </motion.div>

          {/* Form */}
          <div className="space-y-5">
            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label className="block text-sm text-amber-900/80 mb-2 text-right">
                رقم الهاتف
              </label>
              <motion.div
                className="relative"
                animate={{
                  scale: focusedField === 'phone' ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {focusedField === 'phone' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-[18px] blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-5 py-4 pr-12 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[18px] focus:border-green-400/50 focus:bg-white/60 focus:outline-none transition-all duration-300 text-amber-900 placeholder:text-amber-900/40"
                    dir="ltr"
                  />
                  <Phone className="absolute right-4 w-5 h-5 text-amber-900/40" />
                </div>
              </motion.div>
            </motion.div>

            {/* City/Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label className="block text-sm text-amber-900/80 mb-2 text-right">
                المدينة / الموقع
              </label>
              <motion.div
                className="relative"
                animate={{
                  scale: focusedField === 'city' ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {focusedField === 'city' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-[18px] blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                
                <div className="relative flex items-center">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-5 py-4 pr-12 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[18px] focus:border-green-400/50 focus:bg-white/60 focus:outline-none transition-all duration-300 text-amber-900 appearance-none"
                    dir="rtl"
                  >
                    <option value="">اختر المدينة</option>
                    <option value="dubai">دبي</option>
                    <option value="abudhabi">أبوظبي</option>
                    <option value="sharjah">الشارقة</option>
                    <option value="ajman">عجمان</option>
                    <option value="rak">رأس الخيمة</option>
                    <option value="fujairah">الفجيرة</option>
                    <option value="uaq">أم القيوين</option>
                  </select>
                  <MapPin className="absolute right-4 w-5 h-5 text-amber-900/40 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>

            {/* Emirates ID Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <label className="block text-sm text-amber-900/80 mb-2 text-right">
                صورة الهوية الإماراتية
              </label>
              <motion.button
                onClick={() => setIdUploaded(true)}
                className="relative w-full group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {!idUploaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-[18px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}
                
                <div className={`relative flex items-center justify-center gap-3 p-6 rounded-[18px] border-2 border-dashed transition-all duration-300 ${
                  idUploaded 
                    ? 'bg-green-50/50 border-green-400/50 backdrop-blur-xl' 
                    : 'bg-white/30 border-white/40 backdrop-blur-xl group-hover:bg-white/40 group-hover:border-white/60'
                }`}>
                  {idUploaded ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="text-green-700">تم رفع الهوية بنجاح</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-amber-900/60" />
                      <span className="text-amber-900/70">اضغط لرفع صورة الهوية</span>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>

            {/* Business License Upload (for companies only) */}
            {isProvider && isCompany && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <label className="block text-sm text-amber-900/80 mb-2 text-right">
                  رخصة العمل / السجل التجاري
                </label>
                <motion.button
                  onClick={() => setLicenseUploaded(true)}
                  className="relative w-full group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {!licenseUploaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-[18px] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  
                  <div className={`relative flex items-center justify-center gap-3 p-6 rounded-[18px] border-2 border-dashed transition-all duration-300 ${
                    licenseUploaded 
                      ? 'bg-green-50/50 border-green-400/50 backdrop-blur-xl' 
                      : 'bg-white/30 border-white/40 backdrop-blur-xl group-hover:bg-white/40 group-hover:border-white/60'
                  }`}>
                    {licenseUploaded ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <span className="text-green-700">تم رفع الرخصة بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-amber-900/60" />
                        <span className="text-amber-900/70">اضغط لرفع صورة الرخصة</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative w-full group mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.3), rgba(52, 211, 153, 0.3))',
                  filter: 'blur(12px)',
                }}
              />
              
              <motion.div
                className="absolute inset-0 rounded-[20px]"
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(218, 165, 32, 0.15)',
                    '0 0 25px rgba(218, 165, 32, 0.25)',
                    '0 0 15px rgba(218, 165, 32, 0.15)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="relative flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-[20px] shadow-xl border border-green-400/50">
                <span>إتمام التسجيل</span>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </motion.button>
          </div>

          {/* Info Text */}
          <motion.p
            className="text-center text-xs text-amber-900/50 leading-relaxed mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            جميع بياناتك محمية ومشفرة بأعلى معايير الأمان
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
