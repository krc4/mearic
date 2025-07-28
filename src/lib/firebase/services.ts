
import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, doc, deleteDoc, getDoc, updateDoc, orderBy, setDoc, increment, getCountFromServer, limit } from 'firebase/firestore';
import type { Post } from '@/lib/posts';
import type { Comment } from '@/lib/comments';
import { CommentPayload } from '@/lib/comments';
import type { AdminUser } from '@/lib/admin';

export type PostPayload = Omit<Post, 'id' | 'slug' | 'views' | 'createdAt' | 'likes'> & {
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
                createdAt: serverTimestamp()
            });
             console.log("User document created for:", user.email);
        } catch (error) {
            console.error("Error creating user document:", error);
        }
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

export const getPostsByCategory = async (category: string): Promise<Post[]> => {
    try {
        const q = query(collection(db, "posts"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                slug: data.slug,
                title: data.title,
                image: data.image,
                readTime: data.readTime,
                category: data.category,
                content: data.content,
                description: data.description,
                views: data.views,
                likes: data.likes || 0,
                createdAt: data.createdAt,
            } as Post);
        });
        return posts;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
};

export const getTopLikedPosts = async (postLimit: number): Promise<Post[]> => {
    try {
        const q = query(collection(db, "posts"), orderBy("likes", "desc"), limit(postLimit));
        const querySnapshot = await getDocs(q);
        const posts: Post[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                ...data
            } as Post);
        });
        return posts;
    } catch (e) {
        console.error("Error getting top liked posts: ", e);
        return [];
    }
}


export const getPostBySlug = async (slug: string): Promise<Post | null> => {
    try {
        const q = query(collection(db, "posts"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
            return null;
        }
        const postDoc = querySnapshot.docs[0];
        const data = postDoc.data();
        return {
            id: postDoc.id,
            ...data,
            image: data.image,
            likes: data.likes || 0,
        } as Post;
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
        return querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        } as AdminUser));
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
        return { success: false, message: "Bu kullanıcı zaten bir yönetici." };
    }

    try {
        await setDoc(adminRef, {
            email: email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            addedAt: serverTimestamp(),
        });
        return { success: true, message: `${email} başarıyla yönetici olarak atandı.` };
    } catch (error) {
        console.error("Error adding admin: ", error);
        return { success: false, message: "Yönetici eklenirken bir sunucu hatası oluştu." };
    }
};

export const removeAdmin = async (uid: string): Promise<boolean> => {
    try {
        const adminRef = doc(db, "admins", uid);
        await deleteDoc(adminRef);
        return true;
    } catch (error) {
        console.error("Error removing admin: ", error);
        return false;
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
