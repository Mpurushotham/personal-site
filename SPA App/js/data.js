// This file contains the data for your blog articles.
// To add, edit, or remove an article, simply modify the array below.
//
// Each article should have:
// - id: A unique string, typically URL-friendly (e.g., 'my-first-post').
// - title: The title of the article.
// - content: The article content in Markdown format. Use backticks for multiline strings.
// - createdAt: The date the article was created in ISO 8601 format (e.g., '2023-10-26T10:00:00Z').
// - isFeatured: (Optional) Set to true to mark the article as featured.

const articlesData = [
    {
        id: 'welcome-to-my-blog',
        title: 'Welcome to My Tech Blog!',
        content: `This is the first post on my new blog. I'll be writing about web development, cloud infrastructure, and cybersecurity. 
All data for this blog is now managed in a simple JavaScript file, making the site fast, reliable, and easy to update.`,
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z',
        isFeatured: false,
    },
    {
        id: 'understanding-react-hooks',
        title: 'A Deep Dive into React Hooks',
        content: `OKAY.  React Hooks have revolutionized how we write components. In this article, we will explore \`useState\`, \`useEffect\`, and \`useContext\` with practical examples to help you master them. 
We will also touch on custom hooks to encapsulate reusable logic.
### useState
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`
### useEffect
\`\`\`javascript
useEffect(() => {
  document.title = 'You clicked ' + count + ' times';
}, [count]);
\`\`\``,
        createdAt: '2023-11-05T14:30:00Z',
        updatedAt: '2023-11-05T14:30:00Z',
        isFeatured: true,
    }
];
