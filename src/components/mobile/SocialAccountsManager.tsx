import { useState, useEffect } from 'react';
import { 
  Instagram, Facebook, Twitter, Youtube, Linkedin, Globe,
  MessageCircle, Check, X, Settings, AlertCircle, Loader,
  ExternalLink, RefreshCw, Zap, Shield, ChevronRight
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  avatar?: string;
  isConnected: boolean;
  connectedAt?: string;
  followers?: number;
  expiresAt?: string;
}

interface SocialAccountsManagerProps {
  onClose?: () => void;
  mode?: 'modal' | 'page';
}

export function SocialAccountsManager({ onClose, mode = 'modal' }: SocialAccountsManagerProps) {
  const { t, dir } = useTranslation('tools');
  
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Platform configurations
  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
      description: 'ربط حسابك للنشر التلقائي والتحليلات',
      features: ['نشر الصور والريلز', 'جدولة المنشورات', 'تحليل التفاعل']
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600',
      description: 'إدارة صفحاتك ونشر المحتوى',
      features: ['إدارة الصفحات', 'نشر تلقائي', 'تحليل الأداء']
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'from-sky-400 to-sky-600',
      bgColor: 'bg-sky-500',
      description: 'نشر التغريدات والتفاعل مع المتابعين',
      features: ['نشر التغريدات', 'جدولة المحتوى', 'إحصائيات']
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ),
      color: 'from-black to-gray-800',
      bgColor: 'bg-black',
      description: 'نشر الفيديوهات القصيرة والريلز',
      features: ['رفع الفيديوهات', 'تحليل المشاهدات', 'إدارة المحتوى']
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-600',
      description: 'إدارة قناتك ورفع الفيديوهات',
      features: ['رفع الفيديوهات', 'إدارة القناة', 'تحليل المشاهدات']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500',
      description: 'ربط واتساب للردود التلقائية',
      features: ['ردود تلقائية', 'رسائل جماعية', 'إحصائيات']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-700 to-blue-800',
      bgColor: 'bg-blue-700',
      description: 'نشر المحتوى المهني والتواصل',
      features: ['نشر المقالات', 'بناء العلاقات', 'تحليل الشبكة']
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-0 .784-.105 1.486-.42.45-.2 1.05-.495 1.935-.495.909 0 1.649.39 2.096 1.078.405.621.629 1.469.674 2.399a8.18 8.18 0 01-.114 1.447c-.06.3-.12.585-.179.852-.239 1.111-.419 1.946-.419 2.771 0 .576.124.915.347 1.199.27.346.663.577 1.076.754a5.24 5.24 0 001.184.354c.243.06.42.18.569.361.149.18.219.405.219.645 0 .42-.179.825-.519 1.139-.341.314-.81.494-1.319.494h-6.094c-.63 0-1.155-.18-1.575-.54-.42-.36-.705-.855-.84-1.44-.135-.585-.165-1.199-.12-1.814.045-.614.18-1.229.375-1.844a8.43 8.43 0 01.87-1.949c.3-.495.659-.945 1.049-1.335.39-.39.81-.72 1.244-.99.435-.27.885-.48 1.335-.63.45-.15.885-.24 1.29-.27-.029-.45-.074-.885-.134-1.305a6.13 6.13 0 00-.375-1.469 2.23 2.23 0 00-.87-1.2c-.39-.314-.87-.471-1.44-.471-.57 0-1.05.165-1.44.48-.39.314-.705.689-.945 1.125-.24.435-.405.915-.495 1.425a6.28 6.28 0 00-.09 1.455c.014.48.074.945.18 1.395z"/>
        </svg>
      ),
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-400',
      description: 'نشر القصص والمحتوى المرئي',
      features: ['نشر القصص', 'إعلانات', 'تحليلات']
    },
    {
      id: 'website',
      name: 'موقعك الإلكتروني',
      icon: Globe,
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gray-700',
      description: 'ربط موقعك الإلكتروني',
      features: ['نشر تلقائي', 'تكامل المحتوى', 'تحليلات']
    }
  ];

  // Load connected accounts on mount
  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - في الواقع سيكون:
      // const response = await fetch('/api/social-accounts');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockAccounts: SocialAccount[] = JSON.parse(
        localStorage.getItem('socialAccounts') || '[]'
      );
      
      setAccounts(mockAccounts);
    } catch (err) {
      console.error('Error loading accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platformId: string) => {
    setConnectingPlatform(platformId);
    setError(null);

    try {
      // في الواقع، هنا سيتم:
      // 1. فتح نافذة OAuth
      // 2. الحصول على الإذن
      // 3. حفظ التوكن في Backend
      
      // For now, simulate OAuth flow
      const authWindow = window.open(
        getOAuthUrl(platformId),
        'oauth-window',
        'width=600,height=700,left=200,top=100'
      );

      // Listen for OAuth callback
      window.addEventListener('message', handleOAuthCallback);
      
      // Simulate successful connection after 3 seconds
      setTimeout(() => {
        const platform = platforms.find(p => p.id === platformId);
        const newAccount: SocialAccount = {
          id: `${platformId}-${Date.now()}`,
          platform: platformId,
          accountName: `حساب ${platform?.name}`,
          accountId: `user_${Math.random().toString(36).substr(2, 9)}`,
          isConnected: true,
          connectedAt: new Date().toISOString(),
          followers: Math.floor(Math.random() * 10000)
        };

        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        localStorage.setItem('socialAccounts', JSON.stringify(updatedAccounts));

        setSuccessMessage(`تم ربط ${platform?.name} بنجاح! 🎉`);
        setShowSuccess(true);
        setConnectingPlatform(null);

        authWindow?.close();

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الربط');
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      // في الواقع:
      // await fetch(`/api/social-accounts/${accountId}`, { method: 'DELETE' });
      
      const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
      setAccounts(updatedAccounts);
      localStorage.setItem('socialAccounts', JSON.stringify(updatedAccounts));

      setSuccessMessage('تم فصل الحساب بنجاح');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError('حدث خطأ أثناء فصل الحساب');
    }
  };

  const handleOAuthCallback = (event: MessageEvent) => {
    if (event.data.type === 'oauth-success') {
      // Process OAuth success
      console.log('OAuth Success:', event.data);
    }
  };

  const getOAuthUrl = (platform: string): string => {
    // في الواقع، هذه ستكون روابط حقيقية لكل منصة
    const baseUrl = window.location.origin;
    
    const oauthUrls: { [key: string]: string } = {
      instagram: `https://api.instagram.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${baseUrl}/auth/instagram/callback&scope=user_profile,user_media&response_type=code`,
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=${baseUrl}/auth/facebook/callback&scope=pages_show_list,pages_read_engagement,pages_manage_posts`,
      twitter: `https://twitter.com/i/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${baseUrl}/auth/twitter/callback&scope=tweet.read%20tweet.write%20users.read`,
      linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=YOUR_CLIENT_ID&redirect_uri=${baseUrl}/auth/linkedin/callback&scope=r_liteprofile%20w_member_social`,
      youtube: `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${baseUrl}/auth/youtube/callback&scope=https://www.googleapis.com/auth/youtube.upload`,
      // Demo URL for now
      default: `${baseUrl}/demo-oauth?platform=${platform}`
    };

    return oauthUrls[platform] || oauthUrls.default;
  };

  const isConnected = (platformId: string) => {
    return accounts.some(acc => acc.platform === platformId && acc.isConnected);
  };

  const getConnectedAccount = (platformId: string) => {
    return accounts.find(acc => acc.platform === platformId && acc.isConnected);
  };

  return (
    <div 
      className={`${mode === 'modal' ? 'fixed inset-0 z-50' : ''}`}
      dir={dir}
    >
      {mode === 'modal' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      )}
      
      <div className={`
        ${mode === 'modal' 
          ? 'absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto' 
          : 'min-h-screen'
        }
        bg-white rounded-t-3xl shadow-2xl
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  ربط منصات التواصل
                </h2>
                <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {accounts.filter(a => a.isConnected).length} من {platforms.length} متصلة
                </p>
              </div>
            </div>
            {mode === 'modal' && (
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(accounts.filter(a => a.isConnected).length / platforms.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="mx-4 mt-4 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3 animate-slideDown">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <p className="text-green-800 flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {successMessage}
            </p>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-800 flex-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {error}
            </p>
            <button onClick={() => setError(null)}>
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        {/* Info Banner */}
        <div className="mx-4 mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-900 mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                حماية بياناتك أولويتنا
              </h4>
              <p className="text-amber-800 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                جميع البيانات مشفرة بتقنية 256-bit SSL. لا نقوم بتخزين كلمات المرور. يمكنك فصل أي حساب في أي وقت.
              </p>
            </div>
          </div>
        </div>

        {/* Platforms List */}
        <div className="p-4 space-y-3">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const connected = isConnected(platform.id);
            const account = getConnectedAccount(platform.id);
            const isConnecting = connectingPlatform === platform.id;

            return (
              <div 
                key={platform.id}
                className={`
                  bg-white border-2 rounded-2xl overflow-hidden transition-all
                  ${connected 
                    ? 'border-green-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 bg-gradient-to-br ${platform.color} rounded-xl 
                      flex items-center justify-center flex-shrink-0 shadow-lg
                    `}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '17px' }}>
                          {platform.name}
                        </h3>
                        {connected && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            <span className="text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                              متصل
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {connected && account ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            {account.accountName}
                          </p>
                          {account.followers && (
                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {account.followers.toLocaleString('ar-AE')} متابع
                            </p>
                          )}
                          <p className="text-xs text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            متصل منذ {new Date(account.connectedAt!).toLocaleDateString('ar-AE')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {platform.description}
                        </p>
                      )}

                      {/* Features (shown when not connected) */}
                      {!connected && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {platform.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                              style={{ fontFamily: 'Cairo, sans-serif' }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {connected ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDisconnect(account!.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                          >
                            <X className="w-4 h-4" />
                            فصل
                          </button>
                          <button
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                          >
                            <Settings className="w-4 h-4" />
                            إعدادات
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConnect(platform.id)}
                          disabled={isConnecting}
                          className={`
                            ${platform.bgColor} text-white px-6 py-3 rounded-xl 
                            hover:shadow-lg transition-all flex items-center gap-2
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                        >
                          {isConnecting ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              <span>جاري الربط...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              <span>ربط الآن</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="p-4 pb-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-200">
            <h4 className="text-[#1F3D2B] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              <AlertCircle className="w-5 h-5 text-blue-600" />
              هل تحتاج مساعدة؟
            </h4>
            <p className="text-gray-700 text-sm mb-3 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              عملية الربط آمنة تماماً وتتم عبر OAuth الرسمي لكل منصة. لن نطلب منك كلمة المرور أبداً.
            </p>
            <button className="text-blue-600 text-sm flex items-center gap-2 hover:gap-3 transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              <span>شاهد شرح الفيديو</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {accounts.filter(a => a.isConnected).length} حسابات متصلة
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                محدثة للتو
              </p>
            </div>
            <button
              onClick={loadConnectedAccounts}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              <RefreshCw className="w-5 h-5" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
