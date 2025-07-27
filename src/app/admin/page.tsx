
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

const chartData = [
  { date: "Pzt", users: 12, posts: 5 },
  { date: "Sal", users: 18, posts: 7 },
  { date: "Çar", users: 15, posts: 6 },
  { date: "Per", users: 22, posts: 9 },
  { date: "Cum", users: 30, posts: 12 },
  { date: "Cmt", users: 25, posts: 10 },
  { date: "Paz", users: 28, posts: 11 },
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
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yazı</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">
              +12 son aydan
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
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% son aydan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +19% son aydan
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead className="text-right">Görüntülenme</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Kuran'da Evrenin Genişlemesi</div>
                  </TableCell>
                  <TableCell className="text-right">1250</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Dağların Hareketi</div>
                  </TableCell>
                  <TableCell className="text-right">890</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Embriyo Aşamaları</div>
                  </TableCell>
                  <TableCell className="text-right">1100</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Tıbb-ı Nebevi</div>
                  </TableCell>
                  <TableCell className="text-right">750</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Sabrın Önemi</div>
                  </TableCell>
                  <TableCell className="text-right">920</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
             <Button asChild size="sm" variant="outline">
              <Link href="#">
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
