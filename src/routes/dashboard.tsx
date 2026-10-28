import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Wrench, FolderKanban, Bookmark, History, CreditCard, Settings, Menu } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";
import { tools, categories, calcMetrics, buildUtm } from "@/lib/tools";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { tool?: string } => ({ tool: typeof s["tool"] === "string" ? s["tool"] : undefined }),
  head: () => ({
    meta: [
      { title: "Painel — Mony Ads" },
      { name: "description", content: "Seu painel Mony Ads: ferramentas, projetos, ofertas e créditos." },
      { property: "og:title", content: "Painel — Mony Ads" },
      { property: "og:description", content: "Ferramentas de IA, tracking e organização para suas campanhas." },
    ],
  }),
  component: Dashboard,
});

const nav = [
  ["overview", "Visão geral", LayoutDashboard], ["tools", "Ferramentas", Wrench], ["projects", "Projetos", FolderKanban],
  ["offers", "Ofertas salvas", Bookmark], ["history", "Histórico", History], ["plan", "Plano e créditos", CreditCard], ["settings", "Configurações", Settings],
] as const;
const card = "rounded-2xl border border-border bg-card/60 p-6";
const Empty = ({ t }: { t: string }) => <div className={`${card} text-center text-muted-foreground`}>{t}</div>;

function Dashboard() {
  const { tool: initial } = Route.useSearch();
  const [view, setView] = useState<string>(initial ? "tools" : "overview");
  const [tool, setTool] = useState<string | undefined>(initial);
  const [open, setOpen] = useState(false);
  const go = (v: string) => { setView(v); setTool(undefined); setOpen(false); };

  return (
    <div className="flex min-h-screen font-sans">
      <Toaster />
      <aside className={`${open ? "flex" : "hidden"} fixed inset-y-0 z-40 w-64 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-4 md:static md:flex`}>
        <div className="mb-6"><Logo /></div>
        {nav.map(([id, l, I]) => (
          <button key={id} onClick={() => go(id)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${view === id ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <I className="h-4 w-4" />{l}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <Button variant="outline" size="icon" className="mb-4 md:hidden" onClick={() => setOpen(!open)}><Menu /></Button>
        <h1 className="mb-6 text-2xl font-bold">{nav.find((n) => n[0] === view)?.[1]}</h1>
        {view === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Projetos", "0"], ["Ofertas salvas", "0"], ["Créditos usados", "0"]].map(([k, v]) => (
                <div key={k} className={card}><p className="text-sm text-muted-foreground">{k}</p><p className="text-3xl font-bold">{v}</p></div>
              ))}
            </div>
            <div className={card}>
              <p className="mb-3 font-semibold">Ferramentas disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {tools.filter((t) => t.status === "ready").map((t) => (
                  <Button key={t.id} variant="outline" onClick={() => { setView("tools"); setTool(t.id); }}><t.icon />{t.name}</Button>
                ))}
              </div>
            </div>
            <Empty t="Nenhum projeto recente." />
          </div>
        )}
        {view === "tools" && (tool ? <ToolView id={tool} back={() => setTool(undefined)} /> : (
          <div className="space-y-8">
            {categories.map((c) => (
              <div key={c}>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">{c}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tools.filter((t) => t.cat === c).map((t) => (
                    <button key={t.id} disabled={t.status !== "ready"} onClick={() => setTool(t.id)} className={`${card} p-4 text-left disabled:opacity-50`}>
                      <t.icon className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.status === "ready" ? t.desc : "Em desenvolvimento"}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        {view === "projects" && <Empty t="Você ainda não tem projetos salvos." />}
        {view === "offers" && <Empty t="Nenhuma oferta salva. O catálogo será ativado quando uma fonte de dados for integrada." />}
        {view === "history" && <Empty t="Nenhuma atividade registrada." />}
        {view === "plan" && (
          <div className={`${card} max-w-lg space-y-4`}>
            <p>Plano atual: <b>Gratuito</b></p>
            <div><p className="mb-2 text-sm text-muted-foreground">Créditos de IA: 0 / 0</p><Progress value={0} /></div>
            <Button disabled>Fazer upgrade (checkout em breve)</Button>
          </div>
        )}
        {view === "settings" && <Empty t="As configurações de conta estarão disponíveis após a ativação do login." />}
      </main>
    </div>
  );
}

function ToolView({ id, back }: { id: string; back: () => void }) {
  return (
    <div className="max-w-2xl">
      <Button variant="ghost" size="sm" onClick={back} className="mb-4">← Voltar</Button>
      {id === "utm" ? <Utm /> : id === "calc" ? <Calc /> : <Empty t="Em desenvolvimento." />}
    </div>
  );
}

function Field({ l, v, set, type = "text" }: { l: string; v: string; set: (s: string) => void; type?: string }) {
  return <div className="space-y-1.5"><Label>{l}</Label><Input type={type} value={v} onChange={(e) => set(e.target.value)} /></div>;
}

function Utm() {
  const [f, setF] = useState({ url: "", utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" });
  const { url, ...p } = f;
  const out = buildUtm(url, p);
  return (
    <div className={`${card} space-y-4`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.keys(f).map((k) => <Field key={k} l={k === "url" ? "URL de destino" : k} v={f[k as keyof typeof f]} set={(v) => setF({ ...f, [k]: v })} />)}
      </div>
      <div className="break-all rounded-lg bg-muted p-3 text-sm">{out || (url ? "URL inválida (use https://...)" : "Preencha a URL de destino")}</div>
      <Button disabled={!out} onClick={() => { navigator.clipboard.writeText(out); toast.success("URL copiada"); }}>Copiar URL</Button>
    </div>
  );
}

function Calc() {
  const [f, setF] = useState({ spend: "", impressions: "", clicks: "", conversions: "", revenue: "" });
  const labels: Record<string, string> = { spend: "Investimento (R$)", impressions: "Impressões", clicks: "Cliques", conversions: "Conversões", revenue: "Receita (R$)" };
  const m = calcMetrics(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Number(v) || 0])) as never);
  const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return (
    <div className={`${card} space-y-4`}>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.keys(f).map((k) => <Field key={k} type="number" l={labels[k] ?? k} v={f[k as keyof typeof f]} set={(v) => setF({ ...f, [k]: v })} />)}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[["CTR", `${m.ctr.toFixed(2)}%`], ["CPC", brl(m.cpc)], ["CPA", brl(m.cpa)], ["ROAS", `${m.roas.toFixed(2)}x`], ["ROI", `${m.roi.toFixed(1)}%`]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="font-bold">{v}</p></div>
        ))}
      </div>
    </div>
  );
}
