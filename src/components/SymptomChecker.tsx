import { useState } from 'react';
import { Search, ArrowLeft, Loader2, Activity, Brain, MessageCircle, CheckCircle2 } from 'lucide-react';
import { TriageBadge, TriageCard, TriageLevel } from './TriageBadge';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const commonSymptoms = [
  'Fever', 'Cough', 'Headache', 'Chest Pain', 'Breathing Difficulty',
  'Vomiting', 'Dizziness', 'Bleeding', 'Severe Pain', 'Fatigue',
  'Body Ache', 'Sore Throat', 'Skin Rash', 'Eye Irritation', 'Abdominal Pain',
];

const followUpQuestions: Record<string, Question[]> = {
  'Fever': [
    { id: 'fever_days', text: 'How many days have you had the fever?', options: [
      { label: 'Less than 1 day', value: 'acute' }, { label: '1-3 days', value: 'short' }, { label: '3-7 days', value: 'medium' }, { label: 'More than 7 days', value: 'chronic' },
    ]},
    { id: 'fever_temp', text: 'What is your temperature?', options: [
      { label: 'Below 100°F (37.8°C)', value: 'low' }, { label: '100-102°F (37.8-39°C)', value: 'moderate' }, { label: 'Above 102°F (39°C)', value: 'high' },
    ]},
    { id: 'fever_symptoms', text: 'Do you have any other symptoms?', options: [
      { label: 'Only fever', value: 'isolated' }, { label: 'With cough/cold', value: 'respiratory' }, { label: 'With body ache', value: 'bodyache' }, { label: 'With vomiting', value: 'severe' },
    ]},
  ],
  'Chest Pain': [
    { id: 'chest_type', text: 'What type of chest pain?', options: [
      { label: 'Sharp/stabbing', value: 'sharp' }, { label: 'Crushing/squeezing', value: 'crushing' }, { label: 'Dull ache', value: 'dull' }, { label: 'Burning', value: 'burning' },
    ]},
    { id: 'chest_duration', text: 'How long does it last?', options: [
      { label: 'A few seconds', value: 'seconds' }, { label: 'A few minutes', value: 'minutes' }, { label: 'Continuous', value: 'continuous' },
    ]},
    { id: 'chest_spread', text: 'Does the pain spread to other areas?', options: [
      { label: 'No, just chest', value: 'localized' }, { label: 'Left arm/jaw/back', value: 'radiating' }, { label: 'Shoulder/neck', value: 'upper' },
    ]},
  ],
  'Breathing Difficulty': [
    { id: 'breath_when', text: 'When do you feel breathless?', options: [
      { label: 'At rest', value: 'rest' }, { label: 'Walking slowly', value: 'mild' }, { label: 'Climbing stairs', value: 'moderate' }, { label: 'Lying down', value: 'orthopnea' },
    ]},
    { id: 'breath_associated', text: 'Associated symptoms?', options: [
      { label: 'Only breathlessness', value: 'isolated' }, { label: 'With wheezing', value: 'wheezing' }, { label: 'With chest tightness', value: 'tightness' }, { label: 'With cough', value: 'cough' },
    ]},
  ],
  'Headache': [
    { id: 'headache_type', text: 'Type of headache?', options: [
      { label: 'Throbbing/pulsating', value: 'migraine' }, { label: 'Tension band', value: 'tension' }, { label: 'Sharp/stabbing', value: 'cluster' }, { label: 'Whole head ache', value: 'general' },
    ]},
    { id: 'headache_duration', text: 'How long have you had this headache?', options: [
      { label: 'A few hours', value: 'hours' }, { label: '1-3 days', value: 'days' }, { label: 'More than a week', value: 'chronic' },
    ]},
  ],
};

const aiAdvice: Record<string, { triage: TriageLevel; advice: string; firstAid: string[] }> = {
  'chest_crushing': {
    triage: 'red',
    advice: 'This could be a heart attack. Seek emergency care immediately.',
    firstAid: ['Call emergency services (108) immediately', 'Help the person sit or lie down', 'If not allergic, help them chew 325mg aspirin', 'Loosen tight clothing', 'Stay with the person until help arrives'],
  },
  'breath_rest': {
    triage: 'red',
    advice: 'Breathlessness at rest is a medical emergency.',
    firstAid: ['Call emergency services immediately', 'Help the person sit upright', 'Loosen clothing around neck/chest', 'Open windows for fresh air', 'Keep them calm and reassured'],
  },
  'fever_high': {
    triage: 'yellow',
    advice: 'High fever needs medical attention. Monitor and consult a doctor.',
    firstAid: ['Take acetaminophen or ibuprofen if available', 'Apply cool compress to forehead', 'Drink plenty of fluids', 'Rest in a cool room', 'Monitor temperature every 4 hours'],
  },
  'default_green': {
    triage: 'green',
    advice: 'Your symptoms appear mild. Monitor and take rest.',
    firstAid: ['Get adequate rest', 'Stay hydrated', 'Take over-the-counter medication if needed', 'Monitor your symptoms', 'Consult doctor if symptoms worsen'],
  },
};

