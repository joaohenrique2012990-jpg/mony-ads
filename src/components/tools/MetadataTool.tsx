import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Copy,
  Globe,
  Search,
  FileCode,
  Type,
  Link2,
  ExternalLink,
  Eraser,
} from "lucide-react";
import { toast } from "sonner";

// ─── Tab 1: Meta Tags Generator ─────────────────────────────────────────────

function MetaTagsGenerator() {
  const [pageTitle, setPageTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [author, setAuthor] = useState("");

  const metaTags = useMemo(() => {
    const lines: string[] = [];
    lines.push(`<meta charset="UTF-8">`);
    lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    if (pageTitle) lines.push(`<title>${pageTitle}</title>`);
    if (description) lines.push(`<meta name="description" content="${description}">`);
    if (keywords) lines.push(`<meta name="keywords" content="${keywords}">`);
    if (author) lines.push(`<meta name="author" content="${author}">`);
    if (robots) lines.push(`<meta name="robots" content="${robots}">`);
    if (canonicalUrl) lines.push(`<link rel="canonical" href="${canonicalUrl}">`);
    lines.push("");
    lines.push("<!-- Open Graph -->");
    if (ogTitle || pageTitle) lines.push(`<meta property="og:title" content="${ogTitle || pageTitle}">`);
    if (ogDescription || description) lines.push(`<meta property="og:description" content="${ogDescription || description}">`);
    if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}">`);
    lines.push(`<meta property="og:type" content="website">`);
    if (canonicalUrl) lines.push(`<meta property="og:url" content="${canonicalUrl}">`);
    lines.push("");
    lines.push("<!-- Twitter Card -->");
    lines.push(`<meta name="twitter:card" content="${twitterCard}">`);
    if (ogTitle || pageTitle) lines.push(`<meta name="twitter:title" content="${ogTitle || pageTitle}">`);
    if (ogDescription || description) lines.push(`<meta name="twitter:description" content="${ogDescription || description}">`);
    if (ogImage) lines.push(`<meta name="twitter:image" content="${ogImage}">`);
    return lines.join("\n");
  }, [pageTitle, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, robots, author]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileCode className="h-4 w-4" /> Informações Básicas
            </h3>
            <div>
              <Label>Título da Página</Label>
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Minha Página Incrível" className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{pageTitle.length}/60 caracteres (ideal: 50-60)</p>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Uma descrição concisa da página..." rows={3} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{description.length}/160 caracteres (ideal: 150-160)</p>
            </div>
            <div>
              <Label>Palavras-chave</Label>
              <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="marketing, anúncios, digital" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Autor</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome do autor" className="mt-1" />
              </div>
              <div>
                <Label>Robots</Label>
                <Select value={robots} onValueChange={setRobots}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="index, follow">index, follow</SelectItem>
                    <SelectItem value="noindex, follow">noindex, follow</SelectItem>
                    <SelectItem value="index, nofollow">index, nofollow</SelectItem>
                    <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>URL Canônica</Label>
              <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://example.com/pagina" className="mt-1" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" /> Open Graph / Social
            </h3>
            <div>
              <Label>OG Título (opcional)</Label>
              <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="Será usado o título da página se vazio" className="mt-1" />
            </div>
            <div>
              <Label>OG Descrição (opcional)</Label>
              <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="Será usada a descrição padrão se vazio" rows={2} className="mt-1" />
            </div>
            <div>
              <Label>OG Imagem URL</Label>
              <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/imagem.jpg" className="mt-1" />
            </div>
            <div>
              <Label>Twitter Card Type</Label>
              <Select value={twitterCard} onValueChange={setTwitterCard}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">summary</SelectItem>
                  <SelectItem value="summary_large_image">summary_large_image</SelectItem>
                  <SelectItem value="app">app</SelectItem>
                  <SelectItem value="player">player</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Previews + Output */}
        <div className="space-y-6">
          {/* Google Preview */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" /> Pré-visualização no Google
            </h3>
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-green-700 truncate">{canonicalUrl || "https://example.com/pagina"}</p>
              <p className="text-xl text-blue-700 hover:underline truncate cursor-pointer">{pageTitle || "Título da Página"}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{description || "Descrição da página aparecerá aqui..."}</p>
            </div>
          </div>

          {/* Social Preview */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" /> Pré-visualização Social (OG)
            </h3>
            <div className="rounded-lg border overflow-hidden bg-white">
              {ogImage ? (
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <img src={ogImage} alt="OG Preview" className="h-full w-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }} />
                </div>
              ) : (
                <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Sem imagem OG
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 uppercase">{canonicalUrl ? new URL(canonicalUrl).hostname : "example.com"}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{ogTitle || pageTitle || "Título"}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{ogDescription || description || "Descrição"}</p>
              </div>
            </div>
          </div>

          {/* Generated Code */}
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileCode className="h-4 w-4" /> Código Gerado
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(metaTags);
                  toast.success("Meta tags copiadas!");
                }}
              >
                <Copy className="h-3 w-3 mr-1" /> Copiar
              </Button>
            </div>
            <ScrollArea className="max-h-[300px]">
              <pre className="rounded-lg bg-muted/50 p-4 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                {metaTags}
              </pre>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Texto Limpo ─────────────────────────────────────────────────────

function TextoCleaner() {
  const [inputText, setInputText] = useState("");
  const [stripHtml, setStripHtml] = useState(true);
  const [stripExtraSpaces, setStripExtraSpaces] = useState(true);
  const [stripSpecialChars, setStripSpecialChars] = useState(false);
  const [stripLineBreaks, setStripLineBreaks] = useState(false);
  const [removeEmojis, setRemoveEmojis] = useState(false);
  const [removeAccents, setRemoveAccents] = useState(false);
  const [caseTransform, setCaseTransform] = useState<string>("none");

  const cleanedText = useMemo(() => {
    let result = inputText;

    if (stripHtml) {
      result = result.replace(/<[^>]*>/g, "");
    }
    if (stripLineBreaks) {
      result = result.replace(/[\r\n]+/g, " ");
    }
    if (stripExtraSpaces) {
      result = result.replace(/[ \t]+/g, " ").trim();
    }
    if (stripSpecialChars) {
      result = result.replace(/[^a-zA-ZÀ-ÿ0-9\s.,!?;:'"()\-@#]/g, "");
    }
    if (removeEmojis) {
      result = result.replace(
        /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
        ""
      );
    }
    if (removeAccents) {
      result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    switch (caseTransform) {
      case "upper":
        result = result.toUpperCase();
        break;
      case "lower":
        result = result.toLowerCase();
        break;
      case "title":
        result = result.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
        break;
      case "sentence":
        result = result.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
    }

    return result;
  }, [inputText, stripHtml, stripExtraSpaces, stripSpecialChars, stripLineBreaks, removeEmojis, removeAccents, caseTransform]);

  const stats = useMemo(() => {
    const chars = cleanedText.length;
    const words = cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0;
    const lines = cleanedText ? cleanedText.split(/\n/).length : 0;
    return { chars, words, lines };
  }, [cleanedText]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <Label className="text-sm font-semibold mb-3 block">Texto Original</Label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole seu texto aqui..."
            rows={12}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-semibold">Texto Limpo</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(cleanedText);
                toast.success("Texto copiado!");
              }}
              disabled={!cleanedText}
            >
              <Copy className="h-3 w-3 mr-1" /> Copiar
            </Button>
          </div>
          <div className="rounded-lg bg-muted/30 p-4 text-sm whitespace-pre-wrap min-h-[260px] max-h-[260px] overflow-auto">
            {cleanedText || <span className="text-muted-foreground">O resultado aparecerá aqui...</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Options */}
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Eraser className="h-4 w-4" /> Opções de Limpeza
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover tags HTML</Label>
              <Switch checked={stripHtml} onCheckedChange={setStripHtml} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover espaços extras</Label>
              <Switch checked={stripExtraSpaces} onCheckedChange={setStripExtraSpaces} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover caracteres especiais</Label>
              <Switch checked={stripSpecialChars} onCheckedChange={setStripSpecialChars} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover quebras de linha</Label>
              <Switch checked={stripLineBreaks} onCheckedChange={setStripLineBreaks} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover emojis</Label>
              <Switch checked={removeEmojis} onCheckedChange={setRemoveEmojis} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Remover acentos</Label>
              <Switch checked={removeAccents} onCheckedChange={setRemoveAccents} />
            </div>
            <Separator />
            <div>
              <Label className="text-sm mb-2 block">Transformar texto</Label>
              <Select value={caseTransform} onValueChange={setCaseTransform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem transformação</SelectItem>
                  <SelectItem value="upper">MAIÚSCULAS</SelectItem>
                  <SelectItem value="lower">minúsculas</SelectItem>
                  <SelectItem value="title">Primeira Letra Maiúscula</SelectItem>
                  <SelectItem value="sentence">Primeira letra da frase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Type className="h-4 w-4" /> Estatísticas
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center rounded-lg border border-border p-4">
              <p className="text-3xl font-bold">{stats.chars}</p>
              <p className="text-xs text-muted-foreground">Caracteres</p>
            </div>
            <div className="text-center rounded-lg border border-border p-4">
              <p className="text-3xl font-bold">{stats.words}</p>
              <p className="text-xs text-muted-foreground">Palavras</p>
            </div>
            <div className="text-center rounded-lg border border-border p-4">
              <p className="text-3xl font-bold">{stats.lines}</p>
              <p className="text-xs text-muted-foreground">Linhas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Extrator de Links ────────────────────────────────────────────────

function LinkExtractor() {
  const [inputText, setInputText] = useState("");

  const links = useMemo(() => {
    if (!inputText.trim()) return [];
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
    const matches = inputText.match(urlRegex) || [];
    return [...new Set(matches)].map((url) => {
      let domain = "";
      try {
        domain = new URL(url).hostname;
      } catch {
        domain = "—";
      }
      return { url, domain };
    });
  }, [inputText]);

  function copyAll() {
    navigator.clipboard.writeText(links.map((l) => l.url).join("\n"));
    toast.success(`${links.length} links copiados!`);
  }

  function copyOne(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <Label className="text-sm font-semibold mb-3 block">Cole o texto com links</Label>
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Cole qualquer texto contendo URLs para extrair todos os links..."
          rows={6}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Link2 className="h-4 w-4" /> Links Encontrados ({links.length})
          </h3>
          {links.length > 0 && (
            <Button variant="outline" size="sm" onClick={copyAll}>
              <Copy className="h-3 w-3 mr-1" /> Copiar Todos
            </Button>
          )}
        </div>

        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {inputText.trim() ? "Nenhum link encontrado no texto." : "Cole um texto acima para extrair links."}
          </p>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Domínio</TableHead>
                  <TableHead>URL Completa</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">{link.domain}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[300px] truncate">{link.url}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyOne(link.url)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MetadataTool() {
  return (
    <Tabs defaultValue="metatags" className="space-y-6">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="metatags" className="gap-1.5">
          <FileCode className="h-4 w-4" /> Meta Tags
        </TabsTrigger>
        <TabsTrigger value="textoclean" className="gap-1.5">
          <Eraser className="h-4 w-4" /> Texto Limpo
        </TabsTrigger>
        <TabsTrigger value="links" className="gap-1.5">
          <Link2 className="h-4 w-4" /> Extrator de Links
        </TabsTrigger>
      </TabsList>

      <TabsContent value="metatags">
        <MetaTagsGenerator />
      </TabsContent>

      <TabsContent value="textoclean">
        <TextoCleaner />
      </TabsContent>

      <TabsContent value="links">
        <LinkExtractor />
      </TabsContent>
    </Tabs>
  );
}
