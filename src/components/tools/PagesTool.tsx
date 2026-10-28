"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, Save, FileDown,
  LayoutTemplate, Type, Video, ListChecks, MessageSquareQuote,
  DollarSign, Shield, HelpCircle, MousePointerClick, FolderOpen
} from "lucide-react";

type SectionType = "hero" | "video" | "benefits" | "testimonials" | "pricing" | "guarantee" | "faq" | "final-cta";

interface Section {
  id: string;
  type: SectionType;
  data: Record<string, string>;
}

interface Page {
  id: string;
  name: string;
  sections: Section[];
  createdAt: string;
}

const SECTION_DEFAULTS: Record<SectionType, { label: string; icon: React.ReactNode; defaults: Record<string, string> }> = {
  hero: {
    label: "Hero",
    icon: <Type className="w-4 h-4" />,
    defaults: {
      headline: "Transforme Sua Vida Hoje",
      subheadline: "Descubra o método comprovado que já ajudou milhares de pessoas",
      ctaText: "QUERO COMEÇAR AGORA",
      ctaColor: "#22c55e",
    },
  },
  video: {
    label: "Vídeo",
    icon: <Video className="w-4 h-4" />,
    defaults: {
      title: "Assista ao vídeo e descubra como funciona",
      videoUrl: "https://www.youtube.com/embed/exemplo",
    },
  },
  benefits: {
    label: "Benefícios",
    icon: <ListChecks className="w-4 h-4" />,
    defaults: {
      title: "O Que Você Vai Receber",
      benefit1: "✅ Acesso vitalício ao conteúdo completo",
      benefit2: "✅ Suporte exclusivo por 12 meses",
      benefit3: "✅ Bônus especiais para os primeiros compradores",
      benefit4: "✅ Certificado de conclusão",
      benefit5: "✅ Comunidade exclusiva de alunos",
    },
  },
  testimonials: {
    label: "Depoimentos",
    icon: <MessageSquareQuote className="w-4 h-4" />,
    defaults: {
      title: "O Que Nossos Clientes Dizem",
      name1: "Maria Silva",
      text1: "Esse produto mudou minha vida! Recomendo para todos.",
      name2: "João Santos",
      text2: "Resultados incríveis em apenas 30 dias. Vale cada centavo!",
      name3: "Ana Oliveira",
      text3: "O melhor investimento que já fiz na minha carreira.",
    },
  },
  pricing: {
    label: "Preço",
    icon: <DollarSign className="w-4 h-4" />,
    defaults: {
      title: "Investimento Especial",
      originalPrice: "R$ 497,00",
      price: "R$ 197,00",
      installments: "ou 12x de R$ 19,70",
      ctaText: "COMPRAR AGORA",
      ctaColor: "#22c55e",
    },
  },
  guarantee: {
    label: "Garantia",
    icon: <Shield className="w-4 h-4" />,
    defaults: {
      title: "Garantia Incondicional de 7 Dias",
      description: "Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.",
    },
  },
  faq: {
    label: "FAQ",
    icon: <HelpCircle className="w-4 h-4" />,
    defaults: {
      title: "Perguntas Frequentes",
      q1: "Para quem é esse produto?",
      a1: "Para qualquer pessoa que deseja transformar seus resultados.",
      q2: "Como vou receber o acesso?",
      a2: "Imediatamente após a confirmação do pagamento, por e-mail.",
      q3: "Posso pedir reembolso?",
      a3: "Sim, você tem 7 dias de garantia incondicional.",
    },
  },
  "final-cta": {
    label: "CTA Final",
    icon: <MousePointerClick className="w-4 h-4" />,
    defaults: {
      headline: "Não Perca Essa Oportunidade!",
      subheadline: "Vagas limitadas. Garanta a sua agora mesmo.",
      ctaText: "GARANTIR MINHA VAGA",
      ctaColor: "#ef4444",
    },
  },
};

const TEMPLATES: Record<string, SectionType[]> = {
  "Produto Digital": ["hero", "video", "benefits", "testimonials", "pricing", "guarantee", "faq", "final-cta"],
  "Curso Online": ["hero", "video", "benefits", "pricing", "testimonials", "guarantee", "faq", "final-cta"],
  "Serviço": ["hero", "benefits", "testimonials", "pricing", "guarantee", "faq", "final-cta"],
  "Aplicativo": ["hero", "video", "benefits", "testimonials", "pricing", "final-cta"],
};

