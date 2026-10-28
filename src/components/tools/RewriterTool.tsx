import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Star,
  StarOff,
  RefreshCw,
  Sparkles,
  Trash2,
  Heart,
} from "lucide-react";
import { toast } from "sonner";

interface Variation {
  id: string;
  text: string;
  scores: { persuasao: number; clareza: number; urgencia: number };
}

interface FavoriteItem {
  id: string;
  original: string;
  variation: string;
  style: string;
  savedAt: string;
}

const STYLES = [
  { value: "persuasiva", label: "Mais persuasiva" },
  { value: "curta", label: "Mais curta" },
  { value: "formal", label: "Mais formal" },
  { value: "informal", label: "Mais informal" },
  { value: "urgente", label: "Mais urgente" },
  { value: "emocional", label: "Mais emocional" },
  { value: "facebook", label: "Para Facebook Ads" },
  { value: "google", label: "Para Google Ads" },
  { value: "email", label: "Para Email" },
];

const POWER_WORDS = [
  "Exclusivo",
  "Limitado",
  "Grátis",
  "Comprovado",
  "Secreto",
  "Garantido",
  "Novo",
  "Revolucionário",
];

const URGENCY_PHRASES = [
  "Só hoje!",
  "Últimas vagas!",
  "Oferta por tempo limitado!",
  "Não perca essa chance!",
  "Vagas se esgotando!",
  "Aproveite agora!",
];

const EMOTIONAL_OPENERS = [
  "Imagine poder",
  "Você merece",
  "Chegou a hora de",
  "Descubra como",
  "Finalmente,",
  "Pare de sofrer com",
];

const QUESTION_STARTERS = [
  "Você sabia que",
  "Já imaginou",
  "Cansado de",
  "E se você pudesse",
  "Quer saber como",
  "Ainda está lutando com",
];

