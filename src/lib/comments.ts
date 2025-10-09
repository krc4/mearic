import { Timestamp } from 'firebase/firestore';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  photoURL?: string;
  text: string;
  createdAt: Timestamp;
  isAdmin?: boolean;
}

export type CommentPayload = Omit<Comment, 'id' | 'createdAt'>;

export interface CommentWithPostInfo extends Comment {
    postTitle: string;
    postSlug: string;
}
