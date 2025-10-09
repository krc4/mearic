
import { Timestamp } from 'firebase/firestore';

export type AdminRole = 'founder' | 'admin';

export interface AdminPermissions {
  canDeleteComments: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  addedAt: Timestamp;
  role: AdminRole;
  permissions: AdminPermissions;
}
