import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ExternalLink, Trash2, Settings, Eye,
  RefreshCw, CheckCircle, AlertCircle, Link2, Unlink,
  BarChart3, Users, Heart, TrendingUp, Globe, Shield,
  ChevronDown, ChevronUp, X,
  Video, Image, Send, Clock, Lock, MessageSquareOff, Loader2,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '../../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

/* ═══════════════════════════════════════════════
   Toggle مكوّن مستقل
   ═══════════════════════════════════════════════ */

function SettingToggle({ label, desc, defaultValue, fontFamily }: { label: string; desc: string; defaultValue: boolean; fontFamily: string }) {
  const [enabled, setEnabled] = useState(defaultValue);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="text-right">
        <span className="text-sm font-bold text-[#1A1A1A] block" style={{ fontFamily }}>{label}</span>
        <span className="text-[11px] text-gray-400" style={{ fontFamily }}>{desc}</span>
      </div>
      <div className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   أنواع البيانات
   ═══════════════════════════════════════════════ */

interface SocialPlatform {
  id: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  color: string;
  lightBg: string;
  gradient: string;
  authUrl: string;
  scopes: string[];
  features: { ar: string; en: string }[];
}

interface ConnectedAccount {
  platformId: string;
  username: string;
  displayName: string;
  profileImage: string;
  connectedAt: string;
  followers?: number;
  following?: number;
  posts?: number;
  engagement?: number;
  lastSync?: string;
  isActive: boolean;
}

/* ═══════════════════════════════════════════════
   المنصات المدعومة
   ═══════════════════════════════════════════════ */

const PLATFORMS: SocialPlatform[] = [
  {
    id: 'instagram',
    nameAr: 'إنستغرام',
    nameEn: 'Instagram',
    descAr: 'منصة للصور والفيديوهات القصيرة',
    descEn: 'Platform for photos and short videos',
    icon: '📸',
    color: '#E4405F',
    lightBg: '#FCAF45',
    gradient: 'from-[#833AB4] via-[#E4405F] to-[#FCAF45]',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media'],
    features: [
      { ar: 'عرض المنشورات والقصص', en: 'View posts & stories' },
      { ar: 'إحصائيات المتابعين', en: 'Follower analytics' },
      { ar: 'تحليل التفاعل', en: 'Engagement analysis' },
    ],
  },
  {
    id: 'facebook',
    nameAr: 'فيسبوك',
    nameEn: 'Facebook',
    descAr: 'منصة التواصل الاجتماعي الشهيرة',
    descEn: 'Popular social networking platform',
    icon: '👤',
    color: '#1877F2',
    lightBg: '#0C5DC7',
    gradient: 'from-[#1877F2] to-[#0C5DC7]',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_show_list', 'pages_read_engagement'],
    features: [
      { ar: 'إدارة صفحات الأعمال', en: 'Manage business pages' },
      { ar: 'إحصائيات المنشورات', en: 'Post analytics' },
      { ar: 'تحليل الجمهور', en: 'Audience insights' },
    ],
  },
  {
    id: 'tiktok',
    nameAr: 'تيك توك',
    nameEn: 'TikTok',
    descAr: 'منصة الفيديوهات القصيرة الشهيرة',
    descEn: 'Popular short video platform',
    icon: '🎵',
    color: '#000000',
    lightBg: '#FE2C55',
    gradient: 'from-[#25F4EE] via-[#000000] to-[#FE2C55]',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    scopes: ['user.info.basic', 'video.publish'],
    features: [
      { ar: 'نشر فيديوهات مباشرة', en: 'Direct video publishing' },
      { ar: 'نشر صور مباشرة', en: 'Direct photo publishing' },
      { ar: 'إحصائيات المنشئ', en: 'Creator analytics' },
      { ar: 'تتبع حالة النشر', en: 'Publish status tracking' },
    ],
  },
  {
    id: 'x',
    nameAr: 'إكس (تويتر)',
    nameEn: 'X (Twitter)',
    descAr: 'منصة التواصل الاجتماعي الشهيرة',
    descEn: 'Popular social networking platform',
    icon: '𝕏',
    color: '#000000',
    lightBg: '#657786',
    gradient: 'from-[#14171A] to-[#657786]',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'users.read'],
    features: [
      { ar: 'عرض التغريدات', en: 'View tweets' },
      { ar: 'تحليل الإشارات', en: 'Mention analytics' },
      { ar: 'إحصائيات التفاعل', en: 'Engagement stats' },
    ],
  },
  {
    id: 'youtube',
    nameAr: 'يوتيوب',
    nameEn: 'YouTube',
    descAr: 'منصة الفيديوهات الشهيرة',
    descEn: 'Popular video platform',
    icon: '▶️',
    color: '#FF0000',
    lightBg: '#CC0000',
    gradient: 'from-[#FF0000] to-[#CC0000]',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    features: [
      { ar: 'إحصائيات القناة', en: 'Channel analytics' },
      { ar: 'تحليل الفيديوهات', en: 'Video analytics' },
      { ar: 'بيانات المشتركين', en: 'Subscriber data' },
    ],
  },
  {
    id: 'linkedin',
    nameAr: 'لينكد إن',
    nameEn: 'LinkedIn',
    descAr: 'منصة الشبكات المهنية',
    descEn: 'Professional networking platform',
    icon: '💼',
    color: '#0A66C2',
    lightBg: '#004182',
    gradient: 'from-[#0A66C2] to-[#004182]',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'r_organization_social'],
    features: [
      { ar: 'الملف المهني', en: 'Professional profile' },
      { ar: 'إحصائيات الشركة', en: 'Company analytics' },
      { ar: 'تحليل المنشورات', en: 'Post analytics' },
    ],
  },
  {
    id: 'snapchat',
    nameAr: 'سناب شات',
    nameEn: 'Snapchat',
    descAr: 'منصة التواصل الاجتماعي الفورية',
    descEn: 'Instant messaging and sharing platform',
    icon: '👻',
    color: '#FFFC00',
    lightBg: '#F5E600',
    gradient: 'from-[#FFFC00] to-[#F5E600]',
    authUrl: 'https://accounts.snapchat.com/login/oauth2/authorize',
    scopes: ['snapchat-marketing-api'],
    features: [
      { ar: 'إحصائيات السنابات', en: 'Snap analytics' },
      { ar: 'تحليل القصص', en: 'Story analytics' },
      { ar: 'بيانات الجمهور', en: 'Audience data' },
    ],
  },
  {
    id: 'whatsapp',
    nameAr: 'واتساب بزنس',
    nameEn: 'WhatsApp Business',
    descAr: 'منصة التواصل الاجتماعي للأعمال',
    descEn: 'Business messaging platform',
    icon: '💬',
    color: '#25D366',
    lightBg: '#128C7E',
    gradient: 'from-[#25D366] to-[#128C7E]',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['whatsapp_business_management'],
    features: [
      { ar: 'إحصائيات الرسائل', en: 'Message analytics' },
      { ar: 'كتالوج المنتجات', en: 'Product catalog' },
      { ar: 'ردود تلقائية', en: 'Auto-replies' },
    ],
  },
];

