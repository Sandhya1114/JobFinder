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
        return <XCircle size={16} className="atsSeverityIcon atsError" />;
      case 'warning':
        return <AlertTriangle size={16} className="atsSeverityIcon atsWarning" />;
      case 'info':
        return <Info size={16} className="atsSeverityIcon atsInfo" />;
      default:
        return <CheckCircle size={16} className="atsSeverityIcon atsSuccess" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="atsEnhancedContainer">
      <div className="atsEnhancedWrapper">
        <div className="atsEnhancedHeader">
          <h1 className="atsEnhancedTitle">ATS Resume Analyzer</h1>
          <p className="atsEnhancedSubtitle">Get instant AI-powered feedback on your resume</p>
        </div>

        <div className="atsEnhancedCard">
          <div className="atsEnhancedContent">
            <div className="atsEnhancedUploadGrid">
              <div>
                <label className="atsEnhancedLabel">
                  <FileText size={20} />
                  Resume *
                </label>
                <div 
                  className="atsEnhancedUploadArea"
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="atsEnhancedFileInput"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                  />
                  <Upload size={32} className="atsEnhancedUploadIcon" />
                  {resumeFile ? (
                    <div>
                      <p className="atsEnhancedFileSuccess">✓ {resumeFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          setResumeText('');
                        }}
                        className="atsEnhancedRemoveBtn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="atsEnhancedUploadText">Click to upload</p>
                      <p className="atsEnhancedUploadHint">PDF or TXT files</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="atsEnhancedLabel">
                  <Briefcase size={20} />
                  Job Description (Optional)
                </label>
                <div 
                  className="atsEnhancedUploadArea"
                  onClick={() => document.getElementById('jobdesc-input').click()}
                >
                  <input
                    id="jobdesc-input"
                    type="file"
                    accept=".txt,.pdf"
                    className="atsEnhancedFileInput"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')}
                  />
                  <Upload size={32} className="atsEnhancedUploadIcon" />
                  {jobDescFile ? (
                    <div>
                      <p className="atsEnhancedFileSuccess">✓ {jobDescFile.name}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobDescFile(null);
                          setJobDescText('');
                        }}
                        className="atsEnhancedRemoveBtn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="atsEnhancedUploadText">Click to upload</p>
                      <p className="atsEnhancedUploadHint">For better matching</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <details className="atsEnhancedDetails">
              <summary className="atsEnhancedDetailsSummary">Or paste text directly</summary>
              <div className="atsEnhancedTextareaGrid">
                <div>
                  <label className="atsEnhancedTextareaLabel">Resume Text</label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    className="atsEnhancedTextarea"
                  />
                </div>
                <div>
                  <label className="atsEnhancedTextareaLabel">Job Description Text</label>
                  <textarea
                    value={jobDescText}
                    onChange={(e) => setJobDescText(e.target.value)}
                    placeholder="Paste job description here (optional)..."
                    className="atsEnhancedTextarea"
                  />
                </div>
              </div>
            </details>

            {error && (
              <div className="atsEnhancedError">
                <AlertCircle size={20} className="atsEnhancedErrorIcon" />
                <p className="atsEnhancedErrorText">{error}</p>
              </div>
            )}

            {analyzing && analysisStage && (
              <div className="atsEnhancedProgress">
                {stages.map((stage, idx) => (
                  <div 
                    key={idx} 
                    className={`atsProgressStage ${stage === analysisStage ? 'atsActive' : stages.indexOf(analysisStage) > idx ? 'atsCompleted' : ''}`}
                  >
                    <CheckCircle size={20} className="atsStageIcon" />
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={analyzeResume}
              disabled={analyzing || !resumeText.trim()}
              className="atsEnhancedAnalyzeBtn"
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} className="atsEnhancedSpinner" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>

          {results && (
            <div className="atsEnhancedResults">
              {/* Score Overview */}
              <div className="atsScoreOverview">
                <div className="atsMainScore">
                  <div className="atsScoreCircle" style={{ borderColor: getScoreColor(results.ats_score) }}>
                    <div className="atsScoreValue" style={{ color: getScoreColor(results.ats_score) }}>
                      {results.ats_score}/100
                    </div>
                    <div className="atsScoreIssues">{results.total_issues} Issues</div>
                  </div>
                </div>

                <div className="atsScoreSidebar">
                  {/* Content Section */}
                  <div className="atsScoreSection">
                    <div 
                      className="atsSectionHeader" 
                      onClick={() => toggleSection('content')}
                    >
                      <span className="atsSectionTitle">CONTENT</span>
                      <div className="atsSectionMeta">
                        <span 
                          className="atsSectionScore"
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
                      <div className="atsSectionContent">
                        {results.content.issues.map((issue, idx) => (
                          <div key={idx} className="atsIssueItem">
                            {getSeverityIcon(issue.severity)}
                            <div className="atsIssueDetails">
                              <div className="atsIssueType">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="atsIssueMessage">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section Analysis */}
                  <div className="atsScoreSection">
                    <div 
                      className="atsSectionHeader" 
                      onClick={() => toggleSection('section')}
                    >
                      <span className="atsSectionTitle">SECTION</span>
                      <div className="atsSectionMeta">
                        <span 
                          className="atsSectionScore"
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
                      <div className="atsSectionContent">
                        {results.section.issues.map((issue, idx) => (
                          <div key={idx} className="atsIssueItem">
                            {getSeverityIcon(issue.severity)}
                            <div className="atsIssueDetails">
                              <div className="atsIssueType">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="atsIssueMessage">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ATS Essentials */}
                  <div className="atsScoreSection">
                    <div 
                      className="atsSectionHeader" 
                      onClick={() => toggleSection('ats_essentials')}
                    >
                      <span className="atsSectionTitle">ATS ESSENTIALS</span>
                      <div className="atsSectionMeta">
                        <span 
                          className="atsSectionScore"
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
                      <div className="atsSectionContent">
                        {results.ats_essentials.issues.map((issue, idx) => (
                          <div key={idx} className="atsIssueItem">
                            {getSeverityIcon(issue.severity)}
                            <div className="atsIssueDetails">
                              <div className="atsIssueType">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="atsIssueMessage">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tailoring */}
                  <div className="atsScoreSection">
                    <div 
                      className="atsSectionHeader" 
                      onClick={() => toggleSection('tailoring')}
                    >
                      <span className="atsSectionTitle">TAILORING</span>
                      <div className="atsSectionMeta">
                        <span 
                          className="atsSectionScore"
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
                      <div className="atsSectionContent">
                        {results.tailoring.issues.map((issue, idx) => (
                          <div key={idx} className="atsIssueItem">
                            {getSeverityIcon(issue.severity)}
                            <div className="atsIssueDetails">
                              <div className="atsIssueType">{issue.type.replace(/_/g, ' ')}</div>
                              {issue.message && <div className="atsIssueMessage">{issue.message}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="atsUnlockReportBtn">
                    Unlock Full Report
                  </button>
                </div>
              </div>

              {/* Parse Rate Section */}
              {results.parse_rate && (
                <div className="atsParseRateSection">
                  <h3 className="atsSectionHeading">ATS PARSE RATE</h3>
                  <div className="atsParseRateContent">
                    <div className="atsParseRateBar">
                      <div 
                        className="atsParseRateFill"
                        style={{ 
                          width: `${results.parse_rate}%`,
                          background: getScoreColor(results.parse_rate)
                        }}
                      >
                        <span className="atsParseRateMarker"></span>
                      </div>
                    </div>
                    <p className="atsParseRateText">
                      We've parsed <strong>{results.parse_rate}%</strong> of your resume successfully using an industry-leading ATS.
                    </p>
                    <p className="atsParseRateDescription">
                      {results.overall_assessment}
                    </p>
                  </div>
                </div>
              )}

              {/* Skills Grid */}
              <div className="atsEnhancedSkillsGrid">
                <div className="atsEnhancedSkillsPresent">
                  <h3 className="atsEnhancedSkillsTitle">
                    <CheckCircle size={18} />
                    Present Skills ({results.present_skills?.length || 0})
                  </h3>
                  <div className="atsEnhancedSkillsTags">
                    {results.present_skills?.map((skill, idx) => (
                      <span key={idx} className="atsEnhancedSkillTag atsEnhancedSkillPresent">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="atsEnhancedSkillsMissing">
                  <h3 className="atsEnhancedSkillsTitle">
                    <AlertCircle size={18} />
                    Missing Skills
                  </h3>
                  <div className="atsEnhancedMissingSkillsList">
                    {results.missing_skills?.critical?.length > 0 && (
                      <div>
                        <strong className="atsEnhancedMissingCritical">Critical:</strong>
                        <div className="atsEnhancedSkillsTags">
                          {results.missing_skills.critical.map((skill, idx) => (
                            <span key={idx} className="atsEnhancedSkillTag atsEnhancedSkillCritical">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.missing_skills?.important?.length > 0 && (
                      <div>
                        <strong className="atsEnhancedMissingImportant">Important:</strong>
                        <div className="atsEnhancedSkillsTags">
                          {results.missing_skills.important.map((skill, idx) => (
                            <span key={idx} className="atsEnhancedSkillTag atsEnhancedSkillImportant">
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
                <div className="atsTopRecommendations">
                  <h3 className="atsSectionHeading">
                    <Target size={20} />
                    Top Recommendations
                  </h3>
                  <div className="atsRecommendationsList">
                    {results.top_recommendations.map((rec, idx) => (
                      <div key={idx} className="atsRecommendationItem">
                        <span className="atsRecNumber">{idx + 1}</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="atsEnhancedFooter">
          <p>Powered by Groq AI & Llama 3.3 70B</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedATSAnalyzer;