import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Since the theme's JS is loaded globally, we declare its init function
// to avoid TypeScript errors. We'll call this to restart animations.
declare global {
  interface Window {
    initTheme: () => void;
  }
}

const Home: React.FC = () => {

  // This hook runs after the component is added to the page.
  // We call the theme's init function to make sure animations
  // like the typewriter effect start correctly.
  useEffect(() => {
    if (window.initTheme) {
      window.initTheme();
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero" role="region" aria-labelledby="home-heading">
        <h2 id="home-heading" className="visually-hidden">Home</h2>
        <div className="floating-shapes" aria-hidden="true">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="hero-content">
          <div className="hero-subtitle" style={{ color: 'darkgreen' }}>$ deploy-Cloud-ai-infrastructure --optimize=true --scale=auto</div>
          <h1 className="typewriter" style={{ color: 'black', fontFamily: "'Courier'" }}>Muktha@CloudDevSecOps:~$</h1>
          <h1>whoami</h1>
          <h2>
            <a style={{ color: 'rgb(60, 185, 10)', fontSize: 'larger', fontFamily: "'Courier New', Courier, monospace" }}
              className="typewrite" data-period="2000"
              data-type='[ "> Cloud Solution Architect", "> DevSecOps Architect", "> Cybersecurity Architect", "> Cloud & Infra Platform Specialist" ]'>
              <span className="wrap"></span>
            </a>
          </h2>
          <br />
          <h3>
            Architecting cloud solutions reliable, high-performance, and cloud-native platforms with focus on DevSecOps automation, security, and scalability. Whether it's deploying Kubernetes clusters, optimizing CI/CD pipelines, or securing cloud workloads, I help clients with purpose.
          </h3>
          <br />
          <a href="#portfolio" className="cta-button">Explore My Work</a>
          <a href="#contact" className="cta-button">Get In Touch<i className="fa fa-envelope"></i></a>
          <div className="social-badges" aria-label="Social and contact links" style={{ marginTop: '1rem' }}>
            <a href="https://github.com/Mpurushotham" target="_blank" rel="noopener noreferrer" aria-label="GitHub - Mpurushotham">
              <img src="https://img.shields.io/badge/GitHub-Mpurushotham-181717?style=for-the-badge&logo=github" alt="GitHub - Mpurushotham" />
            </a>
            <a href="https://linkedin.com/in/Mpurushotham" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn - Mpurushotham">
              <img src="https://img.shields.io/badge/LinkedIn-Mpurushotham-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn - Mpurushotham" />
            </a>
            <a href="mailto:purushotham.muktha@gmail.com" aria-label="Send email to purushotham.muktha@gmail.com">
              <img src="https://img.shields.io/badge/Email-Contact%20Me-red?style=for-the-badge&logo=gmail" alt="Email - purushotham.muktha@gmail.com" />
            </a>
            <a href="https://wa.me/+46764561036" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp chat">
              <img src="https://img.shields.io/badge/WhatsApp-Chat%20Now-25D366?style=for-the-badge&logo=whatsapp" alt="WhatsApp - Chat Now" />
            </a>
          </div>
        </div>
        <div className="scroll-indicator" role="button" tabIndex={0} aria-label="Scroll to about section" onClick={() => document.getElementById('about-proven')?.scrollIntoView()}></div>
      </section>

      {/* About Proven Impact Section */}
      <section id="about-proven" className="about-proven" role="region" aria-labelledby="about-heading">
        <h2 id="about-heading" className="visually-hidden">About Proven</h2>
        <div className="container">
          <h2 className="section-title fade-in">DevSecOps Engineer & Infra Platform Architect</h2>
          <p className="lead muted" style={{ textAlign: 'center', maxWidth: '800px', margin: '1rem auto 2rem' }}>I build scalable cloud infrastructure and automate deployment pipelines that power innovation at scale.</p>
          <div className="proven-grid">
            <div className="proven-left">
              <div className="stat-cards">
                <div className="stat-card">
                  <div className="stat-value">15+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">10+</div>
                  <div className="stat-label">Projects Delivered</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">99.9%</div>
                  <div className="stat-label">Uptime Achieved</div>
                </div>
              </div>
            </div>
            <div className="proven-right">
              <div className="feature-cards">
                <div className="feature-card">
                  <span className="feature-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 17.58A4 4 0 0016 14h-1.26A6 6 0 106 17.5" stroke="#4FACFE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="feature-text">Multi-Cloud Architecture</span>
                </div>
                <div className="feature-card">
                  <span className="feature-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M4 12h10M4 17h7" stroke="#06B6D4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="feature-text">CI/CD Automation</span>
                </div>
                {/* ... other feature cards ... */}
              </div>
            </div>
          </div>
          <div className="impact-bar">
            <h3>Proven Impact</h3>
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-value">75%</div>
                <div className="impact-label">Faster Deployments</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">40%</div>
                <div className="impact-label">Cost Reduction</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">95%</div>
                <div className="impact-label">Fewer Incidents</div>
              </div>
              <div className="impact-item">
                <div className="impact-value">2x</div>
                <div className="impact-label">Team Productivity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Ecosystem Section */}
      <section id="portfolio" className="skills-section" role="region" aria-labelledby="skills-heading">
          {/* ... full skills section content ... */}
      </section>

      <section id="featured-work" className="portfolio">
          {/* ... full featured work section ... */}
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-floating-shapes" aria-hidden="true">
            {/* ... shapes ... */}
        </div>
        <div className="container">
            <div className="contact-content">
                <h2 className="section-title fade-in">Let's Work Together</h2>
                <p className="fade-in" style={{color: 'aliceblue'}}>Ready to bring your vision to life? Let's discuss how we can create something amazing
                    together. I'm always excited to take on new challenges and collaborate on innovative projects.</p>
                <form id="contact-form" className="contact-form fade-in" data-to-email="purushotham.muktha@gmail.com">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="your.email@example.com" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" placeholder="What's this about?" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows={6} placeholder="Tell me about your project..."
                            required></textarea>
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="submit-btn">Send Message</button>
                        <a href="https://calendly.com/purushotham-muktha/30min?" target="_blank" rel="noopener noreferrer" className="submit-btn secondary-btn">Schedule a Call</a>
                    </div>
                </form>
                <div id="contact-status" className="visually-hidden" aria-live="polite" aria-atomic="true"></div>
            </div>
        </div>
    </section>
    </>
  );
};

export default Home;
