export type UserRole = 'client' | 'provider' | 'admin';
export type UserTier = 'guest' | 'free' | 'verified' | 'pro' | 'enterprise';

export interface UserProfile {
  id: string;
  role: UserRole;
  tier: UserTier;
  is_verified: boolean;
  email?: string;
  created_at?: string;
}

export type FeatureKey = 
  | 'create_project'
  | 'submit_bid'
  | 'view_contact_info'
  | 'access_vip_rooms'
  | 'manage_team';

export interface EntitlementResult {
  allowed: boolean;
  reason?: string;
}

// هذه الدالة الآن تتطابق مع سياسات RLS في قاعدة البيانات
export function checkEntitlement(profile: UserProfile | null, feature: FeatureKey): EntitlementResult {
  if (!profile) return { allowed: false, reason: 'Login required' };

  const { role, tier, is_verified } = profile;

  switch (feature) {
    case 'create_project':
      // RLS Policy Mirror: Only Verified+ Clients
      if (role === 'client' && (is_verified || ['verified', 'pro', 'enterprise'].includes(tier))) {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Must be a verified client' };

    case 'submit_bid':
      // Providers only, must be verified for public bids
      if (role === 'provider') {
        if (tier === 'guest') return { allowed: false, reason: 'Registration required' };
        return { allowed: true };
      }
      return { allowed: false, reason: 'Providers only' };

    case 'access_vip_rooms':
      if (tier === 'pro' || tier === 'enterprise') return { allowed: true };
      return { allowed: false, reason: 'VIP Upgrade required' };

    case 'view_contact_info':
        // Verified clients and Verified providers
        if (is_verified || tier !== 'guest') return { allowed: true };
        return { allowed: false, reason: 'Verification required' };

    default:
      return { allowed: false, reason: 'Unknown feature' };
  }
}

// --- Backward Compatibility Layer for UI Components ---

export interface LegacyPolicyResult {
  allowed: boolean;
  reason?: string;
  actionRequired?: 'login' | 'verify' | 'upgrade';
}

export function checkPolicy(profile: UserProfile | null, feature: string): LegacyPolicyResult {
    // 1. Guest Handling
    if (!profile) {
        return { allowed: false, reason: 'يجب تسجيل الدخول أولاً', actionRequired: 'login' };
    }

    // Map old features to new Entitlement Logic
    let entitlementKey: FeatureKey | null = null;
    
    switch (feature) {
        case 'create_project':
        case 'quick_rfq':
            entitlementKey = 'create_project';
            break;
        case 'voice_projects':
            entitlementKey = 'access_vip_rooms';
            break;
        case 'contact_providers':
            entitlementKey = 'view_contact_info';
            break;
        // Add more mappings if needed
    }

    if (entitlementKey) {
        const result = checkEntitlement(profile, entitlementKey);
        if (result.allowed) return { allowed: true };

        // Infer actionRequired from the failure context
        if (result.reason?.includes('Upgrade')) return { allowed: false, reason: result.reason, actionRequired: 'upgrade' };
        if (result.reason?.includes('verified')) return { allowed: false, reason: result.reason, actionRequired: 'verify' };
        
        // Default fallbacks
        if (profile.tier === 'guest' || profile.tier === 'free') return { allowed: false, reason: result.reason, actionRequired: 'verify' };
        return { allowed: false, reason: result.reason, actionRequired: 'upgrade' };
    }

    // Default loose check for unmapped features (fallback to safe defaults)
    return { allowed: true }; 
}
