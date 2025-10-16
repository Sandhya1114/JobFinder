import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb, Zap, Loader } from 'lucide-react';

export default function LinkedInProfileChecker() {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const validateLinkedInUrl = (url) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?$/;
    return linkedinRegex.test(url.trim());
  };

  const handleAnalyze = async () => {
    setError('');
    setResult(null);

    const url = profileUrl.trim();

    // Validation
    if (!url) {
      setError('Please enter your LinkedIn profile URL');
      return;
    }

    if (!validateLinkedInUrl(url)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/analyze-linkedin-profile-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze profile');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze profile. Please make sure the profile is public.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {!result ? (
        <div style={styles.inputSection}>
          <div style={styles.header}>
            <div style={styles.linkedinIcon}>in</div>
            <h1 style={styles.title}>LinkedIn Profile Checker</h1>
            <p style={styles.subtitle}>Get AI-powered suggestions to optimize your profile</p>
          </div>

          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your LinkedIn Profile URL</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/your-profile"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                style={styles.input}
                disabled={loading}
              />
              <small style={styles.hint}>
                Example: https://linkedin.com/in/john-doe or https://www.linkedin.com/in/jane-smith
              </small>
            </div>

            <div style={styles.infoBox}>
              <AlertCircle size={18} />
              <div>
                <strong>Public Profile Required</strong>
                <p>Make sure your LinkedIn profile is set to public so we can analyze it.</p>
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Analyzing Profile...
                </>
              ) : (
                'Analyze My Profile'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.resultsSection}>
          <button onClick={() => { setResult(null); setProfileUrl(''); }} style={styles.backButton}>
            ← Check Another Profile
          </button>

          {/* Score Card */}
          <div style={styles.scoreCard}>
            <div style={styles.scoreCircle}>
              <div style={styles.scoreNumber}>{result.overallScore}</div>
              <div style={styles.scoreLabel}>Overall Score</div>
            </div>
            <div style={styles.scoreDetails}>
              <div style={styles.scoreRow}>
                <span>Completeness</span>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${result.completenessScore}%`}}></div>
                </div>
                <span>{result.completenessScore}%</span>
              </div>
              <div style={styles.scoreRow}>
                <span>Quality</span>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${result.issueScore}%`}}></div>
                </div>
                <span>{result.issueScore}%</span>
              </div>
            </div>
          </div>

          {/* Detected Role */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Detected Role</h3>
            <p style={styles.roleLabel}>{result.detectedRole}</p>
          </div>

          {/* Sections Overview */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Profile Sections</h3>
            <div style={styles.sectionGrid}>
              {Object.entries(result.sections).map(([key, section]) => (
                <div key={key} style={styles.sectionItem}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {section.present ? (
                      <CheckCircle size={20} color="#4CAF50" />
                    ) : (
                      <AlertCircle size={20} color="#ff6b6b" />
                    )}
                    <span style={styles.sectionName}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                  {section.score !== undefined && (
                    <small style={styles.sectionScore}>{section.score}%</small>
                  )}
                  {section.count !== undefined && (
                    <small style={styles.sectionScore}>{section.count} items</small>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {result.issues.errors.length > 0 && (
            <div style={{...styles.card, borderLeft: '4px solid #ff6b6b'}}>
              <h3 style={{...styles.cardTitle, color: '#ff6b6b'}}>Critical Issues ({result.issues.errors.length})</h3>
              {result.issues.errors.map((issue, idx) => (
                <div key={idx} style={styles.issueItem}>
                  <strong>{issue.section}</strong>
                  <p>{issue.message}</p>
                  <div style={styles.suggestion}>💡 {issue.suggestion}</div>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {result.issues.warnings.length > 0 && (
            <div style={{...styles.card, borderLeft: '4px solid #ffa500'}}>
              <h3 style={{...styles.cardTitle, color: '#ffa500'}}>Warnings ({result.issues.warnings.length})</h3>
              {result.issues.warnings.map((warn, idx) => (
                <div key={idx} style={styles.issueItem}>
                  <strong>{warn.section}</strong>
                  <p>{warn.message}</p>
                  <div style={styles.suggestion}>💡 {warn.suggestion}</div>
                </div>
              ))}
            </div>
          )}

          {/* Spelling Errors */}
          {result.spellingErrors.length > 0 && (
            <div style={{...styles.card, borderLeft: '4px solid #ff9800'}}>
              <h3 style={{...styles.cardTitle, color: '#ff9800'}}>Spelling Errors</h3>
              {result.spellingErrors.map((error, idx) => (
                <div key={idx} style={styles.spellingError}>
                  <code style={styles.code}>{error.word}</code>
                  <span>→</span>
                  <code style={{...styles.code, color: '#4CAF50'}}>{error.suggestion}</code>
                </div>
              ))}
            </div>
          )}

          {/* AI Suggestions */}
          {result.aiSuggestions.length > 0 && (
            <div style={{...styles.card, borderLeft: '4px solid #2196F3', backgroundColor: 'rgba(33, 150, 243, 0.05)'}}>
              <h3 style={{...styles.cardTitle, color: '#2196F3'}}>
                <Lightbulb size={20} style={{marginRight: '8px'}} />
                AI Suggestions
              </h3>
              {result.aiSuggestions.map((sugg, idx) => (
                <div key={idx} style={styles.suggestionBox}>
                  <div style={styles.suggestionType}>{sugg.type.toUpperCase()}</div>
                  {sugg.current && <p><strong>Current:</strong> {sugg.current}</p>}
                  <p><strong>Suggested:</strong> {sugg.suggestion}</p>
                  <p><em>{sugg.explanation}</em></p>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div style={{...styles.card, borderLeft: '4px solid #9C27B0'}}>
              <h3 style={{...styles.cardTitle, color: '#9C27B0'}}>
                <Zap size={20} style={{marginRight: '8px'}} />
                Top Recommendations
              </h3>
              <ol style={styles.recommendationsList}>
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} style={styles.recommendationItem}>{rec}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#fff'
  },
  inputSection: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  resultsSection: {
    maxWidth: '900px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingTop: '40px'
  },
  linkedinIcon: {
    display: 'inline-block',
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px'
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '16px',
    color: '#a0aec0',
    marginBottom: '0'
  },
  form: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '30px',
    backdropFilter: 'blur(10px)'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#e0e7ff'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  hint: {
    display: 'block',
    marginTop: '8px',
    fontSize: '12px',
    color: '#94a3b8'
  },
  infoBox: {
    background: 'rgba(33, 150, 243, 0.1)',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    color: '#a0e4ff'
  },
  button: {
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  error: {
    background: 'rgba(255, 107, 107, 0.1)',
    border: '1px solid #ff6b6b',
    color: '#ff9999',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  backButton: {
    padding: '10px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '24px',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  scoreCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    alignItems: 'center'
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #00d4ff, #0099ff, #0066ff, #00d4ff)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: '0 auto'
  },
  scoreNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#fff',
    textShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
  },
  scoreLabel: {
    fontSize: '12px',
    color: '#a0aec0',
    marginTop: '4px'
  },
  scoreDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  scoreRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 60px',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00d4ff, #0099ff)',
    transition: 'width 0.5s ease'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  roleLabel: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#00d4ff',
    margin: '0'
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px'
  },
  sectionItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sectionName: {
    fontSize: '14px',
    fontWeight: '600'
  },
  sectionScore: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  issueItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    borderLeft: '3px solid rgba(255, 150, 150, 0.5)'
  },
  suggestion: {
    background: 'rgba(0, 212, 255, 0.1)',
    padding: '12px 16px',
    borderRadius: '6px',
    marginTop: '12px',
    fontSize: '13px',
    color: '#a0e4ff'
  },
  suggestionBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    borderLeft: '3px solid #00d4ff'
  },
  suggestionType: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    marginBottom: '12px',
    textTransform: 'uppercase'
  },
  spellingError: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
  },
  code: {
    background: 'rgba(255, 107, 107, 0.2)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#ff9999',
    fontSize: '12px'
  },
  recommendationsList: {
    paddingLeft: '24px',
    margin: '0'
  },
  recommendationItem: {
    marginBottom: '12px',
    lineHeight: '1.6',
    color: '#e0e7ff'
  }
};