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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  Save,
  Trash2,
  Palette,
  RotateCcw,
  Code,
} from "lucide-react";
import { toast } from "sonner";

interface CreativeConfig {
  template: string;
  bgType: "color" | "gradient";
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: string;
  headline: string;
  body: string;
  ctaText: string;
  brandName: string;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  textColor: string;
  ctaColor: string;
  ctaTextColor: string;
  layoutPreset: string;
}

interface SavedCreative {
  id: string;
  config: CreativeConfig;
  savedAt: string;
}

const TEMPLATES: {
  value: string;
  label: string;
  width: number;
  height: number;
}[] = [
  { value: "post-ig", label: "Post Instagram", width: 1080, height: 1080 },
  { value: "story-ig", label: "Story Instagram", width: 1080, height: 1920 },
  { value: "post-fb", label: "Post Facebook", width: 1200, height: 630 },
  { value: "capa-yt", label: "Capa YouTube", width: 1280, height: 720 },
  { value: "banner-li", label: "Banner LinkedIn", width: 1584, height: 396 },
];

const LAYOUT_PRESETS: {
  value: string;
  label: string;
  config: Partial<CreativeConfig>;
}[] = [
  {
    value: "minimalista",
    label: "Minimalista",
    config: {
      bgType: "color",
      bgColor: "#ffffff",
      textColor: "#1a1a1a",
      ctaColor: "#1a1a1a",
      ctaTextColor: "#ffffff",
      fontSize: 32,
      textAlign: "center",
    },
  },
  {
    value: "bold",
    label: "Bold",
    config: {
      bgType: "gradient",
      gradientFrom: "#ff6b35",
      gradientTo: "#f7c948",
      gradientDirection: "135deg",
      textColor: "#ffffff",
      ctaColor: "#1a1a1a",
      ctaTextColor: "#ffffff",
      fontSize: 40,
      textAlign: "center",
    },
  },
  {
    value: "elegante",
    label: "Elegante",
    config: {
      bgType: "gradient",
      gradientFrom: "#1a1a2e",
      gradientTo: "#16213e",
      gradientDirection: "180deg",
      textColor: "#e8d5b7",
      ctaColor: "#e8d5b7",
      ctaTextColor: "#1a1a2e",
      fontSize: 30,
      textAlign: "center",
    },
  },
  {
    value: "moderno",
    label: "Moderno",
    config: {
      bgType: "gradient",
      gradientFrom: "#667eea",
      gradientTo: "#764ba2",
      gradientDirection: "135deg",
      textColor: "#ffffff",
      ctaColor: "#ffffff",
      ctaTextColor: "#764ba2",
      fontSize: 34,
      textAlign: "left",
    },
  },
  {
    value: "colorido",
    label: "Colorido",
    config: {
      bgType: "gradient",
      gradientFrom: "#f093fb",
      gradientTo: "#f5576c",
      gradientDirection: "45deg",
      textColor: "#ffffff",
      ctaColor: "#ffecd2",
      ctaTextColor: "#f5576c",
      fontSize: 36,
      textAlign: "center",
    },
  },
];

const GRADIENT_DIRS = [
  { value: "0deg", label: "↑ Cima" },
  { value: "90deg", label: "→ Direita" },
  { value: "135deg", label: "↘ Diagonal" },
  { value: "180deg", label: "↓ Baixo" },
  { value: "270deg", label: "← Esquerda" },
  { value: "45deg", label: "↗ Diagonal" },
];

const STORAGE_KEY = "mony-creatives-saved";

function genId() {
  return Math.random().toString(36).substring(2, 11);
}

const defaultConfig: CreativeConfig = {
  template: "post-ig",
  bgType: "gradient",
  bgColor: "#667eea",
  gradientFrom: "#667eea",
  gradientTo: "#764ba2",
  gradientDirection: "135deg",
  headline: "Seu Título Aqui",
  body: "Adicione a descrição do seu criativo",
  ctaText: "Saiba Mais",
  brandName: "Sua Marca",
  fontSize: 32,
  textAlign: "center",
  textColor: "#ffffff",
  ctaColor: "#ffffff",
  ctaTextColor: "#764ba2",
  layoutPreset: "moderno",
};

