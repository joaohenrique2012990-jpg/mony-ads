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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  Plus, Trash2, Copy, Eye, Save, FolderOpen, LayoutTemplate,
  ArrowUp, ArrowDown, ArrowRight, RotateCcw, HelpCircle
} from "lucide-react";

type QuestionType = "multiple" | "yesno" | "scale";

interface Option {
  id: string;
  text: string;
  points: number;
}

interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: Option[];
}

interface ResultPage {
  id: string;
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

interface Quiz {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  results: ResultPage[];
  createdAt: string;
}

const STORAGE_KEY = "monyads-quizzes";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const TEMPLATES: Record<string, () => Partial<Quiz>> = {
  "Qualificação de Lead": () => ({
    name: "Qualificação de Lead",
    description: "Descubra se nossa solução é ideal para você",
    questions: [
      {
        id: uid(), title: "Qual é o tamanho da sua empresa?", type: "multiple" as QuestionType,
        options: [
          { id: uid(), text: "MEI / Autônomo", points: 1 },
          { id: uid(), text: "Pequena (até 20 funcionários)", points: 2 },
          { id: uid(), text: "Média (20 a 100 funcionários)", points: 3 },
          { id: uid(), text: "Grande (100+ funcionários)", points: 4 },
        ],
      },
      {
        id: uid(), title: "Qual seu faturamento mensal?", type: "multiple" as QuestionType,
        options: [
          { id: uid(), text: "Até R$ 10 mil", points: 1 },
          { id: uid(), text: "R$ 10 mil a R$ 50 mil", points: 2 },
          { id: uid(), text: "R$ 50 mil a R$ 200 mil", points: 3 },
          { id: uid(), text: "Acima de R$ 200 mil", points: 4 },
        ],
      },
      {
        id: uid(), title: "Você já investe em marketing digital?", type: "yesno" as QuestionType,
        options: [
          { id: uid(), text: "Sim", points: 3 },
          { id: uid(), text: "Não", points: 1 },
        ],
      },
    ],
    results: [
      { id: uid(), minScore: 0, maxScore: 5, title: "Perfil Iniciante", description: "Você está começando sua jornada! Recomendamos nosso plano básico.", ctaText: "Ver Plano Básico", ctaUrl: "#" },
      { id: uid(), minScore: 6, maxScore: 8, title: "Perfil Intermediário", description: "Sua empresa tem potencial de crescimento. Nosso plano profissional é ideal.", ctaText: "Ver Plano Pro", ctaUrl: "#" },
      { id: uid(), minScore: 9, maxScore: 12, title: "Perfil Avançado", description: "Você precisa de uma solução robusta. Fale com nosso time comercial.", ctaText: "Falar com Consultor", ctaUrl: "#" },
    ],
  }),
  "Diagnóstico de Negócio": () => ({
    name: "Diagnóstico de Negócio",
    description: "Avalie a saúde do seu negócio em minutos",
    questions: [
      {
        id: uid(), title: "Você tem metas claras para os próximos 12 meses?", type: "yesno" as QuestionType,
        options: [{ id: uid(), text: "Sim", points: 3 }, { id: uid(), text: "Não", points: 1 }],
      },
      {
        id: uid(), title: "Como você avalia sua presença digital? (1-5)", type: "scale" as QuestionType,
        options: [1, 2, 3, 4, 5].map((n) => ({ id: uid(), text: String(n), points: n })),
      },
      {
        id: uid(), title: "Qual seu maior desafio atual?", type: "multiple" as QuestionType,
        options: [
          { id: uid(), text: "Atrair novos clientes", points: 2 },
          { id: uid(), text: "Converter leads em vendas", points: 3 },
          { id: uid(), text: "Fidelizar clientes", points: 2 },
          { id: uid(), text: "Organizar processos", points: 1 },
        ],
      },
    ],
    results: [
      { id: uid(), minScore: 0, maxScore: 5, title: "Atenção Necessária", description: "Seu negócio precisa de ajustes urgentes. Comece pelo básico.", ctaText: "Baixar Guia Gratuito", ctaUrl: "#" },
      { id: uid(), minScore: 6, maxScore: 10, title: "Em Crescimento", description: "Você está no caminho certo, mas pode melhorar.", ctaText: "Agendar Consultoria", ctaUrl: "#" },
      { id: uid(), minScore: 11, maxScore: 15, title: "Negócio Saudável", description: "Parabéns! Seu negócio está bem estruturado.", ctaText: "Ver Soluções Premium", ctaUrl: "#" },
    ],
  }),
  "Perfil de Cliente": () => ({
    name: "Perfil de Cliente",
    description: "Descubra qual perfil de cliente você é",
    questions: [
      {
        id: uid(), title: "O que mais te motiva a comprar?", type: "multiple" as QuestionType,
        options: [
          { id: uid(), text: "Preço baixo", points: 1 },
          { id: uid(), text: "Qualidade premium", points: 3 },
          { id: uid(), text: "Praticidade", points: 2 },
          { id: uid(), text: "Exclusividade", points: 4 },
        ],
      },
      {
        id: uid(), title: "Com que frequência você compra online?", type: "multiple" as QuestionType,
        options: [
          { id: uid(), text: "Raramente", points: 1 },
          { id: uid(), text: "Mensalmente", points: 2 },
          { id: uid(), text: "Semanalmente", points: 3 },
          { id: uid(), text: "Diariamente", points: 4 },
        ],
      },
    ],
    results: [
      { id: uid(), minScore: 0, maxScore: 3, title: "Comprador Cauteloso", description: "Você pesquisa bastante antes de comprar. Aproveite nossa garantia!", ctaText: "Conhecer Garantia", ctaUrl: "#" },
      { id: uid(), minScore: 4, maxScore: 6, title: "Comprador Estratégico", description: "Você busca o melhor custo-benefício.", ctaText: "Ver Ofertas", ctaUrl: "#" },
      { id: uid(), minScore: 7, maxScore: 8, title: "Comprador Premium", description: "Você valoriza qualidade e exclusividade.", ctaText: "Ver Linha Premium", ctaUrl: "#" },
    ],
  }),
};

function generateDefaultOptions(type: QuestionType): Option[] {
  if (type === "yesno") return [{ id: uid(), text: "Sim", points: 2 }, { id: uid(), text: "Não", points: 0 }];
  if (type === "scale") return [1, 2, 3, 4, 5].map((n) => ({ id: uid(), text: String(n), points: n }));
  return [{ id: uid(), text: "Opção 1", points: 1 }, { id: uid(), text: "Opção 2", points: 2 }];
}

export default function QuizTool() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [current, setCurrent] = useState<Quiz | null>(null);
  const [mainTab, setMainTab] = useState("editor");

