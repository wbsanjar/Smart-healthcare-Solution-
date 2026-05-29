export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="250" cy="200" r="180" fill="url(#grad1)" opacity="0.1" />
      <circle cx="250" cy="200" r="120" fill="url(#grad2)" opacity="0.15" />
      <circle cx="250" cy="200" r="60" fill="url(#grad1)" opacity="0.2" />

      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      <g transform="translate(250, 180)">
        <rect x="-35" y="-40" width="70" height="90" rx="12" fill="#3B82F6" opacity="0.2" />
        <rect x="-25" y="-30" width="50" height="70" rx="8" fill="white" />
        <path d="M-5-10 L5-10 L5-5 L10-5 L10 5 L5 5 L5 10 L-5 10 L-5 5 L-10 5 L-10-5 L-5-5 Z" fill="#3B82F6" />
        <path d="M-12 15 L12 15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M-12 22 L12 22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M-8 29 L8 29" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g transform="translate(170, 140)">
        <circle cx="0" cy="0" r="25" fill="#10B981" opacity="0.15" />
        <path d="M-8-8 L8-8 L8-12 L12-12 L12 12 L8 12 L8 8 L-8 8 L-8 12 L-12 12 L-12-12 L-8-12 Z" fill="#10B981" />
        <path d="M0-18 A18 18 0 1 1-18 0" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.5" />
      </g>

      <g transform="translate(330, 150)">
        <circle cx="0" cy="0" r="20" fill="#8B5CF6" opacity="0.15" />
        <path d="M-6-6 L6-6 L6 6 L-6 6 Z" fill="#8B5CF6" opacity="0.3" />
        <path d="M0-2 L4-8 L8-8 L8-4 L2 2 Z" fill="#8B5CF6" opacity="0.4" />
      </g>

      <g transform="translate(250, 310)">
        <rect x="-80" y="-10" width="160" height="20" rx="10" fill="#3B82F6" opacity="0.08" />
      </g>

      <g transform="translate(140, 260)">
        <circle cx="0" cy="0" r="8" fill="#F59E0B" opacity="0.2" />
        <circle cx="0" cy="0" r="4" fill="#F59E0B" opacity="0.4" />
      </g>
      <g transform="translate(360, 260)">
        <circle cx="0" cy="0" r="8" fill="#F59E0B" opacity="0.2" />
        <circle cx="0" cy="0" r="4" fill="#F59E0B" opacity="0.4" />
      </g>
    </svg>
  );
}

export function EmergencyIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="url(#emergencyGrad)" opacity="0.1" />
      <defs>
        <radialGradient id="emergencyGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </radialGradient>
      </defs>
      <g transform="translate(100, 85)">
        <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#EF4444" opacity="0.15" />
        <rect x="-12" y="-24" width="24" height="48" rx="4" fill="white" />
        <path d="M-4 0 L4 0 L4 6 L10 6 L10 14 L4 14 L4 20 L-4 20 L-4 14 L-10 14 L-10 6 L-4 6 Z" fill="#EF4444" />
      </g>
      <g transform="translate(100, 155)">
        <rect x="-50" y="-6" width="100" height="12" rx="6" fill="#EF4444" opacity="0.08" />
      </g>
      <g transform="translate(60, 70)">
        <path d="M0 0 L5-8 L10-8 L10-3 L5 5 Z" fill="#F59E0B" opacity="0.4" />
        <path d="M15 5 L20-3 L25-3 L25 2 L20 10 Z" fill="#F59E0B" opacity="0.3" />
      </g>
      <g transform="translate(130, 65)">
        <path d="M0 0 L5-6 L10-6 L10-1 L5 7 Z" fill="#F59E0B" opacity="0.4" />
        <path d="M-12 5 L-7-3 L-2-3 L-2 2 L-7 10 Z" fill="#F59E0B" opacity="0.3" />
      </g>
    </svg>
  );
}

