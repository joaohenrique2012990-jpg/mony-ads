import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  ChevronLeft,
  Edit,
  Save,
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  BarChart3,
  ArrowUpDown,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type CampaignPlatform = "Facebook" | "Google" | "Instagram" | "TikTok" | "YouTube";
type CampaignStatus = "Ativa" | "Pausada" | "Encerrada";
type BudgetType = "daily" | "total";
type SortField = "name" | "spend" | "revenue" | "roas" | "ctr" | "clicks";
type SortDirection = "asc" | "desc";

interface Campaign {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  budgetType: BudgetType;
  budget: number;
  startDate: string;
  endDate: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
}

const PLATFORMS: CampaignPlatform[] = ["Facebook", "Google", "Instagram", "TikTok", "YouTube"];
const STATUSES: CampaignStatus[] = ["Ativa", "Pausada", "Encerrada"];

const STATUS_COLORS: Record<CampaignStatus, string> = {
  Ativa: "bg-green-500/10 text-green-400 border-green-500/30",
  Pausada: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Encerrada: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

const PLATFORM_COLORS: Record<CampaignPlatform, string> = {
  Facebook: "bg-blue-600/10 text-blue-400 border-blue-600/30",
  Google: "bg-red-500/10 text-red-400 border-red-500/30",
  Instagram: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  TikTok: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  YouTube: "bg-red-600/10 text-red-500 border-red-600/30",
};

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatNumber(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toLocaleString("pt-BR");
}

function calcCTR(clicks: number, impressions: number): number {
  return impressions > 0 ? (clicks / impressions) * 100 : 0;
}

function calcCPC(spend: number, clicks: number): number {
  return clicks > 0 ? spend / clicks : 0;
}

function calcCPA(spend: number, conversions: number): number {
  return conversions > 0 ? spend / conversions : 0;
}

function calcROAS(revenue: number, spend: number): number {
  return spend > 0 ? revenue / spend : 0;
}

function calcROI(revenue: number, spend: number): number {
  return spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: generateId(), name: "Black Friday - Promoção Principal", platform: "Facebook", status: "Ativa",
    budgetType: "total", budget: 5000, startDate: "2024-11-15", endDate: "2024-11-30",
    spend: 3200, impressions: 450000, clicks: 12500, conversions: 380, revenue: 18500,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), name: "Remarketing - Carrinho Abandonado", platform: "Google", status: "Ativa",
    budgetType: "daily", budget: 150, startDate: "2024-10-01", endDate: "2024-12-31",
    spend: 4500, impressions: 280000, clicks: 8900, conversions: 520, revenue: 22000,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), name: "Stories - Lançamento Produto", platform: "Instagram", status: "Pausada",
    budgetType: "total", budget: 3000, startDate: "2024-11-01", endDate: "2024-11-20",
    spend: 2100, impressions: 320000, clicks: 9800, conversions: 210, revenue: 8400,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), name: "Vídeos Curtos - Awareness", platform: "TikTok", status: "Ativa",
    budgetType: "daily", budget: 200, startDate: "2024-11-10", endDate: "2024-12-10",
    spend: 1800, impressions: 890000, clicks: 15000, conversions: 180, revenue: 5400,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(), name: "YouTube Ads - Tutorial", platform: "YouTube", status: "Encerrada",
    budgetType: "total", budget: 2000, startDate: "2024-09-01", endDate: "2024-10-31",
    spend: 2000, impressions: 150000, clicks: 4500, conversions: 95, revenue: 4800,
    createdAt: new Date().toISOString(),
  },
];

