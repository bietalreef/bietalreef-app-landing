import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  ChevronUp,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ====================================
// 📌 Types & Interfaces
// ====================================

type ProviderStatus = 'available' | 'busy' | 'closed';

interface ProviderMapCardProps {
  providerId: string;
  name: string;
  nameEn?: string;
  category: string;
  tags?: string[];
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  distance?: number; // in km
  status: ProviderStatus;
  onDetailsClick?: () => void;
  onRequestClick?: () => void;
  onWhatsAppClick?: () => void;
  onCallClick?: () => void;
  isExpanded?: boolean;
}

// ====================================
// 🎨 Provider Map Card Component
// ====================================

export function ProviderMapCard({
  providerId,
  name,
  nameEn,
  category,
  tags = [],
  avatarUrl,
  rating,
  reviewCount,
  distance,
  status,
  onDetailsClick,
  onRequestClick,
  onWhatsAppClick,
  onCallClick,
  isExpanded = false,
}: ProviderMapCardProps) {
  
  // ====================================
  // 🎯 Get Status Config
  // ====================================
  
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          text: 'متاح الآن',
          dotColor: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      case 'busy':
        return {
          text: 'مشغول – متاح بعد قليل',
          dotColor: 'bg-yellow-500',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
        };
      case 'closed':
        return {
          text: 'مغلق حالياً',
          dotColor: 'bg-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          text: 'غير متاح',
          dotColor: 'bg-gray-500',
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const statusConfig = getStatusConfig();

  // ====================================
  // 🎯 Get Verification Config
  // ====================================
  
  const getVerificationConfig = () => {
    return {
      text: 'مزود موثق',
      dotColor: 'bg-[#4A90E2]',
      textColor: 'text-[#4A90E2]',
      bgColor: 'bg-[#4A90E2]/10',
    };
  };

  const verificationConfig = getVerificationConfig();

  // ====================================
  // 🖼️ Get Avatar Content
  // ====================================
  
  const getAvatarContent = () => {
    if (avatarUrl) {
      return (
        <ImageWithFallback
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] flex items-center justify-center text-white text-xl font-bold">
        {name.charAt(0)}
      </div>
    );
  };

  // ====================================
  // 🎨 Render Component
  // ====================================
  
  return (
    <div
      className="w-full bg-white rounded-t-3xl shadow-2xl"
      style={{
        maxHeight: isExpanded ? '80vh' : '280px',
        transition: 'max-height 0.3s ease-in-out',
      }}
      dir="rtl"
    >
      {/* Drag Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1 bg-gray-300 rounded-full" />
      </div>

      <div className="px-5 pb-5">
        {/* ====================================
            🎭 Header Section
            ==================================== */}
        
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#F5EEE1] flex-shrink-0 shadow-md">
            {getAvatarContent()}
          </div>

          {/* Provider Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#1F3D2B] mb-1 truncate">
              {name}
            </h3>
            {nameEn && (
              <p className="text-xs text-gray-500 mb-2">{nameEn}</p>
            )}
            
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-[#4A90E2]/10 text-[#4A90E2] text-xs rounded-lg font-medium">
                {category}
              </span>
            </div>

            {/* Rating + Distance */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#C8A86A] text-[#C8A86A]" />
                <span className="font-semibold text-[#1F3D2B]">{rating.toFixed(1)}</span>
                <span className="text-gray-500">({reviewCount})</span>
              </div>
              
              {distance !== undefined && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{distance.toFixed(1)} كم</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ====================================
            🏷️ Tags
            ==================================== */}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-[#F5EEE1] text-[#1F3D2B] text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-[#F5EEE1] text-gray-500 text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ====================================
            ✓ Verification Badge
            ==================================== */}
        
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${verificationConfig.bgColor} mb-4`}>
          <CheckCircle className={`w-4 h-4 ${verificationConfig.textColor}`} />
          <span className={`text-sm font-medium ${verificationConfig.textColor}`}>
            {verificationConfig.text}
          </span>
        </div>

        {/* ====================================
            🔘 Action Buttons
            ==================================== */}
        
        <div className="space-y-2">
          {/* Primary: Details */}
          <button
            onClick={onDetailsClick}
            className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>التفاصيل الكاملة</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onRequestClick}
              className="py-2.5 px-3 bg-[#4A90E2] text-white rounded-xl text-sm font-medium hover:bg-[#3A7BC8] transition-colors"
            >
              طلب خدمة
            </button>
            
            <button
              onClick={onWhatsAppClick}
              className="py-2.5 px-3 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20BA59] transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </button>
            
            <button
              onClick={onCallClick}
              className="py-2.5 px-3 bg-[#F5EEE1] text-[#1F3D2B] rounded-xl text-sm font-medium hover:bg-[#2AA676] hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال</span>
            </button>
          </div>
        </div>

        {/* ====================================
            ⬆️ Expand Indicator
            ==================================== */}
        
        <div className="flex justify-center mt-3">
          <button className="text-gray-400 hover:text-[#2AA676] transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================================
// 📦 Export Types
// ====================================

export type { ProviderStatus, ProviderMapCardProps };