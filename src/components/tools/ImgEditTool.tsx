import { useState, useRef, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  RotateCcw,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface FilterState {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
  opacity: number;
}

interface PresetFilter {
  name: string;
  filters: FilterState;
}

const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  opacity: 100,
};

const PRESETS: PresetFilter[] = [
  { name: "Original", filters: { ...DEFAULT_FILTERS } },
  {
    name: "Preto e Branco",
    filters: { ...DEFAULT_FILTERS, grayscale: 100 },
  },
  {
    name: "Vintage",
    filters: {
      ...DEFAULT_FILTERS,
      sepia: 60,
      contrast: 85,
      brightness: 110,
      saturate: 75,
    },
  },
  {
    name: "Warm",
    filters: {
      ...DEFAULT_FILTERS,
      sepia: 25,
      brightness: 105,
      saturate: 120,
      hueRotate: -10,
    },
  },
  {
    name: "Cool",
    filters: {
      ...DEFAULT_FILTERS,
      hueRotate: 30,
      brightness: 105,
      saturate: 85,
    },
  },
  {
    name: "High Contrast",
    filters: {
      ...DEFAULT_FILTERS,
      contrast: 150,
      brightness: 105,
      saturate: 110,
    },
  },
  {
    name: "Dramatic",
    filters: {
      ...DEFAULT_FILTERS,
      contrast: 140,
      brightness: 90,
      saturate: 130,
      grayscale: 10,
    },
  },
];

const FILTER_CONFIG: {
  key: keyof FilterState;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}[] = [
  { key: "brightness", label: "Brilho", min: 0, max: 200, step: 1, unit: "%" },
  { key: "contrast", label: "Contraste", min: 0, max: 200, step: 1, unit: "%" },
  { key: "saturate", label: "Saturação", min: 0, max: 200, step: 1, unit: "%" },
  { key: "hueRotate", label: "Matiz", min: -180, max: 180, step: 1, unit: "°" },
  { key: "blur", label: "Desfoque", min: 0, max: 20, step: 0.5, unit: "px" },
  { key: "grayscale", label: "Escala de Cinza", min: 0, max: 100, step: 1, unit: "%" },
  { key: "sepia", label: "Sépia", min: 0, max: 100, step: 1, unit: "%" },
  { key: "invert", label: "Inverter", min: 0, max: 100, step: 1, unit: "%" },
  { key: "opacity", label: "Opacidade", min: 0, max: 100, step: 1, unit: "%" },
];

export default function ImgEditTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ w: number; h: number } | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione um arquivo de imagem.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setImageSrc(src);

        // Get dimensions
        const img = new Image();
        img.onload = () => {
          setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
      setFilters({ ...DEFAULT_FILTERS });
      toast.success("Imagem carregada!");
    },
    []
  );

  const filterString = useMemo(() => {
    const parts: string[] = [];
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
    if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
    if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
    return parts.length > 0 ? parts.join(" ") : "none";
  }, [filters]);

  const handleCopyFilter = () => {
    navigator.clipboard.writeText(`filter: ${filterString};`);
    toast.success("CSS copiado!");
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    toast("Filtros resetados.");
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    setImageDims(null);
    setFileName("");
    setFilters({ ...DEFAULT_FILTERS });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const applyPreset = (preset: PresetFilter) => {
    setFilters({ ...preset.filters });
    toast.success(`Preset "${preset.name}" aplicado!`);
  };

  const updateFilter = (key: keyof FilterState, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Editor de Imagens</h2>
        </div>

        {!imageSrc ? (
          /* Upload Area */
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold">Clique para carregar uma imagem</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, GIF, WebP, SVG
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Pré-visualização</Label>
                  {imageDims && (
                    <Badge variant="outline" className="text-xs">
                      {imageDims.w}×{imageDims.h}px
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3 mr-1" /> Trocar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border overflow-hidden bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
                <img
                  src={imageSrc}
                  alt={fileName}
                  className="w-full h-auto max-h-[500px] object-contain"
                  style={{ filter: filterString }}
                />
              </div>

              {fileName && (
                <p className="text-xs text-muted-foreground text-center">
                  {fileName}
                </p>
              )}

              {/* CSS Filter String */}
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs">CSS Filter</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopyFilter}>
                    <Copy className="h-3 w-3 mr-1" /> Copiar
                  </Button>
                </div>
                <code className="text-xs text-muted-foreground break-all block">
                  filter: {filterString};
                </code>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <Label>Presets</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      variant={
                        JSON.stringify(filters) ===
                        JSON.stringify(preset.filters)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sliders */}
              <div className="space-y-4">
                {FILTER_CONFIG.map((fc) => (
                  <div key={fc.key}>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-sm">{fc.label}</Label>
                      <span className="text-xs text-muted-foreground font-mono">
                        {fc.key === "blur"
                          ? filters[fc.key].toFixed(1)
                          : filters[fc.key]}
                        {fc.unit}
                      </span>
                    </div>
                    <Slider
                      value={[filters[fc.key]]}
                      onValueChange={([v]) => updateFilter(fc.key, v)}
                      min={fc.min}
                      max={fc.max}
                      step={fc.step}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
                disabled={isDefault}
              >
                <RotateCcw className="h-4 w-4 mr-1" /> Resetar Todos os
                Filtros
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
