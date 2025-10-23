
export interface Article {
  id: string;
  title: string;
  content: string; // Markdown content
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isFeatured?: boolean;
}
