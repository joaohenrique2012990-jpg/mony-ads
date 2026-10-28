import { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Star,
  StarOff,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Grid3X3,
  List,
  Flame,
  TrendingUp,
  CheckCircle2,
  Compass,
  Layers,
  Facebook,
  Percent,
  SlidersHorizontal,
  DollarSign,
  ShoppingCart,
  Calculator,
} from "lucide-react";

export interface LowTicketOffer {
  id: string;
  name: string;
  niche: string;
  subniche: string;
  country: string;
  network: "Kiwify" | "PerfectPay" | "Kirvano" | "Braip" | "Hotmart" | "Monetizze" | "Eduzz";
  frontPrice: number; // Preço de entrada: R$ 19, R$ 27, R$ 37, etc.
  commissionPercent: number; // % comissão afiliado (geralmente 65% - 85%)
  commissionAmount: number; // R$ comissão no front
  hasOrderBump: boolean;
  orderBumpPrice: number;
  hasUpsell: boolean;
  upsellPrice: number;
  estimatedAov: number; // Ticket Médio Real com Funil (AOV)
  estimatedCpaFb: number; // CPA médio recomendado no Facebook Ads
  estimatedRoas: number; // ROAS médio no Meta Ads
  marginPercent: number; // Margem líquida estimada
  activeAdsCount: number; // Quantidade de criativos ativos na biblioteca de anúncios
  adFormat: "UGC" | "Estático" | "VSL Curta" | "Story Nativo" | "Carrossel";
  scalingStatus: "Escalando Alto 🔥" | "Tendência 🚀" | "Validada ✅" | "Oceano Azul 🌊";
  metaAdLibraryUrl: string; // Link da Biblioteca de Anúncios do Facebook
  salesPageUrl: string;
  affiliateUrl: string;
  isCustom?: boolean;
}

const COUNTRIES = ["Brasil", "EUA", "Portugal", "Espanha", "México"];

const NICHES = [
  "Emagrecimento & Saúde",
  "Renda Extra & Artesanato",
  "Confeitaria & Culinária",
  "Espiritualidade & Fé",
  "Relacionamento & Família",
  "Estética & Manicure",
  "Pets & Adestramento",
  "Maternidade & Bebês",
  "Desenvolvimento Pessoal",
];

const NETWORKS = [
  "Kiwify",
  "PerfectPay",
  "Kirvano",
  "Braip",
  "Hotmart",
  "Monetizze",
  "Eduzz",
];

