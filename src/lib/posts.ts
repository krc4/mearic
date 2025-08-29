
import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string; // Changed to string to accommodate Firestore document IDs
  title: string;
  slug: string;
  image: string;
  readTime: number;
  category: string;
  content: string;
  description: string;
  views: number;
  likes: number;
  createdAt?: Timestamp; // Optional timestamp
  authorId?: string;
  author?: string;
  authorPhotoURL?: string;
  tags?: string[];
}

export type StaticPost = Omit<Post, 'id' | 'views' | 'createdAt' | 'likes' | 'content'>;

export const mainArticle: StaticPost = {
  title: "Kuran'da Evrenin Genişlemesi Mucizesi",
  slug: 'kuran-da-evrenin-genislemesi-mucizesi',
  image: 'https://images.unsplash.com/photo-1566345984367-fa2ba5cedc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3BhY2V8ZW58MHx8fHwxNzUzMzgyMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  readTime: 7,
  category: 'Kuran Mucizeleri',
  description: 'Modern bilimin evrenin genişlediği keşfi, Kuran-ı Kerim\'de 1400 yıl önce Zariyat Suresi\'nde haber verilmiştir. Bu yazıda bu mucizeyi inceliyoruz.',
};

export const secondArticle: StaticPost = {
    title: 'Dağların Hareket Halinde Olması',
    slug: 'daglarin-hareket-halinde-olmasi',
    image: 'https://images.unsplash.com/photo-1669632236861-bea1095c866e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8ZGElQzQlOUZ8ZW58MHx8fHwxNzUzMzgxOTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: 5,
    category: 'Kuran Mucizeleri',
    description: 'Kuran\'da dağların sadece sabit yapılar olmadığı, aynı zamanda hareket halinde oldukları bildirilmiştir. Bu olguyu jeolojik kanıtlarla inceliyoruz.',
};

export const thirdArticle: StaticPost = {
    title: 'Embriyo Aşamaları Mucizesi',
    slug: 'embriyo-asamalari-mucizesi',
    image: 'https://images.unsplash.com/photo-1604363236113-a8a5f3b7381c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxlbWJyeW98ZW58MHx8fHwxNzUzMzgzNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: 6,
    category: 'Kuran Mucizeleri',
    description: 'Kuran, modern embriyolojinin asırlar sonra keşfedeceği insanın anne karnındaki gelişim aşamalarını detaylı olarak bildirmiştir.',
};

export const hadithArticle1: StaticPost = {
    title: 'Tıbb-ı Nebevi: Hadislerdeki Şifa',
    slug: 'tibbi-nebevi',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    readTime: 8,
    category: 'Hadis Mucizeleri',
    description: 'Peygamber Efendimiz\'in (S.A.V) tavsiye ettiği ve modern tıbbın da faydalarını onayladığı şifalı yöntemler.',
};

export const hadithArticle2: StaticPost = {
    title: 'Hurmanın Mucizevi Faydaları',
    slug: 'hurmanin-faydalari',
    image: 'https://images.unsplash.com/photo-1598229474324-f723652a3693?q=80&w=1935&auto=format&fit=crop',
    readTime: 4,
    category: 'Hadis Mucizeleri',
    description: 'Hadislerde övülen ve bilimsel olarak da zengin besin değerleri kanıtlanmış olan hurmanın mucizevi faydaları.',
};

export const blogArticle1: StaticPost = {
    title: 'Sabrın Önemi ve Faziletleri',
    slug: 'sabr-onemi',
    image: 'https://images.unsplash.com/photo-1543083321-482f3c7d1056?q=80&w=2070&auto=format&fit=crop',
    readTime: 6,
    category: 'İslami Bloglar',
    description: 'Hayatın zorlukları karşısında bir mü\'minin en güçlü sığınağı olan sabrın faziletleri ve hayata yansımaları.',
};

export const blogArticle2: StaticPost = {
    title: 'İnfak Kültürü ve Toplumsal Dayanışma',
    slug: 'infak-kulturu',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
    readTime: 5,
    category: 'İslami Bloglar',
    description: 'İslam\'ın toplumsal dayanışma ve yardımlaşma temellerinden biri olan infakın manası ve önemi.',
};

export const mockPosts: StaticPost[] = [
    secondArticle,
    thirdArticle
];
