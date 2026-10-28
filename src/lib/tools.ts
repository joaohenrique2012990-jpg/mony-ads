import {
  Search, FileSearch, Globe, Bot, LayoutTemplate, ListChecks, BookOpen, Mic, Image, Type, PenLine, Copy,
  Sparkles, Video, ImagePlus, GalleryHorizontal, ShieldAlert, FolderKanban, Tags, Link2, Calculator,
  BarChart3, TrendingUp, type LucideIcon,
} from "lucide-react";

export type ToolStatus = "ready" | "soon";
export type Tool = { id: string; name: string; desc: string; icon: LucideIcon; cat: string; status: ToolStatus };

export const categories = ["Inteligência e mineração", "Criação com IA", "Criativos e conteúdo", "Organização", "Tracking e escala"];

const t = (id: string, name: string, desc: string, icon: LucideIcon, cat: number, status: ToolStatus = "soon"): Tool => ({ id, name, desc, icon, cat: categories[cat]!, status });

export const tools: Tool[] = [
  t("catalog", "Catálogo de ofertas Low Ticket", "Melhores ofertas validadas de alta margem no Facebook Ads.", Search, 0, "ready"),
  t("funnel", "Analisador de páginas e funis", "Entenda a estrutura de um funil.", FileSearch, 0),
  t("competitor", "Analisador de concorrentes", "Analise concorrentes a partir da URL.", Globe, 0),
  t("assistant", "Assistente de marketing", "Tire dúvidas e planeje com IA.", Bot, 0),
  t("pages", "Criador de páginas de vendas", "Monte páginas editáveis.", LayoutTemplate, 1),
  t("quiz", "Criador de quizzes", "Quizzes para captar e qualificar.", ListChecks, 1),
  t("ebook", "Gerador de e-books", "Produtos digitais exportáveis.", BookOpen, 1),
  t("scripts", "Roteiros e áudios", "Roteiros para vídeos e VSLs.", Mic, 1),
  t("banners", "Criador de banners", "Banners para anúncios e páginas.", Image, 1),
  t("headlines", "Gerador de headlines", "Títulos que chamam atenção.", Type, 1),
  t("rewriter", "Reescritor de copy", "Novas versões da sua copy.", PenLine, 1),
  t("variations", "Variações de anúncios", "Múltiplas versões para testes.", Copy, 1),
  t("creatives", "Criador de criativos", "Criativos para redes sociais.", Sparkles, 2),
  t("transcriber", "Transcritor de vídeos", "Transforme vídeos em texto.", Video, 2),
  t("imgedit", "Editor de imagens", "Ajustes rápidos em imagens.", ImagePlus, 2),
  t("carousel", "Gerador de carrosséis", "Carrosséis para redes sociais.", GalleryHorizontal, 2),
  t("words", "Palavras problemáticas", "Detecte termos arriscados em anúncios.", ShieldAlert, 3),
  t("projects", "Projetos e arquivos", "Organize seus testes e materiais.", FolderKanban, 3),
  t("metadata", "Ferramentas de metadados", "Limpe e edite metadados.", Tags, 3),
  t("utm", "Gerador de UTMs", "Crie URLs rastreáveis.", Link2, 4, "ready"),
  t("calc", "Calculadora de métricas", "CTR, CPC, CPA, ROAS e ROI.", Calculator, 4, "ready"),
  t("campaigns", "Painel de campanhas", "Acompanhe suas campanhas.", BarChart3, 4),
  t("scale", "Simulador de escala", "Projete cenários de orçamento.", TrendingUp, 4),
];

export function calcMetrics(v: { spend: number; impressions: number; clicks: number; conversions: number; revenue: number }) {
  const d = (a: number, b: number) => (b > 0 ? a / b : 0);
  return {
    ctr: d(v.clicks, v.impressions) * 100,
    cpc: d(v.spend, v.clicks),
    cpa: d(v.spend, v.conversions),
    roas: d(v.revenue, v.spend),
    roi: d(v.revenue - v.spend, v.spend) * 100,
  };
}

export function buildUtm(base: string, p: Record<string, string>) {
  try {
    const u = new URL(base);
    Object.entries(p).forEach(([k, v]) => v.trim() && u.searchParams.set(k, v.trim()));
    return u.toString();
  } catch {
    return "";
  }
}
