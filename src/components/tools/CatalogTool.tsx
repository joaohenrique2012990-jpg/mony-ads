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
} from "lucide-react";

interface Offer {
  id: string;
  name: string;
  niche: string;
  country: string;
  network: string;
  commission: number;
  gravity: number;
  conversionRate: number;
  link: string;
  isCustom?: boolean;
}

const COUNTRIES = ["Brasil", "EUA", "México", "Portugal", "Espanha"];
const NICHES = [
  "Saúde",
  "Finanças",
  "Educação",
  "Relacionamento",
  "Emagrecimento",
  "Renda Extra",
  "Tecnologia",
];
const NETWORKS = [
  "Hotmart",
  "Eduzz",
  "Monetizze",
  "Braip",
  "ClickBank",
  "Digistore",
];

const DEFAULT_OFFERS: Offer[] = [
  { id: "1", name: "Fórmula Negócio Online", niche: "Renda Extra", country: "Brasil", network: "Hotmart", commission: 247, gravity: 89, conversionRate: 4.2, link: "https://hotmart.com/fno" },
  { id: "2", name: "Método Turbo Tráfego", niche: "Tecnologia", country: "Brasil", network: "Hotmart", commission: 197, gravity: 76, conversionRate: 3.8, link: "https://hotmart.com/mtt" },
  { id: "3", name: "Código da Riqueza", niche: "Finanças", country: "Brasil", network: "Eduzz", commission: 350, gravity: 65, conversionRate: 2.9, link: "https://eduzz.com/cdr" },
  { id: "4", name: "Segredo do Emagrecimento", niche: "Emagrecimento", country: "Brasil", network: "Monetizze", commission: 127, gravity: 92, conversionRate: 5.1, link: "https://monetizze.com/sde" },
  { id: "5", name: "Inglês Winner", niche: "Educação", country: "Brasil", network: "Hotmart", commission: 197, gravity: 71, conversionRate: 3.5, link: "https://hotmart.com/iw" },
  { id: "6", name: "Keto Advanced", niche: "Emagrecimento", country: "EUA", network: "ClickBank", commission: 180, gravity: 145, conversionRate: 4.8, link: "https://clickbank.com/keto" },
  { id: "7", name: "Crypto Quantum Leap", niche: "Finanças", country: "EUA", network: "ClickBank", commission: 320, gravity: 112, conversionRate: 3.2, link: "https://clickbank.com/cql" },
  { id: "8", name: "Salvando Seu Casamento", niche: "Relacionamento", country: "Brasil", network: "Braip", commission: 97, gravity: 58, conversionRate: 4.5, link: "https://braip.com/ssc" },
  { id: "9", name: "Método Saúde Total", niche: "Saúde", country: "Portugal", network: "Hotmart", commission: 87, gravity: 42, conversionRate: 3.1, link: "https://hotmart.com/mst" },
  { id: "10", name: "Excel Profissional", niche: "Educação", country: "Brasil", network: "Eduzz", commission: 67, gravity: 55, conversionRate: 6.2, link: "https://eduzz.com/ep" },
  { id: "11", name: "Diabetes Controlada", niche: "Saúde", country: "Brasil", network: "Monetizze", commission: 147, gravity: 83, conversionRate: 4.0, link: "https://monetizze.com/dc" },
  { id: "12", name: "Marketing Digital MX", niche: "Renda Extra", country: "México", network: "Hotmart", commission: 157, gravity: 38, conversionRate: 2.7, link: "https://hotmart.com/mdmx" },
  { id: "13", name: "Programa Fit 90", niche: "Emagrecimento", country: "Brasil", network: "Braip", commission: 117, gravity: 95, conversionRate: 5.5, link: "https://braip.com/pf90" },
  { id: "14", name: "Renda com Dropshipping", niche: "Renda Extra", country: "Brasil", network: "Eduzz", commission: 297, gravity: 61, conversionRate: 3.3, link: "https://eduzz.com/rcd" },
  { id: "15", name: "SocialMedia Mastery", niche: "Tecnologia", country: "Espanha", network: "Digistore", commission: 210, gravity: 47, conversionRate: 2.5, link: "https://digistore.com/smm" },
  { id: "16", name: "Relacionamento Blindado", niche: "Relacionamento", country: "Brasil", network: "Hotmart", commission: 77, gravity: 69, conversionRate: 4.9, link: "https://hotmart.com/rb" },
  { id: "17", name: "Java Masterclass", niche: "Tecnologia", country: "Brasil", network: "Hotmart", commission: 137, gravity: 53, conversionRate: 3.7, link: "https://hotmart.com/jm" },
  { id: "18", name: "Conquiste Sua Liberdade", niche: "Finanças", country: "Brasil", network: "Monetizze", commission: 267, gravity: 74, conversionRate: 3.0, link: "https://monetizze.com/csl" },
];

