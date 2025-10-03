import React, { useState } from 'react';
import { Upload, FileText, Briefcase, CheckCircle, AlertCircle, AlertTriangle, Loader2, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import './ATSAnalyzer.css';

const ATSAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const API_BASE_URL = 'http://localhost:5000';

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    setError('');

    try {
      let text = '';
      if (file.type === 'text/plain') {
        text = await file.text();
      } else if (file.type === 'application/pdf') {
        setError('Please convert PDF to text or paste content directly');
        return;
      }

      if (type === 'resume') {
        setResumeFile(file);
        setResumeText(text);
      } else {
        setJobDescFile(file);
        setJobDescText(text);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume content');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
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

      const data = await response.json();
      setResults(data);
      setExpandedSections({ content: true, section: true, ats_essentials: true, tailoring: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const StatusIcon = ({ status }) => {
    if (status === 'pass') return <CheckCircle size={18} className="icon-success" />;
    if (status === 'warning') return <AlertTriangle size={18} className="icon-warning" />;
    return <AlertCircle size={18} className="icon-error" />;
  };

  return (
    <div className="ats-analyzer">
      <div className="ats-header">
        <h1>ATS Resume Analyzer</h1>
        <p>Get detailed feedback with specific corrections</p>
      </div>

      <div className="ats-upload-section">
        <div className="upload-group">
          <label>
            <FileText size={20} />
            Resume *
          </label>
          <div className="upload-area" onClick={() => document.getElementById('resume-input').click()}>
            <input
              id="resume-input"
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
              style={{ display: 'none' }}
            />
            <Upload size={32} />
            {resumeFile ? (
              <div>
                <p className="file-success">✓ {resumeFile.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    setResumeText('');
                  }}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p>Click to upload</p>
                <p className="upload-hint">TXT files only</p>
              </div>
            )}
          </div>
        </div>

        <div className="upload-group">
          <label>
            <Briefcase size={20} />
            Job Description (Optional)
          </label>
          <div className="upload-area" onClick={() => document.getElementById('job-input').click()}>
            <input
              id="job-input"
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')}
              style={{ display: 'none' }}
            />
            <Upload size={32} />
            {jobDescFile ? (
              <div>
                <p className="file-success">✓ {jobDescFile.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setJobDescFile(null);
                    setJobDescText('');
                  }}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p>Click to upload</p>
                <p className="upload-hint">For better matching</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <details className="paste-section">
        <summary>Or paste text directly</summary>
        <div className="textarea-group">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text..."
            rows={6}
          />
          <textarea
            value={jobDescText}
            onChange={(e) => setJobDescText(e.target.value)}
            placeholder="Paste job description (optional)..."
            rows={6}
          />
        </div>
      </details>

      {error && (
        <div className="error-box">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={analyzeResume}
        disabled={analyzing || !resumeText.trim()}
        className="analyze-btn"
      >
        {analyzing ? (
          <>
            <Loader2 size={20} className="spinner" />
            Analyzing...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>

      {results && (
        <div className="results-section">
          <div className="score-overview">
            <div className="score-circle">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke={results.overall_score >= 80 ? '#10b981' : results.overall_score >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="15"
                  strokeDasharray={`${(results.overall_score / 100) * 534} 534`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="score-text">
                <div className={`score-number ${getScoreColor(results.overall_score)}`}>
                  {results.overall_score}
                </div>
                <div className="score-label">/ 100</div>
              </div>
            </div>
            <div className="score-details">
              <p className="issues-count">{results.total_issues} Issues Found</p>
              <p className="parse-rate">Parse Rate: {results.parse_rate}%</p>
              <p className="summary">{results.summary}</p>
            </div>
          </div>

          {Object.entries(results.categories).map(([key, data]) => (
            <div key={key} className="category-section">
              <button className="category-header" onClick={() => toggleSection(key)}>
                <div className="category-title">
                  <span>{key.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
                <div className="category-meta">
                  <span className={`category-score ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                  {expandedSections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {expandedSections[key] && (
                <div className="category-content">
                  {data.checks && Object.entries(data.checks).map(([checkKey, checkData]) => (
                    <div key={checkKey} className="check-item">
                      <div className="check-header">
                        <StatusIcon status={checkData.status} />
                        <h4>{checkKey.replace(/_/g, ' ').toUpperCase()}</h4>
                      </div>
                      
                      {checkData.message && (
                        <p className="check-message">{checkData.message}</p>
                      )}

                      {checkData.value !== undefined && (
                        <div className="check-value">
                          <span>Value: {checkData.value}%</span>
                        </div>
                      )}

                      {checkData.missing && checkData.missing.length > 0 && (
                        <div className="missing-items">
                          <p className="missing-label">Missing:</p>
                          <ul>
                            {checkData.missing.map((item, idx) => (
                              <li key={idx}>
                                <X size={14} className="icon-error" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {checkData.present && checkData.present.length > 0 && (
                        <div className="present-items">
                          <p className="present-label">Present:</p>
                          <ul>
                            {checkData.present.map((item, idx) => (
                              <li key={idx}>
                                <Check size={14} className="icon-success" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {checkData.matched && (
                        <div className="matched-items">
                          <p>Matched ({checkData.match_percentage}%):</p>
                          <div className="tags">
                            {checkData.matched.map((item, idx) => (
                              <span key={idx} className="tag tag-success">{item}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {checkData.examples && checkData.examples.length > 0 && (
                        <div className="examples">
                          <p>Examples:</p>
                          <ul>
                            {checkData.examples.map((ex, idx) => (
                              <li key={idx}>{ex}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {checkData.suggestions && checkData.suggestions.length > 0 && (
                        <div className="suggestions">
                          <p>Suggestions:</p>
                          <ul>
                            {checkData.suggestions.map((sug, idx) => (
                              <li key={idx}>{sug}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {checkData.repeated_phrases && checkData.repeated_phrases.length > 0 && (
                        <div className="repeated-phrases">
                          <p>Repeated Phrases to Fix:</p>
                          <ul>
                            {checkData.repeated_phrases.map((phrase, idx) => (
                              <li key={idx} className="error-text">{phrase}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {checkData.errors && checkData.errors.length > 0 && (
                        <div className="error-list">
                          <p>Errors to Correct:</p>
                          <ul>
                            {checkData.errors.map((err, idx) => (
                              <li key={idx} className="error-text">{err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {data.issues && data.issues.length > 0 && (
                    <div className="issues-list">
                      <h4>Issues & Corrections:</h4>
                      {data.issues.map((issue, idx) => (
                        <div key={idx} className={`issue-card issue-${issue.type}`}>
                          <div className="issue-header">
                            <h5>{issue.title}</h5>
                            <span className={`priority-badge priority-${issue.impact}`}>
                              {issue.impact}
                            </span>
                          </div>
                          <p className="issue-description">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {results.detailed_feedback && (
            <div className="feedback-section">
              <h3>Detailed Improvements</h3>
              {results.detailed_feedback.improvements.map((imp, idx) => (
                <div key={idx} className="improvement-card">
                  <div className="improvement-header">
                    <span className="improvement-category">{imp.category}</span>
                    <span className={`priority-badge priority-${imp.priority}`}>
                      {imp.priority}
                    </span>
                  </div>
                  <p className="improvement-recommendation">{imp.recommendation}</p>
                  {imp.example && (
                    <div className="improvement-example">
                      <strong>Example:</strong> {imp.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSAnalyzer;