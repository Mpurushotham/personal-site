
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { getArticles } from '../services/articleService';
import ArticleCard from '../components/ArticleCard';

const Home: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const allArticles = getArticles();
    setFeaturedArticles(allArticles.filter(a => a.isFeatured));
  }, []);

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Hi, I'm <span className="text-accent">Purushotham Muktha</span>
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary mb-8">
          A passionate Frontend Engineer specializing in creating beautiful, functional, and user-centric web applications.
        </p>
        <div className="space-x-4">
          <Link
            to="/tech-newsletters"
            className="bg-accent text-primary font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all duration-300 text-lg"
          >
            Read My Newsletters
          </Link>
          <a
            href="https://github.com/Mpurushotham/personal-website"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-text-main font-bold py-3 px-8 rounded-md hover:bg-gray-700 transition-all duration-300 text-lg"
          >
            View on GitHub
          </a>
        </div>
        <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
            <h2 className="text-2xl font-bold text-accent mb-3">About This Site</h2>
            <p className="text-text-secondary">This is a fully client-side React application. All blog posts and subscriber data are managed using your browser's <strong>localStorage</strong>. There's no backend server or database! This demonstrates how to build dynamic-like applications for static hosting environments like GitHub Pages. You can explore the admin features by navigating to the <Link to="/login" className="text-accent underline">login page</Link>.</p>
        </div>
      </div>
      
      {featuredArticles.length > 0 && (
        <div className="w-full max-w-7xl mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 border-b-2 border-accent/50 pb-4">Featured Newsletters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
