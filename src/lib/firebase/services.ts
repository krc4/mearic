import { db } from './config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { Post } from '@/lib/posts';

export type PostPayload = Omit<Post, 'id' | 'slug' | 'views' | 'content'> & {
    content: string; // From editor
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
