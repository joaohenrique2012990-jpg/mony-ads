import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Copy,
  Star,
  StarOff,
  RefreshCw,
  ClipboardCopy,
  Sparkles,
  Zap,
} from "lucide-react";

interface Headline {
  id: string;
  text: string;
  score: number;
  tone: string;
}

const TONES = [
  "Urgente",
  "Curiosidade",
  "Transformação",
  "Medo",
  "Exclusividade",
  "Social Proof",
];

const POWER_WORDS = [
  "secreto", "revelado", "comprovado", "exclusivo", "garantido", "grátis",
  "limitado", "urgente", "novo", "descoberto", "impressionante", "incrível",
  "definitivo", "essencial", "poderoso", "surpreendente", "transformador",
  "revolucionário", "instantâneo", "simples", "fácil", "rápido", "agora",
  "finalmente", "método", "segredo", "fórmula", "sistema", "estratégia",
];

const STORAGE_KEY = "mony-headlines-favorites";

function scoreHeadline(text: string): number {
  let score = 50;
  const lower = text.toLowerCase();

  // Length check
  const len = text.length;
  if (len >= 40 && len <= 70) score += 15;
  else if (len >= 30 && len <= 90) score += 8;
  else score -= 5;

  // Power words
  const pwCount = POWER_WORDS.filter((pw) => lower.includes(pw)).length;
  score += Math.min(pwCount * 5, 20);

  // Has numbers
  if (/\d/.test(text)) score += 8;

  // Starts with question / how
  if (lower.startsWith("como") || lower.startsWith("por que") || lower.startsWith("o que")) score += 5;

  // Has emotional punctuation
  if (text.includes("!") || text.includes("?")) score += 3;

  // Parenthetical content
  if (text.includes("(") && text.includes(")")) score += 4;

  // Has brackets
  if (text.includes("[") && text.includes("]")) score += 3;

  return Math.min(100, Math.max(10, score));
}

type PatternFn = (p: string, a: string, b: string) => string;

const PATTERNS_URGENTE: PatternFn[] = [
  (p, a, b) => `ATENÇÃO ${a}: ${b} — Descubra ${p} Antes Que Seja Tarde`,
  (p, a, b) => `Últimas Vagas! ${p} Está Transformando ${a} com ${b}`,
  (p, a, b) => `${a}: Você Tem Apenas 24h Para Garantir ${b} com ${p}`,
  (p, a, b) => `URGENTE: ${p} Revela Como ${a} Pode ${b} Agora Mesmo`,
  (p, a, b) => `Não Perca! ${a} Está Alcançando ${b} com Este Método — ${p}`,
];

const PATTERNS_CURIOSIDADE: PatternFn[] = [
  (p, a, b) => `O Segredo que ${a} Não Conhece Sobre ${b} (${p})`,
  (p, a, b) => `Por Que ${a} Está ${b}? A Resposta Vai Te Surpreender — ${p}`,
  (p, a, b) => `${a}: Você Sabia Que ${b} É Possível com ${p}?`,
  (p, a, b) => `A Verdade Sobre ${b} que Ninguém Conta Para ${a} — ${p}`,
  (p, a, b) => `Descubra o Método ${p} que ${a} Usa Para ${b}`,
];

const PATTERNS_TRANSFORMACAO: PatternFn[] = [
  (p, a, b) => `Como ${a} Pode ${b} em 30 Dias com ${p}`,
  (p, a, b) => `De Zero a ${b}: A Jornada de ${a} com ${p}`,
  (p, a, b) => `${p}: O Sistema que Transforma ${a} e Entrega ${b}`,
  (p, a, b) => `Conquiste ${b} — O Passo a Passo de ${p} para ${a}`,
  (p, a, b) => `${a}: Sua Transformação Para ${b} Começa com ${p}`,
];

const PATTERNS_MEDO: PatternFn[] = [
  (p, a, b) => `${a}: Você Está Cometendo Estes 5 Erros que Impedem ${b}?`,
  (p, a, b) => `ALERTA: ${a} Pode Estar Perdendo ${b} Sem ${p}`,
  (p, a, b) => `Os 3 Erros Fatais que Impedem ${a} de ${b} (e Como ${p} Resolve)`,
  (p, a, b) => `${a}: Se Você Não ${b} Agora, Vai Se Arrepender — ${p}`,
  (p, a, b) => `Por Que 97% de ${a} Falha em ${b}? ${p} Tem a Resposta`,
];