  // Preview state
  const [previewStep, setPreviewStep] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, number>>({});
  const [previewDone, setPreviewDone] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setQuizzes(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Quiz[]) => {
    setQuizzes(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createQuiz = (template?: string) => {
    const tpl = template && TEMPLATES[template] ? TEMPLATES[template]() : {};
    const quiz: Quiz = {
      id: uid(),
      name: tpl.name || "Novo Quiz",
      description: tpl.description || "",
      questions: tpl.questions || [],
      results: tpl.results || [],
      createdAt: new Date().toISOString(),
    };
    persist([...quizzes, quiz]);
    setCurrent(quiz);
    toast.success("Quiz criado!");
  };

  const saveCurrent = () => {
    if (!current) return;
    persist(quizzes.map((q) => (q.id === current.id ? current : q)));
    toast.success("Quiz salvo!");
  };

  const deleteQuiz = (id: string) => {
    persist(quizzes.filter((q) => q.id !== id));
    if (current?.id === id) setCurrent(null);
    toast.success("Quiz excluído!");
  };

  const addQuestion = () => {
    if (!current) return;
    const q: Question = { id: uid(), title: "Nova pergunta", type: "multiple", options: generateDefaultOptions("multiple") };
    setCurrent({ ...current, questions: [...current.questions, q] });
  };

  const updateQuestion = (qid: string, patch: Partial<Question>) => {
    if (!current) return;
    setCurrent({
      ...current,
      questions: current.questions.map((q) => {
        if (q.id !== qid) return q;
        const updated = { ...q, ...patch };
        if (patch.type && patch.type !== q.type) {
          updated.options = generateDefaultOptions(patch.type);
        }
        return updated;
      }),
    });
  };

  const removeQuestion = (qid: string) => {
    if (!current) return;
    setCurrent({ ...current, questions: current.questions.filter((q) => q.id !== qid) });
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    if (!current) return;
    const arr = [...current.questions];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setCurrent({ ...current, questions: arr });
  };

  const updateOption = (qid: string, oid: string, patch: Partial<Option>) => {
    if (!current) return;
    setCurrent({
      ...current,
      questions: current.questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, ...patch } : o)) }
          : q
      ),
    });
  };

  const addOption = (qid: string) => {
    if (!current) return;
    setCurrent({
      ...current,
      questions: current.questions.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, { id: uid(), text: "Nova opção", points: 1 }] } : q
      ),
    });
  };

  const removeOption = (qid: string, oid: string) => {
    if (!current) return;
    setCurrent({
      ...current,
      questions: current.questions.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q
      ),
    });
  };

  const addResult = () => {
    if (!current) return;
    const r: ResultPage = { id: uid(), minScore: 0, maxScore: 10, title: "Resultado", description: "Descrição do resultado", ctaText: "Saiba Mais", ctaUrl: "#" };
    setCurrent({ ...current, results: [...current.results, r] });
  };

  const updateResult = (rid: string, patch: Partial<ResultPage>) => {
    if (!current) return;
    setCurrent({ ...current, results: current.results.map((r) => (r.id === rid ? { ...r, ...patch } : r)) });
  };

  const removeResult = (rid: string) => {
    if (!current) return;
    setCurrent({ ...current, results: current.results.filter((r) => r.id !== rid) });
  };

  const resetPreview = () => {
    setPreviewStep(0);
    setPreviewAnswers({});
    setPreviewDone(false);
  };

  const answerQuestion = (qid: string, points: number) => {
    const newAnswers = { ...previewAnswers, [qid]: points };
    setPreviewAnswers(newAnswers);
    if (current && previewStep < current.questions.length - 1) {
      setTimeout(() => setPreviewStep(previewStep + 1), 300);
    } else {
      setTimeout(() => setPreviewDone(true), 300);
    }
  };

  const getTotalScore = () => Object.values(previewAnswers).reduce((a, b) => a + b, 0);

  const getResult = (): ResultPage | null => {
    if (!current) return null;
    const score = getTotalScore();
    return current.results.find((r) => score >= r.minScore && score <= r.maxScore) || current.results[current.results.length - 1] || null;
  };

  const generateEmbedCode = () => {
    if (!current) return;
    const code = `<!-- Quiz: ${current.name} -->
<div id="mony-quiz-${current.id}" style="max-width:600px;margin:0 auto;font-family:sans-serif;">
  <h2 style="text-align:center;margin-bottom:8px;">${current.name}</h2>
  <p style="text-align:center;color:#666;margin-bottom:24px;">${current.description}</p>
  <!-- Quiz gerado por Mony Ads - ${current.questions.length} perguntas -->
  <p style="text-align:center;color:#999;font-size:14px;">Quiz com ${current.questions.length} perguntas e ${current.results.length} resultados possíveis</p>
  <script>
    // Quiz data - integrate with your preferred quiz engine
    var quizData = ${JSON.stringify({ questions: current.questions, results: current.results }, null, 2)};
  </script>
</div>`;
    navigator.clipboard.writeText(code);
    toast.success("Código embed copiado!");
  };

  const [selectedTemplate, setSelectedTemplate] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Criador de Quizzes</h2>
            <p className="text-sm text-muted-foreground">Crie quizzes interativos para captura e qualificação de leads</p>
          </div>
          {current && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={saveCurrent}>
                <Save className="w-4 h-4 mr-1" /> Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={generateEmbedCode}>
                <Copy className="w-4 h-4 mr-1" /> Embed
              </Button>
            </div>
          )}
        </div>

        {!current ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-semibold mb-3">Criar Novo Quiz</h3>
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
                <Button onClick={() => { createQuiz(selectedTemplate || undefined); setSelectedTemplate(""); }}>
                  <Plus className="w-4 h-4 mr-1" /> Criar Quiz
                </Button>
                <Button variant="outline" onClick={() => createQuiz()}>
                  Quiz em branco
                </Button>
              </div>
            </div>

            {quizzes.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><FolderOpen className="w-4 h-4" /> Quizzes Salvos</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {quizzes.map((q) => (
                    <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                      <div>
                        <p className="font-medium">{q.name}</p>
                        <p className="text-xs text-muted-foreground">{q.questions.length} perguntas • {new Date(q.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setCurrent(q)}>Abrir</Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteQuiz(q.id)}><Trash2 className="w-4 h-4" /></Button>
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
              <Input value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })} className="max-w-xs font-semibold" />
            </div>

            <Tabs value={mainTab} onValueChange={(v) => { setMainTab(v); if (v === "preview") resetPreview(); }}>
              <TabsList>
                <TabsTrigger value="editor">Perguntas</TabsTrigger>
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-1" /> Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4 space-y-4">
                <div className="flex gap-2 items-center">
                  <Label>Descrição:</Label>
                  <Input value={current.description} onChange={(e) => setCurrent({ ...current, description: e.target.value })} placeholder="Descrição do quiz..." className="flex-1" />
                </div>
                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-4">
                    {current.questions.map((q, idx) => (
                      <div key={q.id} className="rounded-lg border border-border bg-background p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Pergunta {idx + 1}</Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => moveQuestion(idx, -1)} disabled={idx === 0}><ArrowUp className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => moveQuestion(idx, 1)} disabled={idx === current.questions.length - 1}><ArrowDown className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeQuestion(q.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        <Input value={q.title} onChange={(e) => updateQuestion(q.id, { title: e.target.value })} placeholder="Texto da pergunta" />
                        <Select value={q.type} onValueChange={(v) => updateQuestion(q.id, { type: v as QuestionType })}>
                          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple">Múltipla Escolha</SelectItem>
                            <SelectItem value="yesno">Sim / Não</SelectItem>
                            <SelectItem value="scale">Escala (1-5)</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="space-y-2">
                          <Label className="text-xs">Opções:</Label>
                          {q.options.map((o) => (
                            <div key={o.id} className="flex gap-2 items-center">
                              <Input value={o.text} onChange={(e) => updateOption(q.id, o.id, { text: e.target.value })} className="flex-1" />
                              <Input type="number" value={o.points} onChange={(e) => updateOption(q.id, o.id, { points: Number(e.target.value) })} className="w-20" placeholder="Pts" />
                              {q.type === "multiple" && (
                                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeOption(q.id, o.id)}><Trash2 className="w-3 h-3" /></Button>
                              )}
                            </div>
                          ))}
                          {q.type === "multiple" && (
                            <Button size="sm" variant="ghost" onClick={() => addOption(q.id)}><Plus className="w-3 h-3 mr-1" /> Opção</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button onClick={addQuestion}><Plus className="w-4 h-4 mr-1" /> Adicionar Pergunta</Button>
              </TabsContent>

              <TabsContent value="results" className="mt-4 space-y-4">
                <ScrollArea className="h-[400px] pr-2">
                  <div className="space-y-4">
                    {current.results.map((r, idx) => (
                      <div key={r.id} className="rounded-lg border border-border bg-background p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Resultado {idx + 1}</Badge>
                          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeResult(r.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Pontuação Mínima</Label>
                            <Input type="number" value={r.minScore} onChange={(e) => updateResult(r.id, { minScore: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label className="text-xs">Pontuação Máxima</Label>
                            <Input type="number" value={r.maxScore} onChange={(e) => updateResult(r.id, { maxScore: Number(e.target.value) })} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Título</Label>
                          <Input value={r.title} onChange={(e) => updateResult(r.id, { title: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Descrição</Label>
                          <Textarea value={r.description} onChange={(e) => updateResult(r.id, { description: e.target.value })} rows={2} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Texto do CTA</Label>
                            <Input value={r.ctaText} onChange={(e) => updateResult(r.id, { ctaText: e.target.value })} />
                          </div>
                          <div>
                            <Label className="text-xs">URL do CTA</Label>
                            <Input value={r.ctaUrl} onChange={(e) => updateResult(r.id, { ctaUrl: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button onClick={addResult}><Plus className="w-4 h-4 mr-1" /> Adicionar Resultado</Button>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="rounded-2xl border border-border bg-card/60 p-6 max-w-lg mx-auto">
                  {current.questions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Adicione perguntas para visualizar o quiz</p>
                  ) : !previewDone ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>{current.name}</span>
                          <span>{previewStep + 1} de {current.questions.length}</span>
                        </div>
                        <Progress value={((previewStep + 1) / current.questions.length) * 100} />
                      </div>
                      {(() => {
                        const q = current.questions[previewStep];
                        if (!q) return null;
                        return (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{q.title}</h3>
                            <RadioGroup
                              value={previewAnswers[q.id] !== undefined ? String(previewAnswers[q.id]) : ""}
                              onValueChange={(val) => answerQuestion(q.id, Number(val))}
                            >
                              {q.options.map((o) => (
                                <div key={o.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
                                  <RadioGroupItem value={String(o.points)} id={o.id} />
                                  <Label htmlFor={o.id} className="cursor-pointer flex-1">{o.text}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      {(() => {
                        const result = getResult();
                        if (!result) return <p>Nenhum resultado configurado para esta pontuação.</p>;
                        return (
                          <>
                            <div className="text-4xl">🎉</div>
                            <h3 className="text-xl font-bold">{result.title}</h3>
                            <p className="text-muted-foreground">{result.description}</p>
                            <p className="text-sm">Pontuação: {getTotalScore()}</p>
                            <Button className="w-full">{result.ctaText} <ArrowRight className="w-4 h-4 ml-1" /></Button>
                          </>
                        );
                      })()}
                      <Button variant="outline" onClick={resetPreview}><RotateCcw className="w-4 h-4 mr-1" /> Refazer Quiz</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
