
"use client"
import React, { useEffect, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Settings,
  BookOpen,
  Sparkles,
  PenSquare,
  Star,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { getHomepageSettings, updateHomepageSettings } from "@/lib/firebase/services"
import type { HomepageSettings, FeaturedCard } from "@/lib/settings"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"


const featuredCardSchema = z.object({
  title: z.string().min(1, "Başlık gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  image: z.string().url("Geçerli bir URL olmalı"),
  link: z.string().min(1, "Link gerekli"),
});

const homepageSettingsSchema = z.object({
    kuranMucizeleri: z.object({
        card1: featuredCardSchema,
        card2: featuredCardSchema,
    }),
    hadisMucizeleri: z.object({
        card1: featuredCardSchema,
        card2: featuredCardSchema,
    }),
    islamiBloglar: z.object({
        card1: featuredCardSchema,
        card2: featuredCardSchema,
    }),
    populerKonular: z.object({
        mainCard: featuredCardSchema,
        sideCard1: featuredCardSchema,
        sideCard2: featuredCardSchema,
    })
});

const SectionCard = ({ name, control, title }: { name: any, control: any, title: string }) => {
    return (
        <Card className="p-4">
            <h4 className="text-md font-semibold mb-4">{title}</h4>
            <div className="space-y-4">
                <FormField
                    control={control}
                    name={`${name}.title`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Başlık</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}.description`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Açıklama</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}.image`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resim URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`${name}.link`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Buton Linki</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    );
};

export default function AyarlarAdminPage() {
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const form = useForm<HomepageSettings>({
        resolver: zodResolver(homepageSettingsSchema),
        defaultValues: {
            // Initialize with empty or default structure to prevent uncontrolled component errors
             kuranMucizeleri: { card1: { title: '', description: '', image: '', link: '' }, card2: { title: '', description: '', image: '', link: '' } },
             hadisMucizeleri: { card1: { title: '', description: '', image: '', link: '' }, card2: { title: '', description: '', image: '', link: '' } },
             islamiBloglar: { card1: { title: '', description: '', image: '', link: '' }, card2: { title: '', description: '', image: '', link: '' } },
             populerKonular: { mainCard: { title: '', description: '', image: '', link: '' }, sideCard1: { title: '', description: '', image: '', link: '' }, sideCard2: { title: '', description: '', image: '', link: '' } },
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const settings = await getHomepageSettings();
            if (settings) {
                form.reset(settings);
            }
            setLoading(false);
        };
        fetchSettings();
    }, [form]);

    const onSubmit = async (data: HomepageSettings) => {
        const { success, message } = await updateHomepageSettings(data);
        if (success) {
            toast({ title: "Başarılı!", description: message });
        } else {
            toast({ title: "Hata!", description: message, variant: "destructive" });
        }
    };
    
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Genel Ayarlar
                    </h1>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        {form.formState.isSubmitting ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ana Sayfa İçerik Yönetimi</CardTitle>
                        <CardDescription>
                            Ana sayfadaki öne çıkan içerik kartlarını buradan yönetebilirsiniz.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg font-semibold">
                                    <div className="flex items-center gap-2">
                                        <BookOpen/> Kuran Mucizeleri Bölümü
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid md:grid-cols-2 gap-4 pt-4">
                                   <SectionCard name="kuranMucizeleri.card1" control={form.control} title="Kart 1" />
                                   <SectionCard name="kuranMucizeleri.card2" control={form.control} title="Kart 2" />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-semibold">
                                     <div className="flex items-center gap-2">
                                        <Sparkles/> Hadis Mucizeleri Bölümü
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid md:grid-cols-2 gap-4 pt-4">
                                   <SectionCard name="hadisMucizeleri.card1" control={form.control} title="Kart 1" />
                                   <SectionCard name="hadisMucizeleri.card2" control={form.control} title="Kart 2" />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-semibold">
                                     <div className="flex items-center gap-2">
                                        <PenSquare/> İslami Bloglar Bölümü
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid md:grid-cols-2 gap-4 pt-4">
                                    <SectionCard name="islamiBloglar.card1" control={form.control} title="Kart 1" />
                                    <SectionCard name="islamiBloglar.card2" control={form.control} title="Kart 2" />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg font-semibold">
                                     <div className="flex items-center gap-2">
                                        <Star/> Popüler Konular Bölümü
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid lg:grid-cols-3 gap-4 pt-4">
                                    <SectionCard name="populerKonular.mainCard" control={form.control} title="Ana Kart" />
                                    <SectionCard name="populerKonular.sideCard1" control={form.control} title="Yan Kart 1" />
                                    <SectionCard name="populerKonular.sideCard2" control={form.control} title="Yan Kart 2" />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
