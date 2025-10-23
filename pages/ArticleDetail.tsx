import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../services/articleService';
import { Article } from '../types';
import { useAuth } from '../hooks/useAuth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Declare global variables from CDN scripts
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

export default ArticleDetail;