
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getArticles, deleteArticle, toggleFeaturedStatus } from '../services/articleService';
import { Article } from '../types';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

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

export default AdminDashboard;
