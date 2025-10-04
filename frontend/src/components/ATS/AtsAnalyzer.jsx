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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      let text = '';

      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        // Load PDF.js library if not already loaded
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load PDF.js'));
          });

          // Set worker
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        text = await extractTextFromPDF(file);
      } else {
        setError('Please upload PDF or TXT files only');
        setAnalyzing(false);
        return;
      }

      if (!text || text.trim().length < 10) {
        setError('Text must be at least 10 characters');
        setAnalyzing(false);
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
    } finally {
      setAnalyzing(false);
    }
  };
const analyzeWithBackend = async (resumeContent, jobDescContent) => {
     try {
    console.log('Sending request to:', `${API_BASE_URL}/analyze-resume`);
    
    const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeContent, jobDescContent })
    });
      

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Backend server not responding correctly. Please check if the server is running on ' + API_BASE_URL);
      }

      if (!response.ok) {
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const analysisResults = await response.json();
      return analysisResults;
    } catch (err) {
      console.error('Analysis Error:', err);
      if (err.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Make sure it is running on ' + API_BASE_URL);
      }
      throw new Error(err.message);
    }
  };
  // const analyzeWithBackend = async (resumeContent, jobDescContent) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         resumeContent,
  //         jobDescContent
  //       })
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Analysis failed');
  //     }

  //     const analysisResults = await response.json();
  //     return analysisResults;
  //   } catch (err) {
  //     console.error('Analysis Error:', err);
  //     throw new Error(`Analysis failed: ${err.message}`);
  //   }
  // };

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
    <div className="ats-container">
      <div className="ats-wrapper">
        <div className="ats-header">
          <h1 className="ats-title">ATS Resume Analyzer</h1>
          <p className="ats-subtitle">Get instant AI-powered feedback on your resume</p>
        </div>

        <div className="ats-card">
          <div className="ats-content">
            <div className="ats-upload-grid">
              <div>
                <label className="ats-label">
                  <FileText size={20} />
                  Resume *
                </label>
                <div 
                  className="ats-upload-area"
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="ats-file-input"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                  />
                  <Upload size={32} className="ats-upload-icon" />
                  {resumeFile ? (
                    <div>
                      <p className="ats-file-success">✓ {resumeFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          setResumeText('');
                        }}
                        className="ats-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="ats-upload-text">Click to upload</p>
                      <p className="ats-upload-hint">PDF or TXT files</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="ats-label">
                  <Briefcase size={20} />
                  Job Description (Optional)
                </label>
                <div 
                  className="ats-upload-area"
                  onClick={() => document.getElementById('jobdesc-input').click()}
                >
                  <input
                    id="jobdesc-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="ats-file-input"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')}
                  />
                  <Upload size={32} className="ats-upload-icon" />
                  {jobDescFile ? (
                    <div>
                      <p className="ats-file-success">✓ {jobDescFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobDescFile(null);
                          setJobDescText('');
                        }}
                        className="ats-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="ats-upload-text">Click to upload</p>
                      <p className="ats-upload-hint">For better matching</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <details className="ats-details">
              <summary className="ats-details-summary">Or paste text directly</summary>
              <div className="ats-textarea-grid">
                <div>
                  <label className="ats-textarea-label">Resume Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="ats-textarea"
                  />
                </div>
                <div>
                  <label className="ats-textarea-label">Job Description Text</label>
                  <textarea
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                    placeholder="Paste job description here (optional)..."
                    className="ats-textarea"
                  />
                </div>
              </div>
            </details>

            {error && (
              <div className="ats-error">
                <AlertCircle size={20} className="ats-error-icon" />
                <p className="ats-error-text">{error}</p>
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="ats-analyze-btn"
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="ats-spinner" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {results && (
            <div className="ats-results">
              <div className="ats-score-card">
                <div className="ats-score-circle-wrapper">
                  <svg viewBox="0 0 200 200" className="ats-score-svg">
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
                  <div className="ats-score-content">
                    <div className="ats-score-number" style={{ color: getScoreColor(results.ats_score) }}>
                      {results.ats_score}
                    </div>
                    <div className="ats-score-label">{getScoreLabel(results.ats_score)}</div>
                  </div>
                </div>
                <p className="ats-assessment">{results.overall_assessment}</p>
              </div>

              <div className="ats-breakdown-card">
                <h3 className="ats-section-title">
                  <TrendingUp size={20} />
                  Score Breakdown
                </h3>
                <div className="ats-breakdown-list">
                  {Object.entries(results.score_breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="ats-breakdown-header">
                        <span className="ats-breakdown-label">{key.replace(/_/g, ' ')}</span>
                        <span className="ats-breakdown-value" style={{ color: getScoreColor(value) }}>{value}%</span>
                      </div>
                      <div className="ats-progress-bar">
                        <div
                          className="ats-progress-fill"
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

              <div className="ats-skills-grid">
                <div className="ats-skills-present">
                  <h3 className="ats-skills-title">
                    <CheckCircle size={18} />
                    Present Skills ({results.present_skills.length})
                  </h3>
                  <div className="ats-skills-tags">
                    {results.present_skills.map((skill, idx) => (
                      <span key={idx} className="ats-skill-tag ats-skill-present">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ats-skills-missing">
                  <h3 className="ats-skills-title">
                    <AlertCircle size={18} />
                    Missing Skills
                  </h3>
                  <div className="ats-missing-skills-list">
                    {results.missing_skills.critical?.length > 0 && (
                      <div>
                        <strong className="ats-missing-critical">Critical:</strong>
                        <div className="ats-skills-tags">
                          {results.missing_skills.critical.map((skill, idx) => (
                            <span key={idx} className="ats-skill-tag ats-skill-critical">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.missing_skills.important?.length > 0 && (
                      <div>
                        <strong className="ats-missing-important">Important:</strong>
                        <div className="ats-skills-tags">
                          {results.missing_skills.important.map((skill, idx) => (
                            <span key={idx} className="ats-skill-tag ats-skill-important">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ats-suggestions-card">
                <h3 className="ats-section-title">
                  <Target size={20} />
                  Actionable Suggestions
                </h3>
                <div className="ats-suggestions-list">
                  {results.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="ats-suggestion-item">
                      <div className="ats-suggestion-header">
                        <h4 className="ats-suggestion-category">{suggestion.category}</h4>
                        <span className={`ats-priority-badge ats-priority-${suggestion.priority}`}>
                          {suggestion.priority}
                        </span>
                      </div>
                      <p className="ats-suggestion-text">{suggestion.recommendation}</p>
                      <p className="ats-suggestion-impact">{suggestion.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ats-footer">
          <p>Powered by Groq AI & Llama 3.3 70B</p>
        </div>
      </div>
    </div>
  );
};

export default ATSResumeAnalyzer;