"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Copy, Save, FolderOpen, Trash2, Type, Palette,
  AlignLeft, AlignCenter, AlignRight, Plus, Eye, Image
} from "lucide-react";

interface BannerConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  bgType: "solid" | "gradient";
  bgColor1: string;
  bgColor2: string;
  gradientAngle: number;
  headline: string;
  headlineColor: string;
  headlineFontSize: number;
  headlineAlign: "left" | "center" | "right";
  headlineBold: boolean;
  subheadline: string;
  subheadlineColor: string;
  subheadlineFontSize: number;
  ctaText: string;
  ctaColor: string;
  ctaTextColor: string;
  ctaBorderRadius: number;
  ctaFontSize: number;
  showBadge: boolean;
  badgeText: string;
  badgeColor: string;
  badgeTextColor: string;
  createdAt: string;
}

const STORAGE_KEY = "monyads-banners";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const DIMENSIONS = [
  { label: "Feed (1080×1080)", w: 1080, h: 1080 },
  { label: "Facebook Ads (1200×628)", w: 1200, h: 628 },
  { label: "Stories (1080×1920)", w: 1080, h: 1920 },
  { label: "YouTube (1920×1080)", w: 1920, h: 1080 },
  { label: "Leaderboard (728×90)", w: 728, h: 90 },
  { label: "Retângulo (300×250)", w: 300, h: 250 },
];

const TEMPLATES: Record<string, Partial<BannerConfig>> = {
  "Oferta Urgente": {
    bgType: "gradient",
    bgColor1: "#dc2626",
    bgColor2: "#7f1d1d",
    gradientAngle: 135,
    headline: "🔥 OFERTA IMPERDÍVEL",
    headlineColor: "#ffffff",
    headlineFontSize: 48,
    subheadline: "Apenas hoje! Desconto exclusivo de 50%",
    subheadlineColor: "#fecaca",
    ctaText: "COMPRAR AGORA",
    ctaColor: "#facc15",
    ctaTextColor: "#7f1d1d",
    showBadge: true,
    badgeText: "50% OFF",
    badgeColor: "#facc15",
    badgeTextColor: "#7f1d1d",
  },
  "Lançamento": {
    bgType: "gradient",
    bgColor1: "#1e293b",
    bgColor2: "#3b82f6",
    gradientAngle: 135,
    headline: "LANÇAMENTO EXCLUSIVO",
    headlineColor: "#ffffff",
    headlineFontSize: 44,
    subheadline: "O produto que vai transformar seus resultados",
    subheadlineColor: "#93c5fd",
    ctaText: "SAIBA MAIS",
    ctaColor: "#22c55e",
    ctaTextColor: "#ffffff",
    showBadge: true,
    badgeText: "NOVO",
    badgeColor: "#22c55e",
    badgeTextColor: "#ffffff",
  },
  "Lead Magnet": {
    bgType: "gradient",
    bgColor1: "#7c3aed",
    bgColor2: "#4f46e5",
    gradientAngle: 180,
    headline: "E-BOOK GRATUITO",
    headlineColor: "#ffffff",
    headlineFontSize: 42,
    subheadline: "Baixe agora e aprenda o passo a passo completo",
    subheadlineColor: "#c4b5fd",
    ctaText: "BAIXAR GRÁTIS",
    ctaColor: "#f59e0b",
    ctaTextColor: "#1e1b4b",
    showBadge: true,
    badgeText: "GRÁTIS",
    badgeColor: "#f59e0b",
    badgeTextColor: "#1e1b4b",
  },
  "Black Friday": {
    bgType: "solid",
    bgColor1: "#000000",
    bgColor2: "#000000",
    headline: "BLACK FRIDAY",
    headlineColor: "#ffffff",
    headlineFontSize: 56,
    subheadline: "Os melhores descontos do ano estão aqui",
    subheadlineColor: "#a3a3a3",
    ctaText: "VER OFERTAS",
    ctaColor: "#ef4444",
    ctaTextColor: "#ffffff",
    showBadge: true,
    badgeText: "ATÉ 70% OFF",
    badgeColor: "#ef4444",
    badgeTextColor: "#ffffff",
  },
  "Minimalista": {
    bgType: "solid",
    bgColor1: "#ffffff",
    bgColor2: "#ffffff",
    headline: "Simplicidade que converte",
    headlineColor: "#0f172a",
    headlineFontSize: 40,
    subheadline: "A solução definitiva para o seu negócio",
    subheadlineColor: "#64748b",
    ctaText: "COMEÇAR",
    ctaColor: "#0f172a",
    ctaTextColor: "#ffffff",
    showBadge: false,
    badgeText: "",
    badgeColor: "#0f172a",
    badgeTextColor: "#ffffff",
  },
};

