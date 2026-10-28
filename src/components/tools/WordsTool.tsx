import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Eraser,
  Search,
  Info,
} from "lucide-react";
import { toast } from "sonner";

type RiskLevel = "high" | "medium" | "low";

interface FlaggedWord {
  word: string;
  category: string;
  risk: RiskLevel;
  alternative: string;
  platforms: string[];
}

const FLAGGED_WORDS: FlaggedWord[] = [
  // Health claims - HIGH
  { word: "cura", category: "Saúde", risk: "high", alternative: "auxilia no bem-estar", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "elimina", category: "Saúde", risk: "high", alternative: "ajuda a reduzir", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "tratamento", category: "Saúde", risk: "high", alternative: "cuidado complementar", platforms: ["Facebook", "Google"] },
  { word: "doença", category: "Saúde", risk: "high", alternative: "condição de saúde", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "remédio", category: "Saúde", risk: "high", alternative: "suplemento", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "medicamento", category: "Saúde", risk: "high", alternative: "produto natural", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "emagrecer garantido", category: "Saúde", risk: "high", alternative: "auxiliar no emagrecimento", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "perder peso rápido", category: "Saúde", risk: "high", alternative: "auxiliar na perda de peso", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "queima gordura", category: "Saúde", risk: "high", alternative: "auxiliar no metabolismo", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "seca barriga", category: "Saúde", risk: "high", alternative: "auxilia na redução de medidas", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "combate", category: "Saúde", risk: "medium", alternative: "contribui para", platforms: ["Facebook", "Google"] },
  { word: "previne", category: "Saúde", risk: "high", alternative: "pode contribuir para", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "diagnóstico", category: "Saúde", risk: "high", alternative: "avaliação", platforms: ["Facebook", "Google"] },
  { word: "terapia", category: "Saúde", risk: "medium", alternative: "acompanhamento", platforms: ["Facebook", "Google"] },
  { word: "receita médica", category: "Saúde", risk: "high", alternative: "orientação profissional", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "cirurgia", category: "Saúde", risk: "high", alternative: "procedimento", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "droga", category: "Saúde", risk: "high", alternative: "substância", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "mata vírus", category: "Saúde", risk: "high", alternative: "auxilia na proteção", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "antibiótico natural", category: "Saúde", risk: "high", alternative: "ingrediente natural", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "insulina", category: "Saúde", risk: "high", alternative: "níveis saudáveis", platforms: ["Facebook", "Google"] },
  { word: "diabetes", category: "Saúde", risk: "high", alternative: "saúde metabólica", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "câncer", category: "Saúde", risk: "high", alternative: "bem-estar geral", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "depressão", category: "Saúde", risk: "high", alternative: "bem-estar emocional", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "ansiedade", category: "Saúde", risk: "medium", alternative: "equilíbrio emocional", platforms: ["Facebook", "Google"] },
  { word: "detox", category: "Saúde", risk: "medium", alternative: "renovação", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "desintoxica", category: "Saúde", risk: "high", alternative: "renova", platforms: ["Facebook", "Google"] },

  // Income claims - HIGH
  { word: "ganhe dinheiro fácil", category: "Renda", risk: "high", alternative: "oportunidade de renda", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "renda garantida", category: "Renda", risk: "high", alternative: "potencial de renda", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "fique rico", category: "Renda", risk: "high", alternative: "construa seu patrimônio", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "lucro garantido", category: "Renda", risk: "high", alternative: "potencial de lucro", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "ganhos rápidos", category: "Renda", risk: "high", alternative: "oportunidade de crescimento", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "dinheiro fácil", category: "Renda", risk: "high", alternative: "oportunidade de ganhos", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "enriqueça", category: "Renda", risk: "high", alternative: "cresça financeiramente", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "renda extra garantida", category: "Renda", risk: "high", alternative: "possibilidade de renda extra", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "multiplique seu dinheiro", category: "Renda", risk: "high", alternative: "potencialize seus resultados", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "investimento sem risco", category: "Renda", risk: "high", alternative: "investimento com proteção", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "retorno garantido", category: "Renda", risk: "high", alternative: "potencial de retorno", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "liberdade financeira imediata", category: "Renda", risk: "high", alternative: "caminho para liberdade financeira", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "ganhe milhões", category: "Renda", risk: "high", alternative: "alcance seus objetivos financeiros", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "renda passiva garantida", category: "Renda", risk: "high", alternative: "possibilidade de renda passiva", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "esquema", category: "Renda", risk: "high", alternative: "método", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },

  // Prohibited/misleading - HIGH
  { word: "100% garantido", category: "Proibido", risk: "high", alternative: "alta confiabilidade", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "sem risco", category: "Proibido", risk: "high", alternative: "com segurança", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "o melhor", category: "Proibido", risk: "medium", alternative: "um dos melhores", platforms: ["Facebook", "Google"] },
  { word: "o único", category: "Proibido", risk: "medium", alternative: "um dos principais", platforms: ["Facebook", "Google"] },
  { word: "número 1", category: "Proibido", risk: "medium", alternative: "referência no mercado", platforms: ["Facebook", "Google"] },
  { word: "comprovado cientificamente", category: "Proibido", risk: "high", alternative: "baseado em estudos", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "aprovado pela anvisa", category: "Proibido", risk: "high", alternative: "produto regularizado", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "milagroso", category: "Proibido", risk: "high", alternative: "eficaz", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "mágico", category: "Proibido", risk: "high", alternative: "surpreendente", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "instantâneo", category: "Proibido", risk: "medium", alternative: "rápido", platforms: ["Facebook", "Google"] },
  { word: "perfeito", category: "Proibido", risk: "low", alternative: "excelente", platforms: ["Google"] },
  { word: "infalível", category: "Proibido", risk: "high", alternative: "confiável", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "grátis", category: "Proibido", risk: "medium", alternative: "sem custo adicional", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "de graça", category: "Proibido", risk: "medium", alternative: "incluso", platforms: ["Facebook", "Google"] },

  // Sensational - MEDIUM
  { word: "incrível", category: "Sensacionalismo", risk: "medium", alternative: "impressionante", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "inacreditável", category: "Sensacionalismo", risk: "medium", alternative: "surpreendente", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "chocante", category: "Sensacionalismo", risk: "medium", alternative: "revelador", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "segredo revelado", category: "Sensacionalismo", risk: "medium", alternative: "estratégia compartilhada", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "bomba", category: "Sensacionalismo", risk: "medium", alternative: "novidade", platforms: ["Facebook", "Instagram", "TikTok"] },
  { word: "absurdo", category: "Sensacionalismo", risk: "medium", alternative: "expressivo", platforms: ["Facebook", "Google"] },
  { word: "explosão", category: "Sensacionalismo", risk: "medium", alternative: "crescimento acelerado", platforms: ["Facebook", "Google", "TikTok"] },
  { word: "nunca antes visto", category: "Sensacionalismo", risk: "medium", alternative: "inovador", platforms: ["Facebook", "Google"] },
  { word: "urgente", category: "Sensacionalismo", risk: "medium", alternative: "importante", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "alerta", category: "Sensacionalismo", risk: "medium", alternative: "atenção", platforms: ["Facebook", "Google"] },
  { word: "destruir", category: "Sensacionalismo", risk: "medium", alternative: "superar", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "acabar com", category: "Sensacionalismo", risk: "low", alternative: "resolver", platforms: ["Facebook", "Google"] },
  { word: "revolucionário", category: "Sensacionalismo", risk: "low", alternative: "inovador", platforms: ["Facebook", "Google"] },
  { word: "sensacional", category: "Sensacionalismo", risk: "low", alternative: "excelente", platforms: ["Facebook", "Google"] },
  { word: "fantástico", category: "Sensacionalismo", risk: "low", alternative: "muito bom", platforms: ["Facebook", "Google"] },
  { word: "extraordinário", category: "Sensacionalismo", risk: "low", alternative: "diferenciado", platforms: ["Google"] },

  // Personal attributes - HIGH
  { word: "gordo", category: "Atributos Pessoais", risk: "high", alternative: "acima do peso ideal", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "gorda", category: "Atributos Pessoais", risk: "high", alternative: "acima do peso ideal", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "feio", category: "Atributos Pessoais", risk: "high", alternative: "pode melhorar sua aparência", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "feia", category: "Atributos Pessoais", risk: "high", alternative: "pode melhorar sua aparência", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "velho", category: "Atributos Pessoais", risk: "high", alternative: "maduro", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "velha", category: "Atributos Pessoais", risk: "high", alternative: "madura", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "pobre", category: "Atributos Pessoais", risk: "high", alternative: "em busca de crescimento", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "burro", category: "Atributos Pessoais", risk: "high", alternative: "em desenvolvimento", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "fracassado", category: "Atributos Pessoais", risk: "high", alternative: "em fase de aprendizado", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "preguiçoso", category: "Atributos Pessoais", risk: "high", alternative: "que busca praticidade", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "você é", category: "Atributos Pessoais", risk: "medium", alternative: "você pode ser", platforms: ["Facebook", "Google"] },
  { word: "seu problema", category: "Atributos Pessoais", risk: "medium", alternative: "esse desafio", platforms: ["Facebook", "Google"] },
  { word: "sua doença", category: "Atributos Pessoais", risk: "high", alternative: "essa condição", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "sua gordura", category: "Atributos Pessoais", risk: "high", alternative: "as medidas", platforms: ["Facebook", "Google", "Instagram", "TikTok"] },
  { word: "calvície", category: "Atributos Pessoais", risk: "medium", alternative: "saúde capilar", platforms: ["Facebook", "Google"] },
  { word: "acne", category: "Atributos Pessoais", risk: "medium", alternative: "cuidados com a pele", platforms: ["Facebook", "Google"] },
  { word: "rugas", category: "Atributos Pessoais", risk: "medium", alternative: "sinais do tempo", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "celulite", category: "Atributos Pessoais", risk: "medium", alternative: "textura da pele", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "estrias", category: "Atributos Pessoais", risk: "medium", alternative: "cuidados com a pele", platforms: ["Facebook", "Google"] },

  // Urgency abuse - LOW/MEDIUM
  { word: "última chance", category: "Urgência", risk: "medium", alternative: "aproveite a oportunidade", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "só hoje", category: "Urgência", risk: "medium", alternative: "por tempo limitado", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "vagas limitadas", category: "Urgência", risk: "low", alternative: "vagas disponíveis", platforms: ["Facebook", "Google"] },
  { word: "últimas unidades", category: "Urgência", risk: "low", alternative: "estoque limitado", platforms: ["Facebook", "Google"] },
  { word: "vai acabar", category: "Urgência", risk: "medium", alternative: "disponibilidade limitada", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "corra", category: "Urgência", risk: "low", alternative: "não perca", platforms: ["Facebook", "Google"] },
  { word: "agora ou nunca", category: "Urgência", risk: "medium", alternative: "aproveite agora", platforms: ["Facebook", "Google", "Instagram"] },
  { word: "restam poucas", category: "Urgência", risk: "low", alternative: "disponibilidade reduzida", platforms: ["Facebook", "Google"] },
  { word: "promoção relâmpago", category: "Urgência", risk: "low", alternative: "oferta especial", platforms: ["Facebook", "Google"] },
  { word: "imperdível", category: "Urgência", risk: "low", alternative: "excelente oportunidade", platforms: ["Facebook", "Google"] },
  { word: "não perca mais tempo", category: "Urgência", risk: "medium", alternative: "comece agora", platforms: ["Facebook", "Google"] },
  { word: "antes que acabe", category: "Urgência", risk: "low", alternative: "enquanto disponível", platforms: ["Facebook", "Google"] },
];

