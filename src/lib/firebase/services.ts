

import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, doc, deleteDoc, getDoc, updateDoc, orderBy, setDoc, increment, getCountFromServer, limit, startAfter, collectionGroup } from 'firebase/firestore';
import type { Post } from '@/lib/posts';
import type { Comment } from '@/lib/comments';
import { CommentPayload } from '@/lib/comments';
import type { AdminUser, AdminRole, AdminPermissions } from '@/lib/admin';
import type { SiteUser } from '@/lib/users';
import type { HomepageSettings } from '@/lib/settings';

export type PostPayload = Omit<Post, 'id' | 'slug' | 'views' | 'createdAt' | 'likes' | 'content'> & {
    content: string;
};

// Find a user by email in the 'users' collection
export const findUserByEmail = async (email: string): Promise<{ uid: string, displayName: string | null, photoURL: string | null } | null> => {
    try {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        return {
            uid: userDoc.id,
            displayName: data.displayName || null,
            photoURL: data.photoURL || null
        };
    } catch (e) {
        console.error("Error finding user by email: ", e);
        return null;
    }
};

export const ensureUserDocument = async (user: import('firebase/auth').User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        try {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                displayNameLastChanged: null,
            });
             console.log("User document created for:", user.email);
        } catch (error) {
            console.error("Error creating user document:", error);
        }
    }
};

export const getUserDoc = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserDoc = async (uid: string, data: { [key: string]: any }): Promise<{ success: boolean, message: string }> => {
    const userRef = doc(db, 'users', uid);

    if (data.displayName) {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.displayNameLastChanged) {
                const lastChanged = (userData.displayNameLastChanged as Timestamp).toDate();
                const now = new Date();
                const diffHours = (now.getTime() - lastChanged.getTime()) / (1000 * 60 * 60);
                if (diffHours < 24) {
                    const hoursLeft = Math.ceil(24 - diffHours);
                    return { success: false, message: `Kullanıcı adınızı tekrar değiştirmek için yaklaşık ${hoursLeft} saat beklemelisiniz.` };
                }
            }
            data.displayNameLastChanged = serverTimestamp();
        }
    }
    
    try {
        await updateDoc(userRef, data);

        // Also update the admin document if the user is an admin
        const adminRef = doc(db, 'admins', uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
            await updateDoc(adminRef, {
                displayName: data.displayName || adminSnap.data().displayName,
                photoURL: data.photoURL || adminSnap.data().photoURL
            });
        }

        return { success: true, message: "Profil başarıyla güncellendi." };
    } catch (error) {
        console.error("Error updating user doc:", error);
        return { success: false, message: "Profil güncellenirken bir hata oluştu." };
    }
};


export const addPost = async (post: PostPayload) => {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            ...post,
            slug: post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            views: 0,
            likes: 0,
            createdAt: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        return null;
    }
};

const serializePost = (doc: any): Post => {
    const data = doc.data();
    const createdAt = data.createdAt;

    return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        image: data.image,
        readTime: data.readTime,
        category: data.category,
        content: data.content,
        description: data.description,
        views: data.views || 0,
        likes: data.likes || 0,
        createdAt: createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : createdAt,
        author: data.author,
        authorId: data.authorId,
        authorPhotoURL: data.authorPhotoURL,
        tags: data.tags,
    };
};

export const getPostsByCategory = async (
    category: string,
    postsLimit: number = 1000,
    lastVisible: any = null
): Promise<{ posts: Post[], lastVisible: any }> => {
    try {
        const postsRef = collection(db, "posts");
        let constraints = [where("category", "==", category), limit(postsLimit)];

        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        const q = query(postsRef, ...constraints);

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(serializePost);
        const newLastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

        return { posts, lastVisible: newLastVisible };
    } catch (e) {
        console.error("Error getting documents: ", e);
        return { posts: [], lastVisible: null };
    }
};




export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    try {
        const q = query(collection(db, "posts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return null;
        }
        const postDoc = querySnapshot.docs[0];
        return serializePost(postDoc);
    } catch (e) {
        console.error("Error getting document by slug: ", e);
        return null;
    }
}

export const incrementPostView = async (postId: string): Promise<number | null> => {
    try {
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
            views: increment(1)
        });
        const updatedDoc = await getDoc(postRef);
        return updatedDoc.data()?.views || 0;
    } catch (error) {
        console.error("Error incrementing post view: ", error);
        return null;
    }
};

