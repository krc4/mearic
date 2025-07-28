
"use client"
import Link from "next/link"
import {
  FileText,
  Users,
  MessageSquare,
  ArrowUpRight,
  MoreHorizontal,
  PlusCircle,
  BarChart3,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { useState, useEffect } from "react"
import { getDocs, collection, query, orderBy, limit as firestoreLimit } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { Post } from "@/lib/posts"
import { Skeleton } from "@/components/ui/skeleton"

const chartData = [
  { date: "Pzt", users: 2, posts: 1 },
  { date: "Sal", users: 5, posts: 2 },
  { date: "Çar", users: 3, posts: 1 },
  { date: "Per", users: 6, posts: 3 },
  { date: "Cum", users: 8, posts: 4 },
  { date: "Cmt", users: 7, posts: 2 },
  { date: "Paz", users: 10, posts: 5 },
]

const chartConfig = {
  users: {
    label: "Yeni Kullanıcı",
    color: "hsl(var(--primary))",
  },
  posts: {
    label: "Yeni Yazı",
    color: "hsl(var(--primary) / 0.5)",
  },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, users: 0, comments: 0 });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const postQuery = query(collection(db, "posts"));
      const userQuery = query(collection(db, "users"));
      
      const postSnapshot = await getDocs(postQuery);
      const userSnapshot = await getDocs(userQuery);
      
      let totalComments = 0;
      for (const postDoc of postSnapshot.docs) {
          const commentsQuery = query(collection(db, "posts", postDoc.id, "comments"));
          const commentsSnapshot = await getDocs(commentsQuery);
          totalComments += commentsSnapshot.size;
      }

      setStats({
        posts: postSnapshot.size,
        users: userSnapshot.size,
        comments: totalComments
      });
      setLoadingStats(false);
    }

    const fetchRecentPosts = async () => {
        setLoadingPosts(true);
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"), firestoreLimit(5));
        const querySnapshot = await getDocs(q);
        const posts: Post[] = [];
        querySnapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() } as Post);
        });
        setRecentPosts(posts);
        setLoadingPosts(false);
    }

    fetchStats();
    fetchRecentPosts();
  }, [])


  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yazı</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingStats ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{stats.posts}</div>}
            <p className="text-xs text-muted-foreground">
              Tüm kategorilerdeki toplam yazı sayısı
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Toplam Kullanıcı
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingStats ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{stats.users}</div>}
            <p className="text-xs text-muted-foreground">
              Sisteme kayıtlı tüm kullanıcılar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loadingStats ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{stats.comments}</div>}
            <p className="text-xs text-muted-foreground">
              Tüm yazılara yapılan yorum sayısı
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5"/>
                    Site Aktivitesi (Son 7 Gün)
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <BarChart data={chartData}>
                    <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--accent))', radius: 'var(--radius)'}}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="posts" fill="var(--color-posts)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Son Yazılar</CardTitle>
            <CardDescription>
              En son eklenen 5 yazı.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPosts ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Başlık</TableHead>
                      <TableHead className="text-right">Görüntülenme</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPosts.map(post => (
                       <TableRow key={post.id}>
                          <TableCell>
                            <div className="font-medium">{post.title}</div>
                             <div className="text-xs text-muted-foreground">{post.category}</div>
                          </TableCell>
                          <TableCell className="text-right">{post.views || 0}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
          <CardFooter className="justify-end">
             <Button asChild size="sm" variant="outline">
              <Link href="/admin/kuran-mucizeleri">
                Tümünü Gör
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
