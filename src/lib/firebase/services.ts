
import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { Post } from '@/lib/posts';

export type PostPayload = Omit<Post, 'id' | 'slug' | 'views' | 'createdAt'> & {
    content: string;
};

export const addPost = async (post: PostPayload) => {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            ...post,
            slug: post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            views: 0,
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
                createdAt: data.createdAt,
            } as Post);
        });
        return posts;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
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
        const data = postDoc.data();
        return {
            id: postDoc.id,
            ...data,
            image: data.image,
        } as Post;
    } catch (e) {
        console.error("Error getting document by slug: ", e);
        return null;
    }
}


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
