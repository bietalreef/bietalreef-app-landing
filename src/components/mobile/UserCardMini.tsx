import { 
  User, 
  Star, 
  CheckCircle, 
  Shield,
  FolderKanban,
  ChevronLeft
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { IDCopyBox } from './IDCopyBox';

// ====================================
// 📌 Types & Interfaces
// ====================================

type UserCardVariant = 'guest' | 'verified' | 'provider';
type ActivityStatus = 'online' | 'busy' | 'offline';

interface UserCardMiniProps {
  variant: UserCardVariant;
  userName?: string;
  userId?: string;
  avatarUrl?: string;
  activityStatus?: ActivityStatus;
  rating?: number;
  projectCount?: number;
  onCardClick?: () => void;
  onActionClick?: () => void;
}

// ====================================
// 🎨 Mini User Card Component
// ====================================

export function UserCardMini({
  variant,
  userName = 'مستخدم',
  userId = '#USER-0000',
  avatarUrl,
  activityStatus = 'offline',
  rating = 0,
  projectCount = 0,
  onCardClick,
  onActionClick,
}: UserCardMiniProps) {
  
  // ====================================
  // 🎯 Get Status Badge Config
  // ====================================
  
  const getStatusBadge = () => {
    switch (variant) {
      case 'guest':
        return {
          text: 'زائر',
          bgColor: 'bg-[#BDBDBD]',
          textColor: 'text-white',
          icon: null,
        };
      case 'verified':
        return {
          text: 'موثّق',
          bgColor: 'bg-[#2ECC71]',
          textColor: 'text-white',
          icon: <CheckCircle className="w-3 h-3" />,
        };
      case 'provider':
        return {
          text: 'مزود',
          bgColor: 'bg-[#4A90E2]',
          textColor: 'text-white',
          icon: <Shield className="w-3 h-3" />,
        };
      default:
        return {
          text: 'مستخدم',
          bgColor: 'bg-gray-400',
          textColor: 'text-white',
          icon: null,
        };
    }
  };

  // ====================================
  // 🟢 Get Activity Dot Color
  // ====================================
  
  const getActivityDotColor = () => {
    switch (activityStatus) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // ====================================
  // 🖼️ Get Avatar Content
  // ====================================
  
  const getAvatarContent = () => {
    if (avatarUrl) {
      return (
        <ImageWithFallback
          src={avatarUrl}
          alt={userName}
          className="w-full h-full object-cover"
        />
      );
    }
    
    // Default avatar icon based on variant
    const iconClass = "w-7 h-7";
    
    if (variant === 'guest') {
      return <User className={`${iconClass} text-gray-400`} />;
    }
    
    if (variant === 'provider') {
      return <Shield className={`${iconClass} text-[#4A90E2]`} />;
    }
    
    return <User className={`${iconClass} text-[#2AA676]`} />;
  };

  // ====================================
  // 🎯 Get Action Button
  // ====================================
  
  const getActionButton = () => {
    switch (variant) {
      case 'guest':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.();
            }}
            className="px-4 py-1.5 bg-gradient-to-l from-[#4A90E2] to-[#56CCF2] text-white rounded-lg text-sm font-medium hover:shadow-md transition-shadow whitespace-nowrap"
          >
            أكمل التسجيل
          </button>
        );
      
      case 'verified':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onActionClick?.();
            }}
            className="px-4 py-1.5 bg-[#F5EEE1] text-[#1F3D2B] rounded-lg text-sm font-medium hover:bg-[#2AA676] hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span>ملفي</span>
            <ChevronLeft className="w-3 h-3" />
          </button>
        );
      
      case 'provider':
        return (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#C8A86A] text-[#C8A86A]" />
              <span className="text-sm font-semibold text-[#1F3D2B]">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FolderKanban className="w-3 h-3" />
              <span>{projectCount} مشروع</span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge();

  // ====================================
  // 🎨 Render Component
  // ====================================
  
  return (
    <div
      onClick={onCardClick}
      className="w-full h-20 bg-white rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-all"
      style={{
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
      }}
      dir="rtl"
    >
      {/* ====================================
          🎭 Avatar with Activity Dot
          ==================================== */}
      
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F5EEE1] to-[#E5DED1] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {getAvatarContent()}
        </div>
        
        {/* Activity Dot */}
        <div className={`absolute bottom-0 right-0 w-4 h-4 ${getActivityDotColor()} rounded-full border-2 border-white`} />
      </div>

      {/* ====================================
          📝 User Info Section
          ==================================== */}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#1A1A1A] truncate">
            {userName}
          </h3>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${statusBadge.bgColor} ${statusBadge.textColor} text-xs flex-shrink-0`}>
            {statusBadge.icon}
            <span>{statusBadge.text}</span>
          </div>
        </div>
        
        {/* ID Copy Box */}
        <IDCopyBox id={userId} className="mb-1" />
      </div>

      {/* ====================================
          🔘 Action Section
          ==================================== */}
      
      <div className="flex-shrink-0">
        {getActionButton()}
      </div>
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { UserCardVariant, ActivityStatus, UserCardMiniProps };