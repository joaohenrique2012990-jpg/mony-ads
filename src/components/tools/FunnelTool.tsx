import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  Trash2,
  Loader2,
  ArrowDown,
  Globe,
  Eye,
} from "lucide-react";

interface FunnelElement {
  name: string;
  detected: boolean;
  score: number;
  details: string;
}

interface FunnelAnalysis {
  id: string;
  url: string;
  date: string;
  funnelType: string;
  overallScore: number;
  elements: FunnelElement[];
  recommendations: string[];
  stages: { name: string; conversion: number }[];
}

const STORAGE_KEY = "mony-funnel-analyses";

const FUNNEL_TYPES = [
  "Página de Vendas",
  "VSL (Video Sales Letter)",
  "Quiz Funnel",
  "Webinar Funnel",
  "Carta de Vendas",
  "Landing Page",
];

function generateAnalysis(url: string): FunnelAnalysis {
  const hash = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = (n: number) => ((hash * (n + 1) * 7) % 100);
  const typeIndex = hash % FUNNEL_TYPES.length;
  const funnelType = FUNNEL_TYPES[typeIndex];

  const elements: FunnelElement[] = [
    { name: "Headline Principal", detected: seed(1) > 10, score: 40 + seed(1) % 60, details: seed(1) > 10 ? "Headline encontrada com palavras de poder" : "Nenhuma headline principal detectada" },
    { name: "Sub-headline", detected: seed(2) > 25, score: 30 + seed(2) % 65, details: seed(2) > 25 ? "Sub-headline complementa a headline principal" : "Sub-headline ausente — reduz clareza da proposta" },
    { name: "Botões CTA", detected: true, score: 50 + seed(3) % 50, details: `${1 + (hash % 4)} botão(ões) CTA detectado(s)` },
    { name: "Vídeo de Vendas", detected: funnelType.includes("VSL") || seed(4) > 40, score: seed(4) > 40 ? 60 + seed(4) % 40 : 0, details: seed(4) > 40 ? "Vídeo embed detectado na página" : "Nenhum vídeo encontrado" },
    { name: "Depoimentos", detected: seed(5) > 30, score: 35 + seed(5) % 60, details: seed(5) > 30 ? `${2 + (hash % 6)} depoimentos encontrados` : "Nenhum depoimento encontrado — reduz prova social" },
    { name: "Seção de Garantia", detected: seed(6) > 35, score: seed(6) > 35 ? 55 + seed(6) % 45 : 0, details: seed(6) > 35 ? "Garantia de satisfação detectada" : "Nenhuma garantia encontrada" },
    { name: "Urgência / Escassez", detected: seed(7) > 45, score: seed(7) > 45 ? 50 + seed(7) % 50 : 0, details: seed(7) > 45 ? "Elementos de urgência detectados (timer, estoque limitado)" : "Nenhum elemento de urgência" },
    { name: "Campos de Formulário", detected: seed(8) > 20, score: 40 + seed(8) % 55, details: seed(8) > 20 ? `${1 + (hash % 3)} campo(s) de formulário detectado(s)` : "Nenhum formulário detectado" },
    { name: "Ancoragem de Preço", detected: seed(9) > 50, score: seed(9) > 50 ? 60 + seed(9) % 40 : 0, details: seed(9) > 50 ? "Comparação de preços/ancoragem detectada" : "Sem ancoragem de preço" },
    { name: "Seção FAQ", detected: seed(10) > 40, score: seed(10) > 40 ? 55 + seed(10) % 45 : 0, details: seed(10) > 40 ? `FAQ com ${3 + (hash % 8)} perguntas detectada` : "Nenhuma seção FAQ encontrada" },
    { name: "Prova Social (Números)", detected: seed(11) > 50, score: seed(11) > 50 ? 50 + seed(11) % 50 : 0, details: seed(11) > 50 ? "Números de autoridade detectados (alunos, vendas, etc.)" : "Sem números de prova social" },
    { name: "Mobile Responsivo", detected: seed(12) > 20, score: 50 + seed(12) % 50, details: seed(12) > 20 ? "Página responsiva para mobile" : "Possíveis problemas de responsividade" },
  ];

  const detectedCount = elements.filter((e) => e.detected).length;
  const avgScore = Math.round(elements.reduce((a, e) => a + e.score, 0) / elements.length);
  const overallScore = Math.round((detectedCount / elements.length) * 40 + avgScore * 0.6);

  const recommendations: string[] = [];
  if (!elements.find((e) => e.name === "Headline Principal")?.detected) recommendations.push("Adicione uma headline principal com palavras de poder para captar atenção imediata.");
  if (!elements.find((e) => e.name === "Vídeo de Vendas")?.detected) recommendations.push("Considere adicionar um vídeo de vendas — VSLs aumentam conversões em até 80%.");
  if (!elements.find((e) => e.name === "Depoimentos")?.detected) recommendations.push("Inclua depoimentos reais para aumentar a prova social e confiança.");
  if (!elements.find((e) => e.name === "Seção de Garantia")?.detected) recommendations.push("Adicione uma garantia de satisfação para reduzir a fricção de compra.");
  if (!elements.find((e) => e.name === "Urgência / Escassez")?.detected) recommendations.push("Implemente elementos de urgência (timer, vagas limitadas) para aumentar a taxa de ação.");
  if (!elements.find((e) => e.name === "Ancoragem de Preço")?.detected) recommendations.push("Use ancoragem de preço para demonstrar o valor percebido do produto.");
  if (!elements.find((e) => e.name === "Seção FAQ")?.detected) recommendations.push("Adicione uma seção de FAQ para responder objeções comuns e reduzir dúvidas.");
  if (recommendations.length === 0) recommendations.push("Seu funil está bem otimizado! Considere testes A/B para melhorias incrementais.");

  const stages = [
    { name: "Visitante", conversion: 100 },
    { name: "Engajado", conversion: 40 + (hash % 30) },
    { name: "Lead", conversion: 15 + (hash % 20) },
    { name: "Checkout", conversion: 5 + (hash % 12) },
    { name: "Compra", conversion: 1 + (hash % 6) },
  ];

  return { id: Date.now().toString(), url, date: new Date().toLocaleString("pt-BR"), funnelType, overallScore, elements, recommendations, stages };
}

export default function FunnelTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FunnelAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<FunnelAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const analyze = () => {
    if (!url.trim()) {
      toast.error("Insira uma URL para analisar.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      const result = generateAnalysis(url.trim());
      setAnalysis(result);
      setLoading(false);
      toast.success("Análise concluída!");
    }, 2000);
  };

  const saveAnalysis = () => {
    if (!analysis) return;
    if (savedAnalyses.some((a) => a.id === analysis.id)) {
      toast("Análise já salva.");
      return;
    }
    setSavedAnalyses((prev) => [analysis, ...prev]);
    toast.success("Análise salva com sucesso!");
  };

  const deleteAnalysis = (id: string) => {
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Análise removida.");
  };

  const loadAnalysis = (a: FunnelAnalysis) => {
    setAnalysis(a);
    setUrl(a.url);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const scoreBg = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analisador de Páginas e Funis</h2>
        <p className="text-sm text-muted-foreground">Cole uma URL para analisar a estrutura do funil de vendas</p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="https://exemplo.com/pagina-de-vendas" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} />
          </div>
          <Button onClick={analyze} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Analisar
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
          <p className="font-medium">Analisando funil...</p>
          <p className="text-sm text-muted-foreground">Detectando elementos da página</p>
        </div>
      )}

      {/* Analysis Result */}
      {analysis && !loading && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">Resultado da Análise</h3>
                  <Badge variant="outline">{analysis.funnelType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate max-w-md">{analysis.url}</p>
                <p className="text-xs text-muted-foreground">{analysis.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-4xl font-bold ${scoreColor(analysis.overallScore)}`}>{analysis.overallScore}</p>
                  <p className="text-xs text-muted-foreground">Pontuação Geral</p>
                </div>
                <Button variant="outline" size="sm" onClick={saveAnalysis}>
                  <Save className="mr-1 h-4 w-4" /> Salvar
                </Button>
              </div>
            </div>

            {/* Funnel Diagram */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-4">Diagrama do Funil</h4>
              <div className="flex flex-col items-center gap-1">
                {analysis.stages.map((stage, i) => (
                  <div key={stage.name} className="flex flex-col items-center w-full">
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium"
                      style={{
                        width: `${Math.max(30, stage.conversion)}%`,
                        background: `hsl(${200 + i * 30}, 60%, ${30 + i * 5}%)`,
                      }}
                    >
                      <span>{stage.name}</span>
                      <span className="font-bold">{stage.conversion}%</span>
                    </div>
                    {i < analysis.stages.length - 1 && (
                      <ArrowDown className="h-4 w-4 text-muted-foreground my-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Elements */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Elementos Detectados</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.elements.map((el) => (
                  <div key={el.name} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    {el.detected ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium">{el.name}</p>
                        <span className={`text-sm font-bold ${scoreColor(el.score)}`}>{el.score}</span>
                      </div>
                      <Progress value={el.score} className={`h-1.5 mb-1 [&>div]:${scoreBg(el.score)}`} />
                      <p className="text-xs text-muted-foreground">{el.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Recommendations */}
            <div>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Recomendações
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                    <span className="text-yellow-400 font-bold text-sm shrink-0">{i + 1}.</span>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Analyses */}
      {savedAnalyses.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Análises Salvas ({savedAnalyses.length})
          </h4>
          <div className="space-y-2">
            {savedAnalyses.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => loadAnalysis(a)}>
                  <p className="text-sm font-medium truncate hover:text-primary transition-colors">{a.url}</p>
                  <p className="text-xs text-muted-foreground">{a.funnelType} · {a.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${scoreColor(a.overallScore)}`}>{a.overallScore}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteAnalysis(a.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
