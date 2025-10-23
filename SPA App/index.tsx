// --- Single-File Application Bundle ---
// To resolve module loading issues with in-browser transpilation (Babel Standalone),
// all application source files (.ts, .tsx) have been combined into this single file.
// This allows the application to be deployed on static hosting without a build step.

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, NavLink, useNavigate, useParams, Link } from 'react-router-dom';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// =================================================================================
// SECTION: TYPES (from types.ts)
// =================================================================================
interface Article {
  id: string;
  title: string;
  content: string; // Markdown content
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isFeatured?: boolean;
}

// =================================================================================
// SECTION: FIREBASE CONFIG (from firebaseConfig.ts)
// =================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyA2LjRIPb5Q0urmQkhASrZ_An8515lQTOc",
  authDomain: "mywebsite-purushothammuktha.firebaseapp.com",
  projectId: "mywebsite-purushothammuktha",
  storageBucket: "mywebsite-purushothammuktha.firebasestorage.app",
  messagingSenderId: "713181800941",
  appId: "1:713181800941:web:d264f671d83cbd00c0dfe4",
  measurementId: "G-Q3QC44CN6H"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =================================================================================
// SECTION: SUBSCRIBER SERVICE (from services/subscriberService.ts)
// =================================================================================
const SUBSCRIBERS_KEY = 'blog-subscribers';

const getSubscribers = (): string[] => {
  try {
    const subscribersJson = localStorage.getItem(SUBSCRIBERS_KEY);
    return subscribersJson ? JSON.parse(subscribersJson) : [];
  } catch (e) {
    console.error("Failed to retrieve subscribers from localStorage", e);
    return [];
  }
};

const addSubscriber = (email: string): void => {
  try {
    const subscribers = getSubscribers();
    if (subscribers.includes(email)) {
      throw new Error('This email is already subscribed.');
    }
    const newSubscribers = [...subscribers, email];
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(newSubscribers));
  } catch(e) {
    console.error("Failed to add subscriber to localStorage", e);
    if (e instanceof Error) throw e;
    throw new Error('Could not add subscriber.');
  }
};

// =================================================================================
// SECTION: ARTICLE SERVICE (from services/articleService.ts)
// =================================================================================
const ARTICLES_KEY = 'blog-articles';

const getArticlesFromStorage = (): Article[] => {
  try {
    const articlesJson = localStorage.getItem(ARTICLES_KEY);
    return articlesJson ? JSON.parse(articlesJson) : [];
  } catch (e) {
    console.error("Failed to retrieve articles from localStorage", e);
    return [];
  }
};

const seedInitialData = () => {
    try {
        const existingArticles = localStorage.getItem(ARTICLES_KEY);
        if (!existingArticles) {
            const initialArticles: Article[] = [
                {
                    id: 'welcome-to-my-blog',
                    title: 'Welcome to My Tech Blog!',
                    content: 'This is the first post on my new blog. I\'ll be writing about React, TypeScript, and modern web development. All data for this blog is stored in your browser\'s localStorage, making it a fully client-side application. You can log in as an admin to create, edit, and delete posts.',
                    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
                    updatedAt: new Date('2023-10-26T10:00:00Z').toISOString(),
                    isFeatured: false,
                },
                {
                    id: 'understanding-react-hooks',
                    title: 'A Deep Dive into React Hooks',
                    content: 'React Hooks have revolutionized how we write components. In this article, we will explore `useState`, `useEffect`, and `useContext` with practical examples to help you master them. We will also touch on custom hooks to encapsulate reusable logic.',
                    createdAt: new Date('2023-11-05T14:30:00Z').toISOString(),
                    updatedAt: new Date('2023-11-05T14:30:00Z').toISOString(),
                    isFeatured: true,
                }
            ];
            localStorage.setItem(ARTICLES_KEY, JSON.stringify(initialArticles));
        }
    } catch (e) {
        console.error("Failed to seed initial article data into localStorage", e);
    }
};

