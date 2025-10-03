import React, { useState } from 'react';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, AlertTriangle, Loader2, ChevronDown, ChevronUp, Shield, Target, Zap, FileCheck } from 'lucide-react';
import './AtsAnalyzer.css';

const ATSResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [analysisStep, setAnalysisStep] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');

    try {
      const text = await file.text();

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

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    setError('');
    setAnalysisStep('Parsing your resume');

    setTimeout(() => setAnalysisStep('Analyzing your experience'), 1000);
    setTimeout(() => setAnalysisStep('Extracting your skills'), 2000);
    setTimeout(() => setAnalysisStep('Generating recommendations'), 3000);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: resumeText,
          jobDescContent: jobDescText
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisResults = await response.json();
      setResults(analysisResults);
      setExpandedCategories({});
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="status-icon-pass" />;
      case 'warning':
        return <AlertTriangle className="status-icon-warning" />;
      case 'fail':
        return <AlertCircle className="status-icon-fail" />;
      default:
        return <AlertCircle className="status-icon-default" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      content: Shield,
      section: FileCheck,
      ats_essentials: Zap,
      tailoring: Target
    };
    const Icon = icons[category] || Shield;
    return <Icon className="category-icon" />;
  };

  const getCategoryTitle = (category) => {
    const titles = {
      content: 'CONTENT',
      section: 'SECTION',
      ats_essentials: 'ATS ESSENTIALS',
      tailoring: 'TAILORING'
    };
    return titles[category] || category.toUpperCase();
  };

  return (
    <div className="enhanced-ats-container">
      <div className="enhanced-ats-wrapper">
        <div className="enhanced-ats-header">
          <h1 className="enhanced-ats-title">ATS Resume Analyzer</h1>
          <p className="enhanced-ats-subtitle">Comprehensive analysis across all critical parameters</p>
        </div>

        <div className="enhanced-ats-upload-card">
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

          {error && (
            <div className="enhanced-ats-error">
              <AlertCircle size={20} className="enhanced-ats-error-icon" />
              <p>{error}</p>
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
                Analyzing Resume...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>

        {analyzing && (
          <div className="enhanced-ats-analyzing-card">
            <div className="enhanced-ats-analyzing-steps">
              <div className="enhanced-ats-step completed">
                <CheckCircle size={20} className="step-icon" />
                <span>Parsing your resume</span>
              </div>
              <div className={`enhanced-ats-step ${analysisStep.includes('experience') ? 'completed' : ''}`}>
                <CheckCircle size={20} className="step-icon" />
                <span>Analyzing your experience</span>
              </div>
              <div className={`enhanced-ats-step ${analysisStep.includes('skills') ? 'completed' : ''}`}>
                <CheckCircle size={20} className="step-icon" />
                <span>Extracting your skills</span>
              </div>
              <div className={`enhanced-ats-step ${analysisStep.includes('recommendations') ? 'completed' : ''}`}>
                <CheckCircle size={20} className="step-icon" />
                <span>Generating recommendations</span>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="enhanced-ats-results-grid">
            <div className="enhanced-ats-sidebar">
              <div className="enhanced-ats-score-card">
                <h2 className="score-card-title">Your Score</h2>
                
                <div className="score-circle-wrapper">
                  <div className={`score-circle ${getScoreColor(results.overall_score)}`}>
                    <span className="score-number">{results.overall_score}</span>
                    <span className="score-total">/100</span>
                  </div>
                  <p className="score-issues">{results.total_issues} Issues</p>
                </div>

                <div className="category-scores">
                  {Object.entries(results.categories).map(([key, category]) => (
                    <div 
                      key={key} 
                      className="category-score-item"
                      onClick={() => toggleCategory(key)}
                    >
                      <span className="category-name">{getCategoryTitle(key)}</span>
                      <div className="category-score-badge-wrapper">
                        <span className={`category-score-badge ${getScoreColor(category.score)}`}>
                          {category.score}%
                        </span>
                        {expandedCategories[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="unlock-report-btn">
                  Unlock Full Report
                </button>
              </div>
            </div>

            <div className="enhanced-ats-main-content">
              {Object.entries(results.categories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="category-section">
                  <div 
                    className="category-header"
                    onClick={() => toggleCategory(categoryKey)}
                  >
                    <div className="category-header-left">
                      {getCategoryIcon(categoryKey)}
                      <h3>{getCategoryTitle(categoryKey)}</h3>
                    </div>
                    <div className="category-header-right">
                      <span className="issues-badge">{category.checks.filter(c => c.status !== 'pass').length} issues found</span>
                    </div>
                  </div>

                  {expandedCategories[categoryKey] && (
                    <div className="category-checks">
                      {category.checks.map((check, idx) => (
                        <div key={idx} className="check-item">
                          <div className="check-header">
                            {getStatusIcon(check.status)}
                            <h4 className="check-name">{check.name}</h4>
                          </div>
                          <p className="check-message">{check.message}</p>
                          
                          {check.examples && check.examples.length > 0 && (
                            <div className="check-examples">
                              <strong>Examples:</strong>
                              <ul>
                                {check.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                              </ul>
                            </div>
                          )}

                          {check.suggestions && check.suggestions.length > 0 && (
                            <div className="check-suggestions">
                              <strong>Suggestions:</strong>
                              <ul>
                                {check.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                              </ul>
                            </div>
                          )}

                          {check.errors && check.errors.length > 0 && (
                            <div className="check-errors">
                              {check.errors.map((err, i) => (
                                <div key={i} className="error-item">
                                  <span className="error-text">{err.error}</span>
                                  <span className="error-arrow">→</span>
                                  <span className="error-correction">{err.correction}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {results.parse_rate && (
                <div className="parse-rate-card">
                  <div className="parse-rate-meter">
                    <div className="parse-rate-fill" style={{ width: `${results.parse_rate}%` }}></div>
                  </div>
                  <p className="parse-rate-text">
                    We've parsed <strong>{results.parse_rate}%</strong> of your resume successfully using an industry-leading ATS.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="enhanced-ats-footer">
          <p>Powered by Groq AI & Llama 3.3 70B</p>
        </div>
      </div>
    </div>
      
  );
};

export default ATSResumeAnalyzer;