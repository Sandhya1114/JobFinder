import React, { useState } from 'react';
import { 
  Upload, FileText, Briefcase, CheckCircle, AlertCircle, 
  TrendingUp, Target, Award, Loader2, ChevronDown, ChevronUp,
  XCircle, AlertTriangle, Info
} from 'lucide-react';
import './AtsAnalyzer.css';

const EnhancedATSAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    section: false,
    ats_essentials: false,
    tailoring: false
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const stages = [
    'Parsing your resume',
    'Analyzing your experience',
    'Extracting your skills',
    'Generating recommendations'
  ];

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
      setError('File size must be less than 15MB');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      let text = '';

      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load PDF.js'));
          });

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
      const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeContent, jobDescContent })
      });

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

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResults(null);

    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const analysisResults = await analyzeWithBackend(resumeText, jobDescText);
      setResults(analysisResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
      setAnalysisStage('');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error':
        return <XCircle size={16} className="severity-icon error" />;
      case 'warning':
        return <AlertTriangle size={16} className="severity-icon warning" />;
      case 'info':
        return <Info size={16} className="severity-icon info" />;
      default:
        return <CheckCircle size={16} className="severity-icon success" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="enhanced-ats-container">
      <div className="enhanced-ats-wrapper">
        <div className="enhanced-ats-header">
          <h1 className="enhanced-ats-title">ATS Resume Analyzer</h1>
          <p className="enhanced-ats-subtitle">Get instant AI-powered feedback on your resume</p>
        </div>

        <div className="enhanced-ats-card">
          <div className="enhanced-ats-content">
            <div className="enhanced-ats-upload-grid">
              <div>
                <label className="enhanced-ats-label">
                  <FileText size={20} />
                  Resume *
                </label>
                <div 
                  className="enhanced-ats-upload-area"
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="enhanced-ats-file-input"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                  />
                  <Upload size={32} className="enhanced-ats-upload-icon" />
                  {resumeFile ? (
                    <div>
                      <p className="enhanced-ats-file-success">✓ {resumeFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          setResumeText('');
                        }}
                        className="enhanced-ats-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="enhanced-ats-upload-text">Click to upload</p>
                      <p className="enhanced-ats-upload-hint">PDF or TXT files</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="enhanced-ats-label">
                  <Briefcase size={20} />
                  Job Description (Optional)
                </label>
                <div 
                  className="enhanced-ats-upload-area"
                  onClick={() => document.getElementById('jobdesc-input').click()}
                >
                  <input
                    id="jobdesc-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="enhanced-ats-file-input"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')}
                  />
                  <Upload size={32} className="enhanced-ats-upload-icon" />
                  {jobDescFile ? (
                    <div>
                      <p className="enhanced-ats-file-success">✓ {jobDescFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobDescFile(null);
                          setJobDescText('');
                        }}
                        className="enhanced-ats-remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="enhanced-ats-upload-text">Click to upload</p>
                      <p className="enhanced-ats-upload-hint">For better matching</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <details className="enhanced-ats-details">
              <summary className="enhanced-ats-details-summary">Or paste text directly</summary>
              <div className="enhanced-ats-textarea-grid">
                <div>
                  <label className="enhanced-ats-textarea-label">Resume Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="enhanced-ats-textarea"
                  />
                </div>
                <div>
                  <label className="enhanced-ats-textarea-label">Job Description Text</label>
                  <textarea
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                    placeholder="Paste job description here (optional)..."
                    className="enhanced-ats-textarea"
                  />
                </div>
              </div>
            </details>

            {error && (
              <div className="enhanced-ats-error">
                <AlertCircle size={20} className="enhanced-ats-error-icon" />
                <p className="enhanced-ats-error-text">{error}</p>
              </div>
            )}

            {analyzing && analysisStage && (
              <div className="enhanced-ats-progress">
                {stages.map((stage, idx) => (
                  <div 
                    key={idx} 
                    className={`progress-stage ${stage === analysisStage ? 'active' : stages.indexOf(analysisStage) > idx ? 'completed' : ''}`}
                  >
                    <CheckCircle size={20} className="stage-icon" />
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="enhanced-ats-analyze-btn"
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="enhanced-ats-spinner" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {results && (
            <div className="enhanced-ats-results">
              {/* Score Overview */}
              <div className="score-overview">
                <div className="main-score">
                  <div className="score-circle" style={{ borderColor: getScoreColor(results.ats_score) }}>
                    <div className="score-value" style={{ color: getScoreColor(results.ats_score) }}>
                      {results.ats_score}/100
                    </div>
                    <div className="score-issues">{results.total_issues} Issues</div>
                  </div>
                </div>

                <div className="score-sidebar">
                  {/* Content Section */}
                  <div className="score-section">
                    <div 
                      className="section-header" 
                      onClick={() => toggleSection('content')}
                    >
                      <span className="section-title">CONTENT</span>
                      <div className="section-meta">
                        <span 
                          className="section-score"
                          style={{ 
                            background: results.content.score >= 70 ? '#dcfce7' : results.content.score >= 40 ? '#fef3c7' : '#fee2e2',
                            color: results.content.score >= 70 ? '#166534' : results.content.score >= 40 ? '#92400e' : '#991b1b'
                          }}
                        >
                          {results.content.score}%
                        </span>
                        {expandedSections.content ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    {expandedSections.content && (
                      <div className="section-content">
                        {results.content.issues.map((issue, idx) => (
                          <div key={idx} className="issue-item">
                            {getSeverityIcon(issue.severity)}
                            <div className="issue-details">
                              <div className="issue-type">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="issue-message">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section Analysis */}
                  <div className="score-section">
                    <div 
                      className="section-header" 
                      onClick={() => toggleSection('section')}
                    >
                      <span className="section-title">SECTION</span>
                      <div className="section-meta">
                        <span 
                          className="section-score"
                          style={{ 
                            background: results.section.score >= 70 ? '#dcfce7' : results.section.score >= 40 ? '#fef3c7' : '#fee2e2',
                            color: results.section.score >= 70 ? '#166534' : results.section.score >= 40 ? '#92400e' : '#991b1b'
                          }}
                        >
                          {results.section.score}%
                        </span>
                        {expandedSections.section ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    {expandedSections.section && (
                      <div className="section-content">
                        {results.section.issues.map((issue, idx) => (
                          <div key={idx} className="issue-item">
                            {getSeverityIcon(issue.severity)}
                            <div className="issue-details">
                              <div className="issue-type">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="issue-message">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ATS Essentials */}
                  <div className="score-section">
                    <div 
                      className="section-header" 
                      onClick={() => toggleSection('ats_essentials')}
                    >
                      <span className="section-title">ATS ESSENTIALS</span>
                      <div className="section-meta">
                        <span 
                          className="section-score"
                          style={{ 
                            background: results.ats_essentials.score >= 70 ? '#dcfce7' : results.ats_essentials.score >= 40 ? '#fef3c7' : '#fee2e2',
                            color: results.ats_essentials.score >= 70 ? '#166534' : results.ats_essentials.score >= 40 ? '#92400e' : '#991b1b'
                          }}
                        >
                          {results.ats_essentials.score}%
                        </span>
                        {expandedSections.ats_essentials ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    {expandedSections.ats_essentials && (
                      <div className="section-content">
                        {results.ats_essentials.issues.map((issue, idx) => (
                          <div key={idx} className="issue-item">
                            {getSeverityIcon(issue.severity)}
                            <div className="issue-details">
                              <div className="issue-type">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="issue-message">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tailoring */}
                  <div className="score-section">
                    <div 
                      className="section-header" 
                      onClick={() => toggleSection('tailoring')}
                    >
                      <span className="section-title">TAILORING</span>
                      <div className="section-meta">
                        <span 
                          className="section-score"
                          style={{ 
                            background: results.tailoring.score >= 70 ? '#dcfce7' : results.tailoring.score >= 40 ? '#fef3c7' : '#fee2e2',
                            color: results.tailoring.score >= 70 ? '#166534' : results.tailoring.score >= 40 ? '#92400e' : '#991b1b'
                          }}
                        >
                          {results.tailoring.score}%
                        </span>
                        {expandedSections.tailoring ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    {expandedSections.tailoring && (
                      <div className="section-content">
                        {results.tailoring.issues.map((issue, idx) => (
                          <div key={idx} className="issue-item">
                            {getSeverityIcon(issue.severity)}
                            <div className="issue-details">
                              <div className="issue-type">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="issue-message">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="unlock-report-btn">
                    Unlock Full Report
                  </button>
                </div>
              </div>

              {/* Parse Rate Section */}
              {results.parse_rate && (
                <div className="parse-rate-section">
                  <h3 className="section-heading">ATS PARSE RATE</h3>
                  <div className="parse-rate-content">
                    <div className="parse-rate-bar">
                      <div 
                        className="parse-rate-fill"
                        style={{ 
                          width: `${results.parse_rate}%`,
                          background: getScoreColor(results.parse_rate)
                        }}
                      >
                        <span className="parse-rate-marker"></span>
                      </div>
                    </div>
                    <p className="parse-rate-text">
                      We've parsed <strong>{results.parse_rate}%</strong> of your resume successfully using an industry-leading ATS.
                    </p>
                    <p className="parse-rate-description">
                      {results.overall_assessment}
                    </p>
                  </div>
                </div>
              )}

              {/* Skills Grid */}
              <div className="enhanced-ats-skills-grid">
                <div className="enhanced-ats-skills-present">
                  <h3 className="enhanced-ats-skills-title">
                    <CheckCircle size={18} />
                    Present Skills ({results.present_skills?.length || 0})
                  </h3>
                  <div className="enhanced-ats-skills-tags">
                    {results.present_skills?.map((skill, idx) => (
                      <span key={idx} className="enhanced-ats-skill-tag enhanced-ats-skill-present">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="enhanced-ats-skills-missing">
                  <h3 className="enhanced-ats-skills-title">
                    <AlertCircle size={18} />
                    Missing Skills
                  </h3>
                  <div className="enhanced-ats-missing-skills-list">
                    {results.missing_skills?.critical?.length > 0 && (
                      <div>
                        <strong className="enhanced-ats-missing-critical">Critical:</strong>
                        <div className="enhanced-ats-skills-tags">
                          {results.missing_skills.critical.map((skill, idx) => (
                            <span key={idx} className="enhanced-ats-skill-tag enhanced-ats-skill-critical">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.missing_skills?.important?.length > 0 && (
                      <div>
                        <strong className="enhanced-ats-missing-important">Important:</strong>
                        <div className="enhanced-ats-skills-tags">
                          {results.missing_skills.important.map((skill, idx) => (
                            <span key={idx} className="enhanced-ats-skill-tag enhanced-ats-skill-important">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              {results.top_recommendations && (
                <div className="top-recommendations">
                  <h3 className="section-heading">
                    <Target size={20} />
                    Top Recommendations
                  </h3>
                  <div className="recommendations-list">
                    {results.top_recommendations.map((rec, idx) => (
                      <div key={idx} className="recommendation-item">
                        <span className="rec-number">{idx + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="enhanced-ats-footer">
          <p>Powered by Groq AI & Llama 3.3 70B</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedATSAnalyzer;