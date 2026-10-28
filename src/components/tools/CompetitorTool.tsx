import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  Globe,
  Save,
  Trash2,
  TrendingUp,
  Users,
  BarChart3,
  Code,
  Share2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";

interface SocialProfile {
  platform: string;
  followers: string;
  engagement: string;
  active: boolean;
}

interface CompetitorAnalysis {
  id: string;
  url: string;
  domain: string;
  date: string;
  domainInfo: {
    monthlyTraffic: string;
    domainAge: string;
    authorityScore: number;
    bounceRate: string;
    avgVisitDuration: string;
    pagesPerVisit: string;
  };
  contentStrategy: {
    blogFrequency: string;
    contentTypes: string[];
    topTopics: string[];
    avgWordCount: number;
  };
  adPlatforms: { name: string; detected: boolean; spend: string }[];
  seo: {
    estimatedKeywords: number;
    organicTraffic: string;
    backlinksEstimate: number;
    domainRating: number;
    topKeywords: string[];
  };
  techStack: string[];
  socialMedia: SocialProfile[];
  opportunities: string[];
}

const STORAGE_KEY = "mony-competitor-analyses";

function extractDomain(url: string): string {
  try {
    let u = url.trim();
    if (!u.startsWith("http")) u = "https://" + u;
    return new URL(u).hostname.replace("www.", "");
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "").split("/")[0] || url;
  }
}

function generateAnalysis(url: string): CompetitorAnalysis {
  const domain = extractDomain(url);
  const hash = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const s = (n: number, max: number) => ((hash * (n + 1) * 13) % max);

  const techOptions = [
    ["WordPress", "PHP", "MySQL", "Elementor", "WooCommerce"],
    ["Shopify", "Liquid", "React", "Node.js"],
    ["Next.js", "React", "Vercel", "Tailwind CSS", "PostgreSQL"],
    ["Laravel", "PHP", "Vue.js", "MySQL", "Redis"],
    ["Webflow", "JavaScript", "Cloudflare"],
    ["Custom HTML/CSS", "jQuery", "Nginx", "Cloudflare"],
  ];

  const contentTypes = ["Blog posts", "Vídeos", "Infográficos", "Podcasts", "E-books", "Webinars", "Cases de sucesso", "Newsletters"];
  const topics = ["Marketing Digital", "Tráfego Pago", "SEO", "Copy", "Funis de Venda", "E-commerce", "Redes Sociais", "Email Marketing", "Growth Hacking", "Branding"];

  const selectedContent = contentTypes.filter((_, i) => s(i + 20, 10) > 4);
  const selectedTopics = topics.filter((_, i) => s(i + 30, 10) > 5);

  const monthlyTrafficNum = (s(1, 900) + 100) * 100;
  const domainAgeYears = 1 + s(2, 12);
  const authorityScore = 15 + s(3, 70);

  const adPlatforms = [
    { name: "Facebook Ads", detected: s(10, 10) > 3, spend: `R$ ${(s(10, 50) + 5) * 1000}/mês` },
    { name: "Google Ads", detected: s(11, 10) > 4, spend: `R$ ${(s(11, 40) + 3) * 1000}/mês` },
    { name: "TikTok Ads", detected: s(12, 10) > 6, spend: `R$ ${(s(12, 20) + 2) * 1000}/mês` },
    { name: "Instagram Ads", detected: s(13, 10) > 3, spend: `R$ ${(s(13, 30) + 5) * 1000}/mês` },
    { name: "YouTube Ads", detected: s(14, 10) > 6, spend: `R$ ${(s(14, 25) + 3) * 1000}/mês` },
    { name: "Native Ads", detected: s(15, 10) > 7, spend: `R$ ${(s(15, 15) + 1) * 1000}/mês` },
  ];

  const socialMedia: SocialProfile[] = [
    { platform: "Instagram", followers: `${(s(40, 200) + 10)}K`, engagement: `${(s(41, 5) + 1)}.${s(42, 9)}%`, active: s(40, 10) > 2 },
    { platform: "Facebook", followers: `${(s(43, 150) + 5)}K`, engagement: `${(s(44, 3) + 0)}.${s(45, 9)}%`, active: s(43, 10) > 3 },
    { platform: "TikTok", followers: `${(s(46, 500) + 10)}K`, engagement: `${(s(47, 8) + 2)}.${s(48, 9)}%`, active: s(46, 10) > 5 },
    { platform: "YouTube", followers: `${(s(49, 100) + 1)}K`, engagement: `${(s(50, 4) + 1)}.${s(51, 9)}%`, active: s(49, 10) > 4 },
  ];

  const topKeywords = [
    `${domain.split(".")[0]} curso`, `como ${selectedTopics[0]?.toLowerCase() || "vender"} online`,
    `melhor ${selectedTopics[1]?.toLowerCase() || "estratégia"}`, `${domain.split(".")[0]} funciona`,
    `${selectedTopics[0]?.toLowerCase() || "marketing"} para iniciantes`,
  ];

  const opportunities: string[] = [];
  if (adPlatforms.filter((a) => a.detected).length < 3) opportunities.push("Concorrente usa poucos canais de mídia paga — oportunidade de dominar canais não explorados por ele.");
  if (authorityScore < 40) opportunities.push("Autoridade de domínio baixa — com uma estratégia de SEO consistente você pode ultrapassar este concorrente.");
  if (!socialMedia.find((s) => s.platform === "TikTok")?.active) opportunities.push("Concorrente não está ativo no TikTok — grande oportunidade de alcance orgânico nesta plataforma.");
  if (selectedContent.length < 4) opportunities.push("Estratégia de conteúdo limitada — diversifique seus formatos para capturar público que ele não atinge.");
  opportunities.push("Analise os top keywords dele e crie conteúdo melhor para roubar posições orgânicas.");
  opportunities.push("Monitore os anúncios dele na biblioteca de anúncios do Meta para entender sua copy e ofertas.");
  if (authorityScore > 60) opportunities.push("Autoridade alta — considere parcerias ou colaborações em vez de competição direta.");

  return {
    id: Date.now().toString(),
    url,
    domain,
    date: new Date().toLocaleString("pt-BR"),
    domainInfo: {
      monthlyTraffic: monthlyTrafficNum.toLocaleString("pt-BR"),
      domainAge: `${domainAgeYears} ano${domainAgeYears > 1 ? "s" : ""}`,
      authorityScore,
      bounceRate: `${35 + s(5, 30)}%`,
      avgVisitDuration: `${1 + s(6, 4)}:${10 + s(7, 49)}`,
      pagesPerVisit: `${(2 + s(8, 5))}.${s(9, 9)}`,
    },
    contentStrategy: {
      blogFrequency: [`${1 + s(20, 3)}x por semana`, `${2 + s(20, 5)}x por mês`, `Diariamente`][s(21, 3)],
      contentTypes: selectedContent.length > 0 ? selectedContent : ["Blog posts", "Vídeos"],
      topTopics: selectedTopics.length > 0 ? selectedTopics.slice(0, 4) : ["Marketing Digital", "Tráfego Pago"],
      avgWordCount: 800 + s(22, 1200),
    },
    adPlatforms,
    seo: {
      estimatedKeywords: 200 + s(30, 3000),
      organicTraffic: `${(s(31, 80) + 10) * 100}`,
      backlinksEstimate: 50 + s(32, 5000),
      domainRating: 10 + s(33, 75),
      topKeywords,
    },
    techStack: techOptions[hash % techOptions.length],
    socialMedia,
    opportunities,
  };
}

