import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Search, Layers, Clock, GitBranch, PenLine, Puzzle, FolderX, Target, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { tools, categories } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mony Ads — Ofertas, IA e campanhas em um só lugar" },
      { name: "description", content: "Encontre ofertas, analise concorrentes e crie páginas, copies e criativos com IA na Mony Ads." },
      { property: "og:title", content: "Mony Ads — Ofertas, IA e campanhas" },
      { property: "og:description", content: "Mineração, análise, criação com IA e tracking em uma única plataforma." },
    ],
  }),
  component: Home,
});

const card = "rounded-2xl border border-border bg-card/60 p-6";
const H2 = ({ k, t, s }: { k: string; t: string; s?: string }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">{k}</p>
    <h2 className="text-3xl font-bold md:text-4xl">{t}</h2>
    {s && <p className="mt-3 text-muted-foreground">{s}</p>}
  </div>
);

const countries = ["Brasil", "Estados Unidos", "México", "Portugal", "Espanha", "Itália", "França", "Alemanha"];
const problems = [
  [Search, "Dificuldade para encontrar ofertas"], [Clock, "Tempo perdido pesquisando anúncios"],
  [GitBranch, "Dificuldade para analisar funis"], [PenLine, "Criação manual de páginas e copies"],
  [Puzzle, "Excesso de ferramentas separadas"], [FolderX, "Falta de organização dos testes"],
] as const;
const steps = ["Encontrar ofertas", "Analisar concorrentes e funis", "Planejar uma oferta própria", "Criar materiais com IA", "Testar campanhas e acompanhar resultados"];
const audience = ["Afiliados", "Produtores digitais", "Coprodutores", "Gestores de tráfego", "Iniciantes", "Profissionais avançados"];
const plans = [
  { n: "Básico", f: ["Ferramentas de tracking", "Calculadora de métricas", "Créditos de IA limitados", "1 projeto"] },
  { n: "Intermediário", f: ["Tudo do Básico", "Criação com IA", "Catálogo de ofertas", "10 projetos"], hot: true },
  { n: "Avançado", f: ["Tudo do Intermediário", "Análise de funis e concorrentes", "Mais créditos de IA", "Projetos ilimitados"] },
];
const faq = [
  ["Como a Mony Ads funciona?", "Você encontra oportunidades, analisa concorrentes e cria materiais com IA em um único painel."],
  ["Quais ferramentas estão disponíveis?", "Gerador de UTMs e calculadora de métricas já funcionam. As demais estão em desenvolvimento e aparecem identificadas no painel."],
  ["O que são créditos?", "Créditos medem o uso das ferramentas de IA. Cada plano terá um limite mensal."],
  ["Quais integrações existem?", "A plataforma está preparada para integrações com fontes de ofertas e IA, que serão ativadas conforme ficarem disponíveis."],
  ["Como funcionam os pagamentos?", "Os planos serão contratados por checkout seguro, que será configurado no lançamento."],
  ["Posso cancelar quando quiser?", "Sim, o cancelamento poderá ser feito a qualquer momento pelo painel."],
  ["Meus dados estão seguros?", "Chaves e dados sensíveis ficam apenas no servidor, nunca expostos no navegador."],
];

