
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
    <Link to={`/article/${article.id}`} className="block group h-full">
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

export default ArticleCard;