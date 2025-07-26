export interface Post {
  id: number;
  title: string;
  image: string;
  readTime: number;
  category: string;
  content: string;
  description: string;
}

export const mainArticle: Post = {
  id: 1,
  title: 'Kuran\'da Evrenin Genişlemesi Mucizesi',
  image: 'https://images.unsplash.com/photo-1566345984367-fa2ba5cedc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3BhY2V8ZW58MHx8fHwxNzUzMzgyMDMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  readTime: 7,
  category: 'Kuran Mucizeleri',
  description: 'Modern bilimin evrenin genişlediği keşfi, Kuran-ı Kerim\'de 1400 yıl önce Zariyat Suresi\'nde haber verilmiştir. Bu yazıda bu mucizeyi inceliyoruz.',
  content: `
    <p class="text-xl leading-relaxed">Modern bilimin en çarpıcı keşiflerinden biri, evrenin sürekli olarak genişlediği gerçeğidir. Bu keşif, 20. yüzyılın başlarında Edwin Hubble'ın gözlemleriyle bilim dünyasına kazandırılmıştır. Ancak, bu kozmolojik gerçek, Kuran-ı Kerim'de 1400 yıl önce Zariyat Suresi'nde mucizevi bir şekilde haber verilmiştir.</p>
    <p>Hubble, teleskopuyla uzak galaksileri gözlemlerken, bu galaksilerin bizden uzaklaştığını ve bu uzaklaşma hızının mesafeyle doğru orantılı olduğunu keşfetti. Bu, evrenin statik bir yapıda olmadığını, aksine bir balon gibi sürekli şiştiğini gösteriyordu. Bu buluş, "Büyük Patlama" (Big Bang) teorisinin de en güçlü delillerinden biri haline geldi.</p>
    <blockquote>
        <p>Biz göğü ‘büyük bir kudretle’ bina ettik ve şüphesiz Biz, (onu) genişleticiyiz.</p>
        <footer class="text-right not-italic text-base text-muted-foreground mt-2">— Zariyat Suresi, 47. Ayet</footer>
    </blockquote>
    <p>Bu ayette geçen "genişleticiyiz" (lā-mūsi'ūna) ifadesi, Arapça dilbilgisi açısından ism-i fail olup, genişletme eyleminin devam ettiğini ve gelecekte de devam edeceğini ifade eder. Bu, evrenin sadece bir defaya mahsus genişlemediğini, bu eylemin sürekli olduğunu vurgulayan mucizevi bir ifadedir. Bilimin ancak 20. yüzyılda ulaşabildiği bu bilgi, Kuran'ın Allah kelamı olduğunun apaçık bir delilidir.</p>
    <h3 class="text-2xl font-bold mt-8 mb-4">Bilimsel ve Kuranî Perspektifin Uyumu</h3>
    <p>Kuran'ın bu ifadesi, o dönemin ilkel astronomi bilgisiyle açıklanabilecek bir durum değildir. O dönemde hakim olan inanış, Aristo ve Batlamyus'un etkisindeki statik evren modeliydi. Kuran, bu yaygın ve yanlış inanışın aksine, dinamik ve genişleyen bir evren tablosu çizmiştir. Bu durum, Kuran'ın insanüstü bir kaynaktan geldiğini ve her çağda insanlığa yol gösteren bir rehber olduğunu kanıtlar niteliktedir.</p>
  `,
};

export const mockPosts: Post[] = [
  {
    id: 2,
    title: 'Dağların Hareket Halinde Olması',
    image: 'https://images.unsplash.com/photo-1669632236861-bea1095c866e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8ZGElQzQlOUZ8ZW58MHx8fHwxNzUzMzgxOTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: 5,
    category: 'Kuran Mucizeleri',
    description: 'Kuran\'da dağların sadece sabit yapılar olmadığı, aynı zamanda hareket halinde oldukları bildirilmiştir. Bu olguyu jeolojik kanıtlarla inceliyoruz.',
    content: '',
  },
  {
    id: 3,
    title: 'Embriyo Aşamaları Mucizesi',
    image: 'https://images.unsplash.com/photo-1604363236113-a8a5f3b7381c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxlbWJyeW98ZW58MHx8fHwxNzUzMzgzNjgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    readTime: 6,
    category: 'Kuran Mucizeleri',
    description: 'Kuran, modern embriyolojinin asırlar sonra keşfedeceği insanın anne karnındaki gelişim aşamalarını detaylı olarak bildirmiştir.',
    content: '',
  },
  {
    id: 4,
    title: 'Hadislerde Tıbb-ı Nebevi',
    image: 'https://images.unsplash.com/photo-1576092762791-ddc214d25e3c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    readTime: 8,
    category: 'Hadis Mucizeleri',
    description: "Peygamber Efendimiz'in (S.A.V) tavsiye ettiği ve modern tıbbın da faydalarını onayladığı şifalı yöntemler.",
    content: '',
  },
  {
    id: 5,
    title: 'Hurmanın Besin Değeri Mucizesi',
    image: 'https://images.unsplash.com/photo-1598229452289-5b27a17a4a93?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    readTime: 6,
    category: 'Hadis Mucizeleri',
    description: 'Hadislerde övülen ve bilimsel olarak da zengin besin değerleri kanıtlanmış olan hurmanın mucizevi faydaları.',
    content: '',
  },
  {
    id: 6,
    title: 'Sabrın Önemi ve Faziletleri',
    image: 'https://images.unsplash.com/photo-1597854224215-c63d41f057c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    readTime: 7,
    category: 'İslami Bloglar',
    description: 'Hayatın zorlukları karşısında bir mü\'minin en güçlü sığınağı olan sabrın faziletleri ve hayata yansımaları.',
    content: '',
  },
  {
    id: 7,
    title: 'İnfak Kültürü ve Toplumsal Dayanışma',
    image: 'https://images.unsplash.com/photo-1518623380242-d992d14e073c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    readTime: 5,
    category: 'İslami Bloglar',
    description: "İslam'ın toplumsal dayanışma ve yardımlaşma temellerinden biri olan infakın manası ve önemi.",
    content: '',
  },
];

    