const RISK_COLORS: Record<RiskLevel, string> = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const RISK_BG: Record<RiskLevel, string> = {
  high: "bg-red-500/10 border-red-500/30",
  medium: "bg-yellow-500/10 border-yellow-500/30",
  low: "bg-blue-500/10 border-blue-500/30",
};

const RISK_LABELS: Record<RiskLevel, string> = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

const PLATFORMS = ["Facebook", "Google", "Instagram", "TikTok"] as const;

interface FoundWord {
  flaggedWord: FlaggedWord;
  startIndex: number;
  endIndex: number;
}

export default function WordsTool() {
  const [text, setText] = useState("");

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const lowerText = text.toLowerCase();
    const found: FoundWord[] = [];

    // Sort flagged words by length (longest first) to match longer phrases first
    const sorted = [...FLAGGED_WORDS].sort((a, b) => b.word.length - a.word.length);

    const coveredRanges: [number, number][] = [];

    for (const fw of sorted) {
      const wordLower = fw.word.toLowerCase();
      let searchFrom = 0;
      while (true) {
        const idx = lowerText.indexOf(wordLower, searchFrom);
        if (idx === -1) break;

        const endIdx = idx + wordLower.length;
        // Check if this range is already covered by a longer match
        const overlaps = coveredRanges.some(
          ([s, e]) => (idx >= s && idx < e) || (endIdx > s && endIdx <= e)
        );

        if (!overlaps) {
          found.push({ flaggedWord: fw, startIndex: idx, endIndex: endIdx });
          coveredRanges.push([idx, endIdx]);
        }
        searchFrom = idx + 1;
      }
    }

    // Sort by position
    found.sort((a, b) => a.startIndex - b.startIndex);

    // Calculate risk score
    const highCount = found.filter((f) => f.flaggedWord.risk === "high").length;
    const medCount = found.filter((f) => f.flaggedWord.risk === "medium").length;
    const lowCount = found.filter((f) => f.flaggedWord.risk === "low").length;
    const riskScore = Math.min(100, highCount * 20 + medCount * 10 + lowCount * 5);

    // Platform risk
    const platformRisk: Record<string, number> = {};
    for (const p of PLATFORMS) {
      const pFound = found.filter((f) => f.flaggedWord.platforms.includes(p));
      const pH = pFound.filter((f) => f.flaggedWord.risk === "high").length;
      const pM = pFound.filter((f) => f.flaggedWord.risk === "medium").length;
      const pL = pFound.filter((f) => f.flaggedWord.risk === "low").length;
      platformRisk[p] = Math.min(100, pH * 20 + pM * 10 + pL * 5);
    }

    // Unique flagged words
    const unique = Array.from(
      new Map(found.map((f) => [f.flaggedWord.word, f])).values()
    );

    return { found, riskScore, platformRisk, unique, highCount, medCount, lowCount };
  }, [text]);

  function buildHighlightedText() {
    if (!analysis || analysis.found.length === 0) return <span>{text}</span>;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (const f of analysis.found) {
      if (f.startIndex > lastIndex) {
        parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, f.startIndex)}</span>);
      }
      const colorClass =
        f.flaggedWord.risk === "high"
          ? "bg-red-500/20 text-red-400 underline decoration-red-500"
          : f.flaggedWord.risk === "medium"
            ? "bg-yellow-500/20 text-yellow-400 underline decoration-yellow-500"
            : "bg-blue-500/20 text-blue-400 underline decoration-blue-500";

      parts.push(
        <span
          key={`h-${f.startIndex}`}
          className={`${colorClass} rounded px-0.5 cursor-help`}
          title={`${f.flaggedWord.category} (${RISK_LABELS[f.flaggedWord.risk]}) → ${f.flaggedWord.alternative}`}
        >
          {text.slice(f.startIndex, f.endIndex)}
        </span>
      );
      lastIndex = f.endIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
  }

  function cleanText() {
    if (!analysis) return;
    let cleaned = text;
    // Sort by position descending to replace from end to start
    const sorted = [...analysis.found].sort((a, b) => b.startIndex - a.startIndex);
    for (const f of sorted) {
      const original = cleaned.slice(f.startIndex, f.endIndex);
      // Preserve capitalization of first letter
      let alt = f.flaggedWord.alternative;
      if (original[0] === original[0].toUpperCase()) {
        alt = alt.charAt(0).toUpperCase() + alt.slice(1);
      }
      cleaned = cleaned.slice(0, f.startIndex) + alt + cleaned.slice(f.endIndex);
    }
    setText(cleaned);
    toast.success("Texto limpo com sucesso!");
  }

  function getRiskColor(score: number) {
    if (score >= 60) return "text-red-500";
    if (score >= 30) return "text-yellow-500";
    return "text-green-500";
  }

  function getRiskProgressColor(score: number) {
    if (score >= 60) return "[&>div]:bg-red-500";
    if (score >= 30) return "[&>div]:bg-yellow-500";
    return "[&>div]:bg-green-500";
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <Label className="text-base font-semibold mb-3 block">
          Cole seu texto de anúncio abaixo
        </Label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o título e corpo do seu anúncio para análise..."
          rows={6}
          className="mb-3"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} caracteres · {text.trim() ? text.trim().split(/\s+/).length : 0} palavras
          </span>
          <div className="flex gap-2">
            {analysis && analysis.found.length > 0 && (
              <Button variant="outline" size="sm" onClick={cleanText}>
                <Eraser className="h-4 w-4 mr-1" /> Texto Limpo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(text);
                toast.success("Texto copiado!");
              }}
              disabled={!text}
            >
              <Copy className="h-4 w-4 mr-1" /> Copiar
            </Button>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Risk Score */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              {analysis.riskScore >= 60 ? (
                <ShieldAlert className="h-6 w-6 text-red-500" />
              ) : analysis.riskScore >= 30 ? (
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-green-500" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Pontuação de Risco</span>
                  <span className={`text-2xl font-bold ${getRiskColor(analysis.riskScore)}`}>
                    {analysis.riskScore}/100
                  </span>
                </div>
                <Progress value={analysis.riskScore} className={`h-2 ${getRiskProgressColor(analysis.riskScore)}`} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-red-500">{analysis.highCount}</p>
                <p className="text-xs text-muted-foreground">Alto Risco</p>
              </div>
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-yellow-500">{analysis.medCount}</p>
                <p className="text-xs text-muted-foreground">Médio Risco</p>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-blue-500">{analysis.lowCount}</p>
                <p className="text-xs text-muted-foreground">Baixo Risco</p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Platform Risk */}
            <h4 className="text-sm font-medium mb-3">Risco por Plataforma</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PLATFORMS.map((p) => {
                const score = analysis.platformRisk[p];
                return (
                  <div key={p} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{p}</span>
                      <span className={`text-xs font-bold ${getRiskColor(score)}`}>{score}</span>
                    </div>
                    <Progress value={score} className={`h-1.5 ${getRiskProgressColor(score)}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Highlighted text */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" /> Texto Analisado
            </h3>
            <div className="rounded-lg bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {buildHighlightedText()}
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Alto
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Médio
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Baixo
              </div>
            </div>
          </div>

          {/* Flagged Words Table */}
          {analysis.unique.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" /> Palavras Problemáticas Encontradas ({analysis.unique.length})
              </h3>
              <ScrollArea className="max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Palavra/Frase</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Risco</TableHead>
                      <TableHead>Alternativa Segura</TableHead>
                      <TableHead>Plataformas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.unique.map((f) => (
                      <TableRow key={f.flaggedWord.word}>
                        <TableCell className="font-medium">{f.flaggedWord.word}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{f.flaggedWord.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs border ${RISK_BG[f.flaggedWord.risk]} ${RISK_COLORS[f.flaggedWord.risk]}`}>
                            {RISK_LABELS[f.flaggedWord.risk]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-500 text-sm">{f.flaggedWord.alternative}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {f.flaggedWord.platforms.map((p) => (
                              <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">{p}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </>
      )}

      {text.trim() && analysis && analysis.found.length === 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <ShieldCheck className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-500 mb-1">Texto Aprovado!</h3>
          <p className="text-sm text-muted-foreground">
            Nenhuma palavra problemática encontrada. Seu anúncio está seguro para publicação.
          </p>
        </div>
      )}
    </div>
  );
}
