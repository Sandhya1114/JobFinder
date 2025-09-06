import './ContactUs.css';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  return (
    <div className="contact-container">
      <div className="glasCard">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-description">
          Have questions? Reach out to our team for assistance with your job search or employer needs.
        </p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="form-input"
              required 
            />
          </div>
          
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="form-input"
              required 
            />
          </div>
          
          <div className="form-group">
            <select className="form-input" required>
              <option value="">Subject</option>
              <option value="job-seeker">Job Seeker Support</option>
              <option value="employer">Employer Support</option>
              <option value="technical">Technical Assistance</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>
          
          <div className="form-group">
            <textarea 
              placeholder="Your Message" 
              className="form-textarea"
              rows="5"
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Send Message</button>
        </form>
        
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt info-icon"></i>
            <p>123 Job Portal St, Tech City, TC 10001</p>
          </div>
          <div className="info-item">
            <a href="#" class="fa fa-phone info-icon" ></a>
            {/* <i className="fas fa-phone-alt info-icon"></i> */}
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="info-item">
             <a href="#" class="fa fa-envelope info-icon" ></a>
            {/* <i className="fas fa-envelope info-icon"></i> */}
            <p>support@jobportal.example</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
