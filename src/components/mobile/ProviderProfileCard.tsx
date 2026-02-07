import { useState } from 'react';
import {
  Star, Shield, CheckCircle, MapPin, Clock,
  MessageCircle, Share2, Wrench,
  Award, Briefcase, ChevronLeft
} from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ──────────────────────────────────────────
// Provider Profile Card (individual)
// ──────────────────────────────────────────
interface ProviderProfileCardProps {
  provider: {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    location: string;
    isVerified: boolean;
    experience: string;
    completedProjects: number;
    status: 'online' | 'busy' | 'offline';
    hourlyRate: number;
  };
  onContact?: (id: string) => void;
  onViewProfile?: (id: string) => void;
}

export function ProviderProfileCard({ provider, onContact, onViewProfile }: ProviderProfileCardProps) {
  const { language } = useTranslation('services');
  const isEn = language === 'en';

  const statusColors: Record<string, string> = {
    online: 'bg-[#2AA676]',
    busy: 'bg-[#F2994A]',
    offline: 'bg-[#EB5757]',
  };

  const statusLabels: Record<string, string> = {
    online: isEn ? 'Available' : 'متاح',
    busy: isEn ? 'Busy' : 'مشغول',
    offline: isEn ? 'Offline' : 'غير متصل',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#F5EEE1] overflow-hidden hover:shadow-lg transition-all">
      <div className="flex">
        {/* Image */}
        <div className="relative w-[130px] flex-shrink-0">
          <ImageWithFallback
            src={provider.avatar}
            alt={provider.name}
            className="w-full h-full object-cover min-h-[160px]"
          />
          {provider.isVerified && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2">
            <div className={`${statusColors[provider.status]} text-white px-2 py-1 rounded-lg text-[10px] text-center font-bold`}
              style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
              {statusLabels[provider.status]}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="text-[#1A1A1A] font-bold text-[15px] mb-1" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
            {provider.name}
          </h3>
          <p className="text-[#1A1A1A]/60 text-xs mb-2" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
            {provider.specialty}
          </p>

          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#C8A86A] text-[#C8A86A]" />
              <span className="text-[#1A1A1A] text-xs font-bold">{provider.rating}</span>
              <span className="text-[#1A1A1A]/40 text-[10px]">({provider.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#4A90E2]" />
              <span className="text-[#1A1A1A]/60 text-[10px]">{provider.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#2AA676]" />
              <span className="text-[#1A1A1A]/60 text-[10px]">{provider.experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-[#F2994A]" />
              <span className="text-[#1A1A1A]/60 text-[10px]">{provider.completedProjects} {isEn ? 'projects' : 'مشروع'}</span>
            </div>
          </div>

          {/* Price + Actions */}
          <div className="mt-auto flex items-center gap-2">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-3 py-1.5 rounded-xl text-xs font-bold">
              {provider.hourlyRate} {isEn ? 'AED' : 'د.إ'}
            </div>
            <button
              onClick={() => onContact?.(provider.id)}
              className="flex items-center gap-1 bg-[#F5EEE1] text-[#1F3D2B] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#E8DFD0] transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              {isEn ? 'Contact' : 'تواصل'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Providers Tab Content (used in service detail pages)
// ──────────────────────────────────────────
export function ProvidersTabContent() {
  const { language } = useTranslation('services');
  const isEn = language === 'en';

  // Demo providers data
  const providers = [
    {
      id: 'prov-1',
      name: isEn ? 'Ahmed Al Hammadi' : 'أحمد الحمادي',
      specialty: isEn ? 'General Contractor' : 'مقاول عام',
      avatar: 'https://images.unsplash.com/photo-1659353587484-a83a0ddf8aca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.9,
      reviewCount: 156,
      location: isEn ? 'Dubai' : 'دبي',
      isVerified: true,
      experience: isEn ? '15 years' : '15 سنة',
      completedProjects: 234,
      status: 'online' as const,
      hourlyRate: 150,
    },
    {
      id: 'prov-2',
      name: isEn ? 'Al Noor Engineering' : 'النور للهندسة',
      specialty: isEn ? 'Engineering Consultancy' : 'استشارات هندسية',
      avatar: 'https://images.unsplash.com/photo-1606309028742-4039c7b625b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 5.0,
      reviewCount: 89,
      location: isEn ? 'Abu Dhabi' : 'أبوظبي',
      isVerified: true,
      experience: isEn ? '20 years' : '20 سنة',
      completedProjects: 456,
      status: 'online' as const,
      hourlyRate: 200,
    },
    {
      id: 'prov-3',
      name: isEn ? 'Khalid Contracting' : 'خالد للمقاولات',
      specialty: isEn ? 'Building & Renovation' : 'بناء وترميم',
      avatar: 'https://images.unsplash.com/photo-1748640857973-93524ef0fe7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.7,
      reviewCount: 67,
      location: isEn ? 'Sharjah' : 'الشارقة',
      isVerified: false,
      experience: isEn ? '8 years' : '8 سنوات',
      completedProjects: 98,
      status: 'busy' as const,
      hourlyRate: 120,
    },
    {
      id: 'prov-4',
      name: isEn ? 'Al Waha Maintenance' : 'الواحة للصيانة',
      specialty: isEn ? 'Maintenance & Repair' : 'صيانة وإصلاح',
      avatar: 'https://images.unsplash.com/photo-1651596082386-f83cfa746e64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      rating: 4.8,
      reviewCount: 112,
      location: isEn ? 'Ajman' : 'عجمان',
      isVerified: true,
      experience: isEn ? '12 years' : '12 سنة',
      completedProjects: 178,
      status: 'online' as const,
      hourlyRate: 180,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#1F3D2B] font-bold text-lg" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
          {isEn ? 'Available Providers' : 'المزودون المتاحون'}
        </h3>
        <div className="flex items-center gap-1 bg-[#2AA676]/10 px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-[#2AA676]" />
          <span className="text-[#2AA676] text-xs font-bold" style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
            {providers.filter(p => p.isVerified).length} {isEn ? 'verified' : 'موثق'}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 bg-gradient-to-l from-[#F5EEE1] to-white rounded-2xl p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center">
            <Award className="w-4 h-4 text-[#4A90E2]" />
          </div>
          <div>
            <p className="text-[#1A1A1A] text-xs font-bold">{providers.length}+</p>
            <p className="text-[#1A1A1A]/40 text-[10px]">{isEn ? 'Providers' : 'مزود'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2AA676]/10 rounded-xl flex items-center justify-center">
            <Star className="w-4 h-4 text-[#C8A86A]" />
          </div>
          <div>
            <p className="text-[#1A1A1A] text-xs font-bold">4.8</p>
            <p className="text-[#1A1A1A]/40 text-[10px]">{isEn ? 'Avg Rating' : 'متوسط التقييم'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F2994A]/10 rounded-xl flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#F2994A]" />
          </div>
          <div>
            <p className="text-[#1A1A1A] text-xs font-bold">{isEn ? '< 2hrs' : '< ساعتين'}</p>
            <p className="text-[#1A1A1A]/40 text-[10px]">{isEn ? 'Response' : 'استجابة'}</p>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid gap-4">
        {providers.map((provider) => (
          <ProviderProfileCard
            key={provider.id}
            provider={provider}
          />
        ))}
      </div>

      {/* Load More */}
      <button className="w-full bg-[#F5EEE1] text-[#1F3D2B] py-3 rounded-2xl font-bold text-sm hover:bg-[#E8DFD0] transition-colors flex items-center justify-center gap-2"
        style={{ fontFamily: isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif' }}>
        {isEn ? 'View More Providers' : 'عرض المزيد من المزودين'}
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
