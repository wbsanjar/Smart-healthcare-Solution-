import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, Brain } from 'lucide-react';

interface ReportResult {
  patientName: string;
  date: string;
  hospital: string;
  metrics: { name: string; value: string; normalRange: string; status: 'normal' | 'high' | 'low' }[];
  summary: string;
  recommendations: string[];
}

const mockAnalyze = (): ReportResult => ({
  patientName: 'Patient',
  date: new Date().toISOString().split('T')[0],
  hospital: 'NeuroCare Tech Labs',
  metrics: [
    { name: 'Hemoglobin', value: '13.2 g/dL', normalRange: '13.0-17.0 g/dL', status: 'normal' },
    { name: 'WBC Count', value: '7,800 /µL', normalRange: '4,500-11,000 /µL', status: 'normal' },
    { name: 'Platelets', value: '2.5 Lakh', normalRange: '1.5-4.5 Lakh', status: 'normal' },
    { name: 'Blood Sugar (Fasting)', value: '142 mg/dL', normalRange: '70-100 mg/dL', status: 'high' },
    { name: 'Blood Sugar (PP)', value: '198 mg/dL', normalRange: '<140 mg/dL', status: 'high' },
    { name: 'Total Cholesterol', value: '210 mg/dL', normalRange: '<200 mg/dL', status: 'high' },
    { name: 'Creatinine', value: '0.9 mg/dL', normalRange: '0.7-1.3 mg/dL', status: 'normal' },
    { name: 'BP Systolic', value: '128 mmHg', normalRange: '<120 mmHg', status: 'high' },
  ],
  summary: 'Your blood report shows elevated blood sugar levels indicating possible prediabetes. Cholesterol is borderline high. BP is slightly elevated. Other parameters are within normal range.',
  recommendations: [
    'Consult a physician for blood sugar management',
    'Consider dietary changes: reduce sugar and refined carbs',
    'Increase physical activity — 30 min brisk walking daily',
    'Monitor blood pressure weekly',
    'Repeat blood tests after 3 months',
  ],
});

export function ReportAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setAnalyzing(true);
      setTimeout(() => {
        setResult(mockAnalyze());
        setAnalyzing(false);
      }, 2500);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return { text: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' };
      case 'high': return { text: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
      case 'low': return { text: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' };
      default: return { text: 'text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-slide-up bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 border border-white rounded-full animate-float" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 border border-white rounded-full animate-float-slow" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg"><FileText className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold">AI Report Analyzer</h2>
              <p className="text-brand-100">Upload your blood report for AI-powered analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="animate-slide-up-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Report</h3>
            {!selectedFile ? (
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition block group">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3 group-hover:text-brand-500" />
                <p className="text-gray-600 font-medium">Upload blood report (PDF or Image)</p>
                <p className="text-sm text-gray-400 mt-1">CBC, Sugar, Lipid Profile, etc.</p>
                <input type="file" accept=".pdf,image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            ) : (
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-brand-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile}</p>
                    <p className="text-sm text-gray-500">Selected file</p>
                  </div>
                </div>
              </div>
            )}

            {analyzing && (
              <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">Extracting and analyzing report data...</p>
                <p className="text-sm text-gray-500 mt-1">Using OCR and AI to interpret your results</p>
              </div>
            )}

            {!selectedFile && !analyzing && (
              <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Supported Reports</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete Blood Count (CBC)</li>
                  <li>• Blood Sugar (Fasting / PP / Random)</li>
                  <li>• Lipid Profile</li>
                  <li>• Kidney Function Test</li>
                  <li>• Liver Function Test</li>
                  <li>• Thyroid Profile</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {result && !analyzing && (
            <>
              <div className="animate-scale-in bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                <div className="space-y-3">
                  {result.metrics.map((metric, i) => {
                    const colors = getStatusColor(metric.status);
                    return (
                      <div key={metric.name} className={`${colors.bg} rounded-lg p-3 animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{metric.name}</span>
                          <span className={`text-sm font-semibold ${colors.text}`}>{metric.value}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">Normal: {metric.normalRange}</span>
                          <span className={`flex items-center gap-1 text-xs font-medium ${colors.text}`}>
                            <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="animate-slide-up bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-500" /> AI Summary
                </h3>
                <p className="text-gray-700 mb-4">{result.summary}</p>
                <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                <ol className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      {rec}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Disclaimer:</span> This AI analysis is for reference only.
                    Please consult a doctor for proper medical advice.
                  </p>
                </div>
              </div>
            </>
          )}

          {!result && !analyzing && !selectedFile && (
            <div className="animate-fade-in-up bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Upload a report to see AI analysis</p>
              <p className="text-sm text-gray-500 mt-1">We'll extract values and explain them in simple terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