seedInitialData();

const getArticles = (): Article[] => {
  const articles = getArticlesFromStorage();
  return articles.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const getArticleById = (id: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(article => article.id === id);
};

const saveArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Article => {
  const articles = getArticlesFromStorage();
  const now = new Date().toISOString();

  if (articleData.id) {
    const index = articles.findIndex(a => a.id === articleData.id);
    if (index > -1) {
      articles[index] = { ...articles[index], ...articleData, updatedAt: now };
      try {
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
      } catch (e) {
        console.error("Failed to save articles to localStorage", e);
      }
      return articles[index];
    }
  }

  const newArticle: Article = {
    id: articleData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    title: articleData.title,
    content: articleData.content,
    createdAt: now,
    updatedAt: now,
    isFeatured: articleData.isFeatured || false,
  };
  const updatedArticles = [...articles, newArticle];
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
  } catch (e) {
    console.error("Failed to save new article to localStorage", e);
  }
  return newArticle;
};

const deleteArticle = (id: string): void => {
  let articles = getArticlesFromStorage();
  articles = articles.filter(article => article.id !== id);
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error("Failed to delete article from localStorage", e);
  }
};

const toggleFeaturedStatus = (id: string): void => {
  let articles = getArticlesFromStorage();
  const index = articles.findIndex(a => a.id === id);
  if (index > -1) {
    articles[index].isFeatured = !articles[index].isFeatured;
    try {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error("Failed to toggle featured status in localStorage", e);
    }
  }
};


// =================================================================================
// SECTION: AUTH HOOK (from hooks/useAuth.ts)
// =================================================================================
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const value = { 
    currentUser, 
    isAuthenticated: !!currentUser, 
    loading, 
    login, 
    logout 
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// =================================================================================
// SECTION: COMPONENTS (from components/*.tsx)
// =================================================================================

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const snippet = article.content.split(' ').slice(0, 30).join(' ') + '...';
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const cardClasses = `h-full relative overflow-hidden bg-secondary p-6 rounded-lg shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-1 ${
    article.isFeatured ? 'border-2 border-accent/50' : ''
  }`;

  return (
    <Link to={`/tech-newsletters/${article.id}`} className="block group h-full">
      <div className={cardClasses}>
        {article.isFeatured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-accent text-primary px-2 py-1 rounded-full text-xs font-bold z-10">
            <StarIcon className="w-4 h-4" />
            <span>Featured</span>
          </div>
        )}
        <h2 className="text-2xl font-bold text-text-main group-hover:text-accent transition-colors duration-300 mb-2 pr-24">{article.title}</h2>
        <p className="text-sm text-text-secondary mb-4">{formattedDate}</p>
        <p className="text-text-secondary leading-relaxed">{snippet}</p>
        <div className="mt-4 text-accent font-semibold group-hover:underline">Read More &rarr;</div>
      </div>
    </Link>
  );
};