/* ═══════════════════════════════════════════════
   localStorage Key
   ═══════════════════════════════════════════════ */
const STORAGE_KEY = 'bietalreef_social_accounts';

function loadAccounts(): ConnectedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveAccounts(accounts: ConnectedAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

/* ═══════════════════════════════════════════════
   تنسيق الأرقام
   ═══════════════════════════════════════════════ */
function formatNumber(n?: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

/* ═══════════════════════════════════════════════
   المكوّن الرئيسي
   ═══════════════════════════════════════════════ */

export function SocialMediaManager({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const [accounts, setAccounts] = useState<ConnectedAccount[]>(loadAccounts);
  const [activeView, setActiveView] = useState<'dashboard' | 'connect' | 'detail'>('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<string | null>(null);

  // حفظ تلقائي
  useEffect(() => { saveAccounts(accounts); }, [accounts]);

  /* ── نصوص ثنائية اللغة ── */
  const L = {
    title: isEn ? 'Social Media Manager' : 'مدير السوشيال ميديا',
    subtitle: isEn ? 'Connect & manage all your social accounts' : 'اربط وأدر جميع حساباتك الاجتماعية',
    dashboard: isEn ? 'Dashboard' : 'لوحة التحكم',
    connectedAccounts: isEn ? 'Connected Accounts' : 'الحسابات المتصلة',
    addAccount: isEn ? 'Add Account' : 'إضافة حساب',
    connectNew: isEn ? 'Connect New Platform' : 'ربط منصة جديدة',
    connect: isEn ? 'Connect' : 'ربط',
    connected: isEn ? 'Connected' : 'متصل',
    disconnect: isEn ? 'Disconnect' : 'إلغاء الربط',
    settings: isEn ? 'Settings' : 'الإعدادات',
    viewDetails: isEn ? 'View Details' : 'عرض التفاصيل',
    noAccounts: isEn ? 'No accounts connected yet' : 'لا يوجد حسابات متصلة بعد',
    noAccountsDesc: isEn ? 'Connect your social media accounts to view analytics and manage your presence' : 'اربط حسابات السوشيال ميديا لعرض الإحصائيات وإدارة تواجدك',
    startConnect: isEn ? 'Start Connecting' : 'ابدأ الربط',
    totalFollowers: isEn ? 'Total Followers' : 'إجمالي المتابعين',
    totalPosts: isEn ? 'Total Posts' : 'إجمالي المنشورات',
    avgEngagement: isEn ? 'Avg Engagement' : 'متوسط التفاعل',
    platforms: isEn ? 'Platforms' : 'المنصات',
    followers: isEn ? 'Followers' : 'المتابعون',
    following: isEn ? 'Following' : 'المتابَعون',
    posts: isEn ? 'Posts' : 'المنشورات',
    engagement: isEn ? 'Engagement' : 'التفاعل',
    lastSync: isEn ? 'Last Sync' : 'آخر تحديث',
    sync: isEn ? 'Sync' : 'تحديث',
    remove: isEn ? 'Remove' : 'إزالة',
    cancel: isEn ? 'Cancel' : 'إلغاء',
    confirmRemove: isEn ? 'Are you sure you want to disconnect this account?' : 'هل أنت متأكد من إلغاء ربط هذا الحساب؟',
    confirmRemoveDesc: isEn ? 'You can reconnect it anytime later.' : 'يمكنك إعادة ربطه في أي وقت لاحقاً.',
    connecting: isEn ? 'Connecting...' : 'جاري الربط...',
    authInfo: isEn ? 'Secure OAuth authorization — we never store your password' : 'تفويض آمن عبر OAuth — لا نخزّن كلمة مرورك أبداً',
    features: isEn ? 'What you get:' : 'ما ستحصل عليه:',
    back: isEn ? 'Back' : 'رجوع',
    active: isEn ? 'Active' : 'نشط',
    inactive: isEn ? 'Inactive' : 'غير نشط',
    autoSync: isEn ? 'Auto Sync' : 'تحديث تلقائي',
    notifications: isEn ? 'Notifications' : 'الإشعارات',
    privacy: isEn ? 'Data Privacy' : 'خصوصية البيانات',
    settingsTitle: isEn ? 'Account Settings' : 'إعدادات الحساب',
    openPlatform: isEn ? 'Open in Platform' : 'فتح في المنصة',
    connectedSince: isEn ? 'Connected Since' : 'متصل منذ',
    overview: isEn ? 'Overview' : 'نظرة عامة',
  };

  /* ── ربط حساب عبر OAuth ── */
  const handleConnect = useCallback(async (platform: SocialPlatform) => {
    setConnectingId(platform.id);

    // ── TikTok: ربط حقيقي عبر OAuth عبر السيرفر ──
    if (platform.id === 'tiktok') {
      try {
        // Get access token for API call
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || publicAnonKey;

        // Get the OAuth URL from our server (it builds the correct URL with client_key)
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/tiktok/auth-url`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (data.error) {
          console.log('TikTok auth URL error:', data.error);
          toast.error(isEn ? 'Failed to start TikTok connection' : 'فشل في بدء ربط تيك توك', {
            description: data.error,
          });
          setConnectingId(null);
          return;
        }

        // Listen for postMessage from OAuth popup
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.type === 'tiktok_auth') {
            window.removeEventListener('message', handleMessage);
            if (event.data.success) {
              const newAccount: ConnectedAccount = {
                platformId: 'tiktok',
                username: event.data.username ? `@${event.data.username}` : '@tiktok_user',
                displayName: isEn ? 'TikTok Account' : 'حساب تيك توك',
                profileImage: '',
                connectedAt: new Date().toISOString(),
                followers: 0,
                following: 0,
                posts: 0,
                engagement: 0,
                lastSync: new Date().toISOString(),
                isActive: true,
              };
              setAccounts(prev => {
                const existing = prev.findIndex(a => a.platformId === 'tiktok');
                if (existing >= 0) {
                  const updated = [...prev];
                  updated[existing] = newAccount;
                  return updated;
                }
                return [...prev, newAccount];
              });
              toast.success(isEn ? 'TikTok connected successfully!' : 'تم ربط تيك توك بنجاح!');
              setActiveView('dashboard');
            } else {
              toast.error(isEn ? 'TikTok connection failed' : 'فشل ربط تيك توك', {
                description: event.data.error || '',
              });
            }
            setConnectingId(null);
          }
        };
        window.addEventListener('message', handleMessage);

        // Open TikTok OAuth popup
        const authWindow = window.open(
          data.auth_url,
          'tiktok_auth',
          'width=600,height=700,left=200,top=100,scrollbars=yes'
        );

        // Check if popup closed without completing
        const checkTimer = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkTimer);
            // Give a moment for the message to arrive
            setTimeout(() => {
              setConnectingId(prev => {
                if (prev === 'tiktok') {
                  window.removeEventListener('message', handleMessage);
                  return null;
                }
                return prev;
              });
            }, 2000);
          }
        }, 1000);

        // Timeout after 3 minutes
        setTimeout(() => {
          clearInterval(checkTimer);
          window.removeEventListener('message', handleMessage);
          setConnectingId(null);
        }, 180000);

      } catch (e: any) {
        console.log('TikTok connect error:', e);
        toast.error(isEn ? 'Connection error' : 'خطأ في الربط');
        setConnectingId(null);
      }
      return;
    }

    // ── باقي المنصات: محاكاة OAuth ──
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const scope = encodeURIComponent(platform.scopes.join(' '));
    const state = encodeURIComponent(JSON.stringify({ platform: platform.id, ts: Date.now() }));
    const clientId = `bietalreef_${platform.id}_client`;

    const authWindow = window.open(
      `${platform.authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=code`,
      `auth_${platform.id}`,
      'width=600,height=700,left=200,top=100,scrollbars=yes'
    );

    const checkTimer = setInterval(() => {
      try {
        if (authWindow?.closed) {
          clearInterval(checkTimer);
          const newAccount: ConnectedAccount = {
            platformId: platform.id,
            username: `@bietalreef_${platform.id}`,
            displayName: isEn ? 'Beit Al Reef' : 'بيت اريف',
            profileImage: '',
            connectedAt: new Date().toISOString(),
            followers: Math.floor(Math.random() * 5000) + 100,
            following: Math.floor(Math.random() * 500) + 50,
            posts: Math.floor(Math.random() * 200) + 10,
            engagement: parseFloat((Math.random() * 8 + 1).toFixed(1)),
            lastSync: new Date().toISOString(),
            isActive: true,
          };
          setAccounts(prev => {
            const existing = prev.findIndex(a => a.platformId === platform.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = newAccount;
              return updated;
            }
            return [...prev, newAccount];
          });
          setConnectingId(null);
          setActiveView('dashboard');
        }
      } catch {
        // Cross-origin — ignore
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(checkTimer);
      setConnectingId(null);
    }, 120000);
  }, [isEn]);

  /* ── إلغاء ربط ── */
  const handleDisconnect = async (platformId: string) => {
    // For TikTok: also remove token from server
    if (platformId === 'tiktok') {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || publicAnonKey;
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a/tiktok/disconnect`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );
      } catch (e) {
        console.log('TikTok disconnect server error:', e);
      }
    }
    setAccounts(prev => prev.filter(a => a.platformId !== platformId));
    setShowRemoveConfirm(null);
    setSelectedPlatform(null);
    setActiveView('dashboard');
    toast.success(isEn ? 'Account disconnected' : 'تم إلغاء ربط الحساب');
  };

  /* ── تحديث (محاكاة) ── */
  const handleSync = (platformId: string) => {
    setAccounts(prev => prev.map(a =>
      a.platformId === platformId
        ? {
            ...a,
            lastSync: new Date().toISOString(),
            followers: (a.followers || 0) + Math.floor(Math.random() * 50),
            engagement: parseFloat((Math.random() * 8 + 1).toFixed(1)),
          }
        : a
    ));
  };

  const connectedPlatformIds = accounts.map(a => a.platformId);
  const totalFollowers = accounts.reduce((s, a) => s + (a.followers || 0), 0);
  const totalPosts = accounts.reduce((s, a) => s + (a.posts || 0), 0);
  const avgEngagement = accounts.length > 0
    ? (accounts.reduce((s, a) => s + (a.engagement || 0), 0) / accounts.length).toFixed(1)
    : '0';

  const getPlatform = (id: string) => PLATFORMS.find(p => p.id === id);

  /* ═══════════════════════════════════════════════
     عرض تفاصيل حساب
     ═══════════════════════════════════════════════ */
  if (activeView === 'detail' && selectedPlatform) {
    const account = accounts.find(a => a.platformId === selectedPlatform);
    const platform = getPlatform(selectedPlatform);
    if (!account || !platform) return null;

    return (
      <div className="min-h-screen bg-[#FAFAF9] pb-32" dir="rtl">
        {/* Header */}
        <div
          className="px-5 pt-6 pb-8 rounded-b-[32px] shadow-lg relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${platform.color}, ${platform.color}dd)` }}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <button onClick={() => { setActiveView('dashboard'); setSelectedPlatform(null); }} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4" style={{ fontFamily, fontWeight: 600, fontSize: '14px' }}>
              <ArrowRight className="w-5 h-5" />
              <span>{L.back}</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                {platform.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-white text-xl leading-tight" style={{ fontFamily, fontWeight: 800 }}>
                  {isEn ? platform.nameEn : platform.nameAr}
                </h1>
                <p className="text-white/80 text-sm mt-0.5" style={{ fontFamily }}>
                  {account.username}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-bold" style={{ fontFamily }}>{L.connected}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4 relative z-10 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: L.followers, value: formatNumber(account.followers), icon: <Users className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: L.following, value: formatNumber(account.following), icon: <Heart className="w-4 h-4" />, color: 'text-pink-600', bg: 'bg-pink-50' },
              { label: L.posts, value: formatNumber(account.posts), icon: <BarChart3 className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: L.engagement, value: `${account.engagement}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-50' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-2`}>{stat.icon}</div>
                <p className="text-2xl font-extrabold text-[#1A1A1A]" style={{ fontFamily }}>{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily }}>{L.overview}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={{ fontFamily }}>{L.connectedSince}</span>
                <span className="text-xs font-bold text-[#1A1A1A]" style={{ fontFamily }}>
                  {new Date(account.connectedAt).toLocaleDateString(isEn ? 'en-US' : 'ar-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500" style={{ fontFamily }}>{L.lastSync}</span>
                <span className="text-xs font-bold text-[#1A1A1A]" style={{ fontFamily }}>
                  {account.lastSync ? new Date(account.lastSync).toLocaleString(isEn ? 'en-US' : 'ar-AE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-gray-500" style={{ fontFamily }}>{isEn ? 'Status' : 'الحالة'}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {L.active}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSync(selectedPlatform)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-blue-50 transition-colors active:scale-95"
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-gray-700" style={{ fontFamily }}>{L.sync}</span>
            </button>
            <button
              onClick={() => setShowSettings(selectedPlatform)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-purple-50 transition-colors active:scale-95"
            >
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold text-gray-700" style={{ fontFamily }}>{L.settings}</span>
            </button>
            <button
              onClick={() => window.open(platform.authUrl.replace('/oauth', '').replace('/authorize', '').split('?')[0], '_blank')}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-green-50 transition-colors active:scale-95"
            >
              <ExternalLink className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold text-gray-700" style={{ fontFamily }}>{L.openPlatform}</span>
            </button>
            <button
              onClick={() => setShowRemoveConfirm(selectedPlatform)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-red-50 transition-colors active:scale-95"
            >
              <Unlink className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold text-red-500" style={{ fontFamily }}>{L.disconnect}</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {renderRemoveConfirmModal(platform)}
        {showSettings === selectedPlatform && renderSettingsModal(platform, account)}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     شاشة ربط منصة جديدة
     ═══════════════════════════════════════════════ */
  if (activeView === 'connect') {
    const availablePlatforms = PLATFORMS.filter(p => !connectedPlatformIds.includes(p.id));
    return (
      <div className="min-h-screen bg-[#FAFAF9] pb-32" dir="rtl">
        {/* Header — compact */}
        <div className="bg-white border-b border-gray-200 px-5 pt-5 pb-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-3"
            style={{ fontFamily, fontWeight: 600, fontSize: '14px' }}
          >
            <ArrowRight className="w-5 h-5" />
            <span>{L.back}</span>
          </button>
          <h1 className="text-[#1A1A1A] text-lg" style={{ fontFamily, fontWeight: 800 }}>
            {isEn ? 'Connect a Social Account' : 'ربط حساب سوشيال ميديا'}
          </h1>
          <p className="text-gray-400 text-sm mt-1" style={{ fontFamily }}>
            {isEn ? 'Choose a platform to connect' : 'اختر المنصة التي تريد ربطها'}
          </p>
        </div>

        {/* Platform List — GravityWrite style */}
        <div className="px-4 mt-4">
          {availablePlatforms.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-1" style={{ fontFamily }}>
                {isEn ? 'All platforms connected!' : 'تم ربط جميع المنصات!'}
              </h3>
              <p className="text-sm text-gray-400" style={{ fontFamily }}>
                {isEn ? 'You can manage them from the dashboard.' : 'يمكنك إدارتها من لوحة التحكم.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {availablePlatforms.map((platform) => {
                const isLoading = connectingId === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => !isLoading && handleConnect(platform)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-4 px-5 py-4 text-right hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-60 group"
                  >
                    {/* Platform icon — clean colored circle */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: platform.color === '#000000' ? '#1A1A1A' : platform.color }}
                    >
                      <span className="text-white text-lg leading-none">{platform.icon}</span>
                    </div>

                    {/* Name + Description */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[15px] text-[#1A1A1A] group-hover:text-[#2AA676] transition-colors" style={{ fontFamily }}>
                        {isEn ? platform.nameEn : platform.nameAr}
                      </h4>
                      <p className="text-[13px] text-gray-400 mt-0.5" style={{ fontFamily }}>
                        {isEn
                          ? `Connect a new ${platform.nameEn} account`
                          : `ربط حساب ${platform.nameAr} جديد`
                        }
                      </p>
                    </div>

                    {/* Loading indicator or chevron */}
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-[#2AA676] animate-spin flex-shrink-0" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Security note — subtle */}
          <div className="flex items-center gap-2 mt-4 px-2">
            <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-[11px] text-gray-400 leading-relaxed" style={{ fontFamily }}>
              {isEn
                ? 'Secure connection via OAuth 2.0 — We never store your password'
                : 'اتصال آمن عبر OAuth 2.0 — لا نخزّن كلمة مرورك أبداً'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     لوحة التحكم (Dashboard)
     ═══════════════════════════════════════════════ */

  function renderRemoveConfirmModal(platform?: SocialPlatform) {
    if (!showRemoveConfirm) return null;
    const p = platform || getPlatform(showRemoveConfirm);
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6" onClick={() => setShowRemoveConfirm(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Unlink className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2" style={{ fontFamily }}>
                {L.disconnect} {p ? (isEn ? p.nameEn : p.nameAr) : ''}
              </h3>
              <p className="text-sm text-gray-500 mb-1" style={{ fontFamily }}>{L.confirmRemove}</p>
              <p className="text-xs text-gray-400 mb-6" style={{ fontFamily }}>{L.confirmRemoveDesc}</p>
              <div className="flex gap-3">
                <button onClick={() => setShowRemoveConfirm(null)} className="flex-1 py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors" style={{ fontFamily }}>
                  {L.cancel}
                </button>
                <button onClick={() => handleDisconnect(showRemoveConfirm)} className="flex-1 py-3 bg-red-500 rounded-xl text-sm font-bold text-white hover:bg-red-600 transition-colors" style={{ fontFamily }}>
                  {L.remove}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  function renderSettingsModal(platform: SocialPlatform, account: ConnectedAccount) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowSettings(null)}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${platform.gradient} rounded-xl flex items-center justify-center text-lg`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily }}>{L.settingsTitle}</h3>
                  <p className="text-xs text-gray-400" style={{ fontFamily }}>{isEn ? platform.nameEn : platform.nameAr}</p>
                </div>
              </div>
              <button onClick={() => setShowSettings(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: L.autoSync, desc: isEn ? 'Sync data every 6 hours' : 'تحديث البيانات كل 6 ساعات', default: true },
                { label: L.notifications, desc: isEn ? 'Get notified on new followers' : 'إشعارات عند متابعين جدد', default: false },
                { label: L.privacy, desc: isEn ? 'Only you can see this data' : 'أنت فقط من يرى هذه البيانات', default: true },
              ].map((setting) => {
                return (
                  <SettingToggle
                    key={setting.label}
                    label={setting.label}
                    desc={setting.desc}
                    defaultValue={setting.default}
                    fontFamily={fontFamily}
                  />
                );
              })}
            </div>

            <button onClick={() => setShowSettings(null)} className="w-full mt-6 py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors" style={{ fontFamily }}>
              {isEn ? 'Done' : 'تم'}
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-32" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-6 pb-8 rounded-b-[32px] shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1F3D2B, #2AA676)' }}>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-12 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-4" style={{ fontFamily, fontWeight: 600, fontSize: '14px' }}>
            <ArrowRight className="w-5 h-5" />
            <span>{L.back}</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-inner">📱</div>
            <div className="flex-1">
              <h1 className="text-white text-xl leading-tight" style={{ fontFamily, fontWeight: 800 }}>{L.title}</h1>
              <p className="text-white/80 text-sm mt-0.5" style={{ fontFamily }}>{L.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {accounts.length === 0 ? (
        /* ── حالة فارغة ── */
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Globe className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-2" style={{ fontFamily }}>{L.noAccounts}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed" style={{ fontFamily }}>{L.noAccountsDesc}</p>
            <button onClick={() => setActiveView('connect')} className="w-full py-4 bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95" style={{ fontFamily }}>
              <Link2 className="w-5 h-5 inline ml-2" />
              {L.startConnect}
            </button>

            {/* Preview platforms */}
            <div className="mt-8 grid grid-cols-4 gap-4">
              {PLATFORMS.slice(0, 8).map(p => (
                <div key={p.id} className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${p.gradient} rounded-2xl flex items-center justify-center text-xl shadow-md`}>
                    {p.icon}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold" style={{ fontFamily }}>
                    {isEn ? p.nameEn : p.nameAr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── إحصائيات سريعة ── */}
          <div className="px-4 -mt-4 relative z-10">
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { label: L.totalFollowers, value: formatNumber(totalFollowers), icon: <Users className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50' },
                { label: L.totalPosts, value: formatNumber(totalPosts), icon: <BarChart3 className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-50' },
                { label: L.avgEngagement, value: `${avgEngagement}%`, icon: <TrendingUp className="w-4 h-4 text-green-600" />, bg: 'bg-green-50' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
                  <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-1.5`}>{stat.icon}</div>
                  <p className="text-lg font-extrabold text-[#1A1A1A]" style={{ fontFamily }}>{stat.value}</p>
                  <p className="text-[10px] text-gray-400" style={{ fontFamily }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── الحسابات المتصلة ── */}
          <div className="px-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[#1A1A1A] font-bold text-base" style={{ fontFamily }}>{L.connectedAccounts}</h3>
              <span className="text-xs font-bold text-[#2AA676] bg-[#2AA676]/10 px-2.5 py-1 rounded-full" style={{ fontFamily }}>
                {accounts.length} {L.platforms}
              </span>
            </div>

            <div className="space-y-3">
              {accounts.map((account, index) => {
                const platform = getPlatform(account.platformId);
                if (!platform) return null;
                return (
                  <motion.div
                    key={account.platformId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
                          {platform.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[14px] text-[#1A1A1A] truncate" style={{ fontFamily }}>
                              {isEn ? platform.nameEn : platform.nameAr}
                            </h4>
                            <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {L.connected}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400" style={{ fontFamily }}>{account.username}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[11px] text-gray-500" style={{ fontFamily }}>
                              <Users className="w-3 h-3 inline ml-0.5" /> {formatNumber(account.followers)}
                            </span>
                            <span className="text-[11px] text-gray-500" style={{ fontFamily }}>
                              <BarChart3 className="w-3 h-3 inline ml-0.5" /> {formatNumber(account.posts)}
                            </span>
                            <span className="text-[11px] text-green-600 font-bold" style={{ fontFamily }}>
                              <TrendingUp className="w-3 h-3 inline ml-0.5" /> {account.engagement}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => { setSelectedPlatform(account.platformId); setActiveView('detail'); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 rounded-xl text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors active:scale-95"
                          style={{ fontFamily }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {L.viewDetails}
                        </button>
                        <button
                          onClick={() => setShowSettings(account.platformId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-50 rounded-xl text-gray-500 text-xs font-bold hover:bg-gray-100 transition-colors active:scale-95"
                          style={{ fontFamily }}
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowRemoveConfirm(account.platformId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-50 rounded-xl text-red-500 text-xs font-bold hover:bg-red-100 transition-colors active:scale-95"
                          style={{ fontFamily }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add account button */}
            <button
              onClick={() => setActiveView('connect')}
              className="w-full mt-4 py-4 bg-gradient-to-l from-purple-600 to-purple-700 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ fontFamily }}
            >
              <Link2 className="w-5 h-5" />
              {L.addAccount}
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      {renderRemoveConfirmModal()}
      {showSettings && (() => {
        const platform = getPlatform(showSettings);
        const account = accounts.find(a => a.platformId === showSettings);
        if (!platform || !account) return null;
        return renderSettingsModal(platform, account);
      })()}
    </div>
  );
}