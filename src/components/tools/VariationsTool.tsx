import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Sparkles,
  LayoutGrid,
  List,
  Save,
  Trash2,
  FlaskConical,
} from "lucide-react";
import { toast } from "sonner";

interface AdInput {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

type Platform = "facebook" | "instagram" | "google" | "tiktok" | "youtube";
type Angle =
  | "curiosidade"
  | "dor"
  | "beneficio"
  | "social"
  | "urgencia"
  | "pergunta"
  | "estatistica"
  | "storytelling";

interface AdVariation {
  id: string;
  angle: Angle;
  angleLabel: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
}

interface SavedAdSet {
  id: string;
  name: string;
  platform: Platform;
  original: AdInput;
  variations: AdVariation[];
  savedAt: string;
}

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

const ANGLES: { value: Angle; label: string; emoji: string }[] = [
  { value: "curiosidade", label: "Curiosidade", emoji: "🤔" },
  { value: "dor", label: "Dor/Problema", emoji: "😩" },
  { value: "beneficio", label: "Benefício Direto", emoji: "✅" },
  { value: "social", label: "Social Proof", emoji: "👥" },
  { value: "urgencia", label: "Urgência/Escassez", emoji: "⏰" },
  { value: "pergunta", label: "Pergunta", emoji: "❓" },
  { value: "estatistica", label: "Estatística", emoji: "📊" },
  { value: "storytelling", label: "Storytelling", emoji: "📖" },
];

const STORAGE_KEY = "mony-variations-sets";

function genId() {
  return Math.random().toString(36).substring(2, 11);
}
function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function generateVariation(
  ad: AdInput,
  angle: Angle,
  _platform: Platform
): Omit<AdVariation, "id"> {
  const hl = ad.headline.trim();
  const pt = ad.primaryText.trim();
  const desc = ad.description.trim();
  const cta = ad.cta.trim() || "Saiba Mais";

  const angleEntry = ANGLES.find((a) => a.value === angle)!;

  const templates: Record<
    Angle,
    () => { headline: string; primaryText: string; description: string; cta: string }
  > = {
    curiosidade: () => {
      const headlines = [
        `O segredo por trás de: ${hl}`,
        `Você não vai acreditar: ${hl}`,
        `Descubra o que ninguém te conta sobre ${hl.toLowerCase()}`,
        `${hl} — o que estão escondendo de você`,
      ];
      const texts = [
        `Poucos sabem, mas ${pt.toLowerCase()} Descubra agora o que os especialistas recomendam.`,
        `Quer saber a verdade? ${pt} A resposta vai te surpreender.`,
        `${pt} E tem mais: o resultado é ainda melhor do que você imagina.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `${desc} Veja o que descobrimos.`,
        cta: pick(["Descobrir Agora", "Ver Segredo", "Quero Saber"]),
      };
    },
    dor: () => {
      const headlines = [
        `Cansado de ${hl.toLowerCase()}?`,
        `Pare de sofrer com ${hl.toLowerCase()}`,
        `Chega de ${hl.toLowerCase()} — existe solução`,
        `${hl} está te prejudicando?`,
      ];
      const texts = [
        `Sabemos como é frustrante: ${pt.toLowerCase()} Mas existe uma solução comprovada.`,
        `Se você está sofrendo com isso, não está sozinho. ${pt} Hora de mudar.`,
        `O problema: ${pt.toLowerCase()} A solução? Mais simples do que você imagina.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `${desc} Resolva hoje mesmo.`,
        cta: pick(["Resolver Agora", "Acabar com Isso", "Quero a Solução"]),
      };
    },
    beneficio: () => {
      const headlines = [
        `${hl} — Resultados Garantidos`,
        `Conquiste mais com ${hl.toLowerCase()}`,
        `${hl}: o benefício que você merece`,
        `Transforme sua vida com ${hl.toLowerCase()}`,
      ];
      const texts = [
        `Com isso, você vai: ${pt} Simples, direto e eficaz.`,
        `Benefício principal: ${pt} E os resultados aparecem rápido.`,
        `Imagine ter ${pt.toLowerCase()} Isso é totalmente possível.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `✅ ${desc}`,
        cta: pick(["Começar Agora", "Quero Isso", "Garantir Meu Acesso"]),
      };
    },
    social: () => {
      const nums = [
        "10.000+",
        "5.000+",
        "25.000+",
        "50.000+",
        "100.000+",
      ];
      const headlines = [
        `${pick(nums)} pessoas já aprovaram: ${hl}`,
        `Junte-se a ${pick(nums)} clientes satisfeitos`,
        `${hl} — aprovado por quem entende`,
        `Veja por que ${pick(nums)} pessoas escolheram ${hl.toLowerCase()}`,
      ];
      const texts = [
        `"${pt}" — Este é o feedback que recebemos todos os dias dos nossos clientes.`,
        `Milhares já transformaram sua realidade. ${pt} Você é o próximo?`,
        `Recomendado por especialistas e amado pelos clientes. ${pt}`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `⭐⭐⭐⭐⭐ ${desc}`,
        cta: pick(["Ver Depoimentos", "Fazer Parte", "Eu Também Quero"]),
      };
    },
    urgencia: () => {
      const headlines = [
        `🔥 ÚLTIMAS HORAS: ${hl}`,
        `⚠️ OFERTA LIMITADA: ${hl}`,
        `Só até meia-noite: ${hl}`,
        `${hl} — ÚLTIMA CHANCE!`,
      ];
      const texts = [
        `${pt} Mas atenção: essa oferta acaba em breve. Não fique de fora!`,
        `Restam poucas vagas. ${pt} Garanta a sua antes que acabe.`,
        `Oferta válida por tempo limitado! ${pt} Corra!`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `⏳ ${desc} — Válido por tempo limitado!`,
        cta: pick(["Garantir Agora", "Aproveitar Oferta", "Não Perder"]),
      };
    },
    pergunta: () => {
      const headlines = [
        `Você já experimentou ${hl.toLowerCase()}?`,
        `E se ${hl.toLowerCase()} fosse mais fácil?`,
        `Quer ${hl.toLowerCase()}? Veja como.`,
        `Sabia que ${hl.toLowerCase()} é possível?`,
      ];
      const texts = [
        `Já se perguntou por que algumas pessoas conseguem? ${pt} A resposta está aqui.`,
        `O que você faria se pudesse? ${pt} Descubra a resposta.`,
        `Qual é o maior obstáculo? ${pt} Nós temos a solução.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `${desc} Descubra a resposta.`,
        cta: pick(["Ver Resposta", "Quero Saber", "Descobrir"]),
      };
    },
    estatistica: () => {
      const pcts = ["97%", "89%", "93%", "78%", "85%"];
      const headlines = [
        `${pick(pcts)} dos clientes recomendam: ${hl}`,
        `Dados comprovam: ${hl} funciona`,
        `${hl} — resultados em números`,
        `Estudo revela: ${pick(pcts)} de aprovação para ${hl.toLowerCase()}`,
      ];
      const texts = [
        `Os números não mentem: ${pt} ${pick(pcts)} de satisfação entre nossos clientes.`,
        `Pesquisa mostra que ${pick(pcts)} das pessoas viram resultado. ${pt}`,
        `Baseado em dados reais: ${pt} O resultado fala por si.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `📈 ${desc}`,
        cta: pick(["Ver Resultados", "Conferir Dados", "Quero Provar"]),
      };
    },
    storytelling: () => {
      const headlines = [
        `Como ${hl.toLowerCase()} mudou tudo`,
        `A história por trás de ${hl.toLowerCase()}`,
        `De zero a ${hl.toLowerCase()} — uma jornada real`,
        `${hl}: a transformação começa aqui`,
      ];
      const texts = [
        `Tudo começou quando percebi que precisava de algo diferente. ${pt} E foi assim que encontrei a solução.`,
        `Eu também já estive onde você está agora. ${pt} Mas aí descobri algo que mudou tudo.`,
        `Essa é a história de quem decidiu agir. ${pt} O final? Melhor do que o esperado.`,
      ];
      return {
        headline: pick(headlines),
        primaryText: pick(texts),
        description: `${desc} — Conheça a história completa.`,
        cta: pick(["Ler História", "Ver Jornada", "Conhecer Mais"]),
      };
    },
  };

  const result = templates[angle]();
  return {
    angle,
    angleLabel: angleEntry.label,
    ...result,
    cta: result.cta || cta,
  };
}

export default function VariationsTool() {
  const [ad, setAd] = useState<AdInput>({
    headline: "",
    primaryText: "",
    description: "",
    cta: "",
  });
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [variations, setVariations] = useState<AdVariation[]>([]);
  const [savedSets, setSavedSets] = useState<SavedAdSet[]>([]);
  const [gridView, setGridView] = useState(true);
  const [showSaved, setShowSaved] = useState(false);
  const [abPairs, setAbPairs] = useState<[number, number][]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSavedSets(JSON.parse(saved));
    } catch {}
  }, []);

  const persistSets = (sets: SavedAdSet[]) => {
    setSavedSets(sets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
  };

  const handleGenerate = () => {
    if (!ad.headline.trim() || !ad.primaryText.trim()) {
      toast.error("Preencha pelo menos o título e o texto principal.");
      return;
    }
    const angles = [...ANGLES].sort(() => Math.random() - 0.5);
    const count = 5 + Math.floor(Math.random() * 4); // 5-8
    const selected = angles.slice(0, Math.min(count, angles.length));
    const vars: AdVariation[] = selected.map((a) => ({
      id: genId(),
      ...generateVariation(ad, a.value, platform),
    }));
    setVariations(vars);

    // Generate A/B test pairs
    const pairs: [number, number][] = [];
    if (vars.length >= 4) {
      pairs.push([0, 1]);
      pairs.push([2, 3]);
    } else if (vars.length >= 2) {
      pairs.push([0, 1]);
    }
    setAbPairs(pairs);

    toast.success(`${vars.length} variações geradas!`);
  };

  const handleCopy = (v: AdVariation) => {
    const text = `Título: ${v.headline}\nTexto: ${v.primaryText}\nDescrição: ${v.description}\nCTA: ${v.cta}`;
    navigator.clipboard.writeText(text);
    toast.success("Variação copiada!");
  };

  const handleSaveSet = () => {
    if (variations.length === 0) return;
    const newSet: SavedAdSet = {
      id: genId(),
      name: `${ad.headline.substring(0, 30)} — ${PLATFORMS.find((p) => p.value === platform)?.label}`,
      platform,
      original: ad,
      variations,
      savedAt: new Date().toLocaleString("pt-BR"),
    };
    persistSets([newSet, ...savedSets]);
    toast.success("Conjunto de anúncios salvo!");
  };

  const platformLabel = PLATFORMS.find((p) => p.value === platform)?.label || "";

  const AdCard = ({ v, compact }: { v: AdVariation; compact?: boolean }) => {
    const angleInfo = ANGLES.find((a) => a.value === v.angle);
    return (
      <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {angleInfo?.emoji} {v.angleLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {platformLabel}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-sm">{v.headline}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {v.primaryText}
          </p>
          {!compact && (
            <p className="text-xs text-muted-foreground">{v.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <Badge className="text-xs">{v.cta}</Badge>
          <Button variant="ghost" size="sm" onClick={() => handleCopy(v)}>
            <Copy className="h-3 w-3 mr-1" /> Copiar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Variações de Anúncios</h2>
          </div>
          <Button
            variant={showSaved ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSaved(!showSaved)}
          >
            <Save className="h-4 w-4 mr-1" />
            Salvos ({savedSets.length})
          </Button>
        </div>

        {showSaved ? (
          <ScrollArea className="max-h-[500px]">
            <div className="space-y-4">
              {savedSets.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum conjunto salvo.
                </p>
              ) : (
                savedSets.map((set) => (
                  <div
                    key={set.id}
                    className="rounded-xl border border-border bg-background/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{set.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {set.variations.length} variações • {set.savedAt}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          persistSets(savedSets.filter((s) => s.id !== set.id));
                          toast("Removido.");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {set.variations.slice(0, 2).map((v) => (
                        <AdCard key={v.id} v={v} compact />
                      ))}
                      {set.variations.length > 2 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{set.variations.length - 2} mais variações
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Título (Headline)</Label>
                <Input
                  placeholder="Ex: Aprenda Marketing Digital"
                  value={ad.headline}
                  onChange={(e) => setAd({ ...ad, headline: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>CTA</Label>
                <Input
                  placeholder="Ex: Inscreva-se Grátis"
                  value={ad.cta}
                  onChange={(e) => setAd({ ...ad, cta: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Texto Principal</Label>
              <Textarea
                placeholder="Texto principal do anúncio..."
                value={ad.primaryText}
                onChange={(e) => setAd({ ...ad, primaryText: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                placeholder="Descrição curta do anúncio..."
                value={ad.description}
                onChange={(e) => setAd({ ...ad, description: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label>Plataforma</Label>
                <Select
                  value={platform}
                  onValueChange={(v) => setPlatform(v as Platform)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerate}>
                  <Sparkles className="h-4 w-4 mr-1" /> Gerar Variações
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {!showSaved && variations.length > 0 && (
        <>
          {/* Controls */}
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {variations.length} variações geradas
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-muted-foreground" />
                <Switch
                  checked={gridView}
                  onCheckedChange={setGridView}
                />
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveSet}>
                <Save className="h-4 w-4 mr-1" /> Salvar Conjunto
              </Button>
            </div>
          </div>

          {/* Variations Grid/List */}
          <div
            className={
              gridView
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "space-y-4"
            }
          >
            {variations.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-border bg-card/60 p-6"
              >
                <AdCard v={v} />
              </div>
            ))}
          </div>

          {/* A/B Test Suggestions */}
          {abPairs.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Sugestões de Teste A/B</h3>
              </div>
              <div className="space-y-4">
                {abPairs.map(([a, b], idx) => (
                  <div key={idx}>
                    <p className="text-sm font-semibold mb-2">
                      Teste {idx + 1}:{" "}
                      <span className="text-primary">
                        {variations[a]?.angleLabel}
                      </span>{" "}
                      vs{" "}
                      <span className="text-primary">
                        {variations[b]?.angleLabel}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-primary/30 p-3">
                        <Badge variant="outline" className="mb-2 text-xs">
                          A
                        </Badge>
                        <p className="text-xs font-semibold">
                          {variations[a]?.headline}
                        </p>
                      </div>
                      <div className="rounded-lg border border-primary/30 p-3">
                        <Badge variant="outline" className="mb-2 text-xs">
                          B
                        </Badge>
                        <p className="text-xs font-semibold">
                          {variations[b]?.headline}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Esses ângulos contrastantes geralmente geram bons
                      insights de performance.
                    </p>
                    {idx < abPairs.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
