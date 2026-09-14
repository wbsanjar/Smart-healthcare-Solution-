import { useState, useRef } from 'react';
import { Camera, X, Loader2, AlertTriangle, CheckCircle2, Activity, Zap } from 'lucide-react';
import { TriageBadge, TriageCard, TriageLevel } from './TriageBadge';
import { InjuryIllustration } from './Illustrations';

const injuryTypes = ['Cut', 'Burn', 'Swelling', 'Bleeding', 'Bruise', 'Infection', 'Fracture', 'Sprain'];

const mockAIResponse = (injuryType: string) => {
  const responses: Record<string, { triage: TriageLevel; steps: string[]; advice: string }> = {
    'Cut': {
      triage: 'yellow',
      steps: ['Clean the wound with clean water', 'Apply pressure to stop bleeding', 'Cover with sterile bandage', 'Keep the area elevated'],
      advice: 'If bleeding is severe or does not stop after 10 minutes of pressure, seek immediate medical help.',
    },
    'Burn': {
      triage: 'red',
      steps: ['Remove from heat source immediately', 'Cool the burn under running water for 20 minutes', 'Remove tight items before swelling', 'Cover loosely with clean cloth'],
      advice: 'Do NOT apply ice, butter, or creams. Seek medical attention for burns larger than palm size.',
    },
    'Swelling': {
      triage: 'green',
      steps: ['Rest the affected area', 'Apply ice pack wrapped in cloth for 15 min', 'Elevate the area', 'Take anti-inflammatory if available'],
      advice: 'Monitor for increased swelling or pain. If it gets worse, consult a doctor.',
    },
    'Bleeding': {
      triage: 'red',
      steps: ['Apply direct pressure with clean cloth', 'Elevate the injured area', 'Do NOT remove blood-soaked bandages', 'Add more layers if needed'],
      advice: 'Heavy bleeding is a medical emergency. Call for ambulance immediately.',
    },
    'Bruise': {
      triage: 'green',
      steps: ['Apply ice pack for 15 min every hour', 'Elevate the area', 'Rest', 'Use pain relief if needed'],
      advice: 'Most bruises heal within 2 weeks. Yellow/green color change is normal during healing.',
    },
    'Infection': {
      triage: 'yellow',
      steps: ['Clean the area with antiseptic', 'Apply antibiotic cream if available', 'Keep covered with sterile dressing', 'Monitor for spreading redness'],
      advice: 'Signs of spreading infection (redness, warmth, pus) require doctor attention.',
    },
    'Fracture': {
      triage: 'red',
      steps: ['Do NOT move the injured area', 'Immobilize with a splint if possible', 'Apply ice to reduce swelling', 'Keep patient calm and still'],
      advice: 'Do not try to realign bones. Immobilize and wait for medical help.',
    },
    'Sprain': {
      triage: 'yellow',
      steps: ['Rest the joint', 'Ice for 15-20 min every 2-3 hours', 'Compress with elastic bandage', 'Elevate above heart level'],
      advice: 'If you cannot bear weight or there is severe pain, it may be a fracture. Get X-ray done.',
    },
  };

  const matched = Object.keys(responses).find(k => injuryType.toLowerCase().includes(k.toLowerCase()));
  return matched ? responses[matched] : {
    triage: 'yellow' as TriageLevel,
    steps: ['Keep the area clean and monitored', 'Rest and avoid further injury', 'Apply ice if swelling present', 'Seek medical advice if condition worsens'],
    advice: 'Monitor symptoms. If pain or symptoms increase, consult a doctor.',
  };
};

export function InjuryScan() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedInjury, setSelectedInjury] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ triage: TriageLevel; steps: string[]; advice: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedInjury) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(mockAIResponse(selectedInjury));
      setAnalyzing(false);
    }, 2000);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setSelectedInjury('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Injury Scan</h2>
                <p className="text-orange-100">AI-assisted preliminary triage — upload an injury photo</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Green: Minor</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Yellow: Needs Doctor</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Red: Emergency</span>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28">
            <InjuryIllustration className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Injury Photo</h3>
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition group"
              >
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3 group-hover:text-orange-400" />
                <p className="text-gray-600 font-medium">Click to upload injury photo</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG or WEBP</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            ) : (
              <div className="relative">
                <img src={selectedFile} alt="Injury" className="w-full h-64 object-cover rounded-xl" />
                <button onClick={resetAll} className="absolute top-2 right-2 p-1.5 bg-gray-900/50 text-white rounded-full hover:bg-gray-900/70 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="animate-slide-up-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Injury Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {injuryTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedInjury(type)}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                    selectedInjury === type
                      ? 'bg-orange-50 border-orange-300 text-orange-700 ring-1 ring-orange-400'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!selectedInjury || analyzing}
              className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Zap className="w-5 h-5" /> Analyze Injury</>}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {analyzing && (
            <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">AI is analyzing the injury...</p>
              <p className="text-sm text-gray-500 mt-1">Identifying wound type, severity, and risk level</p>
              <div className="mt-4 flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {result && !analyzing && (
            <>
              <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Triage Result</h3>
                  <TriageBadge level={result.triage} size="md" />
                </div>

                <TriageCard level={result.triage} />

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    First Aid Steps
                  </h4>
                  <ol className="space-y-2">
                    {result.steps.map((step, i) => (
                      <li key={i} className={`flex items-start gap-2 animate-fade-in-up-${i + 1}`}>
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-4 p-4 bg-brand-50 border border-brand-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-brand-900">AI Advice</p>
                      <p className="text-sm text-brand-800">{result.advice}</p>
                    </div>
                  </div>
                </div>
              </div>

              {result.triage === 'red' && (
                <div className="animate-slide-up bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">This may be a medical emergency</h3>
                      <p className="text-sm text-red-800 mb-3">Please call for an ambulance or go to the nearest hospital immediately.</p>
                      <div className="flex gap-3">
                        <a href="tel:108" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Call 108</a>
                        <button className="px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg text-sm font-medium hover:bg-red-50 transition">Request Ambulance</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="animate-fade-in-up-5 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Disclaimer:</span> This is AI-assisted preliminary triage only.
                    Always consult a medical professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </>
          )}

          {!result && !analyzing && (
            <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload an injury photo and select the type</p>
              <p className="text-sm text-gray-500">AI will analyze the wound and provide first-aid guidance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
