
import { Timestamp } from 'firebase/firestore';

export type AdminRole = 'admin';

export interface AdminPermissions {
  canDeleteComments: boolean;
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canManageAdmins: boolean;
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
