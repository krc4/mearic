import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  photoURL?: string;
  text: string;
  createdAt: Timestamp;
}

export type CommentPayload = Omit<Comment, 'id' | 'createdAt'>;
