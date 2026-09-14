export type TriageLevel = 'green' | 'yellow' | 'red';

const triageConfig = {
  green: {
    label: 'Green - Minor',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    icon: '●',
    description: 'Home care & monitor',
    action: 'Self-care recommended',
  },
  yellow: {
    label: 'Yellow - Needs Doctor',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-200',
    icon: '●',
    description: 'Doctor consultation needed',
    action: 'Book a consultation',
  },
  red: {
    label: 'Red - Emergency',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: '●',
    description: 'Immediate emergency care',
    action: 'Call ambulance now',
  },
};

export function TriageBadge({ level, size = 'md' }: { level: TriageLevel; size?: 'sm' | 'md' | 'lg' }) {
  const config = triageConfig[level];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-lg px-6 py-3' : 'text-sm px-4 py-2';
  return (
    <span className={`inline-flex items-center gap-2 font-semibold rounded-full ${config.bg} ${config.color} ${sizeClass}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${level === 'green' ? 'bg-green-500' : level === 'yellow' ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
      {config.label}
    </span>
  );
}

export function TriageCard({ level }: { level: TriageLevel }) {
  const config = triageConfig[level];
  const colors = {
    green: { border: 'border-green-200', bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', accent: 'text-green-700' },
    yellow: { border: 'border-yellow-200', bg: 'bg-yellow-50', icon: 'bg-yellow-100 text-yellow-600', accent: 'text-yellow-700' },
    red: { border: 'border-red-200', bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', accent: 'text-red-700' },
  };
  const c = colors[level];
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full ${c.icon} flex items-center justify-center flex-shrink-0 text-lg font-bold`}>
          {level === 'red' ? '!' : level === 'yellow' ? '~' : '✓'}
        </div>
        <div>
          <h4 className={`font-semibold ${c.accent}`}>{level === 'green' ? 'Low Risk' : level === 'yellow' ? 'Medium Risk' : 'High Risk - Emergency'}</h4>
          <p className="text-sm text-gray-600">{config.description}</p>
          <p className={`text-sm font-medium ${c.accent} mt-1`}>{config.action}</p>
        </div>
      </div>
    </div>
  );
}

export function getTriageFromSymptoms(symptoms: string[], severity?: string): TriageLevel {
  const criticalSymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'loss of consciousness', 'unconscious', 'not breathing', 'heavy bleeding', 'stroke', 'seizure', 'severe burn', 'choking'];
  const moderateSymptoms = ['high fever', 'severe pain', 'broken bones', 'vomiting blood', 'moderate bleeding', 'deep cut', 'allergic reaction', 'swelling', 'infection'];
  

  if (severity === 'critical' || severity === 'high') return 'red';
  if (severity === 'medium') return 'yellow';
  if (severity === 'low') return 'green';

  const hasCritical = symptoms.some(s => criticalSymptoms.some(c => s.toLowerCase().includes(c)));
  if (hasCritical) return 'red';

  const hasModerate = symptoms.some(s => moderateSymptoms.some(m => s.toLowerCase().includes(m)));
  if (hasModerate) return 'yellow';

  return 'green';
}
