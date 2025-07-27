
"use client"
import Link from "next/link"
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
import { mockPosts, mainArticle } from "@/lib/posts"

export default function PostsPage() {
  const allPosts = [mainArticle, ...mockPosts];

  return (
    <>
      <div className="flex items-center justify-between">
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

      <Card>
        <CardHeader>
          <CardTitle>Tüm Yazılar</CardTitle>
          <CardDescription>
            Mevcut yazıları yönetin ve yeni yazılar ekleyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Yayında</Badge>
                  </TableCell>
                  <TableCell>2024-05-28</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
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
        </CardContent>
      </Card>
    </>
  )
}
