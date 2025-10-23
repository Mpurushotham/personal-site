
import { Article } from '../types';

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

// Seed with some initial data if none exists
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


export const getArticles = (): Article[] => {
  const articles = getArticlesFromStorage();
  // Sort by featured status first, then by most recent date
  return articles.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getArticleById = (id: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(article => article.id === id);
};

export const saveArticle = (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Article => {
  const articles = getArticlesFromStorage();
  const now = new Date().toISOString();

  if (articleData.id) {
    // Update existing article
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

  // Create new article
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

export const deleteArticle = (id: string): void => {
  let articles = getArticlesFromStorage();
  articles = articles.filter(article => article.id !== id);
  try {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error("Failed to delete article from localStorage", e);
  }
};

export const toggleFeaturedStatus = (id: string): void => {
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