const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }
    try {
      addSubscriber(email);
      setMessage('Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold text-text-main mb-2">Subscribe to my newsletter</h3>
            <p className="text-text-secondary">Get the latest tech articles and updates straight to your inbox.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="flex-grow bg-primary border border-gray-600 rounded-md py-2 px-4 text-text-main focus:ring-accent focus:border-accent"
              required
            />
            <button
              type="submit"
              className="bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
        {message && <p className="text-center mt-4 text-sm text-accent">{message}</p>}
        <div className="text-center text-text-secondary mt-8 pt-8 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} Purushotham Muktha. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Header: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      isActive
        ? 'bg-accent text-primary'
        : 'text-text-secondary hover:text-text-main hover:bg-secondary'
    }`;

  return (
    <header className="bg-primary/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-accent">
              PM.
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses}>
                  Home
                </NavLink>
                <NavLink to="/tech-newsletters" className={navLinkClasses}>
                  Tech Newsletters
                </NavLink>
                {isAuthenticated && (
                   <NavLink to="/admin" className={navLinkClasses}>
                    Admin
                  </NavLink>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {isAuthenticated && (
               <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary hidden sm:block" title={currentUser?.email || ''}>
                  {currentUser?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-main hover:bg-secondary transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};


// =================================================================================
// SECTION: PAGES (from pages/*.tsx)
// =================================================================================

declare global {
  interface Window {
    initTheme: () => void;
  }
}

const Home: React.FC = () => {
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

      <section id="portfolio" className="skills-section" role="region" aria-labelledby="skills-heading">
      </section>

      <section id="featured-work" className="portfolio">
      </section>

      <section id="contact" className="contact">
        <div className="contact-floating-shapes" aria-hidden="true">
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

const TechArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setArticles(getArticles());
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center text-accent">Loading newsletters...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center border-b-2 border-accent pb-4">Tech Newsletters</h1>
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-secondary text-lg">No newsletters found. The admin can add some!</p>
      )}
    </div>
  );
};

declare const jspdf: any;
declare const html2canvas: any;
declare const htmlToDocx: any;

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const articleContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      setArticle(foundArticle || null);
    }
  }, [id]);

  const handleExportPDF = async () => {
    if (!articleContentRef.current || !article) return;
    setIsLoading(true);
    try {
      const { jsPDF } = jspdf;
      const canvas = await html2canvas(articleContentRef.current, { backgroundColor: '#1a1a1a', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${article.id}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF.");
    }
    setIsLoading(false);
  };

  const handleExportDOCX = async () => {
    if (!articleContentRef.current || !article) return;
    setIsLoading(true);
    try {
      const content = articleContentRef.current.innerHTML;
      const fileBuffer = await htmlToDocx(content, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });
      const blob = new Blob([fileBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${article.id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to DOCX:", error);
      alert("Failed to export to DOCX.");
    }
    setIsLoading(false);
  };


  if (!article) {
    return <div className="text-center">Article not found.</div>;
  }
  
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sanitizedHtml = DOMPurify.sanitize(marked.parse(article.content) as string);

  return (
    <div className="max-w-4xl mx-auto bg-secondary p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Link to="/tech-newsletters" className="text-accent hover:underline">&larr; Back to Newsletters</Link>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Link to={`/admin/editor/${article.id}`} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-opacity-80 text-sm transition-colors">Edit</Link>
            <button onClick={handleExportPDF} disabled={isLoading} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 text-sm transition-colors disabled:opacity-50">
              {isLoading ? '...' : 'Export PDF'}
            </button>
            <button onClick={handleExportDOCX} disabled={isLoading} className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 text-sm transition-colors disabled:opacity-50">
              {isLoading ? '...' : 'Export DOCX'}
            </button>
          </div>
        )}
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-2">{article.title}</h1>
      <p className="text-text-secondary mb-8">Posted on {formattedDate}</p>
      <div 
        ref={articleContentRef}
        className="prose prose-invert lg:prose-xl max-w-none prose-p:text-text-secondary prose-headings:text-text-main prose-strong:text-accent no-copy"
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

interface FirebaseError extends Error {
  code: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      const error = err as FirebaseError;
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        default:
          setError('Failed to log in. Please try again.');
          console.error(error);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-main">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Secure login via Firebase Authentication.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-primary placeholder-gray-500 text-text-main rounded-t-md focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-primary placeholder-gray-500 text-text-main rounded-b-md focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-accent hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeaturedStatus(id);
    setArticles(getArticles());
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="flex justify-center gap-4 mb-8">
        <Link
          to="/admin/editor"
          className="bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors"
        >
          Create New Article
        </Link>
        <Link
          to="/admin/subscribers"
          className="bg-secondary text-text-main font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
        >
          View Subscribers
        </Link>
      </div>
      
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Articles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-primary/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date Created</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {articles.map(article => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main">{article.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary text-center">
                    {article.isFeatured && <StarIcon className="w-5 h-5 text-accent mx-auto" />}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => handleToggleFeatured(article.id)} className="text-yellow-400 hover:text-yellow-300">
                      {article.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <Link to={`/admin/editor/${article.id}`} className="text-accent hover:text-green-400">Edit</Link>
                    <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {articles.length === 0 && <p className="text-center text-text-secondary py-4">No articles yet.</p>}
      </div>
    </div>
  );
};


const EditorToolbar: React.FC<{ textareaRef: React.RefObject<HTMLTextAreaElement>, onContentChange: (newContent: string) => void }> = ({ textareaRef, onContentChange }) => {
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${before}${selectedText}${after}`;
    const updatedValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    onContentChange(updatedValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };
  
  const buttons = [
    { label: 'B', action: () => insertText('**', '**'), title: 'Bold' },
    { label: 'I', action: () => insertText('*', '*'), title: 'Italic' },
    { label: 'H1', action: () => insertText('\n# ', ''), title: 'Heading 1' },
    { label: 'H2', action: () => insertText('\n## ', ''), title: 'Heading 2' },
    { label: 'Link', action: () => insertText('[', '](https://)'), title: 'Link' },
    { label: 'Quote', action: () => insertText('\n> ', ''), title: 'Blockquote' },
    { label: 'Code', action: () => insertText('`', '`'), title: 'Inline Code' },
    { label: 'Code Block', action: () => insertText('\n```\n', '\n```\n'), title: 'Code Block' },
    { label: 'List', action: () => insertText('\n- ', ''), title: 'Unordered List' },
  ];

  return (
    <div className="flex flex-wrap gap-1 bg-primary p-2 rounded-t-md border-b border-gray-600">
      {buttons.map(btn => (
        <button key={btn.label} type="button" onClick={btn.action} title={btn.title} className="px-3 py-1 bg-secondary hover:bg-gray-700 rounded-md text-sm font-mono">{btn.label}</button>
      ))}
    </div>
  );
};

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
  
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const article = getArticleById(id);
      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setIsFeatured(article.isFeatured || false);
      } else {
        navigate('/admin'); // Article not found
      }
    }
  }, [id, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }
    const articleData = id ? { id, title, content, isFeatured } : { title, content, isFeatured };
    saveArticle(articleData);
    navigate('/admin');
  };

  const handleFileRead = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      } else {
        alert("Failed to read file.");
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsDataURL(file);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file, (base64) => {
        const markdownImage = `\n![${file.name}](${base64})\n`;
        setContent(prev => prev + markdownImage);
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       handleFileRead(file, (dataUrl) => {
        const fileLink = `\n<a href="${dataUrl}" download="${file.name}">Download ${file.name}</a>\n`;
        setContent(prev => prev + fileLink);
      });
    }
  };

  const handleReplaceAll = () => {
    if(!findText) {
      alert("Please enter text to find.");
      return;
    }
    setContent(prev => prev.split(findText).join(replaceText));
  };

  const sanitizedHtmlPreview = useMemo(() => {
    return DOMPurify.sanitize(marked.parse(content) as string);
  }, [content]);


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">{isEditing ? 'Edit Article' : 'Create New Article'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-secondary p-8 rounded-lg shadow-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
            Article Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-primary border border-gray-600 rounded-md py-2 px-4 text-text-main focus:ring-accent focus:border-accent"
            required
          />
        </div>

        <div className="flex items-center">
            <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-accent bg-primary border-gray-600 rounded focus:ring-accent"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-text-secondary">
                Mark as Featured Article
            </label>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-text-secondary mb-1">Find & Replace</label>
           <div className="flex gap-2">
              <input type="text" placeholder="Find" value={findText} onChange={e => setFindText(e.target.value)} className="flex-1 bg-primary border border-gray-600 rounded-md py-1 px-2 text-text-main text-sm"/>
              <input type="text" placeholder="Replace" value={replaceText} onChange={e => setReplaceText(e.target.value)} className="flex-1 bg-primary border border-gray-600 rounded-md py-1 px-2 text-text-main text-sm"/>
              <button type="button" onClick={handleReplaceAll} className="bg-accent text-primary text-sm font-bold py-1 px-3 rounded-md hover:bg-opacity-80">Replace All</button>
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Content
          </label>
          <div className="flex border-b border-gray-600 mb-[-1px]">
            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`py-2 px-4 text-sm font-medium rounded-t-md transition-colors ${
                viewMode === 'write'
                  ? 'bg-primary border-t border-x border-gray-600 text-text-main'
                  : 'text-text-secondary hover:bg-secondary'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`py-2 px-4 text-sm font-medium rounded-t-md transition-colors ${
                viewMode === 'preview'
                  ? 'bg-primary border-t border-x border-gray-600 text-text-main'
                  : 'text-text-secondary hover:bg-secondary'
              }`}
            >
              Preview
            </button>
          </div>
          
          {viewMode === 'write' ? (
            <div>
              <EditorToolbar textareaRef={contentRef} onContentChange={setContent} />
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="w-full bg-primary border border-gray-600 rounded-b-md py-2 px-4 text-text-main focus:ring-accent focus:border-accent font-mono"
                required
              />
            </div>
          ) : (
             <div
              className="prose prose-invert lg:prose-xl max-w-none prose-p:text-text-secondary prose-headings:text-text-main prose-strong:text-accent bg-primary p-4 border border-gray-600 rounded-b-md min-h-[500px]"
              dangerouslySetInnerHTML={{ __html: sanitizedHtmlPreview }}
            />
          )}

          <p className="text-xs text-text-secondary mt-1">For custom fonts/sizes, you can use inline HTML like {'<span style="font-family: Courier;">text</span>'}. Markdown is supported.</p>
        </div>


        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Attachments</label>
          <div className="flex gap-4">
            <button type="button" onClick={() => imageInputRef.current?.click()} className="bg-gray-600 text-text-main font-bold py-2 px-4 rounded-md hover:bg-gray-700">Insert Image</button>
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            
            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-600 text-text-main font-bold py-2 px-4 rounded-md hover:bg-gray-700">Insert File</button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" className="hidden" />
          </div>
          <p className="text-xs text-text-secondary mt-1">Note: Images and files are embedded directly into the article data, increasing storage size.</p>
        </div>

        <div className="flex justify-end gap-4">
            <button
                type="button"
                onClick={() => navigate('/admin')}
                className="bg-gray-600 text-text-main font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors"
            >
                {isEditing ? 'Update Article' : 'Publish Article'}
            </button>
        </div>
      </form>
    </div>
  );
};

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<string[]>([]);

  useEffect(() => {
    setSubscribers(getSubscribers());
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
       <Link to="/admin" className="text-accent hover:underline mb-8 block">&larr; Back to Dashboard</Link>
      <h1 className="text-4xl font-bold mb-8 text-center">Subscribed Users</h1>
      <div className="bg-secondary p-6 rounded-lg shadow-lg">
        {subscribers.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {subscribers.map((email, index) => (
              <li key={index} className="py-3 text-text-main">
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-text-secondary">No one has subscribed yet.</p>
        )}
      </div>
    </div>
  );
};


// =================================================================================
// SECTION: APP CONTAINER (from App.tsx)
// =================================================================================
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-accent py-10">Verifying session...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tech-newsletters" element={<TechArticles />} />
              <Route path="/tech-newsletters/:id" element={<ArticleDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/editor" element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              } />
              <Route path="/admin/editor/:id" element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              } />
              <Route path="/admin/subscribers" element={
                <ProtectedRoute>
                  <Subscribers />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

// =================================================================================
// SECTION: RENDERER (original index.tsx)
// =================================================================================
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