export function HospitalIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="url(#hospitalGrad)" opacity="0.1" />
      <defs>
        <radialGradient id="hospitalGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </radialGradient>
      </defs>
      <g transform="translate(100, 90)">
        <rect x="-30" y="-35" width="60" height="70" rx="6" fill="#3B82F6" opacity="0.1" />
        <rect x="-24" y="-29" width="48" height="58" rx="4" fill="white" stroke="#3B82F6" strokeWidth="1.5" />
        <rect x="-10" y="-20" width="20" height="15" rx="2" fill="#3B82F6" opacity="0.15" />
        <rect x="-10" y="0" width="20" height="15" rx="2" fill="#3B82F6" opacity="0.15" />
        <rect x="12" y="-20" width="8" height="35" rx="2" fill="#3B82F6" opacity="0.1" />
        <rect x="-20" y="-20" width="8" height="35" rx="2" fill="#3B82F6" opacity="0.1" />
        <rect x="-6" y="-14" width="12" height="3" rx="1.5" fill="#3B82F6" />
        <path d="M-12-8 L12-8" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M-12 12 L12 12" stroke="#3B82F6" strokeWidth="1.5" />
      </g>
      <g transform="translate(100, 165)">
        <rect x="-50" y="-5" width="100" height="10" rx="5" fill="#3B82F6" opacity="0.08" />
      </g>
    </svg>
  );
}

export function AmbulanceIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="url(#ambulanceGrad)" opacity="0.1" />
      <defs>
        <radialGradient id="ambulanceGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
      </defs>
      <g transform="translate(100, 85)">
        <rect x="-40" y="-20" width="80" height="40" rx="8" fill="#10B981" opacity="0.1" />
        <rect x="-35" y="-15" width="70" height="30" rx="6" fill="white" stroke="#10B981" strokeWidth="1.5" />
        <rect x="-20" y="-10" width="30" height="20" rx="3" fill="#10B981" opacity="0.1" />
        <path d="M-12 0 L-8 0 L-8-4 L-4-4 L-4 0 L0 0 L0 4 L-4 4 L-4 8 L-8 8 L-8 4 L-12 4 Z" fill="#EF4444" opacity="0.8" />
        <rect x="15" y="-10" width="15" height="20" rx="3" fill="#10B981" opacity="0.1" />
        <circle cx="-25" cy="12" r="6" fill="#1F2937" opacity="0.3" />
        <circle cx="-25" cy="12" r="3" fill="#1F2937" opacity="0.5" />
        <circle cx="25" cy="12" r="6" fill="#1F2937" opacity="0.3" />
        <circle cx="25" cy="12" r="3" fill="#1F2937" opacity="0.5" />
      </g>
      <g transform="translate(100, 155)">
        <rect x="-50" y="-5" width="100" height="10" rx="5" fill="#10B981" opacity="0.08" />
      </g>
    </svg>
  );
}

export function ChatIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="url(#chatGrad)" opacity="0.1" />
      <defs>
        <radialGradient id="chatGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </radialGradient>
      </defs>
      <g transform="translate(100, 95)">
        <rect x="-35" y="-30" width="70" height="50" rx="10" fill="#8B5CF6" opacity="0.1" />
        <rect x="-30" y="-25" width="60" height="40" rx="8" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
        <circle cx="-15" cy="-5" r="4" fill="#8B5CF6" opacity="0.3" />
        <circle cx="0" cy="-5" r="4" fill="#8B5CF6" opacity="0.5" />
        <circle cx="15" cy="-5" r="4" fill="#8B5CF6" opacity="0.3" />
        <rect x="-20" y="8" width="40" height="4" rx="2" fill="#8B5CF6" opacity="0.2" />
        <rect x="-15" y="16" width="30" height="4" rx="2" fill="#8B5CF6" opacity="0.15" />
      </g>
      <g transform="translate(100, 165)">
        <rect x="-50" y="-5" width="100" height="10" rx="5" fill="#8B5CF6" opacity="0.08" />
      </g>
    </svg>
  );
}

export function ProfileIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="100" cy="100" r="90" fill="url(#profileGrad)" opacity="0.1" />
      <defs>
        <radialGradient id="profileGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#10B981" />
        </radialGradient>
      </defs>
      <g transform="translate(100, 80)">
        <circle cx="0" cy="-10" r="20" fill="#3B82F6" opacity="0.1" />
        <circle cx="0" cy="-10" r="14" fill="#3B82F6" opacity="0.15" />
        <circle cx="0" cy="-10" r="8" fill="#3B82F6" opacity="0.3" />
        <ellipse cx="0" cy="25" rx="25" ry="15" fill="#3B82F6" opacity="0.1" />
      </g>
      <g transform="translate(100, 155)">
        <rect x="-50" y="-5" width="100" height="10" rx="5" fill="#3B82F6" opacity="0.08" />
      </g>
    </svg>
  );
}