const STORAGE_KEY = "mony-catalog-data";
const FAVORITES_KEY = "mony-catalog-favorites";

type SortField = "commission" | "gravity" | "conversionRate" | "name";
type SortDir = "asc" | "desc";

export default function CatalogTool() {
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_OFFERS;
    } catch {
      return DEFAULT_OFFERS;
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
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterNiche, setFilterNiche] = useState("all");
  const [filterNetwork, setFilterNetwork] = useState("all");
  const [sortField, setSortField] = useState<SortField>("gravity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [newOffer, setNewOffer] = useState({
    name: "",
    niche: "",
    country: "",
    network: "",
    commission: "",
    gravity: "",
    conversionRate: "",
    link: "",
  });

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
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.niche.toLowerCase().includes(q) ||
          o.network.toLowerCase().includes(q)
      );
    }
    if (filterCountry !== "all") list = list.filter((o) => o.country === filterCountry);
    if (filterNiche !== "all") list = list.filter((o) => o.niche === filterNiche);
    if (filterNetwork !== "all") list = list.filter((o) => o.network === filterNetwork);
    if (showFavoritesOnly) list = list.filter((o) => favorites.has(o.id));
    list.sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mult * a.name.localeCompare(b.name);
      return mult * ((a[sortField] as number) - (b[sortField] as number));
    });
    return list;
  }, [offers, search, filterCountry, filterNiche, filterNetwork, showFavoritesOnly, sortField, sortDir, favorites]);

  const addOffer = () => {
    if (!newOffer.name || !newOffer.niche || !newOffer.country || !newOffer.network) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const offer: Offer = {
      id: Date.now().toString(),
      name: newOffer.name,
      niche: newOffer.niche,
      country: newOffer.country,
      network: newOffer.network,
      commission: parseFloat(newOffer.commission) || 0,
      gravity: parseFloat(newOffer.gravity) || 0,
      conversionRate: parseFloat(newOffer.conversionRate) || 0,
      link: newOffer.link || "#",
      isCustom: true,
    };
    setOffers((prev) => [offer, ...prev]);
    setNewOffer({ name: "", niche: "", country: "", network: "", commission: "", gravity: "", conversionRate: "", link: "" });
    setDialogOpen(false);
    toast.success("Oferta adicionada com sucesso!");
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  const nicheColor = (niche: string) => {
    const map: Record<string, string> = {
      Saúde: "bg-green-500/15 text-green-400 border-green-500/30",
      Finanças: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      Educação: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      Relacionamento: "bg-pink-500/15 text-pink-400 border-pink-500/30",
      Emagrecimento: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      "Renda Extra": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      Tecnologia: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    };
    return map[niche] || "bg-gray-500/15 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Catálogo de Ofertas</h2>
          <p className="text-sm text-muted-foreground">
            {filteredOffers.length} oferta{filteredOffers.length !== 1 ? "s" : ""} encontrada{filteredOffers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Star className="mr-1 h-4 w-4" />
            Favoritos ({favorites.size})
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="rounded-none">
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-none">
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Oferta</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Nome *</Label>
                  <Input value={newOffer.name} onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })} placeholder="Nome da oferta" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Nicho *</Label>
                    <Select value={newOffer.niche} onValueChange={(v) => setNewOffer({ ...newOffer, niche: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>País *</Label>
                    <Select value={newOffer.country} onValueChange={(v) => setNewOffer({ ...newOffer, country: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Rede *</Label>
                    <Select value={newOffer.network} onValueChange={(v) => setNewOffer({ ...newOffer, network: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{NETWORKS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Comissão (R$)</Label>
                    <Input type="number" value={newOffer.commission} onChange={(e) => setNewOffer({ ...newOffer, commission: e.target.value })} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Gravidade</Label>
                    <Input type="number" value={newOffer.gravity} onChange={(e) => setNewOffer({ ...newOffer, gravity: e.target.value })} placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Taxa de Conversão (%)</Label>
                    <Input type="number" step="0.1" value={newOffer.conversionRate} onChange={(e) => setNewOffer({ ...newOffer, conversionRate: e.target.value })} placeholder="0" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Link de Afiliado</Label>
                  <Input value={newOffer.link} onChange={(e) => setNewOffer({ ...newOffer, link: e.target.value })} placeholder="https://..." />
                </div>
                <Button onClick={addOffer} className="w-full">Adicionar Oferta</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar oferta..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger><SelectValue placeholder="País" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Países</SelectItem>
              {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger><SelectValue placeholder="Nicho" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Nichos</SelectItem>
              {NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterNetwork} onValueChange={setFilterNetwork}>
            <SelectTrigger><SelectValue placeholder="Rede" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Redes</SelectItem>
              {NETWORKS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="rounded-2xl border border-border bg-card/60 p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => handleSort("name")}>
                  <span className="inline-flex items-center gap-1">Nome <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead>Nicho</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Rede</TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("commission")}>
                  <span className="inline-flex items-center gap-1 justify-end">Comissão <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("gravity")}>
                  <span className="inline-flex items-center gap-1 justify-end">Gravidade <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort("conversionRate")}>
                  <span className="inline-flex items-center gap-1 justify-end">Conversão <ArrowUpDown className="h-3 w-3" /></span>
                </TableHead>
                <TableHead className="w-20 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma oferta encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <button onClick={() => toggleFavorite(offer.id)} className="text-muted-foreground hover:text-yellow-400 transition-colors">
                        {favorites.has(offer.id) ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={nicheColor(offer.niche)}>{offer.niche}</Badge>
                    </TableCell>
                    <TableCell>{offer.country}</TableCell>
                    <TableCell>{offer.network}</TableCell>
                    <TableCell className="text-right font-semibold text-green-400">R$ {offer.commission.toFixed(0)}</TableCell>
                    <TableCell className="text-right">{offer.gravity}</TableCell>
                    <TableCell className="text-right">{offer.conversionRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyLink(offer.link)} title="Copiar link">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild title="Abrir link">
                          <a href={offer.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
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
      ) : (
        /* Grid View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground rounded-2xl border border-border bg-card/60 p-6">
              Nenhuma oferta encontrada.
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{offer.name}</h3>
                    <p className="text-xs text-muted-foreground">{offer.network} · {offer.country}</p>
                  </div>
                  <button onClick={() => toggleFavorite(offer.id)} className="text-muted-foreground hover:text-yellow-400 transition-colors ml-2">
                    {favorites.has(offer.id) ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
                  </button>
                </div>
                <Badge variant="outline" className={`${nicheColor(offer.niche)} w-fit`}>{offer.niche}</Badge>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-background/50 p-2">
                    <p className="text-lg font-bold text-green-400">R${offer.commission}</p>
                    <p className="text-[10px] text-muted-foreground">Comissão</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-2">
                    <p className="text-lg font-bold">{offer.gravity}</p>
                    <p className="text-[10px] text-muted-foreground">Gravidade</p>
                  </div>
                  <div className="rounded-lg bg-background/50 p-2">
                    <p className="text-lg font-bold">{offer.conversionRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Conversão</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => copyLink(offer.link)}>
                    <Copy className="mr-1 h-3 w-3" /> Copiar Link
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={offer.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