export const toggleLikePost = async (postId: string, liked: boolean): Promise<number | null> => {
    try {
        const postRef = doc(db, "posts", postId);
        const amount = liked ? 1 : -1;
        await updateDoc(postRef, {
            likes: increment(amount)
        });
        const updatedDoc = await getDoc(postRef);
        return updatedDoc.data()?.likes || 0;
    } catch (error) {
        console.error("Error toggling like on post: ", error);
        return null;
    }
};


export const updatePost = async (postId: string, userId: string, payload: Partial<PostPayload>): Promise<{ success: boolean; message: string; }> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
             return { success: false, message: "Yazı bulunamadı." };
        }
        
        const isUserAdmin = await isAdmin(userId);
        const postData = postSnap.data();

        if (postData.authorId !== userId && !isUserAdmin) {
            return { success: false, message: "Bu yazıyı düzenleme yetkiniz yok." };
        }

        const updatePayload: Partial<Post> = { ...payload };

        if (payload.title) {
            updatePayload.slug = payload.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        await updateDoc(postRef, updatePayload);

        console.log("Document with ID: ", postId, " successfully updated!");
        return { success: true, message: "Yazı başarıyla güncellendi." };
    } catch (e) {
        console.error("Error updating document: ", e);
        return { success: false, message: "Yazı güncellenirken bir hata oluştu." };
    }
};


export const deletePost = async (postId: string, userId: string): Promise<{ success: boolean, message: string }> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            return { success: false, message: "Yazı bulunamadı." };
        }

        const isUserAdmin = await isAdmin(userId);
        const postData = postSnap.data();

        if (postData.authorId !== userId && !isUserAdmin) {
            return { success: false, message: "Bu yazıyı silme yetkiniz yok." };
        }
        
        await deleteDoc(postRef);
        
        console.log("Document with ID: ", postId, " successfully deleted!");
        return { success: true, message: "Yazı başarıyla silindi." };
    } catch (e) {
        console.error("Error deleting document: ", e);
        return { success: false, message: "Yazı silinirken bir hata oluştu." };
    }
}


// Comments services

export const addComment = async (commentData: CommentPayload): Promise<Comment | null> => {
  try {
    const commentWithTimestamp = {
      ...commentData,
      createdAt: serverTimestamp(),
      isReported: false, // Ensure new comments are not reported
    };
    
    const docRef = await addDoc(
      collection(db, 'posts', commentData.postId, 'comments'),
      commentWithTimestamp
    );
    
    // We get the fresh data back to ensure we have the server timestamp
    const newCommentSnap = await getDoc(docRef);
    const newCommentData = newCommentSnap.data();

    const newComment: Comment = {
      id: docRef.id,
      postId: commentData.postId,
      userId: commentData.userId,
      username: commentData.username,
      photoURL: commentData.photoURL,
      text: commentData.text,
      createdAt: newCommentData?.createdAt as Timestamp,
      isAdmin: commentData.isAdmin,
      isReported: false,
    };

    return newComment;

  } catch (error) {
    console.error('Error adding comment: ', error);
    return null;
  }
};

export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    
    const adminSnapshot = await getDocs(collection(db, "admins"));
    const adminIds = new Set(adminSnapshot.docs.map(doc => doc.id));
    
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isAdmin: adminIds.has(data.userId),
        } as Comment
    });
  } catch (error) {
    console.error('Error getting comments: ', error);
    return [];
  }
};


export const getCommentCount = async (postId: string): Promise<number> => {
    try {
        const commentsRef = collection(db, 'posts', postId, 'comments');
        const snapshot = await getCountFromServer(commentsRef);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error getting comment count: ', error);
        return 0;
    }
};


export const deleteComment = async (postId: string, commentId: string): Promise<boolean> => {
    try {
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        await deleteDoc(commentRef);
        // Also delete from the central reported comments collection if it exists
        const reportedCommentRef = doc(db, 'reportedComments', commentId);
        const reportedSnap = await getDoc(reportedCommentRef);
        if (reportedSnap.exists()) {
            await deleteDoc(reportedCommentRef);
        }
        return true;
    } catch (error) {
        console.error('Error deleting comment: ', error);
        return false;
    }
};

export const reportComment = async (postId: string, commentId: string): Promise<boolean> => {
    try {
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        const commentSnap = await getDoc(commentRef);

        if (!commentSnap.exists()) {
             throw new Error("Comment not found");
        }

        const commentData = commentSnap.data() as Comment;
        
        // Mark the original comment as reported
        await updateDoc(commentRef, { isReported: true });

        // Add the comment to the central reportedComments collection
        const reportedCommentRef = doc(db, 'reportedComments', commentId);
        await setDoc(reportedCommentRef, {
            ...commentData,
            id: commentId, // Ensure the original comment ID is stored
            originalPostId: postId, // Store the original post ID for context
            reportedAt: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error('Error reporting comment: ', error);
        return false;
    }
};

export const unreportComment = async (postId: string, commentId: string): Promise<boolean> => {
    try {
        // Unmark the original comment
        const commentRef = doc(db, 'posts', postId, 'comments', commentId);
        await updateDoc(commentRef, { isReported: false });

        // Remove from the central reported comments collection
        const reportedCommentRef = doc(db, 'reportedComments', commentId);
        await deleteDoc(reportedCommentRef);
        
        return true;
    } catch (error) {
        console.error("Error un-reporting comment: ", error);
        return false;
    }
};

export type CommentWithPostInfo = Comment & {
    postTitle: string;
    postSlug: string;
};

export const getPostTitle = async (postId: string): Promise<{title: string, slug: string} | null> => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
            return {
                title: postSnap.data().title || 'Başlıksız Yazı',
                slug: postSnap.data().slug || postId,
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting post title: ", error);
        return null;
    }
};


export const getAllReportedComments = async (): Promise<CommentWithPostInfo[]> => {
    try {
        const reportedCommentsRef = collection(db, 'reportedComments');
        const querySnapshot = await getDocs(reportedCommentsRef);

        const comments: CommentWithPostInfo[] = [];

        for (const docSnap of querySnapshot.docs) {
            const comment = docSnap.data() as Comment;
            const originalPostId = docSnap.data().originalPostId;
            const postInfo = await getPostTitle(originalPostId);
            
            if (postInfo) {
                 comments.push({
                    ...comment,
                    id: docSnap.id,
                    postId: originalPostId,
                    postTitle: postInfo.title,
                    postSlug: postInfo.slug
                });
            }
        }
        
        comments.sort((a: any, b: any) => {
            const timeA = (a as any).createdAt?.seconds || 0;
            const timeB = (b as any).createdAt?.seconds || 0;
            return timeB - timeA;
        });

        return comments;
    } catch (error) {
        console.error('Error getting all reported comments: ', error);
        return [];
    }
};


// Admin Management Services

export const getAdmins = async (): Promise<AdminUser[]> => {
    try {
        const adminsRef = collection(db, "admins");
        const q = query(adminsRef, orderBy('addedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const admins = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const admin: AdminUser = {
                uid: docSnap.id,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                addedAt: data.addedAt,
                role: data.role,
                permissions: data.permissions,
            };
            return admin;
        });
        
        return admins;
    } catch (error) {
        console.error("Error getting admins: ", error);
        return [];
    }
}

const defaultAdminPermissions: AdminPermissions = {
    canDeleteComments: true,
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: false,
    canManageAdmins: false,
};

const founderPermissions: AdminPermissions = {
    canDeleteComments: true,
    canCreatePosts: true,
    canEditPosts: true,
    canDeletePosts: true,
    canManageAdmins: true,
};

export const addAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
    const user = await findUserByEmail(email);
    if (!user) {
        return { success: false, message: "Bu e-posta adresine sahip bir kullanıcı bulunamadı." };
    }

    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
        return { success: false, message: "Bu kullanıcı zaten bir yönetici." };
    }
    
    const adminsCollection = collection(db, "admins");
    const adminCountSnapshot = await getCountFromServer(adminsCollection);
    const isAdminCollectionEmpty = adminCountSnapshot.data().count === 0;

    let role: AdminRole = 'admin';
    let permissions = defaultAdminPermissions;

    if (isAdminCollectionEmpty) {
        role = 'founder';
        permissions = founderPermissions;
    }

    try {
        await setDoc(adminRef, {
            email: email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            addedAt: serverTimestamp(),
            role: role,
            permissions: permissions
        });
        const roleMessage = role === 'founder' ? "Kurucu yönetici" : "Yönetici";
        return { success: true, message: `${email} başarıyla ${roleMessage} olarak atandı.` };
    } catch (error) {
        console.error("Error adding admin: ", error);
        return { success: false, message: "Yönetici eklenirken bir sunucu hatası oluştu." };
    }
};

export const removeAdmin = async (uid: string): Promise<{ success: boolean; message: string }> => {
    try {
        const adminRef = doc(db, "admins", uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
            return { success: false, message: "Yönetici bulunamadı." };
        }

        if (adminSnap.data().role === 'founder') {
            return { success: false, message: "Kurucu yönetici kaldırılamaz." };
        }

        await deleteDoc(adminRef);
        return { success: true, message: "Yönetici başarıyla kaldırıldı." };
    } catch (error) {
        console.error("Error removing admin: ", error);
        return { success: false, message: "Yönetici kaldırılırken bir hata oluştu." };
    }
}

// Function to check if a user is an admin
export const isAdmin = async (uid: string | undefined): Promise<boolean> => {
    try {
        if (!uid) return false;
        const adminRef = doc(db, "admins", uid);
        const adminSnap = await getDoc(adminRef);
        return adminSnap.exists();
    } catch (error) {
        console.error("Error checking admin status: ", error);
        return false;
    }
}

export const getAdminPermissions = async (uid: string): Promise<AdminPermissions> => {
    try {
        if (!uid) return defaultAdminPermissions;
        const adminRef = doc(db, "admins", uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
            const data = adminSnap.data();
            if (data.role === 'founder') {
                return founderPermissions;
            }
            return { ...defaultAdminPermissions, ...data.permissions };
        }
        return defaultAdminPermissions;
    } catch (error) {
        console.error("Error checking admin permissions: ", error);
        return defaultAdminPermissions;
    }
};


export const updateAdminPermissions = async (uid: string, permissions: Partial<AdminPermissions>): Promise<{ success: boolean; message: string }> => {
    try {
        const adminRef = doc(db, "admins", uid);
        await updateDoc(adminRef, {
            permissions: permissions
        });
        return { success: true, message: "Yetkiler başarıyla güncellendi." };
    } catch (error) {
        console.error("Error updating admin permissions: ", error);
        return { success: false, message: "Yetkiler güncellenirken bir hata oluştu." };
    }
};

// Site User Management
export const getUsers = async (
    userLimit: number = 10,
    lastVisible: any = null
): Promise<{ users: SiteUser[], lastVisible: any }> => {
    try {
        const usersRef = collection(db, "users");
        let constraints = [orderBy("createdAt", "desc"), limit(userLimit)];

        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        const q = query(usersRef, ...constraints);
        const querySnapshot = await getDocs(q);

        const users = querySnapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const createdAt = data.createdAt;
            return {
                uid: docSnap.id,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                createdAt: createdAt instanceof Timestamp ? createdAt.toDate().toISOString() : new Date().toISOString(),
            } as SiteUser;
        });

        const newLastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

        return { users, lastVisible: newLastVisible };
    } catch (error) {
        console.error("Error getting users: ", error);
        return { users: [], lastVisible: null };
    }
};

export const deleteUserByAdmin = async (uid: string): Promise<{ success: boolean, message: string }> => {
    try {
        // First, check if the user to be deleted is an admin
        const isAdminUser = await isAdmin(uid);
        if (isAdminUser) {
            return { success: false, message: "Yöneticiler bu panelden silinemez. Lütfen önce yönetici yetkilerini kaldırın." };
        }

        const userRef = doc(db, "users", uid);
        await deleteDoc(userRef);

        // Deleting from Firebase Auth requires a Cloud Function for security reasons.
        // This part is a placeholder for a real implementation.
        console.log(`User with UID: ${uid} deleted from Firestore. Auth deletion should be handled by a backend function.`);

        return { success: true, message: "Kullanıcı başarıyla silindi." };
    } catch (error) {
        console.error("Error deleting user: ", error);
        return { success: false, message: "Kullanıcı silinirken bir hata oluştu." };
    }
};

// Homepage Settings
export const getHomepageSettings = async (): Promise<HomepageSettings | null> => {
    try {
        const settingsRef = doc(db, "settings", "homepage");
        const docSnap = await getDoc(settingsRef);

        if (docSnap.exists()) {
            return docSnap.data() as HomepageSettings;
        } else {
            // Return default settings if document doesn't exist
            console.log("No homepage settings found, returning default.");
            return null;
        }
    } catch (error) {
        console.error("Error getting homepage settings: ", error);
        return null;
    }
};

export const updateHomepageSettings = async (settings: HomepageSettings): Promise<{ success: boolean, message: string }> => {
    try {
        const settingsRef = doc(db, "settings", "homepage");
        await setDoc(settingsRef, settings, { merge: true });
        return { success: true, message: "Ana sayfa ayarları başarıyla güncellendi." };
    } catch (error) {
        console.error("Error updating homepage settings: ", error);
        return { success: false, message: "Ayarlar güncellenirken bir hata oluştu." };
    }
};