const LOW_TICKET_OFFERS: LowTicketOffer[] = [
  {
    id: "1",
    name: "Manual das Marmitas Fit Congeladas",
    niche: "Renda Extra & Artesanato",
    subniche: "Marmitaria em Casa",
    country: "Brasil",
    network: "Kiwify",
    frontPrice: 19.9,
    commissionPercent: 80,
    commissionAmount: 15.92,
    hasOrderBump: true,
    orderBumpPrice: 14.9,
    hasUpsell: true,
    upsellPrice: 47.0,
    estimatedAov: 46.5,
    estimatedCpaFb: 11.2,
    estimatedRoas: 2.8,
    marginPercent: 72,
    activeAdsCount: 48,
    adFormat: "UGC",
    scalingStatus: "Escalando Alto 🔥",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=marmitas+fit+lucrativas",
    salesPageUrl: "https://kiwify.com.br",
    affiliateUrl: "https://kiwify.com.br",
  },
  {
    id: "2",
    name: "Protocolo Zero Barriga em 21 Dias",
    niche: "Emagrecimento & Saúde",
    subniche: "Chás Detox Noturnos",
    country: "Brasil",
    network: "PerfectPay",
    frontPrice: 27.0,
    commissionPercent: 75,
    commissionAmount: 20.25,
    hasOrderBump: true,
    orderBumpPrice: 19.9,
    hasUpsell: true,
    upsellPrice: 67.0,
    estimatedAov: 58.2,
    estimatedCpaFb: 14.5,
    estimatedRoas: 2.6,
    marginPercent: 68,
    activeAdsCount: 84,
    adFormat: "VSL Curta",
    scalingStatus: "Escalando Alto 🔥",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=protocolo+secatudo",
    salesPageUrl: "https://perfectpay.com.br",
    affiliateUrl: "https://perfectpay.com.br",
  },
  {
    id: "3",
    name: "Guia da Oração Restauradora dos Salmos",
    niche: "Espiritualidade & Fé",
    subniche: "Orações Diárias para Família",
    country: "Brasil",
    network: "Kiwify",
    frontPrice: 17.0,
    commissionPercent: 85,
    commissionAmount: 14.45,
    hasOrderBump: true,
    orderBumpPrice: 12.9,
    hasUpsell: true,
    upsellPrice: 37.0,
    estimatedAov: 38.4,
    estimatedCpaFb: 8.9,
    estimatedRoas: 3.2,
    marginPercent: 76,
    activeAdsCount: 35,
    adFormat: "Estático",
    scalingStatus: "Tendência 🚀",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=oracao+poderosa+salmos",
    salesPageUrl: "https://kiwify.com.br",
    affiliateUrl: "https://kiwify.com.br",
  },
  {
    id: "4",
    name: "Doces Finos e Trufas para Vender Hoje",
    niche: "Confeitaria & Culinária",
    subniche: "Faça e Venda no Bairro",
    country: "Brasil",
    network: "Kirvano",
    frontPrice: 24.9,
    commissionPercent: 80,
    commissionAmount: 19.92,
    hasOrderBump: true,
    orderBumpPrice: 17.0,
    hasUpsell: true,
    upsellPrice: 49.0,
    estimatedAov: 51.0,
    estimatedCpaFb: 12.8,
    estimatedRoas: 2.7,
    marginPercent: 71,
    activeAdsCount: 29,
    adFormat: "Story Nativo",
    scalingStatus: "Validada ✅",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=doces+gourmet+vender",
    salesPageUrl: "https://kirvano.com",
    affiliateUrl: "https://kirvano.com",
  },
  {
    id: "5",
    name: "Desfralde Noturno sem Trauma em 7 Dias",
    niche: "Maternidade & Bebês",
    subniche: "Rotina Materna Prática",
    country: "Brasil",
    network: "Hotmart",
    frontPrice: 37.0,
    commissionPercent: 70,
    commissionAmount: 25.9,
    hasOrderBump: true,
    orderBumpPrice: 19.9,
    hasUpsell: true,
    upsellPrice: 57.0,
    estimatedAov: 68.0,
    estimatedCpaFb: 16.0,
    estimatedRoas: 2.5,
    marginPercent: 64,
    activeAdsCount: 22,
    adFormat: "UGC",
    scalingStatus: "Tendência 🚀",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=desfralde+noturno+facil",
    salesPageUrl: "https://hotmart.com",
    affiliateUrl: "https://hotmart.com",
  },
  {
    id: "6",
    name: "Alongamento em Fibra de Vidro Express",
    niche: "Estética & Manicure",
    subniche: "Nail Designer Iniciante",
    country: "Brasil",
    network: "Braip",
    frontPrice: 34.9,
    commissionPercent: 75,
    commissionAmount: 26.17,
    hasOrderBump: true,
    orderBumpPrice: 21.0,
    hasUpsell: true,
    upsellPrice: 67.0,
    estimatedAov: 69.5,
    estimatedCpaFb: 17.5,
    estimatedRoas: 2.4,
    marginPercent: 62,
    activeAdsCount: 52,
    adFormat: "VSL Curta",
    scalingStatus: "Escalando Alto 🔥",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=unhas+fibra+de+vidro+curso",
    salesPageUrl: "https://braip.com",
    affiliateUrl: "https://braip.com",
  },
  {
    id: "7",
    name: "Manual do Adestramento Canino em Casa",
    niche: "Pets & Adestramento",
    subniche: "Xixi e Cocô no Lugar Certo",
    country: "Brasil",
    network: "Kiwify",
    frontPrice: 29.9,
    commissionPercent: 80,
    commissionAmount: 23.92,
    hasOrderBump: true,
    orderBumpPrice: 14.9,
    hasUpsell: true,
    upsellPrice: 47.0,
    estimatedAov: 54.3,
    estimatedCpaFb: 13.0,
    estimatedRoas: 2.9,
    marginPercent: 74,
    activeAdsCount: 38,
    adFormat: "UGC",
    scalingStatus: "Validada ✅",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=adestramento+xixi+lugar+certo",
    salesPageUrl: "https://kiwify.com.br",
    affiliateUrl: "https://kiwify.com.br",
  },
  {
    id: "8",
    name: "Adeus Dores na Coluna: 10 Minutos/Dia",
    niche: "Emagrecimento & Saúde",
    subniche: "Mobilidade e Alívio da Lombar",
    country: "Brasil",
    network: "Monetizze",
    frontPrice: 47.0,
    commissionPercent: 70,
    commissionAmount: 32.9,
    hasOrderBump: true,
    orderBumpPrice: 27.0,
    hasUpsell: true,
    upsellPrice: 77.0,
    estimatedAov: 82.0,
    estimatedCpaFb: 21.0,
    estimatedRoas: 2.3,
    marginPercent: 59,
    activeAdsCount: 65,
    adFormat: "Estático",
    scalingStatus: "Escalando Alto 🔥",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=alivio+dores+coluna+lombar",
    salesPageUrl: "https://monetizze.com.br",
    affiliateUrl: "https://monetizze.com.br",
  },
  {
    id: "9",
    name: "Pães Artesanais de Fermentação Natural",
    niche: "Confeitaria & Culinária",
    subniche: "Levain Caseiro para Iniciantes",
    country: "Brasil",
    network: "Eduzz",
    frontPrice: 22.0,
    commissionPercent: 80,
    commissionAmount: 17.6,
    hasOrderBump: true,
    orderBumpPrice: 15.0,
    hasUpsell: false,
    upsellPrice: 0,
    estimatedAov: 32.5,
    estimatedCpaFb: 9.8,
    estimatedRoas: 2.6,
    marginPercent: 66,
    activeAdsCount: 16,
    adFormat: "Story Nativo",
    scalingStatus: "Oceano Azul 🌊",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=paes+artesanais+fermentacao+natural",
    salesPageUrl: "https://eduzz.com",
    affiliateUrl: "https://eduzz.com",
  },
  {
    id: "10",
    name: "Frases que Cativam no WhatsApp",
    niche: "Relacionamento & Família",
    subniche: "Comunicação e Reconquista",
    country: "Brasil",
    network: "Kiwify",
    frontPrice: 27.0,
    commissionPercent: 85,
    commissionAmount: 22.95,
    hasOrderBump: true,
    orderBumpPrice: 17.0,
    hasUpsell: true,
    upsellPrice: 47.0,
    estimatedAov: 56.0,
    estimatedCpaFb: 12.5,
    estimatedRoas: 3.1,
    marginPercent: 77,
    activeAdsCount: 41,
    adFormat: "Carrossel",
    scalingStatus: "Tendência 🚀",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=mensagens+que+cativam+homens",
    salesPageUrl: "https://kiwify.com.br",
    affiliateUrl: "https://kiwify.com.br",
  },
  {
    id: "11",
    name: "Keto 14-Day Fast Shred Recipe Pack",
    niche: "Emagrecimento & Saúde",
    subniche: "Keto Easy Meals",
    country: "EUA",
    network: "Kiwify",
    frontPrice: 19.0,
    commissionPercent: 75,
    commissionAmount: 14.25,
    hasOrderBump: true,
    orderBumpPrice: 12.0,
    hasUpsell: true,
    upsellPrice: 39.0,
    estimatedAov: 42.0,
    estimatedCpaFb: 11.5,
    estimatedRoas: 2.7,
    marginPercent: 67,
    activeAdsCount: 56,
    adFormat: "UGC",
    scalingStatus: "Escalando Alto 🔥",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=keto+recipes+quick+fat+loss",
    salesPageUrl: "https://kiwify.com",
    affiliateUrl: "https://kiwify.com",
  },
  {
    id: "12",
    name: "Costura Criativa do Zero: Bolsas e Necessaires",
    niche: "Renda Extra & Artesanato",
    subniche: "Costura sem Mistério",
    country: "Brasil",
    network: "Kirvano",
    frontPrice: 37.0,
    commissionPercent: 80,
    commissionAmount: 29.6,
    hasOrderBump: true,
    orderBumpPrice: 19.0,
    hasUpsell: true,
    upsellPrice: 57.0,
    estimatedAov: 65.0,
    estimatedCpaFb: 15.0,
    estimatedRoas: 2.8,
    marginPercent: 73,
    activeAdsCount: 19,
    adFormat: "Estático",
    scalingStatus: "Oceano Azul 🌊",
    metaAdLibraryUrl: "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=costura+criativa+moldes+faceis",
    salesPageUrl: "https://kirvano.com",
    affiliateUrl: "https://kirvano.com",
  },
];

