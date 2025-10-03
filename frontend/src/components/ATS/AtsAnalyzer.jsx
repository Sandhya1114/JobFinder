import React, { useState } from 'react';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, TrendingUp, Target, Award, Loader2 } from 'lucide-react';
import './AtsAnalyzer.css';

const ATSResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Backend API URL - uses your existing backend
  const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL  || 'http://localhost:5000';

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      let text = '';
      
      if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        setError('For demo: Please use text files or paste text directly');
        return;
      }

      if (!text || text.trim().length < 50) {
        setError('Text must be at least 50 characters');
        return;
      }

      if (type === 'resume') {
        setResumeFile(file);
        setResumeText(text);
      } else {
        setJobDescFile(file);
        setJobDescText(text);
      }
      setError('');
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    }
  };

  const analyzeWithBackend = async (resumeContent, jobDescContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeContent,
          jobDescContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisResults = await response.json();
      return analysisResults;
    } catch (err) {
      console.error('Analysis Error:', err);
      throw new Error(`Analysis failed: ${err.message}`);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const analysisResults = await analyzeWithBackend(resumeText, jobDescText);
      setResults(analysisResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ATS Resume Analyzer</h1>
          <p className="text-gray-600">Get instant AI-powered feedback on your resume</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <FileText size={20} />
                  Resume *
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50"
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                  />
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  {resumeFile ? (
                    <div>
                      <p className="text-green-600 font-medium">✓ {resumeFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          setResumeText('');
                        }}
                        className="mt-2 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">Click to upload</p>
                      <p className="text-sm text-gray-400">TXT files only</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-3">
                  <Briefcase size={20} />
                  Job Description (Optional)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer bg-gray-50"
                  onClick={() => document.getElementById('jobdesc-input').click()}
                >
                  <input
                    id="jobdesc-input"
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')}
                  />
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  {jobDescFile ? (
                    <div>
                      <p className="text-green-600 font-medium">✓ {jobDescFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobDescFile(null);
                          setJobDescText('');
                        }}
                        className="mt-2 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">Click to upload</p>
                      <p className="text-sm text-gray-400">For better matching</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-gray-700">Or paste text directly</summary>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description Text</label>
                  <textarea
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                    placeholder="Paste job description here (optional)..."
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </details>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {results && (
            <div className="mt-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
                <div className="inline-block relative">
                  <svg viewBox="0 0 200 200" className="w-48 h-48">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={getScoreColor(results.ats_score)}
                      strokeWidth="12"
                      strokeDasharray={`${(results.ats_score / 100) * 565} 565`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold" style={{ color: getScoreColor(results.ats_score) }}>
                      {results.ats_score}
                    </div>
                    <div className="text-lg text-gray-600">{getScoreLabel(results.ats_score)}</div>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 max-w-2xl mx-auto">{results.overall_assessment}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                  <TrendingUp size={20} />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(results.score_breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span style={{ color: getScoreColor(value) }} className="font-bold">{value}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${value}%`,
                            background: getScoreColor(value)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-green-900 mb-4">
                    <CheckCircle size={18} />
                    Present Skills ({results.present_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.present_skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-orange-900 mb-4">
                    <AlertCircle size={18} />
                    Missing Skills
                  </h3>
                  <div className="space-y-3">
                    {results.missing_skills.critical?.length > 0 && (
                      <div>
                        <strong className="text-red-700">Critical:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.missing_skills.critical.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.missing_skills.important?.length > 0 && (
                      <div>
                        <strong className="text-orange-700">Important:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {results.missing_skills.important.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                  <Target size={20} />
                  Actionable Suggestions
                </h3>
                <div className="space-y-4">
                  {results.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{suggestion.category}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{suggestion.recommendation}</p>
                      <p className="text-sm text-gray-600 italic">{suggestion.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>Powered by Groq AI & Llama 3.3 70B</p>
        </div>
      </div>
    </div>
  );
};

export default ATSResumeAnalyzer;