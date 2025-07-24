export interface Post {
  id: number;
  title: string;
  image: string;
  readTime: number;
  category: string;
  content: string;
}

export const mainArticle: Post = {
  id: 1,
  title: 'Kuran\'da Evrenin Genişlemesi Mucizesi',
  image: 'https://placehold.co/1200x800',
  readTime: 7,
  category: 'Kuran Mucizeleri',
  content: `
    <p class="text-xl leading-relaxed">Modern bilimin en çarpıcı keşiflerinden biri, evrenin sürekli olarak genişlediği gerçeğidir. Bu keşif, 20. yüzyılın başlarında Edwin Hubble'ın gözlemleriyle bilim dünyasına kazandırılmıştır. Ancak, bu kozmolojik gerçek, Kuran-ı Kerim'de 1400 yıl önce Zariyat Suresi'nde mucizevi bir şekilde haber verilmiştir.</p>
    <p>Hubble, teleskopuyla uzak galaksileri gözlemlerken, bu galaksilerin bizden uzaklaştığını ve bu uzaklaşma hızının mesafeyle doğru orantılı olduğunu keşfetti. Bu, evrenin statik bir yapıda olmadığını, aksine bir balon gibi sürekli şiştiğini gösteriyordu. Bu buluş, "Büyük Patlama" (Big Bang) teorisinin de en güçlü delillerinden biri haline geldi.</p>
    <blockquote>
        <p>Biz göğü ‘büyük bir kudretle’ bina ettik ve şüphesiz Biz, (onu) genişleticiyiz.</p>
        <footer class="text-right not-italic text-base text-muted-foreground mt-2">— Zariyat Suresi, 47. Ayet</footer>
    </blockquote>
    <p>Bu ayette geçen "genişleticiyiz" (lā-mūsi'ūna) ifadesi, Arapça dilbilgisi açısından ism-i fail olup, genişletme eyleminin devam ettiğini ve gelecekte de devam edeceğini ifade eder. Bu, evrenin sadece bir defaya mahsus genişlemediğini, bu eylemin sürekli olduğunu vurgulayan mucizevi bir ifadedir. Bilimin ancak 20. yüzyılda ulaşabildiği bu bilgi, Kuran'ın Allah kelamı olduğunun apaçık bir delilidir.</p>
    <h3 class="text-2xl font-headline font-semibold mt-8 mb-4">Bilimsel ve Kuranî Perspektifin Uyumu</h3>
    <p>Kuran'ın bu ifadesi, o dönemin ilkel astronomi bilgisiyle açıklanabilecek bir durum değildir. O dönemde hakim olan inanış, Aristo ve Batlamyus'un etkisindeki statik evren modeliydi. Kuran, bu yaygın ve yanlış inanışın aksine, dinamik ve genişleyen bir evren tablosu çizmiştir. Bu durum, Kuran'ın insanüstü bir kaynaktan geldiğini ve her çağda insanlığa yol gösteren bir rehber olduğunu kanıtlar niteliktedir.</p>
  `,
};

export const mockPosts: Post[] = [
  {
    id: 2,
    title: 'Dağların Hareket Halinde Olması',
    image: 'https://placehold.co/600x400',
    readTime: 5,
    category: 'Kuran Mucizeleri',
    content: '',
  },
  {
    id: 3,
    title: 'Demirin Gökten İndirilmesi',
    image: 'https://placehold.co/600x400',
    readTime: 4,
    category: 'Kuran Mucizeleri',
    content: '',
  },
  {
    id: 4,
    title: 'Parmak İzindeki Yaratılış Sırrı',
    image: 'https://placehold.co/600x400',
    readTime: 3,
    category: 'Kuran Mucizeleri',
    content: '',
  },
  {
    id: 5,
    title: 'Hadislerde Tıbb-ı Nebevi',
    image: 'https://placehold.co/600x400',
    readTime: 8,
    category: 'Hadis Mucizeleri',
    content: '',
  },
  {
    id: 6,
    title: 'İslam ve Sabır Kavramı',
    image: 'https://placehold.co/600x400',
    readTime: 6,
    category: 'İslami Bloglar',
    content: '',
  },
];
