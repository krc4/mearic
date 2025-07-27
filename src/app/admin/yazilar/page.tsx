
"use client"
import Link from "next/link"
import React, { useState } from "react"
import {
  File,
  PlusCircle,
  MoreHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { mockPosts, mainArticle, type Post } from "@/lib/posts"

const allPosts = [mainArticle, ...mockPosts];

const PostTable = ({ posts }: { posts: Post[] }) => (
    <Table>
    <TableHeader>
        <TableRow>
        <TableHead>Başlık</TableHead>
        <TableHead className="hidden md:table-cell">Kategori</TableHead>
        <TableHead className="hidden md:table-cell">Durum</TableHead>
        <TableHead className="hidden md:table-cell">Tarih</TableHead>
        <TableHead>
            <span className="sr-only">İşlemler</span>
        </TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {posts.map((post) => (
        <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell className="hidden md:table-cell">{post.category}</TableCell>
            <TableCell className="hidden md:table-cell">
            <Badge variant="outline">Yayında</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">2024-05-28</TableCell>
            <TableCell>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menüyü aç</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/yazilar/${post.slug}/duzenle`}>Düzenle</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Sil</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
);


export default function PostsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts = allPosts.filter(post => {
    if (activeTab === "all") return true;
    return post.category === activeTab;
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <File className="h-6 w-6" />
          Yazılar
        </h1>
        <Button asChild>
          <Link href="/admin/yazilar/yeni">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

    <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Tümü</TabsTrigger>
            <TabsTrigger value="Kuran Mucizeleri">Kuran Mucizeleri</TabsTrigger>
            <TabsTrigger value="Hadis Mucizeleri">Hadis Mucizeleri</TabsTrigger>
            <TabsTrigger value="İslami Bloglar">İslami Bloglar</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
            <CardHeader>
            <CardTitle>
                {activeTab === "all" ? "Tüm Yazılar" : activeTab}
            </CardTitle>
            <CardDescription>
                {activeTab === "all" ? "Tüm yazıları yönetin." : `${activeTab} kategorisindeki yazıları yönetin.`}
            </CardDescription>
            </CardHeader>
            <CardContent>
                <PostTable posts={filteredPosts} />
            </CardContent>
        </Card>
      </Tabs>
    </>
  )
}