export function SymptomChecker() {
  const [step, setStep] = useState<'select' | 'questions' | 'result'>('select');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ triage: TriageLevel; advice: string; firstAid: string[] } | null>(null);

  const questions = selectedSymptom ? followUpQuestions[selectedSymptom] || [] : [];

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    setAnswers({});
    setCurrentQIndex(0);
    if (!followUpQuestions[symptom] || followUpQuestions[symptom].length === 0) {
      handleAnalyze(symptom, {});
    } else {
      setStep('questions');
    }
  };

  const handleAnswer = (qId: string, value: string) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      handleAnalyze(selectedSymptom, newAnswers);
    }
  };

  const handleAnalyze = (symptom: string, ans: Record<string, string>) => {
    setAnalyzing(true);
    setTimeout(() => {
      const key = Object.keys(ans).length > 0 ? Object.entries(ans).map(([, v]) => `${symptom.toLowerCase().replace(' ', '_')}_${v}`).find(key => aiAdvice[key]) : null;
      const advice = key ? aiAdvice[key] : aiAdvice[selectedSymptom === 'Chest Pain' ? 'chest_crushing' : selectedSymptom === 'Breathing Difficulty' ? 'breath_rest' : selectedSymptom === 'Fever' ? 'fever_high' : 'default_green'];
      setResult(advice);
      setAnalyzing(false);
      setStep('result');
    }, 2000);
  };

  const resetAll = () => {
    setStep('select');
    setSelectedSymptom('');
    setAnswers({});
    setCurrentQIndex(0);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-slide-up bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg"><Search className="w-6 h-6" /></div>
              <div>
                <h2 className="text-xl font-bold">AI Symptom Checker</h2>
                <p className="text-brand-100">Answer a few questions to assess your condition</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-28 h-28 opacity-30"><Brain className="w-full h-full" /></div>
        </div>
      </div>

      {step === 'select' && (
        <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What symptoms are you experiencing?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonSymptoms.map((symptom, i) => (
              <button
                key={symptom}
                onClick={() => handleSymptomSelect(symptom)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'questions' && questions.length > 0 && (
        <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{selectedSymptom} — Follow-up Questions</h3>
            <span className="text-sm text-gray-500">Question {currentQIndex + 1} of {questions.length}</span>
          </div>

          <div className="mb-6">
            <div className="flex gap-1 mb-6">
              {questions.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentQIndex ? 'bg-brand-500' : 'bg-gray-200'} transition`} />
              ))}
            </div>
            <p className="text-lg font-medium text-gray-900 mb-4">{questions[currentQIndex].text}</p>
            <div className="space-y-2">
              {questions[currentQIndex].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(questions[currentQIndex].id, opt.value)}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition font-medium"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} disabled={currentQIndex === 0}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
        </div>
      )}

      {analyzing && (
        <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Analyzing your symptoms...</p>
          <p className="text-sm text-gray-500 mt-1">AI is evaluating your responses</p>
        </div>
      )}

      {step === 'result' && result && (
        <>
          <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assessment Result</h3>
              <TriageBadge level={result.triage} size="md" />
            </div>
            <TriageCard level={result.triage} />

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-brand-500" /> AI Assessment
              </h4>
              <p className="text-gray-700">{result.advice}</p>
            </div>

            {result.firstAid.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-500" /> Recommended Steps
                </h4>
                <ol className="space-y-2">
                  {result.firstAid.map((step, i) => (
                    <li key={i} className={`flex items-start gap-2 animate-fade-in-up-${i + 1}`}>
                      <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={resetAll} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                Check Another Symptom
              </button>
              {result.triage === 'red' && (
                <a href="/" className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-center">
                  Emergency Help
                </a>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Disclaimer:</span> This AI assessment is for guidance only.
                Always consult a doctor for medical advice.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
