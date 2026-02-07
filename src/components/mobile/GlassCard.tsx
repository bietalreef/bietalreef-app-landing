import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
}

export function GlassCard({ icon: Icon, emoji, title, description }: GlassCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2AA676]/5 to-[#C8A86A]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Content */}
      <div className="relative flex items-start gap-3">
        {/* Icon/Emoji */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#2AA676]/10 to-[#C8A86A]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {Icon && <Icon className="w-5 h-5 text-[#2AA676]" />}
          {emoji && <span className="text-xl">{emoji}</span>}
          {!Icon && !emoji && (
            <div className="w-2 h-2 rounded-full bg-[#2AA676]" />
          )}
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[#1F3D2B] font-semibold text-sm mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {title}
          </h4>
          {description && (
            <p className="text-[#1F3D2B]/60 text-xs leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
