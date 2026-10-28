import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Copy,
  Sparkles,
  FileText,
  Search,
  Trash2,
  Save,
  Download,
  Clock,
  BookOpen,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface TimestampNote {
  id: string;
  timestamp: string;
  note: string;
}

interface SavedTranscript {
  id: string;
  title: string;
  rawText: string;
  cleanText: string;
  savedAt: string;
}

interface SavedVideoNotes {
  id: string;
  url: string;
  title: string;
  notes: TimestampNote[];
  savedAt: string;
}

const STORAGE_KEY_TRANSCRIPTS = "mony-transcriber-transcripts";
const STORAGE_KEY_NOTES = "mony-transcriber-notes";

function genId() {
  return Math.random().toString(36).substring(2, 11);
}

function cleanTranscript(raw: string): string {
  let text = raw;

  // Remove timestamp patterns: [00:00], 00:00, (00:00), 0:00:00, etc.
  text = text.replace(/[\[\(]?\d{1,2}:\d{2}(?::\d{2})?[\]\)]?\s*/g, "");

  // Remove [Music], [Applause], [Laughter] and similar tags
  text = text.replace(/\[(?:Music|Música|Applause|Laughter|Risos|Aplausos|Inaudible|Inaudível)[^\]]*\]/gi, "");

  // Remove speaker labels like "Speaker 1:", ">>", "- "
  text = text.replace(/^(?:Speaker\s*\d+|Orador\s*\d+|>>)\s*:?\s*/gim, "");

  // Remove duplicate lines
  const lines = text.split("\n");
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      deduped.push("");
      continue;
    }
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(trimmed);
    }
  }
  text = deduped.join("\n");

  // Collapse multiple blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  // Fix capitalization after periods
  text = text.replace(
    /([.!?])\s+([a-záàâãéèêíïóôõöúçñ])/g,
    (_, p, c) => `${p} ${c.toUpperCase()}`
  );

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  // Add periods to lines that don't end with punctuation
  const finalLines = text.split("\n").map((line) => {
    const t = line.trim();
    if (t.length > 0 && !/[.!?:;,]$/.test(t)) {
      return t + ".";
    }
    return t;
  });
  text = finalLines.join("\n");

  // Organize into paragraphs: group every ~3-5 sentences
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const s of sentences) {
    current.push(s);
    if (current.length >= 3 + Math.floor(Math.random() * 3)) {
      paragraphs.push(current.join(" "));
      current = [];
    }
  }
  if (current.length > 0) {
    paragraphs.push(current.join(" "));
  }

  return paragraphs.join("\n\n").trim();
}

function generateSummary(text: string): string {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 10);

  if (sentences.length === 0) return "Sem conteúdo suficiente para resumir.";

  // Pick first, middle, and last sentences as a simple extractive summary
  const picks: string[] = [];
  picks.push(sentences[0]);
  if (sentences.length > 2) {
    picks.push(sentences[Math.floor(sentences.length / 2)]);
  }
  if (sentences.length > 1) {
    picks.push(sentences[sentences.length - 1]);
  }

  return picks.join(" ");
}