export default function CreativesTool() {
  const [config, setConfig] = useState<CreativeConfig>({ ...defaultConfig });
  const [saved, setSaved] = useState<SavedCreative[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) setSaved(JSON.parse(s));
    } catch {}
  }, []);

  const persistSaved = (items: SavedCreative[]) => {
    setSaved(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const tpl = TEMPLATES.find((t) => t.value === config.template) || TEMPLATES[0];
  const aspect = tpl.width / tpl.height;

  const bgStyle = useMemo(() => {
    if (config.bgType === "gradient") {
      return `linear-gradient(${config.gradientDirection}, ${config.gradientFrom}, ${config.gradientTo})`;
    }
    return config.bgColor;
  }, [config.bgType, config.bgColor, config.gradientFrom, config.gradientTo, config.gradientDirection]);

  const previewMaxWidth = 400;
  const previewWidth = previewMaxWidth;
  const previewHeight = previewWidth / aspect;

  const scaleFactor = previewWidth / tpl.width;

  const applyPreset = (presetValue: string) => {
    const preset = LAYOUT_PRESETS.find((p) => p.value === presetValue);
    if (preset) {
      setConfig({ ...config, ...preset.config, layoutPreset: presetValue });
      toast.success(`Preset "${preset.label}" aplicado!`);
    }
  };

  const exportHTML = () => {
    const bg =
      config.bgType === "gradient"
        ? `background: linear-gradient(${config.gradientDirection}, ${config.gradientFrom}, ${config.gradientTo});`
        : `background-color: ${config.bgColor};`;

    return `<!-- Criativo ${tpl.label} - ${tpl.width}x${tpl.height}px -->
<div style="
  width: ${tpl.width}px;
  height: ${tpl.height}px;
  ${bg}
  display: flex;
  flex-direction: column;
  align-items: ${config.textAlign === "center" ? "center" : config.textAlign === "right" ? "flex-end" : "flex-start"};
  justify-content: center;
  padding: 60px;
  box-sizing: border-box;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  text-align: ${config.textAlign};
  position: relative;
">
  <h1 style="
    color: ${config.textColor};
    font-size: ${config.fontSize}px;
    font-weight: 800;
    margin: 0 0 16px 0;
    line-height: 1.2;
  ">${config.headline}</h1>

  <p style="
    color: ${config.textColor};
    font-size: ${Math.round(config.fontSize * 0.55)}px;
    opacity: 0.85;
    margin: 0 0 32px 0;
    line-height: 1.5;
    max-width: 80%;
  ">${config.body}</p>

  <div style="
    background-color: ${config.ctaColor};
    color: ${config.ctaTextColor};
    padding: 14px 32px;
    border-radius: 8px;
    font-size: ${Math.round(config.fontSize * 0.45)}px;
    font-weight: 700;
    display: inline-block;
  ">${config.ctaText}</div>

  <div style="
    position: absolute;
    bottom: 30px;
    ${config.textAlign === "center" ? "left: 50%; transform: translateX(-50%);" : config.textAlign === "right" ? "right: 60px;" : "left: 60px;"}
    color: ${config.textColor};
    font-size: ${Math.round(config.fontSize * 0.4)}px;
    opacity: 0.6;
    font-weight: 600;
  ">${config.brandName}</div>
</div>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportHTML());
    toast.success("HTML/CSS copiado!");
  };

  const handleSave = () => {
    persistSaved([
      { id: genId(), config: { ...config }, savedAt: new Date().toLocaleString("pt-BR") },
      ...saved,
    ]);
    toast.success("Criativo salvo!");
  };

  const handleReset = () => {
    setConfig({ ...defaultConfig });
    toast("Configurações resetadas.");
  };

  const update = (partial: Partial<CreativeConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Criador de Criativos</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showSaved ? "default" : "outline"}
              size="sm"
              onClick={() => { setShowSaved(!showSaved); setShowCode(false); }}
            >
              <Save className="h-4 w-4 mr-1" />
              Salvos ({saved.length})
            </Button>
          </div>
        </div>

        {showSaved ? (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {saved.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum criativo salvo.</p>
              ) : (
                saved.map((s) => {
                  const t = TEMPLATES.find((t) => t.value === s.config.template);
                  return (
                    <div
                      key={s.id}
                      className="rounded-xl border border-border bg-background/50 p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold">{s.config.headline}</p>
                        <p className="text-xs text-muted-foreground">
                          {t?.label} • {s.savedAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setConfig(s.config);
                            setShowSaved(false);
                            toast("Criativo carregado.");
                          }}
                        >
                          Carregar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            persistSaved(saved.filter((x) => x.id !== s.id));
                            toast("Removido.");
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <ScrollArea className="max-h-[600px] pr-4">
              <div className="space-y-4">
                {/* Template */}
                <div>
                  <Label>Template</Label>
                  <Select
                    value={config.template}
                    onValueChange={(v) => update({ template: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label} ({t.width}×{t.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Layout Presets */}
                <div>
                  <Label>Preset de Layout</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LAYOUT_PRESETS.map((p) => (
                      <Button
                        key={p.value}
                        variant={config.layoutPreset === p.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyPreset(p.value)}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Text Content */}
                <div>
                  <Label>Título</Label>
                  <Input
                    value={config.headline}
                    onChange={(e) => update({ headline: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Texto</Label>
                  <Input
                    value={config.body}
                    onChange={(e) => update({ body: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>CTA</Label>
                    <Input
                      value={config.ctaText}
                      onChange={(e) => update({ ctaText: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Marca</Label>
                    <Input
                      value={config.brandName}
                      onChange={(e) => update({ brandName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator />

                {/* Typography */}
                <div>
                  <Label>Tamanho da Fonte: {config.fontSize}px</Label>
                  <Slider
                    value={[config.fontSize]}
                    onValueChange={([v]) => update({ fontSize: v })}
                    min={16}
                    max={64}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Alinhamento</Label>
                  <div className="flex gap-2 mt-1">
                    {(["left", "center", "right"] as const).map((a) => (
                      <Button
                        key={a}
                        variant={config.textAlign === a ? "default" : "outline"}
                        size="sm"
                        onClick={() => update({ textAlign: a })}
                      >
                        {a === "left" ? "Esquerda" : a === "center" ? "Centro" : "Direita"}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Colors */}
                <div>
                  <Label>Tipo de Fundo</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={config.bgType === "color" ? "default" : "outline"}
                      size="sm"
                      onClick={() => update({ bgType: "color" })}
                    >
                      Cor Sólida
                    </Button>
                    <Button
                      variant={config.bgType === "gradient" ? "default" : "outline"}
                      size="sm"
                      onClick={() => update({ bgType: "gradient" })}
                    >
                      Gradiente
                    </Button>
                  </div>
                </div>

                {config.bgType === "color" ? (
                  <div>
                    <Label>Cor de Fundo</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => update({ bgColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                      <Input
                        value={config.bgColor}
                        onChange={(e) => update({ bgColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor Início</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            value={config.gradientFrom}
                            onChange={(e) => update({ gradientFrom: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border border-border"
                          />
                          <Input
                            value={config.gradientFrom}
                            onChange={(e) => update({ gradientFrom: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Cor Fim</Label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            value={config.gradientTo}
                            onChange={(e) => update({ gradientTo: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer border border-border"
                          />
                          <Input
                            value={config.gradientTo}
                            onChange={(e) => update({ gradientTo: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Direção</Label>
                      <Select
                        value={config.gradientDirection}
                        onValueChange={(v) => update({ gradientDirection: v })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADIENT_DIRS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Cor do Texto</Label>
                    <div className="flex gap-1 mt-1">
                      <input
                        type="color"
                        value={config.textColor}
                        onChange={(e) => update({ textColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cor CTA</Label>
                    <div className="flex gap-1 mt-1">
                      <input
                        type="color"
                        value={config.ctaColor}
                        onChange={(e) => update({ ctaColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Texto CTA</Label>
                    <div className="flex gap-1 mt-1">
                      <input
                        type="color"
                        value={config.ctaTextColor}
                        onChange={(e) => update({ ctaTextColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-3 w-3 mr-1" /> Resetar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" /> Salvar
                  </Button>
                  <Button
                    variant={showCode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code className="h-3 w-3 mr-1" /> HTML/CSS
                  </Button>
                </div>
              </div>
            </ScrollArea>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pré-visualização</Label>
                <Badge variant="outline" className="text-xs">
                  {tpl.width}×{tpl.height}px
                </Badge>
              </div>

              <div
                className="rounded-xl border border-border overflow-hidden mx-auto"
                style={{
                  width: previewWidth,
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: `${tpl.width} / ${tpl.height}`,
                    background: bgStyle,
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      config.textAlign === "center"
                        ? "center"
                        : config.textAlign === "right"
                          ? "flex-end"
                          : "flex-start",
                    justifyContent: "center",
                    padding: `${40 * scaleFactor}px`,
                    boxSizing: "border-box",
                    textAlign: config.textAlign,
                    position: "relative",
                    fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  }}
                >
                  <h1
                    style={{
                      color: config.textColor,
                      fontSize: `${config.fontSize * scaleFactor}px`,
                      fontWeight: 800,
                      margin: `0 0 ${8 * scaleFactor}px 0`,
                      lineHeight: 1.2,
                    }}
                  >
                    {config.headline || "Título"}
                  </h1>
                  <p
                    style={{
                      color: config.textColor,
                      fontSize: `${config.fontSize * 0.55 * scaleFactor}px`,
                      opacity: 0.85,
                      margin: `0 0 ${20 * scaleFactor}px 0`,
                      lineHeight: 1.5,
                      maxWidth: "80%",
                    }}
                  >
                    {config.body || "Texto"}
                  </p>
                  <div
                    style={{
                      backgroundColor: config.ctaColor,
                      color: config.ctaTextColor,
                      padding: `${8 * scaleFactor}px ${20 * scaleFactor}px`,
                      borderRadius: `${6 * scaleFactor}px`,
                      fontSize: `${config.fontSize * 0.45 * scaleFactor}px`,
                      fontWeight: 700,
                      display: "inline-block",
                    }}
                  >
                    {config.ctaText || "CTA"}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: `${16 * scaleFactor}px`,
                      ...(config.textAlign === "center"
                        ? { left: "50%", transform: "translateX(-50%)" }
                        : config.textAlign === "right"
                          ? { right: `${40 * scaleFactor}px` }
                          : { left: `${40 * scaleFactor}px` }),
                      color: config.textColor,
                      fontSize: `${config.fontSize * 0.35 * scaleFactor}px`,
                      opacity: 0.6,
                      fontWeight: 600,
                    }}
                  >
                    {config.brandName}
                  </div>
                </div>
              </div>

              {showCode && (
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Código HTML/CSS</Label>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                      <Copy className="h-3 w-3 mr-1" /> Copiar
                    </Button>
                  </div>
                  <ScrollArea className="max-h-[200px]">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-all">
                      {exportHTML()}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
