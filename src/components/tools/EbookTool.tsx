"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus, Trash2, Copy, Eye, Save, FolderOpen, BookOpen,
  ArrowUp, ArrowDown, Sparkles, Palette, FileDown
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  topic: string;
  coverColor1: string;
  coverColor2: string;
  coverTextColor: string;
  chapters: Chapter[];
  template: string;
  createdAt: string;
}

const STORAGE_KEY = "monyads-ebooks";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const NICHE_SUGGESTIONS: Record<string, { chapters: string[]; subtopics: Record<string, string> }> = {
  marketing: {
    chapters: [
      "Fundamentos do Marketing Digital",
      "Como Definir Seu Público-Alvo",
      "Estratégias de Tráfego Pago",
      "Marketing de Conteúdo que Converte",
      "Funis de Vendas na Prática",
      "E-mail Marketing Automatizado",
      "Métricas e KPIs Essenciais",
      "Escale Seus Resultados",
    ],
    subtopics: {
      "Fundamentos do Marketing Digital": "Neste capítulo, você vai aprender os pilares do marketing digital moderno. Vamos abordar desde a construção de presença online até as principais plataformas e ferramentas disponíveis para empreendedores e profissionais de marketing.\n\nO marketing digital é a base para qualquer negócio que deseja crescer no mundo conectado. Entender os fundamentos é essencial antes de avançar para estratégias mais complexas.",
      "Como Definir Seu Público-Alvo": "Conhecer profundamente seu público-alvo é a chave para o sucesso de qualquer campanha. Neste capítulo, vamos explorar técnicas de pesquisa de mercado, criação de personas e segmentação de audiência.\n\nVocê vai aprender a identificar as dores, desejos e comportamentos do seu cliente ideal para criar mensagens que realmente conectam.",
    },
  },
  finanças: {
    chapters: [
      "Organize Suas Finanças Pessoais",
      "Construindo uma Reserva de Emergência",
      "Tipos de Investimento para Iniciantes",
      "Renda Fixa vs. Renda Variável",
      "Como Montar uma Carteira Diversificada",
      "Planejamento de Aposentadoria",
      "Imposto de Renda: Guia Prático",
      "Hábitos de Pessoas Financeiramente Livres",
    ],
    subtopics: {
      "Organize Suas Finanças Pessoais": "O primeiro passo para a liberdade financeira é organizar suas finanças. Neste capítulo, vamos criar um sistema simples e eficaz para controlar receitas, despesas e definir metas financeiras.\n\nVocê vai aprender a usar a regra 50/30/20, criar planilhas de controle e identificar gastos desnecessários que estão impedindo seu crescimento financeiro.",
    },
  },
  saúde: {
    chapters: [
      "Alimentação Saudável no Dia a Dia",
      "A Importância do Exercício Físico",
      "Saúde Mental e Bem-Estar",
      "Rotinas Matinais para Mais Energia",
      "Sono de Qualidade: Guia Completo",
      "Suplementação Inteligente",
      "Como Manter a Motivação",
      "Criando Hábitos que Duram",
    ],
    subtopics: {
      "Alimentação Saudável no Dia a Dia": "A alimentação é o pilar fundamental da saúde. Neste capítulo, vamos desmistificar dietas da moda e apresentar um guia prático para montar refeições nutritivas, saborosas e acessíveis.\n\nVocê vai aprender a ler rótulos de alimentos, planejar suas refeições semanais e fazer substituições inteligentes sem sacrificar o prazer de comer.",
    },
  },
  negócios: {
    chapters: [
      "Encontrando Sua Ideia de Negócio",
      "Validação de Mercado",
      "Modelo de Negócio Canvas",
      "Precificação Estratégica",
      "Vendas e Persuasão",
      "Gestão de Equipe",
      "Processos e Automatização",
      "Escalando Seu Negócio",
    ],
    subtopics: {},
  },
  produtividade: {
    chapters: [
      "Mindset de Alta Performance",
      "Gestão do Tempo na Prática",
      "Métodos de Produtividade (Pomodoro, GTD, etc.)",
      "Ferramentas Essenciais",
      "Eliminando Distrações",
      "Delegação Inteligente",
      "Energia vs. Tempo",
      "Revisão e Melhoria Contínua",
    ],
    subtopics: {},
  },
};

