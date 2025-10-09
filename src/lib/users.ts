
import { Timestamp } from 'firebase/firestore';

export interface SiteUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string | Timestamp;
}
