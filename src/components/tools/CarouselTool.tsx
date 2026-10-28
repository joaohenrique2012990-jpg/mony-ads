import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Copy,
  Save,
  FolderOpen,
  X,
  LayoutTemplate,
  Eye,
  List,
} from "lucide-react";
import { toast } from "sonner";

interface Slide {
  id: string;
  title: string;
  body: string;
  bgColor: string;
  textColor: string;
}

interface Carousel {
  id: string;
  name: string;
  template: string;
  slides: Slide[];
  createdAt: string;
}

const TEMPLATES: Record<string, { label: string; slides: Omit<Slide, "id">[] }> = {
  educacional: {
    label: "Educacional",
    slides: [
      { title: "Você sabia?", body: "Introduza o tema principal aqui. Algo que chame atenção do leitor.", bgColor: "#1e40af", textColor: "#ffffff" },
      { title: "O Problema", body: "Descreva o problema que seu público enfrenta no dia a dia.", bgColor: "#1e3a8a", textColor: "#ffffff" },
      { title: "Por que isso acontece?", body: "Explique a causa raiz do problema de forma simples.", bgColor: "#1d4ed8", textColor: "#ffffff" },
      { title: "A Solução", body: "Apresente a solução de maneira clara e objetiva.", bgColor: "#2563eb", textColor: "#ffffff" },
      { title: "Conclusão", body: "Resuma os pontos principais e faça um CTA forte.", bgColor: "#3b82f6", textColor: "#ffffff" },
    ],
  },
  storytelling: {
    label: "Storytelling",
    slides: [
      { title: "Era uma vez...", body: "Comece com uma história envolvente que conecte com o público.", bgColor: "#7c2d12", textColor: "#ffffff" },
      { title: "O Desafio", body: "Apresente o obstáculo que o protagonista enfrentou.", bgColor: "#9a3412", textColor: "#ffffff" },
      { title: "A Virada", body: "Mostre o momento de transformação.", bgColor: "#c2410c", textColor: "#ffffff" },
      { title: "O Resultado", body: "Revele o resultado alcançado com dados ou emoção.", bgColor: "#ea580c", textColor: "#ffffff" },
      { title: "E você?", body: "Convide o leitor a viver a mesma transformação.", bgColor: "#f97316", textColor: "#ffffff" },
    ],
  },
  dicas: {
    label: "Lista de Dicas",
    slides: [
      { title: "5 Dicas para...", body: "Tema do carrossel. Use uma promessa clara.", bgColor: "#065f46", textColor: "#ffffff" },
      { title: "Dica #1", body: "Primeira dica com explicação breve e prática.", bgColor: "#047857", textColor: "#ffffff" },
      { title: "Dica #2", body: "Segunda dica com explicação breve e prática.", bgColor: "#059669", textColor: "#ffffff" },
      { title: "Dica #3", body: "Terceira dica com explicação breve e prática.", bgColor: "#10b981", textColor: "#ffffff" },
      { title: "Dica #4", body: "Quarta dica com explicação breve e prática.", bgColor: "#34d399", textColor: "#1f2937" },
      { title: "Dica #5", body: "Quinta dica com explicação breve e prática.", bgColor: "#6ee7b7", textColor: "#1f2937" },
      { title: "Salve este post!", body: "Gostou? Compartilhe com quem precisa dessas dicas!", bgColor: "#a7f3d0", textColor: "#1f2937" },
    ],
  },
  antesDepois: {
    label: "Antes e Depois",
    slides: [
      { title: "Antes vs Depois", body: "Veja a transformação completa.", bgColor: "#581c87", textColor: "#ffffff" },
      { title: "ANTES ❌", body: "Descreva a situação anterior com detalhes reais.", bgColor: "#6b21a8", textColor: "#ffffff" },
      { title: "O que mudou?", body: "Explique o processo de mudança.", bgColor: "#7c3aed", textColor: "#ffffff" },
      { title: "DEPOIS ✅", body: "Mostre o resultado final com dados concretos.", bgColor: "#8b5cf6", textColor: "#ffffff" },
      { title: "Quer o mesmo resultado?", body: "CTA direto para ação.", bgColor: "#a78bfa", textColor: "#1f2937" },
    ],
  },
  passoAPasso: {
    label: "Passo a Passo",
    slides: [
      { title: "Como fazer X em 4 passos", body: "Guia prático e rápido.", bgColor: "#0f172a", textColor: "#ffffff" },
      { title: "Passo 1", body: "Descrição detalhada do primeiro passo.", bgColor: "#1e293b", textColor: "#ffffff" },
      { title: "Passo 2", body: "Descrição detalhada do segundo passo.", bgColor: "#334155", textColor: "#ffffff" },
      { title: "Passo 3", body: "Descrição detalhada do terceiro passo.", bgColor: "#475569", textColor: "#ffffff" },
      { title: "Passo 4", body: "Descrição detalhada do quarto passo.", bgColor: "#64748b", textColor: "#ffffff" },
      { title: "Pronto! 🎉", body: "Agora é sua vez. Salve e compartilhe!", bgColor: "#94a3b8", textColor: "#1f2937" },
    ],
  },
};

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export default function CarouselTool() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [currentCarousel, setCurrentCarousel] = useState<Carousel | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [view, setView] = useState<"list" | "edit">("list");
  const [carouselName, setCarouselName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mony-carousels");
    if (saved) {
      try {
        setCarousels(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mony-carousels", JSON.stringify(carousels));
  }, [carousels]);

  function createFromTemplate(templateKey: string) {
    const template = TEMPLATES[templateKey];
    if (!template) return;
    const carousel: Carousel = {
      id: generateId(),
      name: carouselName || `Carrossel ${template.label}`,
      template: templateKey,
      slides: template.slides.map((s) => ({ ...s, id: generateId() })),
      createdAt: new Date().toISOString(),
    };
    setCurrentCarousel(carousel);
    setPreviewIndex(0);
    setView("edit");
    setCarouselName("");
  }

  function createBlank() {
    const carousel: Carousel = {
      id: generateId(),
      name: carouselName || "Novo Carrossel",
      template: "custom",
      slides: [
        { id: generateId(), title: "Slide 1", body: "Conteúdo do slide", bgColor: "#1e40af", textColor: "#ffffff" },
        { id: generateId(), title: "Slide 2", body: "Conteúdo do slide", bgColor: "#2563eb", textColor: "#ffffff" },
      ],
      createdAt: new Date().toISOString(),
    };
    setCurrentCarousel(carousel);
    setPreviewIndex(0);
    setView("edit");
    setCarouselName("");
  }

  function saveCarousel() {
    if (!currentCarousel) return;
    setCarousels((prev) => {
      const idx = prev.findIndex((c) => c.id === currentCarousel.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = currentCarousel;
        return copy;
      }
      return [...prev, currentCarousel];
    });
    toast.success("Carrossel salvo com sucesso!");
  }

  function deleteCarousel(id: string) {
    setCarousels((prev) => prev.filter((c) => c.id !== id));
    toast.success("Carrossel excluído");
  }

  function openCarousel(carousel: Carousel) {
    setCurrentCarousel({ ...carousel, slides: carousel.slides.map((s) => ({ ...s })) });
    setPreviewIndex(0);
    setView("edit");
  }

  function updateSlide(index: number, field: keyof Slide, value: string) {
    if (!currentCarousel) return;
    const slides = [...currentCarousel.slides];
    slides[index] = { ...slides[index], [field]: value };
    setCurrentCarousel({ ...currentCarousel, slides });
  }

  function addSlide() {
    if (!currentCarousel || currentCarousel.slides.length >= 10) {
      toast.error("Máximo de 10 slides atingido");
      return;
    }
    const slides = [
      ...currentCarousel.slides,
      { id: generateId(), title: "Novo Slide", body: "Conteúdo", bgColor: "#3b82f6", textColor: "#ffffff" },
    ];
    setCurrentCarousel({ ...currentCarousel, slides });
  }

  function removeSlide(index: number) {
    if (!currentCarousel || currentCarousel.slides.length <= 2) {
      toast.error("Mínimo de 2 slides necessário");
      return;
    }
    const slides = currentCarousel.slides.filter((_, i) => i !== index);
    setCurrentCarousel({ ...currentCarousel, slides });
    if (previewIndex >= slides.length) setPreviewIndex(slides.length - 1);
  }

  function moveSlide(index: number, direction: "up" | "down") {
    if (!currentCarousel) return;
    const slides = [...currentCarousel.slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;
    [slides[index], slides[targetIndex]] = [slides[targetIndex], slides[index]];
    setCurrentCarousel({ ...currentCarousel, slides });
    if (previewIndex === index) setPreviewIndex(targetIndex);
    else if (previewIndex === targetIndex) setPreviewIndex(index);
  }

  function exportAsText() {
    if (!currentCarousel) return;
    const text = currentCarousel.slides
      .map((s, i) => `--- Slide ${i + 1}/${currentCarousel.slides.length} ---\n${s.title}\n\n${s.body}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Conteúdo copiado para a área de transferência!");
  }

  const currentSlide = currentCarousel?.slides[previewIndex];

  if (view === "edit" && currentCarousel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView("list")}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <Input
              value={currentCarousel.name}
              onChange={(e) => setCurrentCarousel({ ...currentCarousel, name: e.target.value })}
              className="text-lg font-semibold w-64"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportAsText}>
              <Copy className="h-4 w-4 mr-1" /> Exportar Texto
            </Button>
            <Button size="sm" onClick={saveCarousel}>
              <Save className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Pré-visualização
            </h3>
            {currentSlide && (
              <div className="space-y-4">
                <div
                  className="aspect-square rounded-xl flex flex-col items-center justify-center p-8 text-center transition-all"
                  style={{ backgroundColor: currentSlide.bgColor, color: currentSlide.textColor }}
                >
                  <h2 className="text-2xl font-bold mb-4 leading-tight">{currentSlide.title}</h2>
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{currentSlide.body}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={previewIndex === 0}
                    onClick={() => setPreviewIndex((i) => i - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground">
                    {previewIndex + 1}/{currentCarousel.slides.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={previewIndex === currentCarousel.slides.length - 1}
                    onClick={() => setPreviewIndex((i) => i + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {/* Dot indicators */}
                <div className="flex justify-center gap-1.5">
                  {currentCarousel.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className={`h-2 w-2 rounded-full transition-all ${i === previewIndex ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide Editor */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <List className="h-4 w-4" /> Slides ({currentCarousel.slides.length}/10)
              </h3>
              <Button size="sm" variant="outline" onClick={addSlide} disabled={currentCarousel.slides.length >= 10}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {currentCarousel.slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className={`rounded-lg border p-4 space-y-3 cursor-pointer transition-all ${i === previewIndex ? "border-primary bg-primary/5" : "border-border"}`}
                    onClick={() => setPreviewIndex(i)}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Slide {i + 1}</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={i === 0} onClick={(e) => { e.stopPropagation(); moveSlide(i, "up"); }}>
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={i === currentCarousel.slides.length - 1} onClick={(e) => { e.stopPropagation(); moveSlide(i, "down"); }}>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); removeSlide(i); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateSlide(i, "title", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Texto</Label>
                      <Textarea
                        value={slide.body}
                        onChange={(e) => updateSlide(i, "body", e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label className="text-xs">Cor de fundo</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={slide.bgColor}
                            onChange={(e) => updateSlide(i, "bgColor", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-10 rounded cursor-pointer border-0"
                          />
                          <Input
                            value={slide.bgColor}
                            onChange={(e) => updateSlide(i, "bgColor", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <Label className="text-xs">Cor do texto</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={slide.textColor}
                            onChange={(e) => updateSlide(i, "textColor", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-10 rounded cursor-pointer border-0"
                          />
                          <Input
                            value={slide.textColor}
                            onChange={(e) => updateSlide(i, "textColor", e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Create new */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="text-lg font-semibold mb-4">Criar novo carrossel</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Nome do carrossel"
            value={carouselName}
            onChange={(e) => setCarouselName(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" onClick={createBlank}>
            <Plus className="h-4 w-4 mr-1" /> Em Branco
          </Button>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4" /> Ou escolha um template:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(TEMPLATES).map(([key, tmpl]) => (
            <Button key={key} variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => createFromTemplate(key)}>
              <span className="text-sm font-medium">{tmpl.label}</span>
              <span className="text-xs text-muted-foreground">{tmpl.slides.length} slides</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Saved carousels */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FolderOpen className="h-5 w-5" /> Carrosséis Salvos ({carousels.length})
        </h3>
        {carousels.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum carrossel salvo ainda. Crie um novo acima!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {carousels.map((carousel) => (
              <div
                key={carousel.id}
                className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => openCarousel(carousel)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium truncate flex-1">{carousel.name}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCarousel(carousel.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {carousel.slides.length} slides
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {TEMPLATES[carousel.template]?.label || "Personalizado"}
                  </Badge>
                </div>
                {/* Mini preview */}
                <div className="flex gap-1">
                  {carousel.slides.slice(0, 5).map((slide) => (
                    <div
                      key={slide.id}
                      className="h-8 flex-1 rounded"
                      style={{ backgroundColor: slide.bgColor }}
                    />
                  ))}
                  {carousel.slides.length > 5 && (
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      +{carousel.slides.length - 5}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(carousel.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
