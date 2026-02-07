export function BietAlreefLogo() {
  return (
    <div className="w-[56px] h-[56px] bg-gradient-to-br from-[#5B7FE8] to-[#7B5FE8] rounded-[16px] shadow-md flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sun */}
        <circle cx="28" cy="8" r="3" fill="#FFD700" opacity="0.9" />
        
        {/* Palm Tree */}
        <g opacity="0.95">
          <line x1="26" y1="28" x2="26" y2="16" stroke="#F5EEE1" strokeWidth="1.2" />
          <path d="M 26 16 Q 24 14 22 16" stroke="#F5EEE1" strokeWidth="1.2" fill="none" />
          <path d="M 26 16 Q 28 14 30 16" stroke="#F5EEE1" strokeWidth="1.2" fill="none" />
          <path d="M 26 19 Q 24 18 22 20" stroke="#F5EEE1" strokeWidth="1.2" fill="none" />
          <path d="M 26 19 Q 28 18 30 20" stroke="#F5EEE1" strokeWidth="1.2" fill="none" />
        </g>
        
        {/* Traditional House */}
        <g>
          {/* Base */}
          <rect x="8" y="20" width="14" height="10" fill="#F5EEE1" />
          
          {/* Roof */}
          <path d="M 6 20 L 15 12 L 24 20 Z" fill="#C9A86B" />
          
          {/* Door */}
          <rect x="12.5" y="23" width="5" height="7" fill="#8B7355" rx="0.8" />
          
          {/* Windows */}
          <rect x="9" y="21.5" width="2.5" height="2.5" fill="#5B7FE8" opacity="0.7" />
          <rect x="18.5" y="21.5" width="2.5" height="2.5" fill="#5B7FE8" opacity="0.7" />
          
          {/* Roof Detail */}
          <line x1="15" y1="12" x2="15" y2="15" stroke="#C9A86B" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
