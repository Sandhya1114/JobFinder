
import './WelcomeSection.css';

const WelcomeSection = ({ profile }) => {
  const { name, email } = profile || {};

  return (
    <section className="welcome-section">
      <div className="welcome-content">
        <div className="welcome-text">
          <h2 className="welcome-title">
            Welcome{name ? `, ${name}` : ''}! 👋
          </h2>
          <p className="welcome-subtitle">
            Ready to advance your career journey?
          </p>
          {email && (
            <div className="welcome-email">
              <svg className="email-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span>{email}</span>
            </div>
          )}
        </div>
        <div className="welcome-avatar">
          <div className="avatar-container">
            <svg className="avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="welcome-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </section>
  );
};

export default WelcomeSection;