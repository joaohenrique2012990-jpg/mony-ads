import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
  Settings2,
  Target,
  DollarSign,
  MousePointerClick,
  ShoppingCart,
  ArrowUpRight,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface CampaignMetrics {
  dailyBudget: number;
  cpc: number;
  ctr: number;
  conversionRate: number;
  averageTicket: number;
}

interface ScaleScenario {
  multiplier: number;
  label: string;
  newBudget: number;
  dailyClicks: number;
  dailyConversions: number;
  dailyRevenue: number;
  cpa: number;
  roas: number;
  profit: number;
  effectiveCtr: number;
  effectiveCvr: number;
}

type ScenarioMode = "realista" | "otimista" | "pessimista";

const STORAGE_KEY = "mony-scale-tool";

function loadState(): {
  metrics: CampaignMetrics;
  ctrDecay: number;
  cvrDecay: number;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    metrics: {
      dailyBudget: 100,
      cpc: 1.5,
      ctr: 3.0,
      conversionRate: 5.0,
      averageTicket: 150,
    },
    ctrDecay: 5,
    cvrDecay: 3,
  };
}

function saveState(
  metrics: CampaignMetrics,
  ctrDecay: number,
  cvrDecay: number
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ metrics, ctrDecay, cvrDecay })
  );
}

const MULTIPLIERS = [1, 2, 3, 5, 10];

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPercent(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + "%";
}

function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Calculate the decay factor for a given multiplier.
 * decayPercentPerDouble = how much (%) to lose per 2x of budget.
 * For multiplier m, effective = base * (1 - decay)^(log2(m))
 */
function applyDecay(
  baseValue: number,
  multiplier: number,
  decayPercentPerDouble: number
): number {
  if (multiplier <= 1) return baseValue;
  const doublings = Math.log2(multiplier);
  const factor = Math.pow(1 - decayPercentPerDouble / 100, doublings);
  return baseValue * factor;
}