const STORAGE_KEY = "monyads-pages";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function generateSectionHTML(s: Section): string {
  const d = s.data;
  switch (s.type) {
    case "hero":
      return `<section style="text-align:center;padding:80px 20px;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;">
  <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:16px;">${d.headline}</h1>
  <p style="font-size:1.25rem;opacity:0.85;margin-bottom:32px;">${d.subheadline}</p>
  <a href="#" style="display:inline-block;padding:16px 48px;background:${d.ctaColor};color:#fff;font-weight:700;border-radius:8px;text-decoration:none;font-size:1.1rem;">${d.ctaText}</a>
</section>`;
    case "video":
      return `<section style="text-align:center;padding:60px 20px;background:#f8fafc;">
  <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:24px;color:#0f172a;">${d.title}</h2>
  <div style="max-width:720px;margin:0 auto;aspect-ratio:16/9;background:#000;border-radius:12px;overflow:hidden;">
    <iframe src="${d.videoUrl}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>
  </div>
</section>`;
    case "benefits": {
      const items = [d.benefit1, d.benefit2, d.benefit3, d.benefit4, d.benefit5].filter(Boolean);
      return `<section style="padding:60px 20px;max-width:800px;margin:0 auto;">
  <h2 style="font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:32px;color:#0f172a;">${d.title}</h2>
  <ul style="list-style:none;padding:0;">${items.map((b) => `\n    <li style="padding:12px 0;font-size:1.1rem;color:#334155;">${b}</li>`).join("")}
  </ul>
</section>`;
    }
    case "testimonials":
      return `<section style="padding:60px 20px;background:#f1f5f9;">
  <h2 style="font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:32px;color:#0f172a;">${d.title}</h2>
  <div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;max-width:1000px;margin:0 auto;">
    ${[1, 2, 3].filter((i) => d[`name${i}`]).map((i) => `<div style="flex:1;min-width:260px;background:#fff;padding:24px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.08);">
      <p style="color:#475569;font-style:italic;margin-bottom:12px;">"${d[`text${i}`]}"</p>
      <p style="font-weight:600;color:#0f172a;">— ${d[`name${i}`]}</p>
    </div>`).join("\n    ")}
  </div>
</section>`;
    case "pricing":
      return `<section style="text-align:center;padding:60px 20px;background:#0f172a;color:#fff;">
  <h2 style="font-size:1.75rem;font-weight:700;margin-bottom:24px;">${d.title}</h2>
  <p style="font-size:1.1rem;text-decoration:line-through;opacity:0.6;">${d.originalPrice}</p>
  <p style="font-size:3rem;font-weight:800;color:#22c55e;margin:8px 0;">${d.price}</p>
  <p style="opacity:0.8;margin-bottom:32px;">${d.installments}</p>
  <a href="#" style="display:inline-block;padding:16px 48px;background:${d.ctaColor};color:#fff;font-weight:700;border-radius:8px;text-decoration:none;font-size:1.1rem;">${d.ctaText}</a>
</section>`;
    case "guarantee":
      return `<section style="text-align:center;padding:60px 20px;">
  <div style="max-width:600px;margin:0 auto;padding:32px;border:2px solid #22c55e;border-radius:16px;">
    <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin-bottom:16px;">🛡️ ${d.title}</h2>
    <p style="color:#475569;font-size:1.05rem;">${d.description}</p>
  </div>
</section>`;
    case "faq": {
      const qs = [1, 2, 3].filter((i) => d[`q${i}`]);
      return `<section style="padding:60px 20px;max-width:800px;margin:0 auto;">
  <h2 style="font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:32px;color:#0f172a;">${d.title}</h2>
  ${qs.map((i) => `<div style="margin-bottom:20px;padding:20px;background:#f8fafc;border-radius:8px;">
    <p style="font-weight:600;color:#0f172a;margin-bottom:8px;">${d[`q${i}`]}</p>
    <p style="color:#475569;">${d[`a${i}`]}</p>
  </div>`).join("\n  ")}
</section>`;
    }
    case "final-cta":
      return `<section style="text-align:center;padding:80px 20px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;">
  <h2 style="font-size:2rem;font-weight:800;margin-bottom:16px;">${d.headline}</h2>
  <p style="font-size:1.15rem;opacity:0.9;margin-bottom:32px;">${d.subheadline}</p>
  <a href="#" style="display:inline-block;padding:16px 48px;background:${d.ctaColor || "#fff"};color:#b91c1c;font-weight:700;border-radius:8px;text-decoration:none;font-size:1.1rem;">${d.ctaText}</a>
</section>`;
    default:
      return "";
  }
}

