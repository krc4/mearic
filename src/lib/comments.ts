import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  photoURL?: string;
  text: string;
  createdAt: Timestamp;
  isAdmin?: boolean; // Add isAdmin flag
}

export type CommentPayload = Omit<Comment, 'id' | 'createdAt' | 'isAdmin'>;