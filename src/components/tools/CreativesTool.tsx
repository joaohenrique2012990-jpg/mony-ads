import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Save,
  Trash2,
  RotateCcw,
  Sparkles,
  Download,
  Flame,
  MessageSquare,
  Smartphone,
  Tag,
  Newspaper,
  CheckCircle2,
  Wand2,
  RefreshCw,
  Eye,
  Megaphone,
  Heart,
  Share2,
  Send,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";

export type AdStyle = "news" | "whatsapp" | "tweet" | "shock_offer" | "bold";

export interface CreativeData {
  id: string;
  template: "feed" | "story" | "horizontal";
  style: AdStyle;
  badge: string;
  badgeBg: string;
  headline: string;
  body: string;
  ctaText: string;
  priceText: string;
  oldPriceText: string;
  authorName: string;
  authorHandle: string;
  whatsappMessage: string;
  whatsappTime: string;
  bgType: "gradient" | "solid";
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  accentColor: string;
  adPrimaryText: string; // Copy para o Facebook Ads
  savedAt: string;
}

const STORAGE_KEY = "monyads-creatives-lowticket";

const TEMPLATES = [
  { value: "feed", label: "Feed Quadrado (1:1)", width: 1080, height: 1080, aspect: "aspect-square" },
  { value: "story", label: "Stories & Reels (9:16)", width: 1080, height: 1920, aspect: "aspect-[9/16]" },
  { value: "horizontal", label: "Feed Paisagem (1.91:1)", width: 1200, height: 628, aspect: "aspect-[1.91/1]" },
] as const;