export default function PagesTool() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tab, setTab] = useState("editor");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Page[]) => {
    setPages(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createPage = (name: string, template?: string) => {
    const types = template && TEMPLATES[template] ? TEMPLATES[template] : ["hero", "benefits", "pricing", "final-cta"] as SectionType[];
    const page: Page = {
      id: uid(),
      name,
      sections: types.map((type) => ({
        id: uid(),
        type,
        data: { ...SECTION_DEFAULTS[type].defaults },
      })),
      createdAt: new Date().toISOString(),
    };
    const updated = [...pages, page];
    persist(updated);
    setCurrentPage(page);
    toast.success("Página criada com sucesso!");
  };

  const saveCurrent = () => {
    if (!currentPage) return;
    const updated = pages.map((p) => (p.id === currentPage.id ? currentPage : p));
    persist(updated);
    toast.success("Página salva!");
  };

  const deletePage = (id: string) => {
    persist(pages.filter((p) => p.id !== id));
    if (currentPage?.id === id) setCurrentPage(null);
    toast.success("Página excluída!");
  };

  const addSection = (type: SectionType) => {
    if (!currentPage) return;
    const section: Section = { id: uid(), type, data: { ...SECTION_DEFAULTS[type].defaults } };
    setCurrentPage({ ...currentPage, sections: [...currentPage.sections, section] });
  };

  const removeSection = (id: string) => {
    if (!currentPage) return;
    setCurrentPage({ ...currentPage, sections: currentPage.sections.filter((s) => s.id !== id) });
    if (editingSection === id) setEditingSection(null);
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    if (!currentPage) return;
    const arr = [...currentPage.sections];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setCurrentPage({ ...currentPage, sections: arr });
  };

  const updateSectionData = (sectionId: string, key: string, value: string) => {
    if (!currentPage) return;
    setCurrentPage({
      ...currentPage,
      sections: currentPage.sections.map((s) =>
        s.id === sectionId ? { ...s, data: { ...s.data, [key]: value } } : s
      ),
    });
  };

  const exportHTML = () => {
    if (!currentPage) return;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentPage.name}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}</style>
</head>
<body>
${currentPage.sections.map(generateSectionHTML).join("\n")}
</body>
</html>`;
    navigator.clipboard.writeText(html);
    toast.success("HTML copiado para a área de transferência!");
  };

  const [newPageName, setNewPageName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Criador de Páginas de Vendas</h2>
            <p className="text-sm text-muted-foreground">Construa páginas de alta conversão com seções arrastáveis</p>
          </div>
          {currentPage && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={saveCurrent}>
                <Save className="w-4 h-4 mr-1" /> Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={exportHTML}>
                <FileDown className="w-4 h-4 mr-1" /> Exportar HTML
              </Button>
            </div>
          )}
        </div>

        {!currentPage ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-semibold mb-3">Criar Nova Página</h3>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <Label>Nome da Página</Label>
                  <Input value={newPageName} onChange={(e) => setNewPageName(e.target.value)} placeholder="Ex: Página de vendas do curso..." />
                </div>
                <div className="w-[200px]">
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
                <Button onClick={() => {
                  if (!newPageName.trim()) { toast.error("Informe o nome da página"); return; }
                  createPage(newPageName.trim(), selectedTemplate || undefined);
                  setNewPageName("");
                  setSelectedTemplate("");
                }}>
                  <Plus className="w-4 h-4 mr-1" /> Criar
                </Button>
              </div>
            </div>

            {pages.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> Páginas Salvas</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pages.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sections.length} seções • {new Date(p.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setCurrentPage(p)}>Abrir</Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deletePage(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
              <Button size="sm" variant="ghost" onClick={() => { saveCurrent(); setCurrentPage(null); }}>← Voltar</Button>
              <h3 className="font-semibold text-lg">{currentPage.name}</h3>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-1" /> Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(Object.keys(SECTION_DEFAULTS) as SectionType[]).map((type) => (
                    <Button key={type} size="sm" variant="outline" onClick={() => addSection(type)}>
                      {SECTION_DEFAULTS[type].icon}
                      <span className="ml-1">{SECTION_DEFAULTS[type].label}</span>
                    </Button>
                  ))}
                </div>

                <ScrollArea className="h-[500px] pr-2">
                  <div className="space-y-3">
                    {currentPage.sections.map((section, idx) => (
                      <div key={section.id} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {SECTION_DEFAULTS[section.type].icon}
                            <span className="font-medium text-sm">{SECTION_DEFAULTS[section.type].label}</span>
                            <Badge variant="secondary" className="text-xs">#{idx + 1}</Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => moveSection(idx, -1)} disabled={idx === 0}>
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => moveSection(idx, 1)} disabled={idx === currentPage.sections.length - 1}>
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}>
                              {editingSection === section.id ? "Fechar" : "Editar"}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeSection(section.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {editingSection === section.id && (
                          <div className="space-y-3 mt-3 pt-3 border-t border-border">
                            {Object.entries(section.data).map(([key, val]) => (
                              <div key={key}>
                                <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1").replace(/(\d+)/g, " $1")}</Label>
                                {val.length > 80 ? (
                                  <Textarea value={val} onChange={(e) => updateSectionData(section.id, key, e.target.value)} rows={3} />
                                ) : key.toLowerCase().includes("color") ? (
                                  <div className="flex gap-2 items-center">
                                    <input type="color" value={val} onChange={(e) => updateSectionData(section.id, key, e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
                                    <Input value={val} onChange={(e) => updateSectionData(section.id, key, e.target.value)} className="flex-1" />
                                  </div>
                                ) : (
                                  <Input value={val} onChange={(e) => updateSectionData(section.id, key, e.target.value)} />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {currentPage.sections.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Adicione seções usando os botões acima</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="rounded-lg border border-border overflow-hidden bg-white">
                  <div className="text-xs text-center py-1 bg-muted text-muted-foreground">Preview da Página</div>
                  <div
                    className="w-full"
                    dangerouslySetInnerHTML={{
                      __html: currentPage.sections.map(generateSectionHTML).join(""),
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