const TEMPLATES: Record<string, string[]> = {
  "Guia Completo": ["Introdução", "Fundamentos", "Estratégias Básicas", "Estratégias Avançadas", "Ferramentas Recomendadas", "Estudos de Caso", "Plano de Ação", "Conclusão e Próximos Passos"],
  "Checklist": ["Visão Geral", "Fase 1: Preparação", "Fase 2: Execução", "Fase 3: Otimização", "Fase 4: Manutenção", "Checklist Final"],
  "Passo a Passo": ["Antes de Começar", "Passo 1: Planejamento", "Passo 2: Configuração", "Passo 3: Implementação", "Passo 4: Teste e Validação", "Passo 5: Lançamento", "Passo 6: Análise de Resultados", "Próximos Passos"],
  "Case Studies": ["Introdução e Metodologia", "Caso 1: Do Zero ao Resultado", "Caso 2: Superando Obstáculos", "Caso 3: Crescimento Exponencial", "Lições Aprendidas", "Como Aplicar no Seu Negócio"],
};

export default function EbookTool() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [current, setCurrent] = useState<Ebook | null>(null);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState("info");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEbooks(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Ebook[]) => {
    setEbooks(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createEbook = (template?: string) => {
    const chapters: Chapter[] = template && TEMPLATES[template]
      ? TEMPLATES[template].map((t) => ({ id: uid(), title: t, content: "" }))
      : [];
    const ebook: Ebook = {
      id: uid(),
      title: "Novo E-book",
      subtitle: "",
      author: "",
      topic: "",
      coverColor1: "#1e293b",
      coverColor2: "#3b82f6",
      coverTextColor: "#ffffff",
      chapters,
      template: template || "",
      createdAt: new Date().toISOString(),
    };
    persist([...ebooks, ebook]);
    setCurrent(ebook);
    toast.success("E-book criado!");
  };

  const saveCurrent = () => {
    if (!current) return;
    persist(ebooks.map((e) => (e.id === current.id ? current : e)));
    toast.success("E-book salvo!");
  };

  const deleteEbook = (id: string) => {
    persist(ebooks.filter((e) => e.id !== id));
    if (current?.id === id) setCurrent(null);
    toast.success("E-book excluído!");
  };

  const addChapter = () => {
    if (!current) return;
    const ch: Chapter = { id: uid(), title: `Capítulo ${current.chapters.length + 1}`, content: "" };
    setCurrent({ ...current, chapters: [...current.chapters, ch] });
  };

  const updateChapter = (cid: string, patch: Partial<Chapter>) => {
    if (!current) return;
    setCurrent({ ...current, chapters: current.chapters.map((c) => (c.id === cid ? { ...c, ...patch } : c)) });
  };

  const removeChapter = (cid: string) => {
    if (!current) return;
    setCurrent({ ...current, chapters: current.chapters.filter((c) => c.id !== cid) });
    if (editingChapter === cid) setEditingChapter(null);
  };

  const moveChapter = (idx: number, dir: -1 | 1) => {
    if (!current) return;
    const arr = [...current.chapters];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setCurrent({ ...current, chapters: arr });
  };

  const applySuggestions = () => {
    if (!current || !current.topic) { toast.error("Selecione um nicho primeiro"); return; }
    const niche = Object.keys(NICHE_SUGGESTIONS).find((k) => current.topic.toLowerCase().includes(k));
    if (!niche) { toast.error("Nenhuma sugestão disponível para este nicho. Tente: marketing, finanças, saúde, negócios, produtividade"); return; }
    const suggestions = NICHE_SUGGESTIONS[niche];
    const newChapters: Chapter[] = suggestions.chapters.map((title) => ({
      id: uid(),
      title,
      content: suggestions.subtopics[title] || "",
    }));
    setCurrent({ ...current, chapters: newChapters });
    toast.success(`${newChapters.length} capítulos sugeridos adicionados!`);
  };

  const exportText = () => {
    if (!current) return;
    const lines: string[] = [];
    lines.push("=".repeat(50));
    lines.push(current.title.toUpperCase());
    if (current.subtitle) lines.push(current.subtitle);
    if (current.author) lines.push(`Por ${current.author}`);
    lines.push("=".repeat(50));
    lines.push("");
    lines.push("SUMÁRIO");
    lines.push("-".repeat(30));
    current.chapters.forEach((ch, i) => {
      lines.push(`${i + 1}. ${ch.title}`);
    });
    lines.push("");
    current.chapters.forEach((ch, i) => {
      lines.push("");
      lines.push("=".repeat(50));
      lines.push(`CAPÍTULO ${i + 1}: ${ch.title.toUpperCase()}`);
      lines.push("=".repeat(50));
      lines.push("");
      lines.push(ch.content || "[Conteúdo não preenchido]");
    });
    lines.push("");
    lines.push("=".repeat(50));
    lines.push("Gerado por Mony Ads");
    lines.push("=".repeat(50));
    navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Texto do e-book copiado!");
  };

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const wordCount = current ? current.chapters.reduce((sum, ch) => sum + ch.content.split(/\s+/).filter(Boolean).length, 0) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Gerador de E-books</h2>
            <p className="text-sm text-muted-foreground">Crie e-books profissionais para usar como isca digital</p>
          </div>
          {current && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={saveCurrent}>
                <Save className="w-4 h-4 mr-1" /> Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={exportText}>
                <FileDown className="w-4 h-4 mr-1" /> Exportar Texto
              </Button>
            </div>
          )}
        </div>

        {!current ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-semibold mb-3">Criar Novo E-book</h3>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="w-[220px]">
                  <Label>Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger><SelectValue placeholder="Escolher template" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(TEMPLATES).map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => { createEbook(selectedTemplate || undefined); setSelectedTemplate(""); }}>
                  <Plus className="w-4 h-4 mr-1" /> Criar E-book
                </Button>
              </div>
            </div>

            {ebooks.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> E-books Salvos</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ebooks.map((e) => (
                    <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                      <div>
                        <p className="font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.chapters.length} capítulos • {new Date(e.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setCurrent(e)}>Abrir</Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteEbook(e.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Button size="sm" variant="ghost" onClick={() => { saveCurrent(); setCurrent(null); }}>← Voltar</Button>
              <Badge variant="secondary">{current.chapters.length} capítulos</Badge>
              <Badge variant="outline">{wordCount.toLocaleString("pt-BR")} palavras</Badge>
            </div>

            <Tabs value={mainTab} onValueChange={setMainTab}>
              <TabsList>
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="chapters"><BookOpen className="w-4 h-4 mr-1" /> Capítulos</TabsTrigger>
                <TabsTrigger value="cover"><Palette className="w-4 h-4 mr-1" /> Capa</TabsTrigger>
                <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-1" /> Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Título</Label>
                    <Input value={current.title} onChange={(e) => setCurrent({ ...current, title: e.target.value })} placeholder="Título do e-book" />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Input value={current.subtitle} onChange={(e) => setCurrent({ ...current, subtitle: e.target.value })} placeholder="Subtítulo" />
                  </div>
                  <div>
                    <Label>Autor</Label>
                    <Input value={current.author} onChange={(e) => setCurrent({ ...current, author: e.target.value })} placeholder="Nome do autor" />
                  </div>
                  <div>
                    <Label>Nicho / Tópico</Label>
                    <div className="flex gap-2">
                      <Input value={current.topic} onChange={(e) => setCurrent({ ...current, topic: e.target.value })} placeholder="Ex: marketing, finanças, saúde..." className="flex-1" />
                      <Button variant="outline" onClick={applySuggestions} title="Gerar sugestões de capítulos">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Nichos com sugestões automáticas: marketing, finanças, saúde, negócios, produtividade
                </p>
              </TabsContent>

              <TabsContent value="chapters" className="mt-4 space-y-4">
                <ScrollArea className="h-[420px] pr-2">
                  <div className="space-y-3">
                    {current.chapters.map((ch, idx) => (
                      <div key={ch.id} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">Cap. {idx + 1}</Badge>
                            <Input value={ch.title} onChange={(e) => updateChapter(ch.id, { title: e.target.value })} className="h-8 text-sm font-medium max-w-xs" />
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => moveChapter(idx, -1)} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => moveChapter(idx, 1)} disabled={idx === current.chapters.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingChapter(editingChapter === ch.id ? null : ch.id)}>
                              {editingChapter === ch.id ? "Fechar" : "Editar"}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeChapter(ch.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        {editingChapter === ch.id && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Textarea
                              value={ch.content}
                              onChange={(e) => updateChapter(ch.id, { content: e.target.value })}
                              placeholder="Escreva o conteúdo deste capítulo..."
                              rows={10}
                              className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {ch.content.split(/\s+/).filter(Boolean).length} palavras
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {current.chapters.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Adicione capítulos ou use as sugestões automáticas na aba Informações
                      </p>
                    )}
                  </div>
                </ScrollArea>
                <Button onClick={addChapter}><Plus className="w-4 h-4 mr-1" /> Adicionar Capítulo</Button>
              </TabsContent>

              <TabsContent value="cover" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Cor Primária</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={current.coverColor1} onChange={(e) => setCurrent({ ...current, coverColor1: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                      <Input value={current.coverColor1} onChange={(e) => setCurrent({ ...current, coverColor1: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Cor Secundária</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={current.coverColor2} onChange={(e) => setCurrent({ ...current, coverColor2: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                      <Input value={current.coverColor2} onChange={(e) => setCurrent({ ...current, coverColor2: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={current.coverTextColor} onChange={(e) => setCurrent({ ...current, coverTextColor: e.target.value })} className="w-10 h-8 rounded cursor-pointer" />
                      <Input value={current.coverTextColor} onChange={(e) => setCurrent({ ...current, coverTextColor: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <div
                    className="w-[280px] h-[400px] rounded-lg shadow-2xl flex flex-col items-center justify-center text-center p-8"
                    style={{
                      background: `linear-gradient(135deg, ${current.coverColor1}, ${current.coverColor2})`,
                      color: current.coverTextColor,
                    }}
                  >
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <h3 className="text-2xl font-bold mb-3 leading-tight">{current.title || "Título"}</h3>
                      {current.subtitle && <p className="text-sm opacity-80 mb-4">{current.subtitle}</p>}
                    </div>
                    {current.author && (
                      <p className="text-sm opacity-70 mt-auto">{current.author}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <ScrollArea className="h-[500px] pr-2">
                  <div className="max-w-2xl mx-auto">
                    {/* Cover */}
                    <div
                      className="w-full h-[300px] rounded-lg mb-8 flex flex-col items-center justify-center text-center p-8"
                      style={{
                        background: `linear-gradient(135deg, ${current.coverColor1}, ${current.coverColor2})`,
                        color: current.coverTextColor,
                      }}
                    >
                      <h1 className="text-3xl font-bold mb-3">{current.title}</h1>
                      {current.subtitle && <p className="text-lg opacity-80">{current.subtitle}</p>}
                      {current.author && <p className="mt-6 opacity-70">Por {current.author}</p>}
                    </div>

                    {/* Table of Contents */}
                    {current.chapters.length > 0 && (
                      <div className="mb-8 p-6 rounded-lg bg-muted/50">
                        <h2 className="text-xl font-bold mb-4">Sumário</h2>
                        {current.chapters.map((ch, i) => (
                          <p key={ch.id} className="py-1 text-sm">
                            <span className="font-medium">{i + 1}.</span> {ch.title}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Chapters */}
                    {current.chapters.map((ch, i) => (
                      <div key={ch.id} className="mb-8">
                        <Separator className="mb-6" />
                        <h2 className="text-xl font-bold mb-4">
                          Capítulo {i + 1}: {ch.title}
                        </h2>
                        {ch.content ? (
                          <div className="prose prose-sm max-w-none">
                            {ch.content.split("\n").map((para, pi) => (
                              <p key={pi} className="mb-3 text-muted-foreground leading-relaxed">
                                {para}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic text-sm">[Conteúdo não preenchido]</p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
