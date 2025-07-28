
import { Timestamp } from 'firebase/firestore';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  addedAt: Timestamp;
}
