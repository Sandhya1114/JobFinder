import React, { useState } from 'react';
import { 
  Upload, FileText, Briefcase, CheckCircle, AlertCircle, 
  XCircle, AlertTriangle, Info, Lock, ChevronDown, ChevronUp,
  Edit3, Target, Award, Zap, TrendingUp, Users
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
    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: resumeText, jobDescContent: jobDescText })
      });
      if (!response.ok) throw new Error('Analysis failed');
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
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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
                  {['CONTENT', 'SECTION', 'ATS ESSENTIALS', 'TAILORING'].map((name, idx) => (
                    <div key={idx} className="atsProgressSectionItem">
                      <span className="atsProgressSectionLabel">{name}</span>
                      <div className="atsProgressSectionBar"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="atsProgressStages">
                {stages.map((stage, idx) => {
                  const StageIcon = stage.icon;
                  return (
                    <div key={idx} className={`atsStageItem ${idx === currentStage ? 'atsStageActive' : ''} ${idx < currentStage ? 'atsStageCompleted' : ''}`}>
                      <div className="atsStageIcon"><StageIcon size={24} /></div>
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
              <div className="atsScoreCard">
                <h2 className="atsScoreTitle">Your Score</h2>
                <div className="atsScoreCircle" style={{ borderColor: getScoreColor(results.ats_score) }}>
                  <div className="atsScoreValue" style={{ color: getScoreColor(results.ats_score) }}>
                    {results.ats_score}/100
                  </div>
                  <div className="atsScoreIssues">{results.total_issues} Issues</div>
                </div>
                <div className="atsSections">
                  {['content', 'section', 'ats_essentials', 'tailoring'].map((key) => {
                    const section = results[key];
                    const name = key.replace(/_/g, ' ').toUpperCase();
                    return (
                      <div key={key} className="atsSectionItem">
                        <div className="atsSectionHeader" onClick={() => toggleSection(key)}>
                          <span className="atsSectionName">{name}</span>
                          <div className="atsSectionMeta">
                            <span className="atsSectionScore" style={{
                              background: section.score >= 70 ? '#dcfce7' : section.score >= 40 ? '#fef3c7' : '#fee2e2',
                              color: section.score >= 70 ? '#166534' : section.score >= 40 ? '#92400e' : '#991b1b'
                            }}>{section.score}%</span>
                            {expandedSections[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                        {expandedSections[key] && (
                          <div className="atsSectionContent">
                            {section.issues.map((issue, idx) => (
                              <div key={idx} className="atsIssueItem">
                                {getSeverityIcon(issue.severity)}
                                <span className="atsIssueText">{issue.type.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className="atsUnlockButton">
                  <Lock size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                  Unlock Full Report
                </button>
              </div>
              <div>
                {results.parse_rate && (
                  <div className="atsParseRate">
                    <div className="atsDetailIcon" style={{ margin: '0 auto 1.5rem', width: '60px', height: '60px' }}>
                      <FileText size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>ATS PARSE RATE</h3>
                    <div className="atsParseRateBar">
                      <div className="atsParseRateFill" style={{ width: `${results.parse_rate}%`, background: getScoreColor(results.parse_rate) }}>
                        <div className="atsParseRateMarker"></div>
                      </div>
                    </div>
                    <p className="atsParseRateText">We've parsed <strong>{results.parse_rate}%</strong> of your resume successfully using an industry-leading ATS.</p>
                    <p className="atsParseRateDescription">{results.overall_assessment}</p>
                  </div>
                )}
                {spellingIssues.length > 0 && (
                  <div className="atsSpellingCard">
                    <div className="atsSpellingIcon">abc<sub style={{ fontSize: '0.6em' }}>2</sub></div>
                    <h3 className="atsSpellingTitle">Oh, no!</h3>
                    <p className="atsSpellingSubtitle">We found the following spelling mistakes in your resume:</p>
                    <div className="atsSpellingList">
                      {spellingIssues.slice(0, 3).map((issue, idx) => (
                        <div key={idx} className="atsSpellingItem">
                          <XCircle size={20} style={{ color: '#ef4444' }} />
                          <span style={{ flex: 1, color: '#6b7280' }}>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                    <button className="atsFixButton">Fix Mistakes</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="atsContainer">
      <div className="atsWrapper">
        {/* Hero Section */}
        <div className="atsHero">
          <div className="atsHeroContent">
            <div className="atsLogo">
              <span className="atsLogoIcon">RES</span>UME CHECKER
            </div>
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
              {[
                { name: 'CONTENT', score: '89%', color: '#dcfce7', textColor: '#166534' },
                { name: 'FORMAT & BREVITY', score: '84%', color: '#dcfce7', textColor: '#166534' },
                { name: 'STYLE', score: '48%', color: '#fee2e2', textColor: '#991b1b' },
                { name: 'SECTIONS', score: '58%', color: '#fee2e2', textColor: '#991b1b' },
                { name: 'SKILLS', score: '64%', color: '#fef3c7', textColor: '#92400e' }
              ].map((item, idx) => (
                <div key={idx} className="atsPreviewSection">
                  <span className="atsPreviewSectionName">{item.name}</span>
                  <span className="atsPreviewSectionScore" style={{ background: item.color, color: item.textColor }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <div className="atsUploadCard">
          <div className="atsUploadGrid">
            <div className="atsUploadItem">
              <label className="atsUploadLabel">Resume (Required)</label>
              <div className="atsUploadArea" onClick={() => document.getElementById('ats-resume-input').click()}>
                <input id="ats-resume-input" type="file" accept=".pdf,.txt" className="atsFileInput" onChange={(e) => handleFileUpload(e.target.files[0], 'resume')} />
                <Upload size={36} className="atsUploadIcon" />
                {resumeFile ? (
                  <div>
                    <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>✓ {resumeFile.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setResumeFile(null); setResumeText(''); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <p className="atsUploadText">Drop resume here or click</p>
                    <p className="atsUploadHint">PDF & TXT only. Max 2MB</p>
                  </>
                )}
              </div>
            </div>
            <div className="atsUploadItem">
              <label className="atsUploadLabel">Job Description (Optional)</label>
              <div className="atsUploadArea" onClick={() => document.getElementById('ats-job-input').click()}>
                <input id="ats-job-input" type="file" accept=".pdf,.txt" className="atsFileInput" onChange={(e) => handleFileUpload(e.target.files[0], 'jobdesc')} />
                <Briefcase size={36} className="atsUploadIcon" />
                {jobDescFile ? (
                  <div>
                    <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>✓ {jobDescFile.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setJobDescFile(null); setJobDescText(''); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <p className="atsUploadText">Drop job description here</p>
                    <p className="atsUploadHint">For better matching</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />{error}
            </div>
          )}
          <button onClick={analyzeResume} disabled={!resumeText.trim()} className="atsUploadButton">
            {analyzing ? 'Analyzing...' : 'Analyze Your Resume'}
          </button>
          <div className="atsPrivacy"><Lock size={16} />Privacy guaranteed</div>
        </div>

        {/* Info Sections */}
        <div className="atsInfoSection">
          <div className="atsInfoContent">
            <div className="atsInfoNumber">1</div>
            <h2 className="atsInfoTitle">The proportion of content we can interpret</h2>
            <p className="atsInfoText">Similar to an ATS, we analyze and attempt to comprehend your resume. The greater our understanding of your resume, the more effectively it aligns with a company's ATS.</p>
          </div>
          <div className="atsInfoContent">
            <div className="atsInfoNumber">2</div>
            <h2 className="atsInfoTitle">What our checker identifies</h2>
            <p className="atsInfoText">Although an ATS doesn't look for spelling mistakes and poorly crafted content, recruitment managers certainly do. The second part of our score is based on the quantifiable achievements you have in your resume and the quality of the written content.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="atsFeaturesSection">
          <h2 className="atsFeaturesTitle">Our AI-powered resume checker goes beyond typos and punctuation</h2>
          <p className="atsFeaturesSubtitle">We've built-in ChatGPT to help you create a resume that's tailored to the position you're applying for.</p>
          <div className="atsFeaturesGrid">
            <div className="atsFeatureCard">
              <div className="atsFeatureIcon" style={{ background: '#d1fae5' }}><Edit3 size={24} style={{ color: '#10b981' }} /></div>
              <h3 className="atsFeatureTitle">Content</h3>
              <ul className="atsFeatureList">
                <li><CheckCircle size={16} />ATS parse rate</li>
                <li><CheckCircle size={16} />Repetition of words and phrases</li>
                <li><CheckCircle size={16} />Spelling and grammar</li>
                <li><CheckCircle size={16} />Quantifying impact in experience section with examples</li>
              </ul>
            </div>
            <div className="atsFeatureCard">
              <div className="atsFeatureIcon" style={{ background: '#dbeafe' }}><FileText size={24} style={{ color: '#3b82f6' }} /></div>
              <h3 className="atsFeatureTitle">Format</h3>
              <ul className="atsFeatureList">
                <li><CheckCircle size={16} />File format and size</li>
                <li><CheckCircle size={16} />Resume length</li>
                <li><CheckCircle size={16} />Long bullet points with suggestions on how to shorten</li>
              </ul>
            </div>
            <div className="atsFeatureCard">
              <div className="atsFeatureIcon" style={{ background: '#fce7f3' }}><Users size={24} style={{ color: '#ec4899' }} /></div>
              <h3 className="atsFeatureTitle">Resume sections</h3>
              <ul className="atsFeatureList">
                <li><CheckCircle size={16} />Contact information</li>
                <li><CheckCircle size={16} />Essential sections</li>
                <li><CheckCircle size={16} />Personality showcase with tips on how to improve</li>
              </ul>
            </div>
            <div className="atsFeatureCard">
              <div className="atsFeatureIcon" style={{ background: '#e0e7ff' }}><Target size={24} style={{ color: '#6366f1' }} /></div>
              <h3 className="atsFeatureTitle">Skills suggestion</h3>
              <ul className="atsFeatureList">
                <li><CheckCircle size={16} />Hard skills</li>
                <li><CheckCircle size={16} />Soft skills</li>
              </ul>
            </div>
            <div className="atsFeatureCard">
              <div className="atsFeatureIcon" style={{ background: '#fef3c7' }}><Award size={24} style={{ color: '#f59e0b' }} /></div>
              <h3 className="atsFeatureTitle">Style</h3>
              <ul className="atsFeatureList">
                <li><CheckCircle size={16} />Resume design</li>
                <li><CheckCircle size={16} />Email address</li>
                <li><CheckCircle size={16} />Usage of active voice</li>
                <li><CheckCircle size={16} />Usage of buzzwords and cliches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalyzer;