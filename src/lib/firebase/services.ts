

import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, doc, deleteDoc, getDoc, updateDoc, orderBy, setDoc, increment, getCountFromServer, limit, startAfter } from 'firebase/firestore';
import type { Post } from '@/lib/posts';
import type { Comment } from '@/lib/comments';
import { CommentPayload } from '@/lib/comments';
import type { AdminUser, AdminRole, AdminPermissions } from '@/lib/admin';

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

export const updateUserDoc = async (uid: string, data: object) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
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
    postsLimit: number = 1000, // Increased limit for admin pages
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


export const updatePost = async (postId: string, payload: Partial<PostPayload>) => {
    try {
        const postRef = doc(db, "posts", postId);
        
        const updatePayload: Partial<Post> = { ...payload };

        // Only update the slug if the title has actually changed.
        if (payload.title) {
            updatePayload.slug = payload.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        await updateDoc(postRef, updatePayload);

        console.log("Document with ID: ", postId, " successfully updated!");
        return true;
    } catch (e) {
        console.error("Error updating document: ", e);
        return false;
    }
};


export const deletePost = async (postId: string) => {
    try {
        await deleteDoc(doc(db, "posts", postId));
        console.log("Document with ID: ", postId, " successfully deleted!");
        return true;
    } catch (e) {
        console.error("Error deleting document: ", e);
        return false;
    }
}


// Comments services

export const addComment = async (commentData: CommentPayload): Promise<Comment | null> => {
  try {
    const commentWithTimestamp = {
      ...commentData,
      createdAt: serverTimestamp(),
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
        return true;
    } catch (error) {
        console.error('Error deleting comment: ', error);
        return false;
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
            // Ensure every admin has a permissions object
            const permissions = data.permissions || { canDeleteComments: false };
            const admin: AdminUser = {
                uid: docSnap.id,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                addedAt: data.addedAt,
                role: data.role,
                permissions: permissions,
            };
            // Force 'test1' to always be a founder in the returned data
            if (admin.displayName === 'test1') {
                admin.role = 'founder';
            }
            return admin;
        });
        
        return admins;
    } catch (error) {
        console.error("Error getting admins: ", error);
        return [];
    }
}

export const addAdmin = async (email: string): Promise<{ success: boolean; message: string }> => {
    const user = await findUserByEmail(email);
    if (!user) {
        return { success: false, message: "Bu e-posta adresine sahip bir kullanıcı bulunamadı." };
    }

    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists()) {
        // If the user is 'test1' and their role isn't founder, update it.
        if (user.displayName === 'test1' && adminSnap.data().role !== 'founder') {
            try {
                await updateDoc(adminRef, { role: 'founder' });
                return { success: true, message: "'test1' kullanıcısının rolü Kurucu olarak güncellendi." };
            } catch (error) {
                console.error("Error updating test1 to founder: ", error);
                return { success: false, message: "'test1' rolü güncellenirken bir hata oluştu." };
            }
        }
        return { success: false, message: "Bu kullanıcı zaten bir yönetici." };
    }
    
    const adminsCollection = collection(db, "admins");
    const adminCountSnapshot = await getCountFromServer(adminsCollection);
    const isAdminCollectionEmpty = adminCountSnapshot.data().count === 0;

    let role: AdminRole = 'admin';
    if (isAdminCollectionEmpty || user.displayName === 'test1') {
        role = 'founder';
    }

    try {
        await setDoc(adminRef, {
            email: email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            addedAt: serverTimestamp(),
            role: role,
            permissions: {
                canDeleteComments: role === 'founder' ? true : false,
            }
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
    const defaultPermissions: AdminPermissions = { canDeleteComments: false };
    try {
        if (!uid) return defaultPermissions;
        const adminRef = doc(db, "admins", uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
            const data = adminSnap.data();
            // Founders always have all permissions
            if (data.role === 'founder') {
                return { canDeleteComments: true };
            }
            return { ...defaultPermissions, ...data.permissions };
        }
        return defaultPermissions;
    } catch (error) {
        console.error("Error checking admin permissions: ", error);
        return defaultPermissions;
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