function createDefaultBanner(name: string = "Novo Banner"): BannerConfig {
  return {
    id: uid(),
    name,
    width: 1080,
    height: 1080,
    bgType: "gradient",
    bgColor1: "#1e293b",
    bgColor2: "#3b82f6",
    gradientAngle: 135,
    headline: "Seu Título Aqui",
    headlineColor: "#ffffff",
    headlineFontSize: 48,
    headlineAlign: "center",
    headlineBold: true,
    subheadline: "Subtítulo descritivo do seu anúncio",
    subheadlineColor: "#cbd5e1",
    subheadlineFontSize: 20,
    ctaText: "SAIBA MAIS",
    ctaColor: "#22c55e",
    ctaTextColor: "#ffffff",
    ctaBorderRadius: 8,
    ctaFontSize: 18,
    showBadge: false,
    badgeText: "OFERTA",
    badgeColor: "#ef4444",
    badgeTextColor: "#ffffff",
    createdAt: new Date().toISOString(),
  };
}

export default function BannersTool() {
  const [banners, setBanners] = useState<BannerConfig[]>([]);
  const [current, setCurrent] = useState<BannerConfig | null>(null);
  const [tab, setTab] = useState("design");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setBanners(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: BannerConfig[]) => {
    setBanners(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createBanner = (template?: string) => {
    const banner = createDefaultBanner();
    if (template && TEMPLATES[template]) {
      Object.assign(banner, TEMPLATES[template]);
      banner.name = template;
    }
    persist([...banners, banner]);
    setCurrent(banner);
    toast.success("Banner criado!");
  };

  const saveCurrent = () => {
    if (!current) return;
    persist(banners.map((b) => (b.id === current.id ? current : b)));
    toast.success("Banner salvo!");
  };

  const deleteBanner = (id: string) => {
    persist(banners.filter((b) => b.id !== id));
    if (current?.id === id) setCurrent(null);
    toast.success("Banner excluído!");
  };

  const update = (patch: Partial<BannerConfig>) => {
    if (!current) return;
    setCurrent({ ...current, ...patch });
  };

  const getBackground = (b: BannerConfig) =>
    b.bgType === "gradient"
      ? `linear-gradient(${b.gradientAngle}deg, ${b.bgColor1}, ${b.bgColor2})`
      : b.bgColor1;

  const getPreviewScale = () => {
    if (!current) return 1;
    const maxW = 500;
    const maxH = 400;
    const scaleX = maxW / current.width;
    const scaleY = maxH / current.height;
    return Math.min(scaleX, scaleY, 1);
  };

  const exportHTML = () => {
    if (!current) return;
    const bg = getBackground(current);
    const html = `<div style="width:${current.width}px;height:${current.height}px;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:${current.headlineAlign};position:relative;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  ${current.showBadge ? `<div style="position:absolute;top:20px;right:20px;background:${current.badgeColor};color:${current.badgeTextColor};padding:8px 20px;font-weight:800;font-size:16px;border-radius:4px;transform:rotate(0deg);">${current.badgeText}</div>` : ""}
  <h1 style="color:${current.headlineColor};font-size:${current.headlineFontSize}px;font-weight:${current.headlineBold ? "800" : "400"};margin:0 40px 16px;line-height:1.2;text-align:${current.headlineAlign};">${current.headline}</h1>
  <p style="color:${current.subheadlineColor};font-size:${current.subheadlineFontSize}px;margin:0 40px 32px;opacity:0.9;text-align:${current.headlineAlign};">${current.subheadline}</p>
  ${current.ctaText ? `<div style="display:inline-block;padding:14px 40px;background:${current.ctaColor};color:${current.ctaTextColor};font-weight:700;font-size:${current.ctaFontSize}px;border-radius:${current.ctaBorderRadius}px;cursor:pointer;">${current.ctaText}</div>` : ""}
</div>`;
    navigator.clipboard.writeText(html);
    toast.success("HTML/CSS do banner copiado!");
  };

  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Criador de Banners</h2>
            <p className="text-sm text-muted-foreground">Crie banners profissionais para anúncios e páginas</p>
          </div>
          {current && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={saveCurrent}>
                <Save className="w-4 h-4 mr-1" /> Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={exportHTML}>
                <Copy className="w-4 h-4 mr-1" /> Copiar HTML
              </Button>
            </div>
          )}
        </div>

        {!current ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-semibold mb-3">Criar Novo Banner</h3>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="w-[220px]">
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger><SelectValue placeholder="Escolher template" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(TEMPLATES).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => { createBanner(selectedTemplate || undefined); setSelectedTemplate(""); }}>
                  <Plus className="w-4 h-4 mr-1" /> Criar Banner
                </Button>
                <Button variant="outline" onClick={() => createBanner()}>
                  Banner em branco
                </Button>
              </div>
            </div>

            {banners.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> Banners Salvos</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {banners.map((b) => (
                    <div key={b.id} className="rounded-lg border border-border bg-background overflow-hidden">
                      <div
                        className="h-24 flex items-center justify-center text-center p-2"
                        style={{
                          background: getBackground(b),
                          color: b.headlineColor,
                        }}
                      >
                        <span className="text-xs font-bold truncate">{b.headline}</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.width}×{b.height}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setCurrent(b)}>Editar</Button>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteBanner(b.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Button size="sm" variant="ghost" onClick={() => { saveCurrent(); setCurrent(null); }}>← Voltar</Button>
              <Input value={current.name} onChange={(e) => update({ name: e.target.value })} className="max-w-xs font-semibold" />
              <Badge variant="secondary">{current.width}×{current.height}</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr,auto]">
              {/* Controls */}
              <div>
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList>
                    <TabsTrigger value="design"><Palette className="w-4 h-4 mr-1" /> Design</TabsTrigger>
                    <TabsTrigger value="text"><Type className="w-4 h-4 mr-1" /> Textos</TabsTrigger>
                    <TabsTrigger value="cta">CTA & Badge</TabsTrigger>
                  </TabsList>

                  <TabsContent value="design" className="mt-4 space-y-4">
                    <div>
                      <Label>Dimensões</Label>
                      <Select
                        value={`${current.width}x${current.height}`}
                        onValueChange={(v) => {
                          const dim = DIMENSIONS.find((d) => `${d.w}x${d.h}` === v);
                          if (dim) update({ width: dim.w, height: dim.h });
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {DIMENSIONS.map((d) => (
                            <SelectItem key={`${d.w}x${d.h}`} value={`${d.w}x${d.h}`}>{d.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tipo de Fundo</Label>
                      <div className="flex gap-3 mt-1">
                        <Button size="sm" variant={current.bgType === "solid" ? "default" : "outline"} onClick={() => update({ bgType: "solid" })}>
                          Cor sólida
                        </Button>
                        <Button size="sm" variant={current.bgType === "gradient" ? "default" : "outline"} onClick={() => update({ bgType: "gradient" })}>
                          Gradiente
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor {current.bgType === "gradient" ? "1" : "de Fundo"}</Label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={current.bgColor1} onChange={(e) => update({ bgColor1: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                          <Input value={current.bgColor1} onChange={(e) => update({ bgColor1: e.target.value })} />
                        </div>
                      </div>
                      {current.bgType === "gradient" && (
                        <div>
                          <Label>Cor 2</Label>
                          <div className="flex gap-2 items-center">
                            <input type="color" value={current.bgColor2} onChange={(e) => update({ bgColor2: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                            <Input value={current.bgColor2} onChange={(e) => update({ bgColor2: e.target.value })} />
                          </div>
                        </div>
                      )}
                    </div>

                    {current.bgType === "gradient" && (
                      <div>
                        <Label>Ângulo do Gradiente: {current.gradientAngle}°</Label>
                        <Slider
                          value={[current.gradientAngle]}
                          onValueChange={([v]) => update({ gradientAngle: v })}
                          min={0}
                          max={360}
                          step={15}
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="text" className="mt-4 space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input value={current.headline} onChange={(e) => update({ headline: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor do Título</Label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={current.headlineColor} onChange={(e) => update({ headlineColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                          <Input value={current.headlineColor} onChange={(e) => update({ headlineColor: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Tamanho: {current.headlineFontSize}px</Label>
                        <Slider
                          value={[current.headlineFontSize]}
                          onValueChange={([v]) => update({ headlineFontSize: v })}
                          min={16}
                          max={96}
                          step={2}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label>Alinhamento:</Label>
                      <Button size="sm" variant={current.headlineAlign === "left" ? "default" : "outline"} onClick={() => update({ headlineAlign: "left" })}>
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={current.headlineAlign === "center" ? "default" : "outline"} onClick={() => update({ headlineAlign: "center" })}>
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={current.headlineAlign === "right" ? "default" : "outline"} onClick={() => update({ headlineAlign: "right" })}>
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center gap-2">
                        <Switch checked={current.headlineBold} onCheckedChange={(v) => update({ headlineBold: v })} />
                        <Label>Negrito</Label>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label>Subtítulo</Label>
                      <Input value={current.subheadline} onChange={(e) => update({ subheadline: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor do Subtítulo</Label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={current.subheadlineColor} onChange={(e) => update({ subheadlineColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                          <Input value={current.subheadlineColor} onChange={(e) => update({ subheadlineColor: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Tamanho: {current.subheadlineFontSize}px</Label>
                        <Slider
                          value={[current.subheadlineFontSize]}
                          onValueChange={([v]) => update({ subheadlineFontSize: v })}
                          min={12}
                          max={48}
                          step={2}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="cta" className="mt-4 space-y-4">
                    <div>
                      <Label>Texto do CTA</Label>
                      <Input value={current.ctaText} onChange={(e) => update({ ctaText: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor do Botão</Label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={current.ctaColor} onChange={(e) => update({ ctaColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                          <Input value={current.ctaColor} onChange={(e) => update({ ctaColor: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Cor do Texto</Label>
                        <div className="flex gap-2 items-center">
                          <input type="color" value={current.ctaTextColor} onChange={(e) => update({ ctaTextColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                          <Input value={current.ctaTextColor} onChange={(e) => update({ ctaTextColor: e.target.value })} />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Borda: {current.ctaBorderRadius}px</Label>
                        <Slider
                          value={[current.ctaBorderRadius]}
                          onValueChange={([v]) => update({ ctaBorderRadius: v })}
                          min={0}
                          max={50}
                          step={2}
                        />
                      </div>
                      <div>
                        <Label>Tamanho: {current.ctaFontSize}px</Label>
                        <Slider
                          value={[current.ctaFontSize]}
                          onValueChange={([v]) => update({ ctaFontSize: v })}
                          min={12}
                          max={36}
                          step={1}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-3">
                      <Switch checked={current.showBadge} onCheckedChange={(v) => update({ showBadge: v })} />
                      <Label>Mostrar Badge/Ribbon</Label>
                    </div>
                    {current.showBadge && (
                      <div className="space-y-3 pl-2 border-l-2 border-border">
                        <div>
                          <Label>Texto da Badge</Label>
                          <Input value={current.badgeText} onChange={(e) => update({ badgeText: e.target.value })} placeholder="OFERTA, 50% OFF, GRÁTIS..." />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Cor da Badge</Label>
                            <div className="flex gap-2 items-center">
                              <input type="color" value={current.badgeColor} onChange={(e) => update({ badgeColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                              <Input value={current.badgeColor} onChange={(e) => update({ badgeColor: e.target.value })} />
                            </div>
                          </div>
                          <div>
                            <Label>Cor do Texto</Label>
                            <div className="flex gap-2 items-center">
                              <input type="color" value={current.badgeTextColor} onChange={(e) => update({ badgeTextColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                              <Input value={current.badgeTextColor} onChange={(e) => update({ badgeTextColor: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Live Preview */}
              <div className="flex flex-col items-center">
                <Label className="mb-2 text-sm font-semibold flex items-center gap-1"><Eye className="w-4 h-4" /> Preview ao Vivo</Label>
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <div
                    ref={previewRef}
                    style={{
                      width: current.width,
                      height: current.height,
                      background: getBackground(current),
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: current.headlineAlign,
                      position: "relative",
                      overflow: "hidden",
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      transform: `scale(${getPreviewScale()})`,
                      transformOrigin: "top center",
                    }}
                  >
                    {current.showBadge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          background: current.badgeColor,
                          color: current.badgeTextColor,
                          padding: "8px 20px",
                          fontWeight: 800,
                          fontSize: 16,
                          borderRadius: 4,
                        }}
                      >
                        {current.badgeText}
                      </div>
                    )}
                    <h1
                      style={{
                        color: current.headlineColor,
                        fontSize: current.headlineFontSize,
                        fontWeight: current.headlineBold ? 800 : 400,
                        margin: "0 40px 16px",
                        lineHeight: 1.2,
                        textAlign: current.headlineAlign,
                      }}
                    >
                      {current.headline}
                    </h1>
                    <p
                      style={{
                        color: current.subheadlineColor,
                        fontSize: current.subheadlineFontSize,
                        margin: "0 40px 32px",
                        opacity: 0.9,
                        textAlign: current.headlineAlign,
                      }}
                    >
                      {current.subheadline}
                    </p>
                    {current.ctaText && (
                      <div
                        style={{
                          display: "inline-block",
                          padding: "14px 40px",
                          background: current.ctaColor,
                          color: current.ctaTextColor,
                          fontWeight: 700,
                          fontSize: current.ctaFontSize,
                          borderRadius: current.ctaBorderRadius,
                          cursor: "pointer",
                        }}
                      >
                        {current.ctaText}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {current.width}×{current.height}px (escala: {Math.round(getPreviewScale() * 100)}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