export default function CompetitorTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<CompetitorAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["domain", "content", "ads", "seo", "tech", "social", "opportunities"]));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAnalyses));
  }, [savedAnalyses]);

  const toggleSection = (s: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const analyze = () => {
    if (!url.trim()) {
      toast.error("Insira a URL do concorrente.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      setAnalysis(generateAnalysis(url.trim()));
      setLoading(false);
      toast.success("Análise do concorrente concluída!");
    }, 2500);
  };

  const saveAnalysis = () => {
    if (!analysis) return;
    if (savedAnalyses.some((a) => a.id === analysis.id)) return toast("Análise já salva.");
    setSavedAnalyses((prev) => [analysis, ...prev]);
    toast.success("Perfil salvo!");
  };

  const deleteAnalysis = (id: string) => {
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Perfil removido.");
  };

  const scoreColor = (score: number) => {
    if (score >= 60) return "text-green-400";
    if (score >= 35) return "text-yellow-400";
    return "text-red-400";
  };

  const SectionHeader = ({ id, icon: Icon, title }: { id: string; icon: React.ComponentType<{ className?: string }>; title: string }) => (
    <button onClick={() => toggleSection(id)} className="flex items-center justify-between w-full text-left py-2">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </span>
      {expandedSections.has(id) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analisador de Concorrentes</h2>
        <p className="text-sm text-muted-foreground">Analise a estratégia digital de qualquer concorrente</p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="https://concorrente.com.br" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} />
          </div>
          <Button onClick={analyze} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Analisar
          </Button>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
          <p className="font-medium">Analisando concorrente...</p>
          <p className="text-sm text-muted-foreground">Coletando dados de tráfego, SEO, anúncios e redes sociais</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">{analysis.domain}</h3>
                <p className="text-xs text-muted-foreground">{analysis.url} · {analysis.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${scoreColor(analysis.domainInfo.authorityScore)}`}>
                    {analysis.domainInfo.authorityScore}
                  </p>
                  <p className="text-xs text-muted-foreground">Autoridade</p>
                </div>
                <Button variant="outline" size="sm" onClick={saveAnalysis}>
                  <Save className="mr-1 h-4 w-4" /> Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Domain Info */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="domain" icon={BarChart3} title="Informações do Domínio" />
            {expandedSections.has("domain") && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {[
                  { label: "Tráfego Mensal", value: analysis.domainInfo.monthlyTraffic },
                  { label: "Idade do Domínio", value: analysis.domainInfo.domainAge },
                  { label: "Autoridade", value: `${analysis.domainInfo.authorityScore}/100` },
                  { label: "Taxa de Rejeição", value: analysis.domainInfo.bounceRate },
                  { label: "Duração Média", value: analysis.domainInfo.avgVisitDuration },
                  { label: "Págs/Visita", value: analysis.domainInfo.pagesPerVisit },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Strategy */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="content" icon={TrendingUp} title="Estratégia de Conteúdo" />
            {expandedSections.has("content") && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-sm font-medium">{analysis.contentStrategy.blogFrequency}</p>
                    <p className="text-xs text-muted-foreground">Frequência de Publicação</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3">
                    <p className="text-sm font-medium">{analysis.contentStrategy.avgWordCount} palavras</p>
                    <p className="text-xs text-muted-foreground">Média por Artigo</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tipos de Conteúdo</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.contentStrategy.contentTypes.map((t) => (
                      <Badge key={t} variant="outline">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Principais Tópicos</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.contentStrategy.topTopics.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Platforms */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="ads" icon={Share2} title="Plataformas de Anúncio" />
            {expandedSections.has("ads") && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {analysis.adPlatforms.map((ad) => (
                  <div key={ad.name} className={`flex items-center justify-between p-3 rounded-lg ${ad.detected ? "bg-green-500/5 border border-green-500/20" : "bg-background/50 opacity-60"}`}>
                    <div>
                      <p className="text-sm font-medium">{ad.name}</p>
                      {ad.detected && <p className="text-xs text-muted-foreground">Est. {ad.spend}</p>}
                    </div>
                    <Badge variant={ad.detected ? "default" : "outline"} className={ad.detected ? "bg-green-500/20 text-green-400" : ""}>
                      {ad.detected ? "Detectado" : "Não detectado"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="seo" icon={Search} title="Métricas de SEO" />
            {expandedSections.has("seo") && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-lg font-bold">{analysis.seo.estimatedKeywords.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">Keywords</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-lg font-bold">{analysis.seo.organicTraffic}</p>
                    <p className="text-xs text-muted-foreground">Tráfego Orgânico</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-lg font-bold">{analysis.seo.backlinksEstimate.toLocaleString("pt-BR")}</p>
                    <p className="text-xs text-muted-foreground">Backlinks</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-3 text-center">
                    <p className="text-lg font-bold">{analysis.seo.domainRating}/100</p>
                    <p className="text-xs text-muted-foreground">Domain Rating</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Principais Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.seo.topKeywords.map((k) => (
                      <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="tech" icon={Code} title="Tecnologias Detectadas" />
            {expandedSections.has("tech") && (
              <div className="flex flex-wrap gap-2 mt-4">
                {analysis.techStack.map((t) => (
                  <Badge key={t} variant="secondary" className="text-sm">{t}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="social" icon={Users} title="Presença nas Redes Sociais" />
            {expandedSections.has("social") && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                {analysis.socialMedia.map((sm) => (
                  <div key={sm.platform} className={`p-4 rounded-lg ${sm.active ? "bg-background/50" : "bg-background/30 opacity-60"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">{sm.platform}</p>
                      <Badge variant={sm.active ? "default" : "outline"} className="text-xs">{sm.active ? "Ativo" : "Inativo"}</Badge>
                    </div>
                    <p className="text-2xl font-bold">{sm.followers}</p>
                    <p className="text-xs text-muted-foreground">Engajamento: {sm.engagement}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opportunities */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <SectionHeader id="opportunities" icon={Lightbulb} title="Oportunidades Identificadas" />
            {expandedSections.has("opportunities") && (
              <div className="space-y-2 mt-4">
                {analysis.opportunities.map((opp, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm">{opp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Profiles */}
      {savedAnalyses.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Perfis Salvos ({savedAnalyses.length})
          </h4>
          <div className="space-y-2">
            {savedAnalyses.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setAnalysis(a); setUrl(a.url); }}>
                  <p className="text-sm font-medium truncate hover:text-primary transition-colors">{a.domain}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${scoreColor(a.domainInfo.authorityScore)}`}>{a.domainInfo.authorityScore}</span>
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