export default function CampaignsTool() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [view, setView] = useState<"dashboard" | "detail">("dashboard");
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("mony-campaigns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setCampaigns(parsed);
        } else {
          setCampaigns(SAMPLE_CAMPAIGNS);
          localStorage.setItem("mony-campaigns", JSON.stringify(SAMPLE_CAMPAIGNS));
        }
      } catch {
        setCampaigns(SAMPLE_CAMPAIGNS);
      }
    } else {
      setCampaigns(SAMPLE_CAMPAIGNS);
      localStorage.setItem("mony-campaigns", JSON.stringify(SAMPLE_CAMPAIGNS));
    }
  }, []);

  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem("mony-campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const summary = useMemo(() => {
    const totalSpend = campaigns.reduce((a, c) => a + c.spend, 0);
    const totalRevenue = campaigns.reduce((a, c) => a + c.revenue, 0);
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const activeCampaigns = campaigns.filter((c) => c.status === "Ativa").length;
    const totalImpressions = campaigns.reduce((a, c) => a + c.impressions, 0);
    const totalClicks = campaigns.reduce((a, c) => a + c.clicks, 0);
    const totalConversions = campaigns.reduce((a, c) => a + c.conversions, 0);
    return { totalSpend, totalRevenue, avgROAS, activeCampaigns, totalImpressions, totalClicks, totalConversions };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    let result = campaigns.filter((c) => {
      const matchesPlatform = filterPlatform === "all" || c.platform === filterPlatform;
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      return matchesPlatform && matchesStatus;
    });

    result.sort((a, b) => {
      let valA: number | string;
      let valB: number | string;

      switch (sortField) {
        case "name": valA = a.name.toLowerCase(); valB = b.name.toLowerCase(); break;
        case "spend": valA = a.spend; valB = b.spend; break;
        case "revenue": valA = a.revenue; valB = b.revenue; break;
        case "roas": valA = calcROAS(a.revenue, a.spend); valB = calcROAS(b.revenue, b.spend); break;
        case "ctr": valA = calcCTR(a.clicks, a.impressions); valB = calcCTR(b.clicks, b.impressions); break;
        case "clicks": valA = a.clicks; valB = b.clicks; break;
        default: valA = a.name; valB = b.name;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [campaigns, filterPlatform, filterStatus, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function createCampaign() {
    const campaign: Campaign = {
      id: generateId(),
      name: "",
      platform: "Facebook",
      status: "Ativa",
      budgetType: "daily",
      budget: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };
    setCurrentCampaign(campaign);
    setIsEditing(true);
    setView("detail");
  }

  function saveCampaign() {
    if (!currentCampaign) return;
    if (!currentCampaign.name.trim()) {
      toast.error("Nome da campanha é obrigatório");
      return;
    }
    setCampaigns((prev) => {
      const idx = prev.findIndex((c) => c.id === currentCampaign.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = currentCampaign;
        return copy;
      }
      return [...prev, currentCampaign];
    });
    setIsEditing(false);
    toast.success("Campanha salva com sucesso!");
  }

  function deleteCampaign(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("Campanha excluída");
    if (currentCampaign?.id === id) {
      setView("dashboard");
      setCurrentCampaign(null);
    }
  }

  function updateField(field: keyof Campaign, value: unknown) {
    if (!currentCampaign) return;
    setCurrentCampaign({ ...currentCampaign, [field]: value });
  }

  function SortableHeader({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <TableHead
        className="cursor-pointer hover:text-foreground select-none"
        onClick={() => toggleSort(field)}
      >
        <span className="flex items-center gap-1">
          {children}
          {sortField === field && (
            <ArrowUpDown className="h-3 w-3" />
          )}
        </span>
      </TableHead>
    );
  }

  // Detail View
  if (view === "detail" && currentCampaign) {
    const ctr = calcCTR(currentCampaign.clicks, currentCampaign.impressions);
    const cpc = calcCPC(currentCampaign.spend, currentCampaign.clicks);
    const cpa = calcCPA(currentCampaign.spend, currentCampaign.conversions);
    const roas = calcROAS(currentCampaign.revenue, currentCampaign.spend);
    const roi = calcROI(currentCampaign.revenue, currentCampaign.spend);
    const budgetUsed = currentCampaign.budget > 0 ? (currentCampaign.spend / currentCampaign.budget) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => { setView("dashboard"); setIsEditing(false); }}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            ) : (
              <Button size="sm" onClick={saveCampaign}>
                <Save className="h-4 w-4 mr-1" /> Salvar
              </Button>
            )}
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteCampaign(currentCampaign.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "CTR", value: `${ctr.toFixed(2)}%`, icon: MousePointerClick },
            { label: "CPC", value: formatCurrency(cpc), icon: DollarSign },
            { label: "CPA", value: formatCurrency(cpa), icon: Target },
            { label: "ROAS", value: `${roas.toFixed(2)}x`, icon: TrendingUp },
            { label: "ROI", value: `${roi.toFixed(1)}%`, icon: BarChart3, color: roi > 0 ? "text-green-400" : "text-red-400" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-card/60 p-6 text-center">
              <kpi.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className={`text-xl font-bold ${kpi.color || ""}`}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Info */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold">Informações da Campanha</h3>
            <div>
              <Label>Nome</Label>
              {isEditing ? (
                <Input value={currentCampaign.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1" />
              ) : (
                <p className="text-lg font-semibold mt-1">{currentCampaign.name || "—"}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Plataforma</Label>
                {isEditing ? (
                  <Select value={currentCampaign.platform} onValueChange={(v) => updateField("platform", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1"><Badge className={`border ${PLATFORM_COLORS[currentCampaign.platform]}`}>{currentCampaign.platform}</Badge></div>
                )}
              </div>
              <div>
                <Label>Status</Label>
                {isEditing ? (
                  <Select value={currentCampaign.status} onValueChange={(v) => updateField("status", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1"><Badge className={`border ${STATUS_COLORS[currentCampaign.status]}`}>{currentCampaign.status}</Badge></div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Orçamento</Label>
                {isEditing ? (
                  <Select value={currentCampaign.budgetType} onValueChange={(v) => updateField("budgetType", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="total">Total</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm mt-1">{currentCampaign.budgetType === "daily" ? "Diário" : "Total"}</p>
                )}
              </div>
              <div>
                <Label>Orçamento (R$)</Label>
                {isEditing ? (
                  <Input type="number" value={currentCampaign.budget} onChange={(e) => updateField("budget", parseFloat(e.target.value) || 0)} className="mt-1" />
                ) : (
                  <p className="text-sm font-semibold mt-1">{formatCurrency(currentCampaign.budget)}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Início</Label>
                {isEditing ? (
                  <Input type="date" value={currentCampaign.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="mt-1" />
                ) : (
                  <p className="text-sm mt-1">{currentCampaign.startDate ? new Date(currentCampaign.startDate + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</p>
                )}
              </div>
              <div>
                <Label>Data Fim</Label>
                {isEditing ? (
                  <Input type="date" value={currentCampaign.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="mt-1" />
                ) : (
                  <p className="text-sm mt-1">{currentCampaign.endDate ? new Date(currentCampaign.endDate + "T00:00:00").toLocaleDateString("pt-BR") : "—"}</p>
                )}
              </div>
            </div>

            {/* Budget progress */}
            {currentCampaign.budget > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Orçamento utilizado</span>
                  <span className="font-medium">{Math.min(budgetUsed, 100).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(budgetUsed, 100)} className={`h-2 ${budgetUsed > 100 ? "[&>div]:bg-red-500" : ""}`} />
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold">Métricas</h3>
            {[
              { label: "Investimento (R$)", field: "spend" as const, value: currentCampaign.spend },
              { label: "Impressões", field: "impressions" as const, value: currentCampaign.impressions },
              { label: "Cliques", field: "clicks" as const, value: currentCampaign.clicks },
              { label: "Conversões", field: "conversions" as const, value: currentCampaign.conversions },
              { label: "Receita (R$)", field: "revenue" as const, value: currentCampaign.revenue },
            ].map((metric) => (
              <div key={metric.field}>
                <Label>{metric.label}</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={metric.value}
                    onChange={(e) => updateField(metric.field, parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm font-semibold mt-1">
                    {metric.field === "spend" || metric.field === "revenue"
                      ? formatCurrency(metric.value)
                      : formatNumber(metric.value)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual comparison bar */}
        {currentCampaign.spend > 0 && (
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-sm font-semibold mb-4">Investimento vs Receita</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Investimento</span>
                  <span>{formatCurrency(currentCampaign.spend)}</span>
                </div>
                <div className="h-6 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500/60 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.min((currentCampaign.spend / Math.max(currentCampaign.spend, currentCampaign.revenue)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Receita</span>
                  <span>{formatCurrency(currentCampaign.revenue)}</span>
                </div>
                <div className="h-6 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500/60 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.min((currentCampaign.revenue / Math.max(currentCampaign.spend, currentCampaign.revenue)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <DollarSign className="h-5 w-5 text-red-400 mb-2" />
          <p className="text-xl font-bold">{formatCurrency(summary.totalSpend)}</p>
          <p className="text-xs text-muted-foreground">Investimento Total</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <TrendingUp className="h-5 w-5 text-green-400 mb-2" />
          <p className="text-xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-xs text-muted-foreground">Receita Total</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <BarChart3 className="h-5 w-5 text-blue-400 mb-2" />
          <p className="text-xl font-bold">{summary.avgROAS.toFixed(2)}x</p>
          <p className="text-xs text-muted-foreground">ROAS Médio</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <Zap className="h-5 w-5 text-yellow-400 mb-2" />
          <p className="text-xl font-bold">{summary.activeCampaigns}</p>
          <p className="text-xs text-muted-foreground">Campanhas Ativas</p>
        </div>
      </div>

      {/* Additional Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <p className="text-lg font-bold">{formatNumber(summary.totalImpressions)}</p>
          <p className="text-xs text-muted-foreground">Impressões Totais</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <p className="text-lg font-bold">{formatNumber(summary.totalClicks)}</p>
          <p className="text-xs text-muted-foreground">Cliques Totais</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6 text-center">
          <p className="text-lg font-bold">{formatNumber(summary.totalConversions)}</p>
          <p className="text-xs text-muted-foreground">Conversões Totais</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Plataformas</SelectItem>
                {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createCampaign}>
            <Plus className="h-4 w-4 mr-1" /> Nova Campanha
          </Button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="text-lg font-semibold mb-4">Campanhas ({filteredCampaigns.length})</h3>
        {filteredCampaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma campanha encontrada.</p>
        ) : (
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="name">Nome</SortableHeader>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableHeader field="spend">Investimento</SortableHeader>
                  <SortableHeader field="clicks">Cliques</SortableHeader>
                  <SortableHeader field="ctr">CTR</SortableHeader>
                  <SortableHeader field="revenue">Receita</SortableHeader>
                  <SortableHeader field="roas">ROAS</SortableHeader>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const ctr = calcCTR(campaign.clicks, campaign.impressions);
                  const roas = calcROAS(campaign.revenue, campaign.spend);
                  return (
                    <TableRow
                      key={campaign.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => {
                        setCurrentCampaign({ ...campaign });
                        setIsEditing(false);
                        setView("detail");
                      }}
                    >
                      <TableCell className="font-medium max-w-[200px] truncate">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${PLATFORM_COLORS[campaign.platform]}`}>{campaign.platform}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border ${STATUS_COLORS[campaign.status]}`}>{campaign.status}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(campaign.spend)}</TableCell>
                      <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                      <TableCell>{ctr.toFixed(2)}%</TableCell>
                      <TableCell className="text-green-400">{formatCurrency(campaign.revenue)}</TableCell>
                      <TableCell>
                        <Badge variant={roas >= 1 ? "default" : "destructive"} className="text-xs">
                          {roas.toFixed(2)}x
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCampaign(campaign.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* Visual Campaign Comparison */}
      {filteredCampaigns.length > 1 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="text-sm font-semibold mb-4">Comparação de ROAS</h3>
          <div className="space-y-3">
            {filteredCampaigns
              .map((c) => ({ ...c, roas: calcROAS(c.revenue, c.spend) }))
              .sort((a, b) => b.roas - a.roas)
              .map((campaign) => {
                const maxRoas = Math.max(...filteredCampaigns.map((c) => calcROAS(c.revenue, c.spend)), 1);
                const pct = (campaign.roas / maxRoas) * 100;
                return (
                  <div key={campaign.id} className="flex items-center gap-3">
                    <span className="text-xs w-36 truncate">{campaign.name}</span>
                    <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${campaign.roas >= 1 ? "bg-green-500/60" : "bg-red-500/60"}`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-14 text-right ${campaign.roas >= 1 ? "text-green-400" : "text-red-400"}`}>
                      {campaign.roas.toFixed(2)}x
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
