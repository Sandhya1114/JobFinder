import React, { useState } from 'react';
import { 
  Upload, FileText, Briefcase, CheckCircle, AlertCircle, 
  XCircle, AlertTriangle, Info, Lock, ChevronDown, ChevronUp
} from 'lucide-react';
import './AtsAnalyzer.css';

const ATSAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
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
    { name: 'Parsing your resume', icon: FileText },
    { name: 'Analyzing your experience', icon: Briefcase },
    { name: 'Extracting your skills', icon: CheckCircle },
    { name: 'Generating recommendations', icon: AlertCircle }
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
        return;
      }

      if (!text || text.trim().length < 10) {
        setError('Text must be at least 10 characters');
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
    setResults(null);

    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

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
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
      setCurrentStage(0);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <XCircle size={18} className="atsIssueIcon atsIconError" />;
      case 'warning': return <AlertTriangle size={18} className="atsIssueIcon atsIconWarning" />;
      case 'info': return <Info size={18} className="atsIssueIcon atsIconInfo" />;
      default: return <CheckCircle size={18} className="atsIssueIcon atsIconSuccess" />;
    }
  };

  if (analyzing) {
    return (
      <div className="atsContainer">
        <div className="atsWrapper">
          <div className="atsProgress">
            <div className="atsProgressGrid">
              <div className="atsProgressSidebar">
                <h2 className="atsProgressTitle">Your Score</h2>
                <div className="atsProgressScorePlaceholder">
                  <div className="atsProgressScoreLine"></div>
                </div>
                <div className="atsProgressSections">
                  <div className="atsProgressSectionItem">
                    <span className="atsProgressSectionLabel">CONTENT</span>
                    <div className="atsProgressSectionBar"></div>
                  </div>
                  <div className="atsProgressSectionItem">
                    <span className="atsProgressSectionLabel">SECTION</span>
                    <div className="atsProgressSectionBar"></div>
                  </div>
                  <div className="atsProgressSectionItem">
                    <span className="atsProgressSectionLabel">ATS ESSENTIALS</span>
                    <div className="atsProgressSectionBar"></div>
                  </div>
                  <div className="atsProgressSectionItem">
                    <span className="atsProgressSectionLabel">TAILORING</span>
                    <div className="atsProgressSectionBar"></div>
                  </div>
                </div>
              </div>

              <div className="atsProgressStages">
                {stages.map((stage, idx) => {
                  const StageIcon = stage.icon;
                  const isActive = idx === currentStage;
                  const isCompleted = idx < currentStage;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`atsStageItem ${isActive ? 'atsStageActive' : ''} ${isCompleted ? 'atsStageCompleted' : ''}`}
                    >
                      <div className="atsStageIcon">
                        <StageIcon size={24} />
                      </div>
                      <span className="atsStageText">{stage.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    const contentIssues = results.content?.issues || [];
    const spellingIssues = contentIssues.filter(i => i.type === 'spelling_grammar');
    
    return (
      <div className="atsContainer">
        <div className="atsWrapper">
          <div className="atsResults">
            <div className="atsResultsGrid">
              {/* Score Sidebar */}
              <div className="atsScoreCard">
                <h2 className="atsScoreTitle">Your Score</h2>
                <div 
                  className="atsScoreCircle" 
                  style={{ borderColor: getScoreColor(results.ats_score) }}
                >
                  <div className="atsScoreValue" style={{ color: getScoreColor(results.ats_score) }}>
                    {results.ats_score}/100
                  </div>
                  <div className="atsScoreIssues">{results.total_issues} Issues</div>
                </div>

                <div className="atsSections">
                  {/* Content Section */}
                  <div className="atsSectionItem">
                    <div className="atsSectionHeader" onClick={() => toggleSection('content')}>
                      <span className="atsSectionName">CONTENT</span>
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
                        {contentIssues.map((issue, idx) => (
                          <div key={idx} className="atsIssueItem">
                            {getSeverityIcon(issue.severity)}
                            <span className="atsIssueText">{issue.type.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section */}
                  <div className="atsSectionItem">
                    <div className="atsSectionHeader" onClick={() => toggleSection('section')}>
                      <span className="atsSectionName">SECTION</span>
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
                            <span className="atsIssueText">{issue.type.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ATS Essentials */}
                  <div className="atsSectionItem">
                    <div className="atsSectionHeader" onClick={() => toggleSection('ats_essentials')}>
                      <span className="atsSectionName">ATS ESSENTIALS</span>
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
                            <span className="atsIssueText">{issue.type.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tailoring */}
                  <div className="atsSectionItem">
                    <div className="atsSectionHeader" onClick={() => toggleSection('tailoring')}>
                      <span className="atsSectionName">TAILORING</span>
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
                            <span className="atsIssueText">{issue.type.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button className="atsUnlockButton">
                  <Lock size={18} style={{ marginRight: '0.5rem' }} />
                  Unlock Full Report
                </button>
              </div>

              {/* Main Content */}
              <div>
                {/* Parse Rate */}
                {results.parse_rate && (
                  <div className="atsParseRate">
                    <div className="atsDetailIcon" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px' }}>
                      <FileText size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                      ATS PARSE RATE
                    </h3>
                    <div className="atsParseRateBar">
                      <div 
                        className="atsParseRateFill" 
                        style={{ 
                          width: `${results.parse_rate}%`,
                          background: getScoreColor(results.parse_rate)
                        }}
                      >
                        <div className="atsParseRateMarker"></div>
                      </div>
                    </div>
                    <p className="atsParseRateText">
                      We've parsed <strong>{results.parse_rate}%</strong> of your resume successfully using an industry-leading ATS.
                    </p>
                    <p className="atsParseRateDescription">
                      {results.overall_assessment}
                    </p>
                  </div>
                )}

                {/* Spelling & Grammar */}
                {spellingIssues.length > 0 && (
                  <div className="atsSpellingCard">
                    <div className="atsSpellingIcon">abc<sub style={{ fontSize: '0.6em' }}>2</sub></div>
                    <h3 className="atsSpellingTitle">Oh, no!</h3>
                    <p className="atsSpellingSubtitle">
                      We found the following spelling mistakes in your resume:
                    </p>
                    <div className="atsSpellingList">
                      {spellingIssues.slice(0, 3).map((issue, idx) => (
                        <div key={idx} className="atsSpellingItem">
                          <XCircle size={20} style={{ color: '#ef4444' }} />
                          <span style={{ flex: 1, color: '#6b7280' }}>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#eef2ff', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                      <p style={{ textAlign: 'center', color: '#374151', marginBottom: '1rem' }}>
                        <strong>Fix my spelling & grammar mistakes with Enhancv PRO</strong>
                      </p>
                    </div>
                    <button className="atsFixButton">Fix Mistakes</button>
                  </div>
                )}

                {/* Detailed Sections */}
                {results.content.issues.map((issue, idx) => (
                  issue.message && (
                    <div key={idx} className="atsDetailsSection">
                      <div className="atsDetailHeader">
                        <div className="atsDetailTitle">
                          <div className="atsDetailIcon">
                            {getSeverityIcon(issue.severity)}
                          </div>
                          <span>{issue.type.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="atsDetailContent">
                        <p>{issue.message}</p>
                        {issue.suggestion && <p><strong>Suggestion:</strong> {issue.suggestion}</p>}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial Upload Screen
  return (
    <div className="atsContainer">
      <div className="atsWrapper">
        <div className="atsHero">
          <div className="atsHeroContent">
            {/* <div className="atsLogo">
              <span className="atsLogoIcon">RES</span>UME CHECKER
            </div> */}
            <h1 className="atsHeroTitle">Is your resume good enough?</h1>
            <p className="atsHeroSubtitle">
              A free and fast AI resume checker doing 16 crucial checks to ensure your resume is ready to perform and get you interview callbacks.
            </p>
          </div>

          <div className="atsHeroPreview">
            <div className="atsPreviewScore">
              <div className="atsPreviewScoreLabel">Resume Score</div>
              <div className="atsPreviewScoreValue">92/100</div>
              <div className="atsPreviewScoreIssues">24 Issues</div>
            </div>
            <div className="atsPreviewSections">
              <div className="atsPreviewSection">
                <span className="atsPreviewSectionName">CONTENT</span>
                <span className="atsPreviewSectionScore" style={{ background: '#dcfce7', color: '#166534' }}>89%</span>
              </div>
              <div className="atsPreviewSection">
                <span className="atsPreviewSectionName">FORMAT & BREVITY</span>
                <span className="atsPreviewSectionScore" style={{ background: '#dcfce7', color: '#166534' }}>84%</span>
              </div>
              <div className="atsPreviewSection">
                <span className="atsPreviewSectionName">STYLE</span>
                <span className="atsPreviewSectionScore" style={{ background: '#fee2e2', color: '#991b1b' }}>48%</span>
              </div>
              <div className="atsPreviewSection">
                <span className="atsPreviewSectionName">SECTIONS</span>
                <span className="atsPreviewSectionScore" style={{ background: '#fee2e2', color: '#991b1b' }}>58%</span>
              </div>
              <div className="atsPreviewSection">
                <span className="atsPreviewSectionName">SKILLS</span>
                <span className="atsPreviewSectionScore" style={{ background: '#fef3c7', color: '#92400e' }}>64%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="atsUploadCard">
          <div 
            className="atsUploadArea"
            onClick={() => document.getElementById('ats-resume-input').click()}
          >
            <input
              id="ats-resume-input"
              type="file"
              accept=".pdf,.txt"
              className="atsFileInput"
              onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
            />
            <Upload size={48} className="atsUploadIcon" />
            {resumeFile ? (
              <div>
                <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>
                  ✓ {resumeFile.name}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                    setResumeText('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="atsUploadText">Drop your resume here or choose a file.</p>
                <p className="atsUploadHint">PDF & DOCX only. Max 2MB file size.</p>
              </>
            )}
          </div>

          {error && (
            <div style={{ 
              background: '#fee2e2', 
              color: '#991b1b', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button 
            onClick={analyzeResume}
            disabled={!resumeText.trim()}
            className="atsUploadButton"
          >
            {analyzing ? 'Analyzing...' : 'Upload Your Resume'}
          </button>

          {/* <div className="atsPrivacy">
            <Lock size={16} />
            Privacy guaranteed
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer;