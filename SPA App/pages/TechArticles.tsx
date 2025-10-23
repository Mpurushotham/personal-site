import React, { useState, useEffect } from 'react';
import { getArticles } from '../services/articleService';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';

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

export default TechArticles;