const PATTERNS_EXCLUSIVIDADE: PatternFn[] = [
  (p, a, b) => `[ACESSO VIP] ${p}: O Método Exclusivo Para ${a} ${b}`,
  (p, a, b) => `Apenas Para ${a} Selecionados: ${b} com ${p}`,
  (p, a, b) => `Convite Especial: ${a}, Descubra Como ${b} com ${p}`,
  (p, a, b) => `${p} — O Programa Premium que Garante ${b} Para ${a}`,
  (p, a, b) => `Acesso Restrito: ${a} Convidados Para ${b} com ${p}`,
];

const PATTERNS_SOCIAL_PROOF: PatternFn[] = [
  (p, a, b) => `+10.000 ${a} Já Estão ${b} com ${p} — E Você?`,
  (p, a, b) => `Como ${a} de Todo o Brasil Estão ${b} Graças ao ${p}`,
  (p, a, b) => `${p}: O Método que 5.000+ ${a} Usam Para ${b}`,
  (p, a, b) => `Veja Como ${a} Reais Conquistaram ${b} com ${p}`,
  (p, a, b) => `Avaliado com 5 Estrelas por ${a}: ${p} Entrega ${b}`,
];

const PATTERNS_GENERIC: PatternFn[] = [
  (p, a, b) => `${p}: A Solução Definitiva Para ${a} que Querem ${b}`,
  (p, a, b) => `7 Segredos de ${p} Para ${a} Alcançar ${b}`,
  (p, a, b) => `Como ${b} Sem Complicação — ${p} Para ${a}`,
  (p, a, b) => `${a}: O Guia Completo de ${p} Para ${b}`,
  (p, a, b) => `Fórmula ${p}: ${a} Descobre Como ${b} de Forma Simples`,
  (p, a, b) => `[Novo Método] ${p} Ensina ${a} a ${b} Passo a Passo`,
  (p, a, b) => `Por Que ${p} É a Escolha #1 de ${a} Para ${b}`,
  (p, a, b) => `${b} Garantido: ${p} É o Que ${a} Precisa`,
  (p, a, b) => `Chega de Frustração, ${a}! ${p} Entrega ${b} de Verdade`,
  (p, a, b) => `A Estratégia ${p} que Todo ${a} Deveria Conhecer Para ${b}`,
];

function getPatterns(tone: string): PatternFn[] {
  switch (tone) {
    case "Urgente": return PATTERNS_URGENTE;
    case "Curiosidade": return PATTERNS_CURIOSIDADE;
    case "Transformação": return PATTERNS_TRANSFORMACAO;
    case "Medo": return PATTERNS_MEDO;
    case "Exclusividade": return PATTERNS_EXCLUSIVIDADE;
    case "Social Proof": return PATTERNS_SOCIAL_PROOF;
    default: return PATTERNS_GENERIC;
  }
}

function generateHeadlines(product: string, audience: string, benefit: string, tone: string, existingIds: Set<string>): Headline[] {
  const tonePatterns = getPatterns(tone);
  const genericPatterns = PATTERNS_GENERIC;
  const allPatterns = [...tonePatterns, ...genericPatterns];

  const headlines: Headline[] = [];
  const seen = new Set<string>();

  for (const pattern of allPatterns) {
    const text = pattern(product, audience, benefit);
    if (!seen.has(text) && !existingIds.has(text)) {
      seen.add(text);
      headlines.push({
        id: `${Date.now()}-${headlines.length}`,
        text,
        score: scoreHeadline(text),
        tone,
      });
    }
  }

  // Additional variations
  const extras: string[] = [
    `Como ${audience} Pode ${benefit} com ${product} (Mesmo Começando do Zero)`,
    `${product}: ${benefit} Para ${audience} em Tempo Recorde`,
    `Pare de Perder Tempo! ${product} Ajuda ${audience} a ${benefit}`,
    `${audience}? Então Você Precisa Conhecer ${product} Para ${benefit}`,
    `O Que ${audience} de Sucesso Fazem Para ${benefit} — A Resposta é ${product}`,
    `Descubra Como ${product} Ajudou Milhares de ${audience} a ${benefit}`,
    `${benefit}: O Sonho de Todo ${audience} Agora É Realidade com ${product}`,
    `Método ${product}: ${audience} Consegue ${benefit} Mesmo Sem Experiência`,
    `A Fórmula Comprovada de ${product} Para ${audience} ${benefit}`,
    `[Exclusivo] ${product} Revela Como ${audience} Pode ${benefit} Hoje`,
  ];

  for (const text of extras) {
    if (!seen.has(text) && !existingIds.has(text)) {
      seen.add(text);
      headlines.push({
        id: `${Date.now()}-${headlines.length}`,
        text,
        score: scoreHeadline(text),
        tone,
      });
    }
  }

  return headlines.sort((a, b) => b.score - a.score);
}