function extractKeyPoints(text: string): string[] {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 15);

  if (sentences.length === 0) return [];

  // Extract sentences that seem important (longer, contain key indicators)
  const importantWords = [
    "importante",
    "principal",
    "essencial",
    "fundamental",
    "resultado",
    "conclusão",
    "objetivo",
    "estratégia",
    "dica",
    "primeiro",
    "segundo",
    "terceiro",
    "porque",
    "portanto",
    "então",
    "precisa",
    "deve",
    "sempre",
    "nunca",
    "melhor",
    "pior",
  ];

  const scored = sentences.map((s) => {
    let score = 0;
    const lower = s.toLowerCase();
    for (const w of importantWords) {
      if (lower.includes(w)) score += 2;
    }
    if (s.length > 80) score += 1;
    if (s.includes("!")) score += 1;
    return { sentence: s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, Math.min(5, Math.ceil(sentences.length / 3)));
  return top.map((t) => t.sentence.trim());
}

export default function TranscriberTool() {
  const [rawText, setRawText] = useState("");
  const [cleanText, setCleanText] = useState("");
  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessed, setIsProcessed] = useState(false);
  const [savedTranscripts, setSavedTranscripts] = useState<SavedTranscript[]>([]);

  // Video Notes
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoNotes, setVideoNotes] = useState<TimestampNote[]>([]);
  const [noteTimestamp, setNoteTimestamp] = useState("");
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedVideoNotes[]>([]);

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_KEY_TRANSCRIPTS);
      if (t) setSavedTranscripts(JSON.parse(t));
      const n = localStorage.getItem(STORAGE_KEY_NOTES);
      if (n) setSavedNotes(JSON.parse(n));
    } catch {}
  }, []);

  const persistTranscripts = (items: SavedTranscript[]) => {
    setSavedTranscripts(items);
    localStorage.setItem(STORAGE_KEY_TRANSCRIPTS, JSON.stringify(items));
  };

  const persistNotes = (items: SavedVideoNotes[]) => {
    setSavedNotes(items);
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(items));
  };

  const handleProcess = () => {
    if (!rawText.trim()) {
      toast.error("Cole o texto da transcrição primeiro.");
      return;
    }
    const cleaned = cleanTranscript(rawText);
    setCleanText(cleaned);
    setSummary(generateSummary(cleaned));
    setKeyPoints(extractKeyPoints(cleaned));
    setIsProcessed(true);
    toast.success("Transcrição processada!");
  };

  const stats = useMemo(() => {
    if (!cleanText) return null;
    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const chars = cleanText.length;
    const readingTime = Math.ceil(words / 200); // ~200 wpm
    const videoDuration = Math.ceil(words / 150); // ~150 wpm for speech
    return { words, chars, readingTime, videoDuration };
  }, [cleanText]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !cleanText) return [];
    const q = searchQuery.toLowerCase();
    const sentences = cleanText.split(/(?<=[.!?])\s+/);
    return sentences.filter((s) => s.toLowerCase().includes(q));
  }, [searchQuery, cleanText]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const handleSaveTranscript = () => {
    if (!cleanText) return;
    const title =
      cleanText
        .split(/[.!?]/)[0]
        ?.trim()
        .substring(0, 50) || "Transcrição";
    persistTranscripts([
      {
        id: genId(),
        title,
        rawText,
        cleanText,
        savedAt: new Date().toLocaleString("pt-BR"),
      },
      ...savedTranscripts,
    ]);
    toast.success("Transcrição salva!");
  };

  const handleAddNote = () => {
    if (!noteTimestamp.trim() || !noteText.trim()) {
      toast.error("Preencha o timestamp e a nota.");
      return;
    }
    setVideoNotes([
      ...videoNotes,
      { id: genId(), timestamp: noteTimestamp, note: noteText },
    ]);
    setNoteTimestamp("");
    setNoteText("");
    toast.success("Nota adicionada!");
  };

  const handleSaveVideoNotes = () => {
    if (videoNotes.length === 0) {
      toast.error("Adicione pelo menos uma nota.");
      return;
    }
    persistNotes([
      {
        id: genId(),
        url: videoUrl,
        title: videoTitle || "Vídeo sem título",
        notes: videoNotes,
        savedAt: new Date().toLocaleString("pt-BR"),
      },
      ...savedNotes,
    ]);
    toast.success("Notas salvas!");
  };

  const handleExport = () => {
    let exported = `# Transcrição Limpa\n\n${cleanText}\n\n`;
    if (summary) exported += `## Resumo\n\n${summary}\n\n`;
    if (keyPoints.length > 0) {
      exported += `## Pontos-chave\n\n${keyPoints.map((p) => `- ${p}`).join("\n")}\n\n`;
    }
    if (stats) {
      exported += `## Estatísticas\n- Palavras: ${stats.words}\n- Tempo de leitura: ~${stats.readingTime} min\n- Duração estimada do vídeo: ~${stats.videoDuration} min\n`;
    }
    navigator.clipboard.writeText(exported);
    toast.success("Texto exportado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Transcritor de Vídeos</h2>
        </div>

        <Tabs defaultValue="transcriber">
          <TabsList className="mb-4">
            <TabsTrigger value="transcriber">Transcrição</TabsTrigger>
            <TabsTrigger value="notes">Notas de Vídeo</TabsTrigger>
            <TabsTrigger value="saved">Salvos</TabsTrigger>
          </TabsList>

          {/* TRANSCRIBER TAB */}
          <TabsContent value="transcriber" className="space-y-4">
            <div>
              <Label>Texto Bruto da Transcrição</Label>
              <Textarea
                placeholder="Cole aqui o texto bruto da transcrição (legendas do YouTube, legendas automáticas, etc.)..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={8}
                className="mt-1 font-mono text-xs"
              />
              {rawText.trim() && (
                <p className="text-xs text-muted-foreground mt-1">
                  {rawText.split(/\s+/).filter(Boolean).length} palavras no texto bruto
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleProcess}>
                <Sparkles className="h-4 w-4 mr-1" /> Processar Transcrição
              </Button>
              {isProcessed && (
                <>
                  <Button variant="outline" onClick={handleSaveTranscript}>
                    <Save className="h-4 w-4 mr-1" /> Salvar
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" /> Exportar
                  </Button>
                </>
              )}
            </div>

            {isProcessed && cleanText && (
              <>
                {/* Stats */}
                {stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                      <p className="text-2xl font-bold">{stats.words}</p>
                      <p className="text-xs text-muted-foreground">Palavras</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                      <p className="text-2xl font-bold">{stats.chars.toLocaleString("pt-BR")}</p>
                      <p className="text-xs text-muted-foreground">Caracteres</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <p className="text-2xl font-bold">~{stats.readingTime}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Min leitura</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-2xl font-bold">~{stats.videoDuration}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Min vídeo</p>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Resumo</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(summary)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">{summary}</p>
                </div>

                {/* Key Points */}
                {keyPoints.length > 0 && (
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <Label className="font-semibold mb-2 block">
                      Pontos-chave ({keyPoints.length})
                    </Label>
                    <ul className="space-y-2">
                      {keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Badge
                            variant="secondary"
                            className="shrink-0 mt-0.5 text-xs"
                          >
                            {idx + 1}
                          </Badge>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Search */}
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <Label className="font-semibold mb-2 block">
                    Buscar na Transcrição
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  {searchQuery.trim() && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {searchResults.length} resultado(s) encontrado(s)
                      </p>
                      <ScrollArea className="max-h-[200px]">
                        {searchResults.map((r, i) => (
                          <p
                            key={i}
                            className="text-sm py-1 border-b border-border/50 last:border-0"
                          >
                            {r}
                          </p>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>

                {/* Clean Text */}
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Texto Limpo</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(cleanText)}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copiar
                    </Button>
                  </div>
                  <ScrollArea className="max-h-[300px]">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {cleanText}
                    </p>
                  </ScrollArea>
                </div>
              </>
            )}
          </TabsContent>

          {/* VIDEO NOTES TAB */}
          <TabsContent value="notes" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>URL do Vídeo (opcional)</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Título do Vídeo</Label>
                <Input
                  placeholder="Nome do vídeo..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-2 items-end">
              <div className="w-28">
                <Label>Timestamp</Label>
                <Input
                  placeholder="00:00"
                  value={noteTimestamp}
                  onChange={(e) => setNoteTimestamp(e.target.value)}
                  className="mt-1 font-mono"
                />
              </div>
              <div className="flex-1">
                <Label>Nota</Label>
                <Input
                  placeholder="Ponto importante mencionado no vídeo..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNote();
                  }}
                />
              </div>
              <Button onClick={handleAddNote}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {videoNotes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">
                    Notas ({videoNotes.length})
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveVideoNotes}
                  >
                    <Save className="h-3 w-3 mr-1" /> Salvar Notas
                  </Button>
                </div>
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-2">
                    {videoNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3"
                      >
                        <Badge variant="outline" className="font-mono shrink-0">
                          {note.timestamp}
                        </Badge>
                        <p className="text-sm flex-1">{note.note}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setVideoNotes(
                              videoNotes.filter((n) => n.id !== note.id)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          {/* SAVED TAB */}
          <TabsContent value="saved" className="space-y-4">
            <div>
              <Label className="font-semibold mb-2 block">
                Transcrições Salvas ({savedTranscripts.length})
              </Label>
              {savedTranscripts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma transcrição salva.
                </p>
              ) : (
                <ScrollArea className="max-h-[250px]">
                  <div className="space-y-2">
                    {savedTranscripts.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.savedAt}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRawText(t.rawText);
                              setCleanText(t.cleanText);
                              setSummary(generateSummary(t.cleanText));
                              setKeyPoints(extractKeyPoints(t.cleanText));
                              setIsProcessed(true);
                              toast("Transcrição carregada.");
                            }}
                          >
                            Carregar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              persistTranscripts(
                                savedTranscripts.filter((x) => x.id !== t.id)
                              );
                              toast("Removido.");
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <Separator />

            <div>
              <Label className="font-semibold mb-2 block">
                Notas de Vídeo Salvas ({savedNotes.length})
              </Label>
              {savedNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma nota salva.
                </p>
              ) : (
                <ScrollArea className="max-h-[250px]">
                  <div className="space-y-2">
                    {savedNotes.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-lg border border-border bg-background/50 p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold">{n.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {n.notes.length} notas • {n.savedAt}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setVideoUrl(n.url);
                                setVideoTitle(n.title);
                                setVideoNotes(n.notes);
                                toast("Notas carregadas.");
                              }}
                            >
                              Carregar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                persistNotes(
                                  savedNotes.filter((x) => x.id !== n.id)
                                );
                                toast("Removido.");
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {n.notes.slice(0, 3).map((note) => (
                            <div
                              key={note.id}
                              className="flex gap-2 text-xs"
                            >
                              <span className="font-mono text-muted-foreground">
                                {note.timestamp}
                              </span>
                              <span>{note.note}</span>
                            </div>
                          ))}
                          {n.notes.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{n.notes.length - 3} mais notas
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
