// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- SERVICES (Data Access) ---
    const SUBSCRIBERS_KEY = 'blog-subscribers';
    const articles = articlesData.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const getArticleById = (id) => articles.find(article => article.id === id);
    const getSubscribers = () => JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
    const addSubscriber = (email) => {
        const subscribers = getSubscribers();
        if (subscribers.includes(email)) {
            throw new Error('This email is already subscribed.');
        }
        subscribers.push(email);
        localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
    };

    // --- UI ELEMENTS ---
    const pages = document.querySelectorAll('.page-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const homePage = document.getElementById('page-home');
    const articlesPage = document.getElementById('page-articles');
    const articleDetailPage = document.getElementById('page-article-detail');
    const subscribeForm = document.getElementById('subscribe-form');
    const subscribeEmail = document.getElementById('subscribe-email');
    const subscribeMessage = document.getElementById('subscribe-message');

    // --- ROUTING ---
    const handleRouteChange = () => {
        const hash = window.location.hash || '#/';
        pages.forEach(page => page.classList.remove('active'));

        // Update nav link styles
        navLinks.forEach(link => {
            const linkHash = link.getAttribute('href');
            if (linkHash === hash || (hash === '#/' && linkHash === '#/')) {
                 link.classList.add('bg-accent', 'text-primary');
                 link.classList.remove('text-text-secondary', 'hover:text-text-main', 'hover:bg-secondary');
            } else {
                 link.classList.remove('bg-accent', 'text-primary');
                 link.classList.add('text-text-secondary', 'hover:text-text-main', 'hover:bg-secondary');
            }
        });

        if (hash.startsWith('#/tech-newsletters/')) {
            const articleId = hash.substring('#/tech-newsletters/'.length);
            renderArticleDetailPage(articleId);
            articleDetailPage.classList.add('active');
        } else if (hash === '#/tech-newsletters') {
            renderArticlesListPage();
            articlesPage.classList.add('active');
        } else {
            homePage.classList.add('active');
            // Re-initialize theme animations if the home page is shown
            if (window.initTheme) {
                window.initTheme();
            }
        }
        window.scrollTo(0, 0);
    };

    // --- RENDERING FUNCTIONS ---
    const renderArticlesListPage = () => {
        let content = `<h1 class="text-4xl font-bold mb-8 text-center border-b-2 border-accent pb-4">Tech Newsletters</h1>`;
        if (articles.length > 0) {
            content += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`;
            articles.forEach(article => {
                const snippet = article.content.split(' ').slice(0, 30).join(' ') + '...';
                const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const featuredBadge = article.isFeatured ? `
                    <div class="absolute top-3 right-3 flex items-center gap-1 bg-accent text-primary px-2 py-1 rounded-full text-xs font-bold z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span>Featured</span>
                    </div>` : '';
                const cardBorder = article.isFeatured ? 'border-2 border-accent/50' : '';

                content += `
                    <a href="#/tech-newsletters/${article.id}" class="block group h-full">
                        <div class="h-full relative overflow-hidden bg-secondary p-6 rounded-lg shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-1 ${cardBorder}">
                            ${featuredBadge}
                            <h2 class="text-2xl font-bold text-text-main group-hover:text-accent transition-colors duration-300 mb-2 pr-24">${article.title}</h2>
                            <p class="text-sm text-text-secondary mb-4">${formattedDate}</p>
                            <p class="text-text-secondary leading-relaxed">${snippet}</p>
                            <div class="mt-4 text-accent font-semibold group-hover:underline">Read More &rarr;</div>
                        </div>
                    </a>
                `;
            });
            content += `</div>`;
        } else {
            content += `<p class="text-center text-text-secondary text-lg">No newsletters found.</p>`;
        }
        articlesPage.innerHTML = content;
    };

    const renderArticleDetailPage = (id) => {
        const article = getArticleById(id);
        if (!article) {
            articleDetailPage.innerHTML = `<div class="text-center">Article not found. <a href="#/tech-newsletters" class="text-accent hover:underline">Go back</a>.</div>`;
            return;
        }

        const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const sanitizedHtml = DOMPurify.sanitize(marked.parse(article.content));

        articleDetailPage.innerHTML = `
            <div class="max-w-4xl mx-auto bg-secondary p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
                <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <a href="#/tech-newsletters" class="text-accent hover:underline">&larr; Back to Newsletters</a>
                    <div class="flex gap-2">
                        <button id="export-pdf-btn" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 text-sm transition-colors disabled:opacity-50">
                            Export PDF
                        </button>
                        <button id="export-docx-btn" class="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 text-sm transition-colors disabled:opacity-50">
                            Export DOCX
                        </button>
                    </div>
                </div>
                <div id="article-export-content">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-text-main mb-2">${article.title}</h1>
                    <p class="text-text-secondary mb-8">Posted on ${formattedDate}</p>
                    <div 
                        class="prose prose-invert lg:prose-xl max-w-none prose-p:text-text-secondary prose-headings:text-text-main prose-strong:text-accent no-copy"
                    >
                        ${sanitizedHtml}
                    </div>
                </div>
            </div>
        `;
        
        // Add protection and event listeners after content is in the DOM
        const articleContent = articleDetailPage.querySelector('.prose');
        if(articleContent) {
            articleContent.oncopy = (e) => e.preventDefault();
            articleContent.oncontextmenu = (e) => e.preventDefault();
        }

        const pdfBtn = document.getElementById('export-pdf-btn');
        const docxBtn = document.getElementById('export-docx-btn');
        const exportContent = document.getElementById('article-export-content');

        pdfBtn.addEventListener('click', async () => {
            pdfBtn.disabled = true;
            pdfBtn.textContent = '...';
            try {
                const { jsPDF } = window.jspdf;
                const canvas = await html2canvas(exportContent, { backgroundColor: '#2a2a2a', scale: 2 });
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
            pdfBtn.disabled = false;
            pdfBtn.textContent = 'Export PDF';
        });

        docxBtn.addEventListener('click', async () => {
            docxBtn.disabled = true;
            docxBtn.textContent = '...';
            try {
                const fileBuffer = await window.htmlToDocx(exportContent.innerHTML, null, {
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
            docxBtn.disabled = false;
            docxBtn.textContent = 'Export DOCX';
        });

    };

    // --- EVENT LISTENERS ---
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = subscribeEmail.value.trim();
        if (!email) {
            subscribeMessage.textContent = 'Please enter a valid email address.';
            return;
        }
        try {
            addSubscriber(email);
            subscribeMessage.textContent = 'Thank you for subscribing!';
            subscribeEmail.value = '';
            setTimeout(() => { subscribeMessage.textContent = '' }, 3000);
        } catch (error) {
            subscribeMessage.textContent = error.message;
        }
    });

    window.addEventListener('hashchange', handleRouteChange);

    // --- INITIALIZATION ---
    handleRouteChange(); // Render initial route
    const currentYear = new Date().getFullYear();
    document.querySelector('footer .text-center p').innerHTML = `&copy; ${currentYear} Purushotham Muktha. All Rights Reserved.`;

});
// FIX: Replaced local firebase imports with CDN URL imports to fix module resolution errors.