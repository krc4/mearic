"use client";
import { Copy, Twitter, RotateCw, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const funFacts = [
  {
    id: 1,
    ar: "﴿وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ...﴾",
    tr: "Bal arısının Kuran’da kendi adıyla anılan bir suresi vardır: Nahl Suresi.",
    ref: "Nahl 68-69",
  },
  {
    id: 2,
    ar: "﴿كُلَّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَهُ﴾",
    tr: "Kuran, atom altı parçacıkların bile yok olabileceğini bildirirken, Allah’ın varlığının ezeli olduğunu vurgular.",
    ref: "Rahman 26-27",
  },
  {
    id: 3,
    ar: "﴿وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ﴾",
    tr: "Canlı hücrelerin %70’inin su olduğu günümüzde keşfedildi; Kuran 1400 yıl önce ‘Her canlı su’dan yarattık’ diyor.",
    ref: "Enbiya 30",
  },
  {
    id: 4,
    ar: "﴿فَالِقُ الْإِصْبَاحِ﴾",
    tr: "Gün ışığının ‘yarılması’ ifadesi, ışığın kutuplanması (polarizasyon) olgusuna işaret ediyor olabilir.",
    ref: "En’am 96",
  },
  {
    id: 5,
    ar: "﴿خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ بِالْحَقِّ﴾",
    tr: "Kuran’ın “yedi gök katı” ifadesi, modern astrofiziğin çoklu evren katmanları teorileriyle örtüşüyor.",
    ref: "Talaq 12",
  },
];

export function DidYouKnowSection() {
  const [idx, setIdx] = useState(0);
  const { toast } = useToast();
  const fact = funFacts[idx];

  const next = () => setIdx((idx + 1) % funFacts.length);

  const copy = () => {
    if (fact) {
      navigator.clipboard.writeText(`${fact.tr} – ${fact.ref}`);
      toast({ title: "Panoya kopyalandı!" });
    }
  };

  if (!fact) return null;

  return (
    <section className="relative isolate mx-auto my-20 max-w-4xl px-4">
      {/* Soft glow in back */}
      <div className="absolute -top-8 -left-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl -z-10" />
      <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl -z-10" />

      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-background/70 p-6 shadow-2xl backdrop-blur-xl">
        {/* Arabic ornament */}
        <span className="absolute -right-4 -top-4 text-[8rem] font-kufi text-foreground/5 dark:text-foreground/10 select-none -z-10">
          ﷽
        </span>

        <header className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <RotateCw className="h-5 w-5" />
          </span>
          <h3 className="text-xl font-semibold text-foreground">
            Biliyor muydunuz?
          </h3>
        </header>

        <div className="mt-4 space-y-2">
          <p className="text-2xl font-kufi leading-relaxed text-primary">
            {fact.ar}
          </p>
          <p className="text-base text-foreground/80">{fact.tr}</p>
          <p className="text-sm text-muted-foreground">— {fact.ref}</p>
        </div>

        <footer className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copy}
              className="rounded-full"
            >
              <Copy className="h-3.5 w-3.5" />
              Kopyala
            </Button>
          </div>

          <Button
            onClick={next}
            size="sm"
            className="group/btn rounded-full"
          >
            Sonraki
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </footer>
      </div>
    </section>
  );
}