// Presets Validados de Alta Conversão no Facebook Ads para Low Ticket
const LOW_TICKET_AI_PRESETS = [
  {
    niche: "Emagrecimento & Chás",
    style: "news" as AdStyle,
    badge: "🔴 ALERTA URGENTE",
    badgeBg: "#ef4444",
    headline: "O Segredo do Chá Noturno que Está Secando Barrigas sem Exercícios",
    body: "Especialistas revelam a combinação de 3 ingredientes simples que desinflama o corpo enquanto você dorme.",
    priceText: "R$ 19,90",
    oldPriceText: "R$ 97,00",
    ctaText: "Acessar Protocolo Completo",
    authorName: "Saúde & Bem-Estar Brasil",
    authorHandle: "@saudeebemestar",
    whatsappMessage: "Menina, já são 3,4kg a menos em 9 dias tomando o chá antes de dormir! Nem acreditei quando subi na balança hoje!",
    whatsappTime: "08:42",
    gradientFrom: "#064e3b",
    gradientTo: "#0f766e",
    textColor: "#ffffff",
    accentColor: "#facc15",
    adPrimaryText: `🚨 [ATENÇÃO] Pare de passar fome com dietas malucas que só estressam seu corpo!

Descubra o ritual noturno de 3 ingredientes que está ajudando milhares de mulheres comuns a desinflamar e destravar o metabolismo.

👉 Sem academias lotadas
👉 Sem cortar o que você gosta
👉 Ingredientes baratos que você já tem em casa

Clique em 'Saiba Mais' e garanta o guia completo com desconto exclusivo por apenas R$ 19,90!`,
  },
  {
    niche: "Renda Extra & Marmitas",
    style: "whatsapp" as AdStyle,
    badge: "💰 CASO REAL",
    badgeBg: "#10b981",
    headline: "Como Faturar R$ 3.500 no Mês com Marmitas Feitas na Sua Cozinha",
    body: "Sem fogão industrial e sem estoque caro. O método simples para começar com 15 clientes fixos por semana.",
    priceText: "R$ 27,00",
    oldPriceText: "R$ 147,00",
    ctaText: "Quero Começar Hoje",
    authorName: "Marmitaria Lucrativa",
    authorHandle: "@marmitasfit.pro",
    whatsappMessage: "Oi Ju! Fiz a primeira fornada ontem e já vendi as 25 marmitas só no grupo do condomínio! Já deu R$ 375 de lucro livre no primeiro dia 😍",
    whatsappTime: "11:15",
    gradientFrom: "#1e1b4b",
    gradientTo: "#312e81",
    textColor: "#ffffff",
    accentColor: "#22c55e",
    adPrimaryText: `Quer conquistar sua independência financeira trabalhando na cozinha da sua própria casa? 🍱

O mercado de marmitas congeladas está explodindo e faltam pessoas para atender a demanda!

Neste manual passo a passo você recebe:
✅ Os 5 cardápios mais vendidos
✅ Como congelar sem juntar água
✅ Planilha automática de custos
✅ Scripts prontos de WhatsApp para vender todo dia

Promoção de lançamento por apenas R$ 27,00 (Acesso vitalício)! Toque abaixo:`,
  },
  {
    niche: "Espiritualidade & Salmos",
    style: "tweet" as AdStyle,
    badge: "✨ REVELAÇÃO",
    badgeBg: "#8b5cf6",
    headline: "Os 3 Salmos que Destravam Portas Financeiras e Paz no Lar",
    body: "Uma oração matinal guiada de 7 minutos para começar o dia com o coração em paz e a mente protegida.",
    priceText: "R$ 17,00",
    oldPriceText: "R$ 67,00",
    ctaText: "Receber Guia dos Salmos",
    authorName: "Palavra Diária de Fé",
    authorHandle: "@devocional.diario",
    whatsappMessage: "Irmã, depois que comecei a orar o Salmo 91 com a minha família todas as noites, a paz voltou para a nossa casa. Que bênção!",
    whatsappTime: "21:30",
    gradientFrom: "#18181b",
    gradientTo: "#27272a",
    textColor: "#ffffff",
    accentColor: "#fbbf24",
    adPrimaryText: `Se você está enfrentando noites de preocupação e sente que seus caminhos estão travados, faça uma pausa de 3 minutos. 🙏

O Guia Secreto dos Salmos da Prosperidade foi preparado para trazer conforto, fé e sabedoria para a sua vida financeira e familiar.

Adquira agora por apenas R$ 17,00 e receba imediatamente no seu e-mail!`,
  },
  {
    niche: "Maternidade & Desfralde",
    style: "shock_offer" as AdStyle,
    badge: "👶 PROMOÇÃO LIMITADA",
    badgeBg: "#0284c7",
    headline: "Desfralde Noturno em 7 Dias sem Trauma e sem Estresse",
    body: "O passo a passo com reforço positivo que já ajudou mais de 4.000 mães a tirarem a fralda sem choros.",
    priceText: "R$ 37,00",
    oldPriceText: "R$ 97,00",
    ctaText: "Garantir Método com 60% OFF",
    authorName: "Maternidade Sem Culpa",
    authorHandle: "@desfraldepraticoinfantil",
    whatsappMessage: "Gente, meu filho de 2 anos e meio passou a noite toda sem fralda pela primeira vez e não escapou nada! Método sensacional!",
    whatsappTime: "07:18",
    gradientFrom: "#0c4a6e",
    gradientTo: "#0369a1",
    textColor: "#ffffff",
    accentColor: "#38bdf8",
    adPrimaryText: `Mãe, você não precisa passar meses estressada limpando colchão e brigando na hora do desfralde! 🧸

Conheça o método prático de 7 dias criado por especialistas em desenvolvimento infantil.

👉 Sinais exatos de prontidão
👉 Como tirar a fralda noturna sem sustos
👉 Quadro de incentivos lúdico para imprimir

De R$ 97 por apenas R$ 37,00 hoje! Clique abaixo para garantir sua vaga:`,
  },
];

