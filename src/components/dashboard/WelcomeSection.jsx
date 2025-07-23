import React from 'react';

const WelcomeSection = ({ profile }) => {
  const { name, email } = profile || {};

  return (
    <section style={{ marginBottom: '20px' }}>
      <h2>Welcome{ name ? `, ${name}` : '' }!</h2>
      {email && <p>Email: {email}</p>}
    </section>
  );
};

export default WelcomeSection;