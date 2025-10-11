
import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  slug: string;
  image: string;
  readTime: number;
  category: string;
  content: string;
  description: string;
  views: number;
  likes: number;
  createdAt?: string | Timestamp; 
  authorId?: string;
  author?: string;
  authorPhotoURL?: string;
  tags?: string[];
}