function Home() {
  const [cat, setCat] = useState("Todas");
  const [country, setCountry] = useState(countries[0]);
  const [annual, setAnnual] = useState(false);
  const list = cat === "Todas" ? tools : tools.filter((t) => t.cat === cat);

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Logo />
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            {[["#ferramentas", "Funcionalidades"], ["#como-funciona", "Como funciona"], ["#planos", "Planos"], ["#faq", "FAQ"]].map(([h, l]) => (
              <a key={h} href={h} className="hover:text-foreground">{l}</a>
            ))}
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link to="/dashboard">Entrar</Link></Button>
            <Button asChild className="bg-gradient-brand shadow-glow"><Link to="/dashboard">Começar agora</Link></Button>
          </div>
        </div>
      </header>

      <section className="bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Encontre ofertas vencedoras. <span className="text-gradient">Crie campanhas com IA.</span> Escale com inteligência.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">Descubra oportunidades, analise concorrentes e crie páginas, produtos digitais, copies e criativos em uma única plataforma.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-gradient-brand shadow-glow"><Link to="/dashboard">Começar agora</Link></Button>
              <Button size="lg" variant="outline" asChild><a href="#ferramentas">Conhecer funcionalidades</a></Button>
            </div>
          </div>
          <div className={`${card} shadow-glow`}>
            <div className="mb-4 flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-muted" />)}</div>
            <div className="grid grid-cols-3 gap-3">
              {[["ROAS", "—"], ["CTR", "—"], ["Ofertas", "—"]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-muted p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="text-xl font-bold">{v}</p></div>
              ))}
            </div>
            <div className="mt-4 flex h-32 items-end gap-2 rounded-xl bg-muted p-3">
              {[40, 65, 50, 80, 60, 90, 75, 95].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-brand" style={{ height: `${h}%` }} />)}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {["Gerador de copy", "Criador de páginas", "Análise de funis", "Gerador de UTMs"].map((x) => (
                <div key={x} className="rounded-lg border border-border px-3 py-2 text-muted-foreground">{x}</div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Prévia ilustrativa</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <H2 k="Ofertas globais" t="Oportunidades organizadas por país" />
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {countries.map((c) => (
            <Button key={c} size="sm" variant={c === country ? "default" : "outline"} onClick={() => setCountry(c)}>{c}</Button>
          ))}
        </div>
        <div className={`${card} text-center`}>
          <Globe2 />
          <p className="font-semibold">Nenhuma oferta conectada para {country}</p>
          <p className="mt-1 text-sm text-muted-foreground">O catálogo exibirá nome, nicho, país, fonte e data de atualização assim que uma fonte de dados for integrada.</p>
          <Button className="mt-4" variant="outline" disabled>Analisar oferta (em breve)</Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <H2 k="O problema" t="Pare de criar campanhas no escuro" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map(([I, t]) => (
            <div key={t} className={card}><I className="mb-3 h-6 w-6 text-primary" /><p className="font-semibold">{t}</p></div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20">
        <H2 k="Como funciona" t="Da ideia à escala em 5 etapas" />
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s} className={card}>
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-brand font-bold text-primary-foreground">{i + 1}</span>
              <p className="font-semibold">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ferramentas" className="mx-auto max-w-7xl px-4 py-20">
        <H2 k="Central de ferramentas" t="Tudo o que você precisa, em um só lugar" />
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["Todas", ...categories].map((c) => (
            <Button key={c} size="sm" variant={c === cat ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t) => (
            <div key={t.id} className={`${card} flex flex-col`}>
              <t.icon className="mb-3 h-6 w-6 text-accent" />
              <p className="font-semibold">{t.name}</p>
              <p className="mb-4 mt-1 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              {t.status === "ready" ? (
                <Button size="sm" asChild><Link to="/dashboard" search={{ tool: t.id }}>Acessar</Link></Button>
              ) : (
                <Button size="sm" variant="outline" disabled>Em desenvolvimento</Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <H2 k="Comparação" t="Várias ferramentas vs. Mony Ads" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className={card}>
            <p className="mb-4 font-semibold text-muted-foreground">Ferramentas separadas</p>
            {["Várias assinaturas", "Dados espalhados", "Troca constante de abas", "Sem visão unificada"].map((x) => (
              <p key={x} className="flex items-center gap-2 py-1.5 text-sm"><X className="h-4 w-4 text-destructive" />{x}</p>
            ))}
          </div>
          <div className={`${card} border-primary/50 shadow-glow`}>
            <p className="mb-4 font-semibold text-gradient">Mony Ads</p>
            {["Mineração", "Análise", "Criação com IA", "Páginas", "Criativos", "Tracking"].map((x) => (
              <p key={x} className="flex items-center gap-2 py-1.5 text-sm"><Check className="h-4 w-4 text-accent" />{x}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <H2 k="Para quem" t="Feita para quem vive de tráfego" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.map((a, i) => (
            <div key={a} className={`${card} flex items-center gap-3`}>{i % 2 ? <Target className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-accent" />}<p className="font-semibold">{a}</p></div>
          ))}
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-6xl px-4 py-20">
        <H2 k="Planos" t="Escolha seu plano" s="Valores serão definidos no lançamento." />
        <div className="mb-8 flex justify-center gap-2">
          <Button size="sm" variant={!annual ? "default" : "outline"} onClick={() => setAnnual(false)}>Mensal</Button>
          <Button size="sm" variant={annual ? "default" : "outline"} onClick={() => setAnnual(true)}>Anual</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.n} className={`${card} flex flex-col ${p.hot ? "border-primary/60 shadow-glow" : ""}`}>
              <p className="flex items-center gap-2 text-lg font-bold"><Layers className="h-5 w-5 text-primary" />{p.n}</p>
              <p className="my-4 text-2xl font-bold">A definir<span className="text-sm font-normal text-muted-foreground">/{annual ? "ano" : "mês"}</span></p>
              <ul className="mb-6 flex-1 space-y-2 text-sm">{p.f.map((f) => <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-accent" />{f}</li>)}</ul>
              <Button variant={p.hot ? "default" : "outline"} disabled>Checkout em breve</Button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <H2 k="FAQ" t="Perguntas frequentes" />
        <Accordion type="single" collapsible>
          {faq.map(([q, a]) => (
            <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 md:flex-row">
          <Logo />
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#ferramentas">Funcionalidades</a><a href="#planos">Planos</a>
            <a href="mailto:contato@monyads.com">Contato</a><a href="#faq">Termos de uso</a><a href="#faq">Política de privacidade</a>
          </nav>
          <p className="text-xs text-muted-foreground">© 2026 Mony Ads</p>
        </div>
      </footer>
    </div>
  );
}

function Globe2() {
  return <Search className="mx-auto mb-3 h-8 w-8 text-accent" />;
}