const STORAGE_KEY = "mony-lowticket-catalog-data";
const FAVORITES_KEY = "mony-lowticket-catalog-favorites";

type SortField = "marginPercent" | "estimatedRoas" | "estimatedAov" | "activeAdsCount" | "frontPrice";
type SortDir = "asc" | "desc";

export default function CatalogTool() {
  const [offers, setOffers] = useState<LowTicketOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : LOW_TICKET_OFFERS;
    } catch {
      return LOW_TICKET_OFFERS;
    }
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [search, setSearch] = useState("");
  const [filterNiche, setFilterNiche] = useState("all");
  const [filterNetwork, setFilterNetwork] = useState("all");
  const [filterTicketTier, setFilterTicketTier] = useState("all"); // 'micro' (<=20), 'sweet' (21-40), 'mid' (41-97)
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAdFormat, setFilterAdFormat] = useState("all");
  const [filterMinMargin, setFilterMinMargin] = useState("all"); // 'high' (>=70%), 'med' (>=60%)
  const [filterCountry, setFilterCountry] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [simDialogOpen, setSimDialogOpen] = useState(false);

  // Simulador rápido de margem no Facebook Ads
  const [simBudget, setSimBudget] = useState("100");
  const [simSelectedOffer, setSimSelectedOffer] = useState<LowTicketOffer | null>(null);

  const [newOffer, setNewOffer] = useState({
    name: "",
    niche: NICHES[0],
    subniche: "",
    country: "Brasil",
    network: "Kiwify" as LowTicketOffer["network"],
    frontPrice: "19.90",
    commissionPercent: "80",
    hasOrderBump: true,
    orderBumpPrice: "14.90",
    hasUpsell: true,
    upsellPrice: "47.00",
    estimatedCpaFb: "12.00",
    activeAdsCount: "25",
    adFormat: "UGC" as LowTicketOffer["adFormat"],
    scalingStatus: "Tendência 🚀" as LowTicketOffer["scalingStatus"],
    metaAdLibraryUrl: "",
    salesPageUrl: "",
    affiliateUrl: "",
  });

  const [sortField, setSortField] = useState<SortField>("marginPercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filteredOffers = useMemo(() => {
    let list = [...offers];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.niche.toLowerCase().includes(q) ||
          o.subniche.toLowerCase().includes(q) ||
          o.network.toLowerCase().includes(q)
      );
    }
    if (filterNiche !== "all") list = list.filter((o) => o.niche === filterNiche);
    if (filterNetwork !== "all") list = list.filter((o) => o.network === filterNetwork);
    if (filterCountry !== "all") list = list.filter((o) => o.country === filterCountry);
    if (filterStatus !== "all") list = list.filter((o) => o.scalingStatus === filterStatus);
    if (filterAdFormat !== "all") list = list.filter((o) => o.adFormat === filterAdFormat);

    if (filterTicketTier === "micro") list = list.filter((o) => o.frontPrice <= 20);
    else if (filterTicketTier === "sweet") list = list.filter((o) => o.frontPrice > 20 && o.frontPrice <= 37);
    else if (filterTicketTier === "mid") list = list.filter((o) => o.frontPrice > 37);

    if (filterMinMargin === "high") list = list.filter((o) => o.marginPercent >= 70);
    else if (filterMinMargin === "med") list = list.filter((o) => o.marginPercent >= 60);

    if (showFavoritesOnly) list = list.filter((o) => favorites.has(o.id));

    list.sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      return mult * (a[sortField] - b[sortField]);
    });
    return list;
  }, [
    offers,
    search,
    filterNiche,
    filterNetwork,
    filterCountry,
    filterStatus,
    filterAdFormat,
    filterTicketTier,
    filterMinMargin,
    showFavoritesOnly,
    sortField,
    sortDir,
    favorites,
  ]);

  const addOffer = () => {
    if (!newOffer.name || !newOffer.subniche) {
      toast.error("Preencha o nome e o subnicho da oferta.");
      return;
    }
    const front = parseFloat(newOffer.frontPrice) || 19.9;
    const commPct = parseFloat(newOffer.commissionPercent) || 80;
    const bump = newOffer.hasOrderBump ? parseFloat(newOffer.orderBumpPrice) || 0 : 0;
    const upsell = newOffer.hasUpsell ? parseFloat(newOffer.upsellPrice) || 0 : 0;
    const cpa = parseFloat(newOffer.estimatedCpaFb) || 12;

    // Cálculo automático de AOV no funil Low Ticket:
    // AOV aproximado = Front + (Bump * 35% adesão) + (Upsell * 18% adesão)
    const calcAov = Number((front + bump * 0.35 + upsell * 0.18).toFixed(1));
    const roas = Number((calcAov / (cpa > 0 ? cpa : 1)).toFixed(2));
    const commAmount = Number((front * (commPct / 100)).toFixed(2));
    const margin = Math.min(85, Math.max(45, Math.round(((calcAov - cpa) / calcAov) * 100)));

    const created: LowTicketOffer = {
      id: Date.now().toString(),
      name: newOffer.name,
      niche: newOffer.niche,
      subniche: newOffer.subniche,
      country: newOffer.country,
      network: newOffer.network,
      frontPrice: front,
      commissionPercent: commPct,
      commissionAmount: commAmount,
      hasOrderBump: newOffer.hasOrderBump,
      orderBumpPrice: bump,
      hasUpsell: newOffer.hasUpsell,
      upsellPrice: upsell,
      estimatedAov: calcAov,
      estimatedCpaFb: cpa,
      estimatedRoas: roas,
      marginPercent: margin,
      activeAdsCount: parseInt(newOffer.activeAdsCount, 10) || 15,
      adFormat: newOffer.adFormat,
      scalingStatus: newOffer.scalingStatus,
      metaAdLibraryUrl:
        newOffer.metaAdLibraryUrl ||
        `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=${encodeURIComponent(
          newOffer.name
        )}`,
      salesPageUrl: newOffer.salesPageUrl || "#",
      affiliateUrl: newOffer.affiliateUrl || "#",
      isCustom: true,
    };

    setOffers((prev) => [created, ...prev]);
    setDialogOpen(false);
    toast.success("Nova oferta de Low Ticket adicionada ao catálogo!");
  };

  const copyToClipboard = (txt: string, msg: string) => {
    navigator.clipboard.writeText(txt);
    toast.success(msg);
  };

  const openSimulator = (offer: LowTicketOffer) => {
    setSimSelectedOffer(offer);
    setSimDialogOpen(true);
  };

  // Simulação de lucro diário no Facebook Ads para Low Ticket
  const simResults = useMemo(() => {
    if (!simSelectedOffer) return null;
    const dailySpend = parseFloat(simBudget) || 100;
    const cpa = simSelectedOffer.estimatedCpaFb > 0 ? simSelectedOffer.estimatedCpaFb : 12;
    const estimatedConversions = Math.max(1, Math.round(dailySpend / cpa));
    const grossRevenue = estimatedConversions * simSelectedOffer.estimatedAov;
    const netProfit = grossRevenue - dailySpend;
    const roas = grossRevenue / (dailySpend > 0 ? dailySpend : 1);
    const margin = ((grossRevenue - dailySpend) / (grossRevenue > 0 ? grossRevenue : 1)) * 100;

    return {
      dailySpend,
      estimatedConversions,
      grossRevenue,
      netProfit,
      roas,
      margin,
    };
  }, [simSelectedOffer, simBudget]);

  return (
    <div className="space-y-6">
      {/* Top Banner de Posicionamento */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card/80 to-accent/10 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
                FOCO EM LOW TICKET
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                Meta / Facebook Ads
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Catálogo de Ofertas de Alta Margem</h2>
            <p className="text-sm text-muted-foreground">
              Minerador de ofertas validadas de ticket baixo (R$ 10 a R$ 97) com funil de alta conversão (Order Bump + Upsell) prontas para escalar no Facebook Ads.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-brand shadow-glow">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Cadastrar Oferta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-primary" />
                    Cadastrar Oferta Low Ticket
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-3 text-sm">
                  <div className="grid gap-1.5">
                    <Label>Nome do Produto / Oferta *</Label>
                    <Input
                      placeholder="Ex: Manual das Marmitas Fit Congeladas"
                      value={newOffer.name}
                      onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label>Nicho Principal *</Label>
                      <Select
                        value={newOffer.niche}
                        onValueChange={(v) => setNewOffer({ ...newOffer, niche: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NICHES.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Subnicho / Ângulo *</Label>
                      <Input
                        placeholder="Ex: Renda com Marmitaria em Casa"
                        value={newOffer.subniche}
                        onChange={(e) => setNewOffer({ ...newOffer, subniche: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-1.5">
                      <Label>Plataforma *</Label>
                      <Select
                        value={newOffer.network}
                        onValueChange={(v: LowTicketOffer["network"]) =>
                          setNewOffer({ ...newOffer, network: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NETWORKS.map((net) => (
                            <SelectItem key={net} value={net}>
                              {net}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>País *</Label>
                      <Select
                        value={newOffer.country}
                        onValueChange={(v) => setNewOffer({ ...newOffer, country: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Status de Escala *</Label>
                      <Select
                        value={newOffer.scalingStatus}
                        onValueChange={(v: LowTicketOffer["scalingStatus"]) =>
                          setNewOffer({ ...newOffer, scalingStatus: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Escalando Alto 🔥">Escalando Alto 🔥</SelectItem>
                          <SelectItem value="Tendência 🚀">Tendência 🚀</SelectItem>
                          <SelectItem value="Validada ✅">Validada ✅</SelectItem>
                          <SelectItem value="Oceano Azul 🌊">Oceano Azul 🌊</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-muted/40 space-y-3">
                    <p className="font-semibold text-xs text-primary uppercase tracking-wide">
                      Estrutura de Preço & Funil Low Ticket
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="grid gap-1">
                        <Label>Preço Front (R$)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="19.90"
                          value={newOffer.frontPrice}
                          onChange={(e) => setNewOffer({ ...newOffer, frontPrice: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label>Comissão (%)</Label>
                        <Input
                          type="number"
                          placeholder="80"
                          value={newOffer.commissionPercent}
                          onChange={(e) =>
                            setNewOffer({ ...newOffer, commissionPercent: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label>CPA Meta Ads (R$)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="12.00"
                          value={newOffer.estimatedCpaFb}
                          onChange={(e) =>
                            setNewOffer({ ...newOffer, estimatedCpaFb: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                      <div className="grid gap-1">
                        <Label>Order Bump (R$)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="14.90"
                          value={newOffer.orderBumpPrice}
                          onChange={(e) =>
                            setNewOffer({ ...newOffer, orderBumpPrice: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label>Upsell 1-Click (R$)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="47.00"
                          value={newOffer.upsellPrice}
                          onChange={(e) =>
                            setNewOffer({ ...newOffer, upsellPrice: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label>Criativos Ativos na Biblioteca Meta</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 35"
                        value={newOffer.activeAdsCount}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, activeAdsCount: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Formato Vencedor</Label>
                      <Select
                        value={newOffer.adFormat}
                        onValueChange={(v: LowTicketOffer["adFormat"]) =>
                          setNewOffer({ ...newOffer, adFormat: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UGC">UGC (Pessoa Real)</SelectItem>
                          <SelectItem value="Estático">Estático / Imagem</SelectItem>
                          <SelectItem value="VSL Curta">VSL Curta (3 min)</SelectItem>
                          <SelectItem value="Story Nativo">Story Nativo</SelectItem>
                          <SelectItem value="Carrossel">Carrossel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label>Link da Biblioteca de Anúncios (Facebook Ad Library)</Label>
                    <Input
                      placeholder="https://www.facebook.com/ads/library/?..."
                      value={newOffer.metaAdLibraryUrl}
                      onChange={(e) =>
                        setNewOffer({ ...newOffer, metaAdLibraryUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label>Link da Página de Vendas</Label>
                      <Input
                        placeholder="https://..."
                        value={newOffer.salesPageUrl}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, salesPageUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Link de Afiliação</Label>
                      <Input
                        placeholder="https://..."
                        value={newOffer.affiliateUrl}
                        onChange={(e) =>
                          setNewOffer({ ...newOffer, affiliateUrl: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={addOffer} className="w-full bg-gradient-brand mt-2">
                    Salvar Oferta no Catálogo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Inteligentes para Facebook Ads & Low Ticket */}
      <div className="rounded-2xl border border-border bg-card/60 p-4 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 bg-background/50"
              placeholder="Buscar por nicho, subnicho, produto ou plataforma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="h-9"
            >
              <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Favoritos ({favorites.size})
            </Button>

            <div className="flex border rounded-lg overflow-hidden bg-background/50">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-9 rounded-none px-3"
                title="Visualização em Grade"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-9 rounded-none px-3"
                title="Visualização em Tabela"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Linha secundária de seletores de filtro */}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 pt-1">
          {/* Faixa de Preço Low Ticket */}
          <Select value={filterTicketTier} onValueChange={setFilterTicketTier}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <DollarSign className="mr-1 h-3.5 w-3.5 text-primary" />
              <SelectValue placeholder="Ticket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Preços</SelectItem>
              <SelectItem value="micro">Micro Ticket (até R$ 20)</SelectItem>
              <SelectItem value="sweet">Sweet Spot (R$ 21 - R$ 37)</SelectItem>
              <SelectItem value="mid">Low Ticket Alto (R$ 38 - R$ 97)</SelectItem>
            </SelectContent>
          </Select>

          {/* Margem no Facebook Ads */}
          <Select value={filterMinMargin} onValueChange={setFilterMinMargin}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <Percent className="mr-1 h-3.5 w-3.5 text-green-400" />
              <SelectValue placeholder="Margem Meta Ads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Margens</SelectItem>
              <SelectItem value="high">Alta Margem (≥ 70%)</SelectItem>
              <SelectItem value="med">Boa Margem (≥ 60%)</SelectItem>
            </SelectContent>
          </Select>

          {/* Nichos */}
          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <SelectValue placeholder="Nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Nichos</SelectItem>
              {NICHES.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status no Facebook */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <SelectValue placeholder="Momento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Momentos</SelectItem>
              <SelectItem value="Escalando Alto 🔥">Escalando Alto 🔥</SelectItem>
              <SelectItem value="Tendência 🚀">Tendência 🚀</SelectItem>
              <SelectItem value="Validada ✅">Validada ✅</SelectItem>
              <SelectItem value="Oceano Azul 🌊">Oceano Azul 🌊</SelectItem>
            </SelectContent>
          </Select>

          {/* Formato de Anúncio */}
          <Select value={filterAdFormat} onValueChange={setFilterAdFormat}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <SelectValue placeholder="Formato Anúncio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Formatos</SelectItem>
              <SelectItem value="UGC">UGC (Pessoa Real)</SelectItem>
              <SelectItem value="Estático">Estático / Imagem</SelectItem>
              <SelectItem value="VSL Curta">VSL Curta</SelectItem>
              <SelectItem value="Story Nativo">Story Nativo</SelectItem>
              <SelectItem value="Carrossel">Carrossel</SelectItem>
            </SelectContent>
          </Select>

          {/* Plataforma */}
          <Select value={filterNetwork} onValueChange={setFilterNetwork}>
            <SelectTrigger className="h-8 text-xs bg-background/50">
              <SelectValue placeholder="Plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Plataformas</SelectItem>
              {NETWORKS.map((net) => (
                <SelectItem key={net} value={net}>
                  {net}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Barra de Ordenação Rápida */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <span>
            Exibindo <b>{filteredOffers.length}</b> oferta{filteredOffers.length !== 1 ? "s" : ""} de Low Ticket
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Ordenar por:</span>
            <Button
              variant={sortField === "marginPercent" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => handleSort("marginPercent")}
            >
              Margem {sortField === "marginPercent" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </Button>
            <Button
              variant={sortField === "estimatedRoas" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => handleSort("estimatedRoas")}
            >
              ROAS {sortField === "estimatedRoas" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </Button>
            <Button
              variant={sortField === "activeAdsCount" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => handleSort("activeAdsCount")}
            >
              Anúncios Meta {sortField === "activeAdsCount" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </Button>
            <Button
              variant={sortField === "frontPrice" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => handleSort("frontPrice")}
            >
              Preço {sortField === "frontPrice" ? (sortDir === "desc" ? "↓" : "↑") : ""}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border bg-card/60 p-12 text-center text-muted-foreground">
              Nenhuma oferta encontrada para os filtros selecionados. Tente ajustar os termos ou filtros.
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="group relative rounded-2xl border border-border/80 bg-card/70 p-5 flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium"
                        >
                          {offer.network}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-muted text-foreground text-[10px]"
                        >
                          {offer.scalingStatus}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {offer.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {offer.subniche} · <span className="text-foreground/80">{offer.niche}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleFavorite(offer.id)}
                      className="text-muted-foreground hover:text-yellow-400 transition-colors p-1"
                      title={favorites.has(offer.id) ? "Remover dos favoritos" : "Favoritar oferta"}
                    >
                      {favorites.has(offer.id) ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Bloco de Métricas de Margem & Facebook Ads */}
                  <div className="grid grid-cols-3 gap-2 my-4 rounded-xl bg-muted/40 p-3 border border-border/40 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        Preço Front
                      </p>
                      <p className="text-base font-extrabold text-foreground">
                        R$ {offer.frontPrice.toFixed(2)}
                      </p>
                      <p className="text-[9px] text-accent font-medium">
                        {offer.commissionPercent}% comissão
                      </p>
                    </div>
                    <div className="border-x border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        AOV Médio
                      </p>
                      <p className="text-base font-extrabold text-primary">
                        R$ {offer.estimatedAov.toFixed(1)}
                      </p>
                      <p className="text-[9px] text-muted-foreground">com funil</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        Margem Meta
                      </p>
                      <p className="text-base font-extrabold text-green-400">
                        {offer.marginPercent}%
                      </p>
                      <p className="text-[9px] text-green-500/80 font-medium">
                        ROAS ~{offer.estimatedRoas}x
                      </p>
                    </div>
                  </div>

                  {/* Indicadores de Funil & Anúncios Ativos */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                        Funil Low Ticket:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            offer.hasOrderBump
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {offer.hasOrderBump ? `+Bump (R$ ${offer.orderBumpPrice})` : "Sem Bump"}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            offer.hasUpsell
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {offer.hasUpsell ? `+Upsell (R$ ${offer.upsellPrice})` : "Sem Upsell"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Facebook className="h-3.5 w-3.5 text-blue-400" />
                        Meta Ad Library:
                      </span>
                      <span className="font-semibold text-foreground">
                        {offer.activeAdsCount} criativos ativos ({offer.adFormat})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-yellow-400" />
                        CPA Alvo Facebook:
                      </span>
                      <span className="font-semibold text-foreground">
                        até R$ {offer.estimatedCpaFb.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações Diretas */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
                      asChild
                    >
                      <a
                        href={offer.metaAdLibraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver anúncios reais ativos na Biblioteca do Facebook"
                      >
                        <Facebook className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                        Ver Anúncios
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2.5"
                      onClick={() => openSimulator(offer)}
                      title="Simular Lucro Diário no Facebook Ads"
                    >
                      <Calculator className="h-3.5 w-3.5 text-accent" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() =>
                        copyToClipboard(
                          offer.metaAdLibraryUrl,
                          "Link da Biblioteca de Anúncios copiado!"
                        )
                      }
                    >
                      <Copy className="mr-1 h-3 w-3" /> Copiar Link Meta
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-brand text-xs font-semibold px-3"
                      asChild
                    >
                      <a href={offer.salesPageUrl} target="_blank" rel="noopener noreferrer">
                        Página
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-border bg-card/60 p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Oferta / Subnicho</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("frontPrice")}>
                  <span className="inline-flex items-center gap-1 justify-end">
                    Front <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("estimatedAov")}>
                  <span className="inline-flex items-center gap-1 justify-end">
                    AOV (Funil) <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead className="text-right">CPA Meta</TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("marginPercent")}>
                  <span className="inline-flex items-center gap-1 justify-end text-green-400">
                    Margem <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead className="text-right cursor-pointer select-none" onClick={() => handleSort("estimatedRoas")}>
                  <span className="inline-flex items-center gap-1 justify-end">
                    ROAS <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead className="text-center cursor-pointer select-none" onClick={() => handleSort("activeAdsCount")}>
                  <span className="inline-flex items-center gap-1 justify-center">
                    Anúncios Meta <ArrowUpDown className="h-3 w-3" />
                  </span>
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhuma oferta encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <button
                        onClick={() => toggleFavorite(offer.id)}
                        className="text-muted-foreground hover:text-yellow-400 transition-colors"
                      >
                        {favorites.has(offer.id) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-bold text-sm text-foreground">{offer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {offer.subniche} · <span className="text-primary">{offer.niche}</span>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {offer.network}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {offer.frontPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      R$ {offer.estimatedAov.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      R$ {offer.estimatedCpaFb.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-400">
                      {offer.marginPercent}%
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {offer.estimatedRoas}x
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {offer.activeAdsCount} ads ({offer.adFormat})
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-400 hover:text-blue-300"
                          asChild
                          title="Abrir Anúncios na Biblioteca do Facebook"
                        >
                          <a href={offer.metaAdLibraryUrl} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-accent hover:text-accent/80"
                          onClick={() => openSimulator(offer)}
                          title="Simular Lucro"
                        >
                          <Calculator className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                          title="Página de Vendas"
                        >
                          <a href={offer.salesPageUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal Simulador de Lucro no Facebook Ads */}
      <Dialog open={simDialogOpen} onOpenChange={setSimDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-5 w-5 text-accent" />
              Simulador de Margem & Lucro no Facebook Ads
            </DialogTitle>
          </DialogHeader>

          {simSelectedOffer && simResults && (
            <div className="space-y-4 py-2 text-sm">
              <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                <p className="font-bold text-foreground">{simSelectedOffer.name}</p>
                <p className="text-xs text-muted-foreground">
                  Front: R$ {simSelectedOffer.frontPrice.toFixed(2)} · AOV Estimado (com funil):{" "}
                  <b className="text-primary">R$ {simSelectedOffer.estimatedAov.toFixed(1)}</b>
                </p>
                <p className="text-xs text-muted-foreground">
                  CPA Alvo Estimado: <b>R$ {simSelectedOffer.estimatedCpaFb.toFixed(2)}</b>
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Orçamento Diário de Teste / Escala no Meta (R$)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    type="number"
                    value={simBudget}
                    onChange={(e) => setSimBudget(e.target.value)}
                    className="pl-9"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-border bg-card/60 p-3">
                  <p className="text-xs text-muted-foreground">Vendas Estimadas / dia</p>
                  <p className="text-xl font-bold text-foreground">
                    ~{simResults.estimatedConversions} vendas
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card/60 p-3">
                  <p className="text-xs text-muted-foreground">Faturamento Bruto</p>
                  <p className="text-xl font-bold text-foreground">
                    R$ {simResults.grossRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
                  <p className="text-xs text-green-400 font-medium">Lucro Líquido / dia</p>
                  <p className="text-xl font-extrabold text-green-400">
                    + R$ {simResults.netProfit.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
                  <p className="text-xs text-primary font-medium">ROAS no Meta</p>
                  <p className="text-xl font-extrabold text-primary">
                    {simResults.roas.toFixed(2)}x
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                * Projeção baseada em taxa de conversão média de Order Bump (35%) e Upsell (18%) no Low Ticket.
              </p>

              <Button
                className="w-full bg-gradient-brand"
                onClick={() => setSimDialogOpen(false)}
              >
                Concluir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}