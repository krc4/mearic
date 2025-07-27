
"use client"
import Link from "next/link"
import React from "react"
import {
  PenSquare,
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
import { mockPosts, type Post } from "@/lib/posts"

const allPosts = [...mockPosts];
const blogPosts = allPosts.filter(p => p.category === "İslami Bloglar");

const PostTable = ({ posts }: { posts: Post[] }) => (
    <Table>
    <TableHeader>
        <TableRow>
        <TableHead>Başlık</TableHead>
        <TableHead className="hidden md:table-cell">Durum</TableHead>
        <TableHead className="hidden md:table-cell">Tarih</TableHead>
        <TableHead>
            <span className="sr-only">İşlemler</span>
        </TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {posts.map((post) => (
        <TableRow key={post.slug}>
            <TableCell className="font-medium">{post.title}</TableCell>
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


export default function IslamiBloglarAdminPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PenSquare className="h-6 w-6" />
          İslami Bloglar
        </h1>
        <Button asChild>
          <Link href="/admin/yazilar/yeni">
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Yazı Ekle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>İslami Blog Yazıları</CardTitle>
          <CardDescription>
            Bu kategorideki yazıları yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <PostTable posts={blogPosts} />
        </CardContent>
      </Card>
    </>
  )
}