export default function CreativesTool() {
  const [template, setTemplate] = useState<"feed" | "story" | "horizontal">("feed");
  const [style, setStyle] = useState<AdStyle>("news");
  const [badge, setBadge] = useState("🔴 ALERTA URGENTE");
  const [badgeBg, setBadgeBg] = useState("#ef4444");
  const [headline, setHeadline] = useState("O Segredo do Chá Noturno que Está Secando Barrigas");
  const [body, setBody] = useState("Especialistas revelam a combinação de 3 ingredientes simples que desinflama o corpo enquanto você dorme.");
  const [priceText, setPriceText] = useState("R$ 19,90");
  const [oldPriceText, setOldPriceText] = useState("R$ 97,00");
  const [ctaText, setCtaText] = useState("Acessar Método Completo");
  const [authorName, setAuthorName] = useState("Saúde Brasil");
  const [authorHandle, setAuthorHandle] = useState("@saudebrasil");
  const [whatsappMessage, setWhatsappMessage] = useState("Menina, já são 3,4kg a menos em 9 dias tomando o chá antes de dormir! Nem acreditei!");
  const [whatsappTime, setWhatsappTime] = useState("08:42");

  const [bgType, setBgType] = useState<"gradient" | "solid">("gradient");
  const [bgColor, setBgColor] = useState("#064e3b");
  const [gradientFrom, setGradientFrom] = useState("#064e3b");
  const [gradientTo, setGradientTo] = useState("#0f766e");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#facc15");
  const [adPrimaryText, setAdPrimaryText] = useState(LOW_TICKET_AI_PRESETS[0].adPrimaryText);

  const [previewMode, setPreviewMode] = useState<"raw" | "mockup">("mockup");
  const [savedCreatives, setSavedCreatives] = useState<CreativeData[]>([]);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiNicheInput, setAiNicheInput] = useState("Emagrecimento");
  const [aiAngleInput, setAiAngleInput] = useState("curiosity");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) setSavedCreatives(JSON.parse(s));
    } catch {}
  }, []);

  const persistSaved = (list: CreativeData[]) => {
    setSavedCreatives(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const currentTemplate = useMemo(() => {
    return TEMPLATES.find((t) => t.value === template) || TEMPLATES[0];
  }, [template]);

  const applyPreset = (preset: (typeof LOW_TICKET_AI_PRESETS)[0]) => {
    setStyle(preset.style);
    setBadge(preset.badge);
    setBadgeBg(preset.badgeBg);
    setHeadline(preset.headline);
    setBody(preset.body);
    setPriceText(preset.priceText);
    setOldPriceText(preset.oldPriceText);
    setCtaText(preset.ctaText);
    setAuthorName(preset.authorName);
    setAuthorHandle(preset.authorHandle);
    setWhatsappMessage(preset.whatsappMessage);
    setWhatsappTime(preset.whatsappTime);
    setGradientFrom(preset.gradientFrom);
    setGradientTo(preset.gradientTo);
    setTextColor(preset.textColor);
    setAccentColor(preset.accentColor);
    setAdPrimaryText(preset.adPrimaryText);
    toast.success(`Modelo "${preset.niche}" aplicado!`);
  };

  const handleGenerateAiCreative = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      let match = LOW_TICKET_AI_PRESETS.find((p) =>
        p.niche.toLowerCase().includes(aiNicheInput.toLowerCase())
      );
      if (!match) {
        match = LOW_TICKET_AI_PRESETS[Math.floor(Math.random() * LOW_TICKET_AI_PRESETS.length)];
      }

      applyPreset(match);
      setIsAiGenerating(false);
      setAiModalOpen(false);
      toast.success("Criativo e copy gerados com Inteligência Artificial!");
    }, 600);
  };

  const saveCurrentCreative = () => {
    const item: CreativeData = {
      id: Math.random().toString(36).slice(2, 10),
      template,
      style,
      badge,
      badgeBg,
      headline,
      body,
      ctaText,
      priceText,
      oldPriceText,
      authorName,
      authorHandle,
      whatsappMessage,
      whatsappTime,
      bgType,
      bgColor,
      gradientFrom,
      gradientTo,
      textColor,
      accentColor,
      adPrimaryText,
      savedAt: new Date().toISOString(),
    };
    persistSaved([item, ...savedCreatives]);
    toast.success("Criativo salvo na sua galeria!");
  };

  const deleteSavedCreative = (id: string) => {
    persistSaved(savedCreatives.filter((c) => c.id !== id));
    toast.success("Criativo removido.");
  };

  const loadSavedCreative = (c: CreativeData) => {
    setTemplate(c.template);
    setStyle(c.style);
    setBadge(c.badge);
    setBadgeBg(c.badgeBg);
    setHeadline(c.headline);
    setBody(c.body);
    setCtaText(c.ctaText);
    setPriceText(c.priceText);
    setOldPriceText(c.oldPriceText);
    setAuthorName(c.authorName);
    setAuthorHandle(c.authorHandle);
    setWhatsappMessage(c.whatsappMessage);
    setWhatsappTime(c.whatsappTime);
    setBgType(c.bgType);
    setBgColor(c.bgColor);
    setGradientFrom(c.gradientFrom);
    setGradientTo(c.gradientTo);
    setTextColor(c.textColor);
    setAccentColor(c.accentColor);
    setAdPrimaryText(c.adPrimaryText);
    toast.success("Criativo carregado!");
  };

  // Download do Criativo como Imagem PNG usando Canvas HTML5
  const downloadCreativeImage = () => {
    const canvas = document.createElement("canvas");
    const width = currentTemplate.width;
    const height = currentTemplate.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fundo
    if (bgType === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, gradientFrom);
      grad.addColorStop(1, gradientTo);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, width, height);

    // Borda interna decorativa
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Badge Superior
    ctx.fillStyle = badgeBg;
    const badgeW = 340;
    const badgeH = 55;
    const badgeX = (width - badgeW) / 2;
    const badgeY = height * 0.12;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 25);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(badge, width / 2, badgeY + 36);

    // Headline Principal
    ctx.fillStyle = textColor;
    ctx.font = "800 52px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";

    // Quebra de linha da Headline
    const words = headline.split(" ");
    let line = "";
    let y = height * 0.28;
    const maxLineW = width - 180;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && i > 0) {
        ctx.fillText(line, width / 2, y);
        line = words[i] + " ";
        y += 68;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);

    // Box Central Dependendo do Estilo
    if (style === "whatsapp") {
      const boxW = width - 200;
      const boxH = 220;
      const boxX = 100;
      const boxY = y + 40;

      ctx.fillStyle = "#075e54";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 24);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "28px -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`💬 ${authorName} (${whatsappTime})`, boxX + 30, boxY + 50);

      ctx.font = "32px -apple-system, sans-serif";
      ctx.fillStyle = "#dcf8c6";
      ctx.fillText(`"${whatsappMessage.slice(0, 75)}..."`, boxX + 30, boxY + 120);
    } else if (style === "shock_offer") {
      const boxW = width - 240;
      const boxH = 180;
      const boxX = 120;
      const boxY = y + 50;

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 24);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`De: ${oldPriceText}`, width / 2, boxY + 60);

      ctx.fillStyle = accentColor;
      ctx.font = "900 68px sans-serif";
      ctx.fillText(`Por Apenas: ${priceText}`, width / 2, boxY + 135);
    } else {
      // Subtexto padrão
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "32px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(body.slice(0, 90) + "...", width / 2, y + 70);
    }

    // Botão CTA Inferior
    const ctaW = 480;
    const ctaH = 80;
    const ctaX = (width - ctaW) / 2;
    const ctaY = height - 160;

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 40);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${ctaText} →`, width / 2, ctaY + 52);

    // Gerar Link de Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `criativo-${template}-${style}.png`;
    link.href = dataUrl;
    link.click();
    toast.success("Imagem do criativo baixada em alta resolução (PNG)!");
  };

  const copyAdCopy = () => {
    navigator.clipboard.writeText(adPrimaryText);
    toast.success("Texto do anúncio copiado para o Facebook Ads!");
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card/80 to-accent/10 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
                ESTÚDIO DE ANÚNCIOS
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                Meta Ads · Feed & Stories
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Criador de Criativos de Alta Conversão</h2>
            <p className="text-sm text-muted-foreground">
              Crie criativos no padrão vencedor de Low Ticket (Notícia, Print WhatsApp, Oferta Choque) e exporte a imagem em PNG com a copy pronta para o Facebook Ads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              className="bg-gradient-brand shadow-glow font-bold"
              onClick={() => setAiModalOpen(true)}
            >
              <Wand2 className="w-4 h-4 mr-1.5" /> Gerar com IA
            </Button>
            <Button size="sm" variant="outline" onClick={saveCurrentCreative}>
              <Save className="w-4 h-4 mr-1.5" /> Salvar
            </Button>
            <Button size="sm" variant="secondary" onClick={downloadCreativeImage}>
              <Download className="w-4 h-4 mr-1.5" /> Baixar PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Modelos Rápidos de Low Ticket */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-foreground">Formatos Vencedores no Meta Ads:</span>
          </div>
          <span className="text-xs text-muted-foreground">Clique para aplicar modelo pronto</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LOW_TICKET_AI_PRESETS.map((p) => (
            <Button
              key={p.niche}
              variant="outline"
              size="sm"
              className="h-auto py-2.5 flex flex-col items-start text-left justify-start bg-background/50 hover:border-primary/50"
              onClick={() => applyPreset(p)}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-xs text-foreground truncate">{p.niche}</span>
                <span className="text-[10px] text-green-400 font-semibold">{p.priceText}</span>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{p.headline}</p>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Painel Esquerdo: Controles & Personalização */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Configurações do Anúncio</h3>
              <div className="flex items-center gap-1">
                {TEMPLATES.map((t) => (
                  <Button
                    key={t.value}
                    size="sm"
                    variant={template === t.value ? "default" : "ghost"}
                    className="text-xs h-7 px-2"
                    onClick={() => setTemplate(t.value as any)}
                  >
                    {t.value === "feed" ? "1:1 Feed" : t.value === "story" ? "9:16 Stories" : "1.91:1"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Estilo do Criativo */}
            <div className="space-y-1.5">
              <Label className="text-xs">Estilo Visual do Criativo</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "news", name: "Estilo Notícia", icon: Newspaper },
                  { id: "whatsapp", name: "Print WhatsApp", icon: MessageSquare },
                  { id: "shock_offer", name: "Oferta de Choque", icon: Tag },
                  { id: "tweet", name: "Nota / Tweet", icon: Smartphone },
                  { id: "bold", name: "Bold Direto", icon: Flame },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <Button
                      key={s.id}
                      type="button"
                      variant={style === s.id ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-9 justify-start px-2 bg-background/50"
                      onClick={() => setStyle(s.id as AdStyle)}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      <span className="truncate">{s.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Headline e Badge */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1 space-y-1">
                <Label className="text-xs">Badge de Topo</Label>
                <Input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="text-xs h-8"
                  placeholder="🔴 ALERTA"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Headline Principal *</Label>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="text-xs h-8"
                  placeholder="Título atraente"
                />
              </div>
            </div>

            {/* Subtexto */}
            <div className="space-y-1">
              <Label className="text-xs">Texto de Apoio</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            {/* Campos Específicos por Estilo */}
            {style === "whatsapp" && (
              <div className="p-3 rounded-xl border border-green-500/30 bg-green-500/5 space-y-2">
                <p className="text-xs font-bold text-green-400">Conteúdo do Print de WhatsApp</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[11px]">Nome do Remetente</Label>
                    <Input
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="text-xs h-7"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Horário</Label>
                    <Input
                      value={whatsappTime}
                      onChange={(e) => setWhatsappTime(e.target.value)}
                      className="text-xs h-7"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Mensagem do Print</Label>
                  <Input
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="text-xs h-7"
                  />
                </div>
              </div>
            )}

            {style === "shock_offer" && (
              <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                <p className="text-xs font-bold text-primary">Preços da Oferta Low Ticket</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Preço Promocional (Front)</Label>
                    <Input
                      value={priceText}
                      onChange={(e) => setPriceText(e.target.value)}
                      className="text-xs h-7 font-bold text-green-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Preço Antigo (Âncora)</Label>
                    <Input
                      value={oldPriceText}
                      onChange={(e) => setOldPriceText(e.target.value)}
                      className="text-xs h-7 text-muted-foreground line-through"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botão CTA & Cores */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
              <div className="space-y-1">
                <Label className="text-xs">Texto do Botão (CTA)</Label>
                <Input
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Cores de Fundo</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                    title="Cor 1"
                  />
                  <input
                    type="color"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                    title="Cor 2"
                  />
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                    title="Cor do Destaque/Botão"
                  />
                </div>
              </div>
            </div>

            {/* Copy do Anúncio para o Facebook */}
            <div className="space-y-1.5 pt-3 border-t border-border/40">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-accent" />
                  Texto Principal do Anúncio (Facebook Ads):
                </Label>
                <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={copyAdCopy}>
                  <Copy className="w-3 h-3 mr-1" /> Copiar Copy
                </Button>
              </div>
              <Textarea
                value={adPrimaryText}
                onChange={(e) => setAdPrimaryText(e.target.value)}
                rows={4}
                className="text-xs font-sans leading-relaxed bg-background"
                placeholder="Texto que vai na legenda do anúncio no Meta Ads..."
              />
            </div>
          </div>
        </div>

        {/* Painel Direito: Live Preview & Simulação de Anúncio Real */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base">Pré-Visualização do Anúncio</h3>
              </div>
              <div className="flex border rounded-lg overflow-hidden bg-background/50">
                <Button
                  size="sm"
                  variant={previewMode === "mockup" ? "default" : "ghost"}
                  className="h-7 text-xs px-2.5 rounded-none"
                  onClick={() => setPreviewMode("mockup")}
                >
                  Feed do Instagram
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === "raw" ? "default" : "ghost"}
                  className="h-7 text-xs px-2.5 rounded-none"
                  onClick={() => setPreviewMode("raw")}
                >
                  Apenas Imagem
                </Button>
              </div>
            </div>

            {/* Container do Preview */}
            <div className="flex justify-center p-4 bg-muted/20 rounded-xl border border-border/40 overflow-hidden">
              {previewMode === "mockup" ? (
                /* Moldura de Anúncio Patrocinado do Instagram */
                <div className="w-full max-w-[340px] rounded-xl border border-border bg-background shadow-2xl overflow-hidden text-xs">
                  {/* Top Bar do Anúncio */}
                  <div className="flex items-center justify-between p-3 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-[10px] text-white">
                        {authorName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-tight">{authorName}</p>
                        <p className="text-[10px] text-muted-foreground">Patrocinado · 🌐</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground">•••</span>
                  </div>

                  {/* Texto Superior no Facebook/Instagram */}
                  <div className="p-3 text-[11px] text-foreground/90 line-clamp-3 leading-snug">
                    {adPrimaryText}
                  </div>

                  {/* Área da Imagem do Criativo */}
                  <div
                    className={`relative w-full ${
                      template === "feed" ? "aspect-square" : template === "story" ? "aspect-[4/5]" : "aspect-[1.91/1]"
                    } flex flex-col justify-between p-5 text-center overflow-hidden transition-all`}
                    style={{
                      background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                      color: textColor,
                    }}
                  >
                    {/* Badge Superior */}
                    <div className="flex justify-center">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md"
                        style={{ backgroundColor: badgeBg }}
                      >
                        {badge}
                      </span>
                    </div>

                    {/* Headline Central */}
                    <div className="my-auto space-y-2">
                      <h4 className="font-extrabold text-lg leading-tight tracking-tight drop-shadow-md">
                        {headline}
                      </h4>

                      {style === "whatsapp" && (
                        <div className="rounded-xl p-3 text-left shadow-lg bg-[#075e54]/90 text-white my-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] opacity-80">
                            <span>💬 {authorName}</span>
                            <span>{whatsappTime}</span>
                          </div>
                          <p className="text-xs text-[#dcf8c6] font-medium leading-snug">
                            "{whatsappMessage}"
                          </p>
                        </div>
                      )}

                      {style === "shock_offer" && (
                        <div className="rounded-xl p-2.5 bg-black/40 border border-white/20 text-center space-y-0.5">
                          <p className="text-[10px] text-white/70 line-through">De: {oldPriceText}</p>
                          <p className="text-base font-extrabold text-green-400">
                            Por Apenas: {priceText}
                          </p>
                        </div>
                      )}

                      {style !== "whatsapp" && style !== "shock_offer" && (
                        <p className="text-[11px] opacity-90 line-clamp-2 leading-relaxed">
                          {body}
                        </p>
                      )}
                    </div>

                    {/* Botão no Criativo */}
                    <div className="pt-2">
                      <span
                        className="inline-block px-5 py-2 rounded-full font-bold text-xs text-black shadow-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        {ctaText} →
                      </span>
                    </div>
                  </div>

                  {/* Barra de Ação do Instagram (CTA Bar) */}
                  <div className="flex items-center justify-between p-3 bg-muted/40 border-t border-border/40">
                    <div>
                      <p className="font-bold text-xs text-foreground">monyads.com</p>
                      <p className="text-[10px] text-muted-foreground">{ctaText}</p>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground font-semibold">
                      Saiba mais
                    </Button>
                  </div>

                  {/* Ícones de Engajamento */}
                  <div className="flex items-center justify-between p-3 border-t border-border/30 text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 hover:text-red-500 cursor-pointer" />
                      <MessageSquare className="w-4 h-4 cursor-pointer" />
                      <Send className="w-4 h-4 cursor-pointer" />
                    </div>
                    <Bookmark className="w-4 h-4 cursor-pointer" />
                  </div>
                </div>
              ) : (
                /* Apenas a Imagem do Criativo */
                <div
                  className={`relative w-full max-w-[340px] ${
                    template === "feed" ? "aspect-square" : template === "story" ? "aspect-[9/16]" : "aspect-[1.91/1]"
                  } rounded-xl shadow-2xl flex flex-col justify-between p-6 text-center overflow-hidden border border-border/50`}
                  style={{
                    background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                    color: textColor,
                  }}
                >
                  <div className="flex justify-center">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {badge}
                    </span>
                  </div>

                  <div className="my-auto space-y-3">
                    <h3 className="font-extrabold text-xl leading-tight drop-shadow-md">
                      {headline}
                    </h3>
                    {style === "whatsapp" && (
                      <div className="rounded-xl p-3 text-left shadow-lg bg-[#075e54]/90 text-white my-2 space-y-1">
                        <div className="flex items-center justify-between text-[10px] opacity-80">
                          <span>💬 {authorName}</span>
                          <span>{whatsappTime}</span>
                        </div>
                        <p className="text-xs text-[#dcf8c6] font-medium leading-snug">
                          "{whatsappMessage}"
                        </p>
                      </div>
                    )}
                    {style === "shock_offer" && (
                      <div className="rounded-xl p-3 bg-black/40 border border-white/20 text-center space-y-1">
                        <p className="text-xs text-white/70 line-through">De: {oldPriceText}</p>
                        <p className="text-lg font-extrabold text-green-400">
                          Por Apenas: {priceText}
                        </p>
                      </div>
                    )}
                    {style !== "whatsapp" && style !== "shock_offer" && (
                      <p className="text-xs opacity-90 line-clamp-3 leading-relaxed">
                        {body}
                      </p>
                    )}
                  </div>

                  <div>
                    <span
                      className="inline-block px-6 py-2.5 rounded-full font-bold text-xs text-black shadow-lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      {ctaText} →
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-gradient-brand shadow-glow text-xs" onClick={downloadCreativeImage}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> Baixar Imagem (PNG)
              </Button>
              <Button variant="outline" className="flex-1 text-xs" onClick={copyAdCopy}>
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar Copy do Anúncio
              </Button>
            </div>
          </div>

          {/* Galeria de Criativos Salvos */}
          {savedCreatives.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-primary" />
                Criativos Salvos ({savedCreatives.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {savedCreatives.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-border/60 bg-background/50 flex flex-col justify-between hover:border-primary/50 transition-all"
                  >
                    <div className="space-y-1 mb-2">
                      <Badge variant="outline" className="text-[9px]">
                        {c.style.toUpperCase()} · {c.template}
                      </Badge>
                      <p className="font-bold text-xs text-foreground line-clamp-1">{c.headline}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-6 text-[10px] flex-1"
                        onClick={() => loadSavedCreative(c)}
                      >
                        Carregar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        onClick={() => deleteSavedCreative(c.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Dialog do Gerador de Criativos com IA */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Wand2 className="h-5 w-5 text-primary" />
              Gerar Criativo Vencedor com Inteligência Artificial
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="space-y-1.5">
              <Label>Qual é o seu nicho ou produto?</Label>
              <Input
                placeholder="Ex: Emagrecimento, Marmitas Fit, Unhas em Fibra, Salmos..."
                value={aiNicheInput}
                onChange={(e) => setAiNicheInput(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ângulo Psicológico de Conversão</Label>
              <Select value={aiAngleInput} onValueChange={setAiAngleInput}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="curiosity">Curiosidade & Segredo (Maior CTR no Meta)</SelectItem>
                  <SelectItem value="urgency">Alerta Urgente & Notícia (Quebra de Padrão)</SelectItem>
                  <SelectItem value="social_proof">Prova Social & Print WhatsApp</SelectItem>
                  <SelectItem value="shock_price">Oferta de Choque (Preço Low Ticket R$ 19,90)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs text-muted-foreground">
              A IA vai gerar automaticamente a headline, o subtexto, o formato visual adequado e a legenda completa do anúncio pronta para rodar no Meta Ads.
            </p>

            <Button
              className="w-full bg-gradient-brand shadow-glow font-bold"
              disabled={isAiGenerating}
              onClick={handleGenerateAiCreative}
            >
              {isAiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Gerando Criativo com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Criativo Agora
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}