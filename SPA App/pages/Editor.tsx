import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveArticle, getArticleById } from '../SPA App/services/articleService';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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

export default Editor;