const CTA_PHRASES = [
  "Comece agora →",
  "Saiba mais →",
  "Garanta o seu →",
  "Clique e descubra →",
  "Quero aproveitar →",
  "Inscreva-se grátis →",
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function trimPunctuation(s: string): string {
  return s.replace(/[.!?]+$/, "").trim();
}

function generateVariations(text: string, style: string): Variation[] {
  const clean = text.trim();
  if (!clean) return [];

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
  const firstSentence = trimPunctuation(sentences[0] || clean);
  const count = 3 + Math.floor(Math.random() * 3); // 3-5

  const variations: Variation[] = [];

  const generators: Record<string, () => string[]> = {
    persuasiva: () => {
      const results: string[] = [];
      results.push(`${pick(POWER_WORDS)}: ${clean}`);
      results.push(
        `${pick(EMOTIONAL_OPENERS)} ${firstSentence.toLowerCase()}. ${pick(CTA_PHRASES)}`
      );
      results.push(
        `⚡ ${clean} — ${pick(POWER_WORDS)}. ${pick(CTA_PHRASES)}`
      );
      results.push(
        `${pick(QUESTION_STARTERS)} ${firstSentence.toLowerCase()}? ${pick(CTA_PHRASES)}`
      );
      results.push(
        `🔥 ${pick(POWER_WORDS)}! ${clean} ${pick(URGENCY_PHRASES)}`
      );
      return results;
    },
    curta: () => {
      const results: string[] = [];
      const words = clean.split(/\s+/);
      const half = Math.ceil(words.length / 2);
      results.push(words.slice(0, half).join(" ") + ".");
      results.push(`${firstSentence}. ${pick(CTA_PHRASES)}`);
      results.push(
        `${pick(POWER_WORDS)}: ${words.slice(0, Math.min(10, words.length)).join(" ")}.`
      );
      results.push(`${firstSentence}.`);
      results.push(
        `✅ ${words.slice(0, Math.min(8, words.length)).join(" ")}. ${pick(CTA_PHRASES)}`
      );
      return results;
    },
    formal: () => {
      const results: string[] = [];
      results.push(
        `Prezado(a), temos o prazer de informar que ${firstSentence.toLowerCase()}.`
      );
      results.push(
        `Gostaríamos de apresentar: ${firstSentence.toLowerCase()}. Fale conosco para mais informações.`
      );
      results.push(
        `É com satisfação que comunicamos: ${firstSentence.toLowerCase()}. Entre em contato.`
      );
      results.push(
        `Informamos que ${firstSentence.toLowerCase()}. Estamos à disposição para mais detalhes.`
      );
      results.push(
        `Convidamos você a conhecer: ${firstSentence.toLowerCase()}. Será um prazer atendê-lo(a).`
      );
      return results;
    },
    informal: () => {
      const results: string[] = [];
      results.push(`Ei! ${firstSentence} 😄`);
      results.push(`Olha só isso: ${firstSentence.toLowerCase()}! 🚀`);
      results.push(
        `Fala, galera! ${firstSentence}. Bora? ${pick(CTA_PHRASES)}`
      );
      results.push(`Tá ligado? ${capitalize(firstSentence.toLowerCase())}! 💪`);
      results.push(
        `Opa! ${firstSentence.toLowerCase()}. Cola com a gente! 🎉`
      );
      return results;
    },
    urgente: () => {
      const results: string[] = [];
      results.push(`🚨 ${pick(URGENCY_PHRASES)} ${clean}`);
      results.push(
        `⏰ ÚLTIMA CHANCE: ${firstSentence}. ${pick(URGENCY_PHRASES)}`
      );
      results.push(
        `🔥 ${pick(URGENCY_PHRASES)} ${firstSentence}. ${pick(CTA_PHRASES)}`
      );
      results.push(
        `⚠️ ATENÇÃO: ${firstSentence}. ${pick(URGENCY_PHRASES)} ${pick(CTA_PHRASES)}`
      );
      results.push(
        `❗ ${clean} — ${pick(URGENCY_PHRASES)}`
      );
      return results;
    },
    emocional: () => {
      const results: string[] = [];
      results.push(
        `${pick(EMOTIONAL_OPENERS)} ${firstSentence.toLowerCase()}. Sua vida vai mudar. ❤️`
      );
      results.push(
        `💡 ${pick(QUESTION_STARTERS)} ${firstSentence.toLowerCase()}? Chegou sua vez.`
      );
      results.push(
        `Você não precisa mais esperar. ${capitalize(firstSentence.toLowerCase())}. Comece hoje. 🌟`
      );
      results.push(
        `Sabe aquele sonho? ${capitalize(firstSentence.toLowerCase())}. Ele é possível. ✨`
      );
      results.push(
        `Pare um momento e pense: ${firstSentence.toLowerCase()}. Você merece isso. 💪`
      );
      return results;
    },
    facebook: () => {
      const results: string[] = [];
      results.push(
        `${pick(QUESTION_STARTERS)} ${firstSentence.toLowerCase()}?\n\n${pick(POWER_WORDS)}. ${pick(CTA_PHRASES)}\n\n👇 Clique no link abaixo`
      );
      results.push(
        `🔥 ${firstSentence}\n\n✅ ${pick(POWER_WORDS)}\n✅ Resultados reais\n✅ Sem enrolação\n\n${pick(CTA_PHRASES)}`
      );
      results.push(
        `${pick(EMOTIONAL_OPENERS)} ${firstSentence.toLowerCase()}...\n\n${pick(URGENCY_PHRASES)}\n\n${pick(CTA_PHRASES)}`
      );
      results.push(
        `⚡ ${firstSentence}\n\n${clean}\n\n💬 Comente "EU QUERO" para saber mais!`
      );
      results.push(
        `📢 ATENÇÃO: ${firstSentence}\n\n${pick(POWER_WORDS)} | ${pick(POWER_WORDS)} | ${pick(POWER_WORDS)}\n\n${pick(CTA_PHRASES)}`
      );
      return results;
    },
    google: () => {
      const short = firstSentence.substring(0, 30);
      const results: string[] = [];
      results.push(
        `${short} | ${pick(POWER_WORDS)}\n${firstSentence}. ${pick(CTA_PHRASES)}`
      );
      results.push(
        `${pick(POWER_WORDS)}: ${short}\n${clean.substring(0, 90)}. Confira!`
      );
      results.push(
        `${short} - Oferta Especial\n${firstSentence}. ${pick(URGENCY_PHRASES)}`
      );
      results.push(
        `${firstSentence.substring(0, 30)} | Site Oficial\n${pick(POWER_WORDS)}. ${firstSentence}. ${pick(CTA_PHRASES)}`
      );
      results.push(
        `Melhor ${short}\n${firstSentence}. ${pick(POWER_WORDS)}. Acesse agora!`
      );
      return results;
    },
    email: () => {
      const results: string[] = [];
      results.push(
        `Assunto: ${pick(POWER_WORDS)} — ${firstSentence}\n\nOlá,\n\n${clean}\n\n${pick(CTA_PHRASES)}\n\nAbraço!`
      );
      results.push(
        `Assunto: ${pick(QUESTION_STARTERS)} ${firstSentence.toLowerCase()}?\n\nOi!\n\n${clean}\n\n${pick(URGENCY_PHRASES)}\n\n${pick(CTA_PHRASES)}`
      );
      results.push(
        `Assunto: [${pick(POWER_WORDS)}] ${firstSentence}\n\nOlá,\n\n${pick(EMOTIONAL_OPENERS)} ${firstSentence.toLowerCase()}.\n\n${clean}\n\nAté logo!`
      );
      results.push(
        `Assunto: Você precisa ver isso — ${firstSentence}\n\nEi!\n\n${clean}\n\nResponda este email com qualquer dúvida.\n\nAbraço!`
      );
      results.push(
        `Assunto: ${pick(URGENCY_PHRASES)} ${firstSentence}\n\nOlá,\n\n${clean}\n\n${pick(CTA_PHRASES)}\n\nAtenciosamente.`
      );
      return results;
    },
  };

  const gen = generators[style] || generators.persuasiva;
  const raw = shuffle(gen()).slice(0, count);

  for (const r of raw) {
    const scoreBase: Record<string, { p: number; c: number; u: number }> = {
      persuasiva: { p: 85, c: 70, u: 60 },
      curta: { p: 60, c: 90, u: 50 },
      formal: { p: 55, c: 85, u: 30 },
      informal: { p: 65, c: 75, u: 45 },
      urgente: { p: 75, c: 65, u: 95 },
      emocional: { p: 80, c: 60, u: 55 },
      facebook: { p: 85, c: 70, u: 75 },
      google: { p: 75, c: 80, u: 65 },
      email: { p: 70, c: 80, u: 50 },
    };
    const base = scoreBase[style] || { p: 70, c: 70, u: 50 };
    const jitter = () => Math.floor(Math.random() * 16) - 8;
    const clamp = (v: number) => Math.max(10, Math.min(100, v));

    variations.push({
      id: generateId(),
      text: r,
      scores: {
        persuasao: clamp(base.p + jitter()),
        clareza: clamp(base.c + jitter()),
        urgencia: clamp(base.u + jitter()),
      },
    });
  }

  return variations;
}

const STORAGE_KEY = "mony-rewriter-favorites";

export default function RewriterTool() {
  const [originalText, setOriginalText] = useState("");
  const [style, setStyle] = useState("persuasiva");
  const [variations, setVariations] = useState<Variation[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  const saveFavorites = (items: FavoriteItem[]) => {
    setFavorites(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const handleGenerate = () => {
    if (!originalText.trim()) {
      toast.error("Cole ou digite o texto original primeiro.");
      return;
    }
    const v = generateVariations(originalText, style);
    setVariations(v);
    toast.success(`${v.length} variações geradas!`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const isFavorited = (varId: string) =>
    favorites.some((f) => f.id === varId);

  const toggleFavorite = (v: Variation) => {
    if (isFavorited(v.id)) {
      saveFavorites(favorites.filter((f) => f.id !== v.id));
      toast("Removido dos favoritos.");
    } else {
      saveFavorites([
        ...favorites,
        {
          id: v.id,
          original: originalText,
          variation: v.text,
          style,
          savedAt: new Date().toLocaleString("pt-BR"),
        },
      ]);
      toast.success("Salvo nos favoritos!");
    }
  };

  const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Reescritor de Copy</h2>
          </div>
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Heart className="h-4 w-4 mr-1" />
            Favoritos ({favorites.length})
          </Button>
        </div>

        {showFavorites ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Variações Salvas
            </h3>
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum favorito salvo ainda.
              </p>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="rounded-xl border border-border bg-background/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {STYLES.find((s) => s.value === fav.style)?.label || fav.style}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {fav.savedAt}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap mb-2">
                        {fav.variation}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(fav.variation)}
                        >
                          <Copy className="h-3 w-3 mr-1" /> Copiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            saveFavorites(favorites.filter((f) => f.id !== fav.id));
                            toast("Removido.");
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <Label htmlFor="original-text">Texto Original</Label>
                <Textarea
                  id="original-text"
                  placeholder="Cole ou digite sua copy aqui..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  rows={5}
                  className="mt-1"
                />
                {originalText.trim() && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {wordCount(originalText)} palavras
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label>Estilo de Reescrita</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleGenerate}>
                    <Sparkles className="h-4 w-4 mr-1" /> Gerar Variações
                  </Button>
                  {variations.length > 0 && (
                    <Button variant="outline" onClick={handleGenerate}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Variations */}
      {!showFavorites && variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground px-1">
            {variations.length} variações geradas — estilo:{" "}
            <span className="text-foreground">
              {STYLES.find((s) => s.value === style)?.label}
            </span>
          </h3>

          {variations.map((v, idx) => (
            <div
              key={v.id}
              className="rounded-2xl border border-border bg-card/60 p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge variant="outline" className="shrink-0">
                  Variação {idx + 1}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {wordCount(v.text)} palavras
                </span>
              </div>

              <p className="text-sm whitespace-pre-wrap mb-4 leading-relaxed">
                {v.text}
              </p>

              <Separator className="mb-3" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex gap-4 text-xs">
                  <span>
                    Persuasão:{" "}
                    <span className={`font-bold ${scoreColor(v.scores.persuasao)}`}>
                      {v.scores.persuasao}%
                    </span>
                  </span>
                  <span>
                    Clareza:{" "}
                    <span className={`font-bold ${scoreColor(v.scores.clareza)}`}>
                      {v.scores.clareza}%
                    </span>
                  </span>
                  <span>
                    Urgência:{" "}
                    <span className={`font-bold ${scoreColor(v.scores.urgencia)}`}>
                      {v.scores.urgencia}%
                    </span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(v.text)}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copiar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(v)}
                  >
                    {isFavorited(v.id) ? (
                      <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <StarOff className="h-3 w-3 mr-1" />
                    )}
                    {isFavorited(v.id) ? "Salvo" : "Salvar"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