export default function ScaleTool() {
  const initial = loadState();
  const [metrics, setMetrics] = useState<CampaignMetrics>(initial.metrics);
  const [ctrDecayBase, setCtrDecayBase] = useState(initial.ctrDecay);
  const [cvrDecayBase, setCvrDecayBase] = useState(initial.cvrDecay);
  const [mode, setMode] = useState<ScenarioMode>("realista");
  const [showSettings, setShowSettings] = useState(false);
  const [showBreakeven, setShowBreakeven] = useState(false);

  const persist = (m: CampaignMetrics, cd: number, cv: number) =>
    saveState(m, cd, cv);

  const updateMetric = (key: keyof CampaignMetrics, value: string) => {
    const num = parseFloat(value.replace(",", "."));
    const updated = { ...metrics, [key]: isNaN(num) ? 0 : num };
    setMetrics(updated);
    persist(updated, ctrDecayBase, cvrDecayBase);
  };

  // Effective decay based on mode
  const decayMultiplier =
    mode === "otimista" ? 0.5 : mode === "pessimista" ? 2 : 1;
  const effectiveCtrDecay = ctrDecayBase * decayMultiplier;
  const effectiveCvrDecay = cvrDecayBase * decayMultiplier;

  const scenarios: ScaleScenario[] = useMemo(() => {
    const { dailyBudget, cpc, ctr, conversionRate, averageTicket } = metrics;
    if (dailyBudget <= 0 || cpc <= 0) return [];

    return MULTIPLIERS.map((multiplier) => {
      const newBudget = dailyBudget * multiplier;
      const effCtr = applyDecay(ctr, multiplier, effectiveCtrDecay);
      const effCvr = applyDecay(conversionRate, multiplier, effectiveCvrDecay);

      // CPC tends to increase with more budget due to competition
      // We model this as inversely affected by CTR decay (lower CTR → higher effective CPC)
      const ctrRatio = effCtr / ctr;
      const effectiveCpc = ctrRatio > 0 ? cpc / ctrRatio : cpc;

      const dailyClicks = effectiveCpc > 0 ? newBudget / effectiveCpc : 0;
      const dailyConversions = dailyClicks * (effCvr / 100);
      const dailyRevenue = dailyConversions * averageTicket;
      const cpa = dailyConversions > 0 ? newBudget / dailyConversions : 0;
      const roas = newBudget > 0 ? dailyRevenue / newBudget : 0;
      const profit = dailyRevenue - newBudget;

      return {
        multiplier,
        label: multiplier === 1 ? "Atual" : `${multiplier}x`,
        newBudget,
        dailyClicks,
        dailyConversions,
        dailyRevenue,
        cpa,
        roas,
        profit,
        effectiveCtr: effCtr,
        effectiveCvr: effCvr,
      };
    });
  }, [metrics, effectiveCtrDecay, effectiveCvrDecay]);

  // Break-even calculations
  const breakeven = useMemo(() => {
    const { dailyBudget, cpc, averageTicket } = metrics;
    if (dailyBudget <= 0 || cpc <= 0 || averageTicket <= 0) return null;

    const dailyClicks = dailyBudget / cpc;
    // Break-even: revenue = budget → conversions * ticket = budget → conversions = budget / ticket
    const neededConversions = dailyBudget / averageTicket;
    const neededCvr =
      dailyClicks > 0 ? (neededConversions / dailyClicks) * 100 : 0;
    const maxCpa = averageTicket; // CPA must be <= ticket to break even
    const minRoas = 1.0;

    return {
      neededCvr,
      maxCpa,
      minRoas,
      neededConversions,
    };
  }, [metrics]);

  // Visual bar chart data
  const maxProfit = useMemo(() => {
    if (scenarios.length === 0) return 1;
    const absMax = Math.max(...scenarios.map((s) => Math.abs(s.profit)), 1);
    return absMax;
  }, [scenarios]);

  const modeLabel =
    mode === "otimista"
      ? "Otimista"
      : mode === "pessimista"
        ? "Pessimista"
        : "Realista";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Simulador de Escala</h2>
            <p className="text-sm text-muted-foreground">
              Projete resultados ao escalar seu orçamento de campanha
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings2 className="mr-1 h-4 w-4" />
            Ajustes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBreakeven(!showBreakeven)}
          >
            <Target className="mr-1 h-4 w-4" />
            Break-even
          </Button>
        </div>
      </div>

      {/* Input Metrics */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Métricas Atuais da Campanha
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <DollarSign className="h-3 w-3" /> Orçamento Diário (R$)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={metrics.dailyBudget || ""}
              onChange={(e) => updateMetric("dailyBudget", e.target.value)}
              placeholder="100.00"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <MousePointerClick className="h-3 w-3" /> CPC (R$)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={metrics.cpc || ""}
              onChange={(e) => updateMetric("cpc", e.target.value)}
              placeholder="1.50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <BarChart3 className="h-3 w-3" /> CTR (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={metrics.ctr || ""}
              onChange={(e) => updateMetric("ctr", e.target.value)}
              placeholder="3.0"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <ShoppingCart className="h-3 w-3" /> Taxa de Conversão (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              value={metrics.conversionRate || ""}
              onChange={(e) => updateMetric("conversionRate", e.target.value)}
              placeholder="5.0"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1 text-xs">
              <ArrowUpRight className="h-3 w-3" /> Ticket Médio (R$)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={metrics.averageTicket || ""}
              onChange={(e) => updateMetric("averageTicket", e.target.value)}
              placeholder="150.00"
            />
          </div>
        </div>
      </div>

      {/* Scenario Mode Toggle */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Modo do Cenário
          </h3>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {(["otimista", "realista", "pessimista"] as ScenarioMode[]).map(
              (m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    mode === m
                      ? m === "otimista"
                        ? "bg-green-500/20 text-green-400 shadow-sm"
                        : m === "pessimista"
                          ? "bg-red-500/20 text-red-400 shadow-sm"
                          : "bg-blue-500/20 text-blue-400 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "otimista"
                    ? "🌟 Otimista"
                    : m === "pessimista"
                      ? "⚠️ Pessimista"
                      : "📊 Realista"}
                </button>
              )
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {mode === "otimista" &&
            "Decaimento reduzido pela metade. Ideal para nichos com grande público disponível."}
          {mode === "realista" &&
            "Decaimento padrão baseado em benchmarks de mercado."}
          {mode === "pessimista" &&
            "Decaimento dobrado. Para mercados saturados ou públicos limitados."}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Decaimento CTR:{" "}
            <Badge variant="secondary">{formatPercent(effectiveCtrDecay)} por 2x</Badge>
          </span>
          <span>
            Decaimento CVR:{" "}
            <Badge variant="secondary">{formatPercent(effectiveCvrDecay)} por 2x</Badge>
          </span>
        </div>
      </div>

      {/* Decay Settings */}
      {showSettings && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Fatores de Decaimento (base — modo {modeLabel})
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Decaimento do CTR por 2x de orçamento</Label>
                <span className="font-mono text-sm font-bold">
                  {ctrDecayBase}%
                </span>
              </div>
              <Slider
                min={0}
                max={20}
                step={0.5}
                value={[ctrDecayBase]}
                onValueChange={([v]) => {
                  setCtrDecayBase(v);
                  persist(metrics, v, cvrDecayBase);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Quanto o CTR diminui a cada vez que o orçamento dobra
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Decaimento da Taxa de Conversão por 2x
                </Label>
                <span className="font-mono text-sm font-bold">
                  {cvrDecayBase}%
                </span>
              </div>
              <Slider
                min={0}
                max={20}
                step={0.5}
                value={[cvrDecayBase]}
                onValueChange={([v]) => {
                  setCvrDecayBase(v);
                  persist(metrics, ctrDecayBase, v);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Quanto a taxa de conversão diminui a cada vez que o orçamento
                dobra
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Break-even Card */}
      {showBreakeven && breakeven && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Target className="h-4 w-4" /> Análise de Break-even
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Para o orçamento atual de{" "}
            <strong>{formatCurrency(metrics.dailyBudget)}</strong>/dia, estas
            são as métricas mínimas para não ter prejuízo:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Taxa de Conversão Mín.
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {formatPercent(breakeven.neededCvr)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Atual: {formatPercent(metrics.conversionRate)}
                {metrics.conversionRate >= breakeven.neededCvr ? (
                  <CheckCircle2 className="ml-1 inline h-3 w-3 text-green-500" />
                ) : (
                  <AlertTriangle className="ml-1 inline h-3 w-3 text-red-500" />
                )}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">CPA Máximo</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {formatCurrency(breakeven.maxCpa)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                = Ticket Médio
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">ROAS Mínimo</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {breakeven.minRoas.toFixed(2)}x
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Receita ≥ Custo
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Conversões Mín./Dia
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-400">
                {formatNumber(breakeven.neededConversions, 2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Para cobrir o investimento
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {scenarios.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Projeção por Nível de Escala — Cenário {modeLabel}
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Escala</TableHead>
                  <TableHead className="text-right text-xs">
                    Orçamento/Dia
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Cliques/Dia
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Conversões/Dia
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Receita/Dia
                  </TableHead>
                  <TableHead className="text-right text-xs">CPA</TableHead>
                  <TableHead className="text-right text-xs">ROAS</TableHead>
                  <TableHead className="text-right text-xs">CTR Efet.</TableHead>
                  <TableHead className="text-right text-xs">CVR Efet.</TableHead>
                  <TableHead className="text-right text-xs">
                    Lucro/Dia
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((s) => {
                  const isProfitable = s.profit >= 0;
                  return (
                    <TableRow
                      key={s.multiplier}
                      className={
                        s.multiplier === 1
                          ? "bg-muted/30 font-medium"
                          : undefined
                      }
                    >
                      <TableCell>
                        <Badge
                          variant={s.multiplier === 1 ? "default" : "secondary"}
                          className="font-mono"
                        >
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(s.newBudget)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatNumber(s.dailyClicks)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatNumber(s.dailyConversions, 2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(s.dailyRevenue)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(s.cpa)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        <span
                          className={
                            s.roas >= 1 ? "text-green-400" : "text-red-400"
                          }
                        >
                          {s.roas.toFixed(2)}x
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatPercent(s.effectiveCtr)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {formatPercent(s.effectiveCvr)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-sm font-semibold ${
                            isProfitable ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isProfitable ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {formatCurrency(s.profit)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Visual Bar Chart */}
      {scenarios.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Lucro Diário por Nível de Escala
          </h3>
          <div className="space-y-3">
            {scenarios.map((s) => {
              const barWidth = Math.abs(s.profit) / maxProfit;
              const isProfitable = s.profit >= 0;
              return (
                <div key={s.multiplier} className="flex items-center gap-3">
                  <div className="w-12 shrink-0 text-right">
                    <Badge
                      variant={s.multiplier === 1 ? "default" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {s.label}
                    </Badge>
                  </div>
                  <div className="relative flex h-8 flex-1 items-center">
                    <div className="absolute inset-0 rounded-lg bg-muted/30" />
                    <div
                      className={`relative h-full rounded-lg transition-all duration-500 ${
                        isProfitable
                          ? "bg-gradient-to-r from-green-500/30 to-green-500/60"
                          : "bg-gradient-to-r from-red-500/30 to-red-500/60"
                      }`}
                      style={{ width: `${Math.max(barWidth * 100, 2)}%` }}
                    >
                      <span
                        className={`absolute right-2 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs font-semibold ${
                          isProfitable ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        {formatCurrency(s.profit)}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 shrink-0 text-right">
                    <span
                      className={`font-mono text-xs ${
                        s.roas >= 1 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {s.roas.toFixed(2)}x
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded bg-green-500/50" />{" "}
              Lucro
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded bg-red-500/50" />{" "}
              Prejuízo
            </span>
            <span className="ml-auto">ROAS à direita</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {scenarios.length > 1 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Best Scale */}
          {(() => {
            const bestScenario = scenarios
              .filter((s) => s.multiplier > 1)
              .reduce(
                (best, s) => (s.profit > best.profit ? s : best),
                scenarios[1]
              );
            return (
              <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Melhor Escala (Lucro)
                </p>
                <p className="mt-1 text-3xl font-bold text-green-400">
                  {bestScenario.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(bestScenario.profit)}/dia
                </p>
              </div>
            );
          })()}

          {/* Max ROAS */}
          {(() => {
            const bestRoas = scenarios.reduce((best, s) =>
              s.roas > best.roas ? s : best
            );
            return (
              <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
                <p className="text-xs text-muted-foreground">Melhor ROAS</p>
                <p className="mt-1 text-3xl font-bold text-blue-400">
                  {bestRoas.roas.toFixed(2)}x
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  no nível {bestRoas.label}
                </p>
              </div>
            );
          })()}

          {/* Revenue at max profitable scale */}
          {(() => {
            const profitable = scenarios.filter((s) => s.profit > 0);
            const maxProfitable =
              profitable.length > 0
                ? profitable.reduce((best, s) =>
                    s.multiplier > best.multiplier ? s : best
                  )
                : null;
            return (
              <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Escala Máx. Lucrativa
                </p>
                <p className="mt-1 text-3xl font-bold text-amber-400">
                  {maxProfitable ? maxProfitable.label : "—"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {maxProfitable
                    ? `${formatCurrency(maxProfitable.dailyRevenue)}/dia`
                    : "Nenhuma escala lucrativa"}
                </p>
              </div>
            );
          })()}

          {/* Profit growth from 1x to best */}
          {(() => {
            const current = scenarios[0];
            const best = scenarios
              .filter((s) => s.multiplier > 1)
              .reduce(
                (b, s) => (s.profit > b.profit ? s : b),
                scenarios[1]
              );
            const growth =
              current.profit > 0
                ? ((best.profit - current.profit) / current.profit) * 100
                : 0;
            return (
              <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Crescimento do Lucro
                </p>
                <p
                  className={`mt-1 text-3xl font-bold ${growth >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {growth >= 0 ? "+" : ""}
                  {formatNumber(growth, 0)}%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atual → {best.label}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Monthly Projection */}
      {scenarios.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Projeção Mensal (30 dias)
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Escala</TableHead>
                  <TableHead className="text-right text-xs">
                    Investimento/Mês
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Receita/Mês
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Lucro/Mês
                  </TableHead>
                  <TableHead className="text-right text-xs">
                    Conversões/Mês
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((s) => {
                  const monthlyProfit = s.profit * 30;
                  return (
                    <TableRow key={s.multiplier}>
                      <TableCell>
                        <Badge
                          variant={s.multiplier === 1 ? "default" : "secondary"}
                          className="font-mono"
                        >
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(s.newBudget * 30)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(s.dailyRevenue * 30)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-mono text-sm font-semibold ${
                            monthlyProfit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatCurrency(monthlyProfit)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatNumber(s.dailyConversions * 30, 0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