export default function HeadlinesTool() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [benefit, setBenefit] = useState("");
  const [tone, setTone] = useState("Transformação");
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const generate = () => {
    if (!product.trim() || !audience.trim() || !benefit.trim()) {
      toast.error("Preencha todos os campos para gerar headlines.");
      return;
    }
    const result = generateHeadlines(product.trim(), audience.trim(), benefit.trim(), tone, new Set());
    setHeadlines(result);
    toast.success(`${result.length} headlines geradas!`);
  };

  const generateMore = () => {
    if (!product.trim() || !audience.trim() || !benefit.trim()) return;
    const existingTexts = new Set(headlines.map((h) => h.text));
    // Generate with different tones
    const otherTones = TONES.filter((t) => t !== tone);
    const randomTone = otherTones[Math.floor(Math.random() * otherTones.length)];
    const newHeadlines = generateHeadlines(product.trim(), audience.trim(), benefit.trim(), randomTone, existingTexts);
    if (newHeadlines.length === 0) {
      toast("Todas as variações já foram geradas. Tente mudar os parâmetros.");
      return;
    }
    setHeadlines((prev) => [...prev, ...newHeadlines]);
    toast.success(`+${newHeadlines.length} headlines adicionadas (Tom: ${randomTone})`);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Headline copiada!");
  };

  const copyAll = () => {
    const display = showFavoritesOnly ? headlines.filter((h) => favorites.has(h.id)) : headlines;
    const text = display.map((h) => h.text).join("\n");
    navigator.clipboard.writeText(text);
    toast.success(`${display.length} headlines copiadas!`);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-500/15 border-green-500/30";
    if (score >= 60) return "text-yellow-400 bg-yellow-500/15 border-yellow-500/30";
    return "text-orange-400 bg-orange-500/15 border-orange-500/30";
  };

  const displayHeadlines = showFavoritesOnly ? headlines.filter((h) => favorites.has(h.id)) : headlines;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerador de Headlines</h2>
        <p className="text-sm text-muted-foreground">Crie headlines irresistíveis para suas campanhas</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Produto / Serviço</Label>
            <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Fórmula Negócio Online" />
          </div>
          <div className="grid gap-2">
            <Label>Público-Alvo</Label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex: empreendedores iniciantes" />
          </div>
          <div className="grid gap-2">
            <Label>Benefício Principal</Label>
            <Input value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="Ex: ganhar dinheiro na internet" />
          </div>
          <div className="grid gap-2">
            <Label>Tom da Mensagem</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={generate} className="flex-1 sm:flex-none">
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar Headlines
          </Button>
          {headlines.length > 0 && (
            <>
              <Button variant="outline" onClick={generateMore}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Gerar Mais
              </Button>
              <Button variant="outline" onClick={copyAll}>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copiar Todas
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      {headlines.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {displayHeadlines.length} headline{displayHeadlines.length !== 1 ? "s" : ""}
              {showFavoritesOnly ? " favoritas" : " geradas"}
            </p>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star className="mr-1 h-4 w-4" />
              Favoritas ({[...favorites].filter((id) => headlines.some((h) => h.id === id)).length})
            </Button>
          </div>

          <div className="space-y-2">
            {displayHeadlines.map((headline, idx) => (
              <div key={headline.id} className="rounded-2xl border border-border bg-card/60 p-4 flex items-start gap-3 group hover:border-primary/30 transition-colors">
                <span className="text-xs text-muted-foreground font-mono w-6 pt-1 shrink-0 text-right">
                  {idx + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">{headline.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs ${scoreColor(headline.score)}`}>
                      <Zap className="h-3 w-3 mr-1" />
                      {headline.score}/100
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {headline.tone}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyText(headline.text)}
                    title="Copiar"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFavorite(headline.id)}
                    title={favorites.has(headline.id) ? "Remover favorito" : "Favoritar"}
                  >
                    {favorites.has(headline.id) ? (
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {displayHeadlines.length === 0 && showFavoritesOnly && (
            <div className="rounded-2xl border border-border bg-card/60 p-6 text-center text-muted-foreground">
              Nenhuma headline favoritada ainda. Clique na estrela para salvar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
