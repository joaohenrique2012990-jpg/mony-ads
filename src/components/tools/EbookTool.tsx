import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Copy,
  Eye,
  Save,
  FolderOpen,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Palette,
  FileDown,
  Download,
  Share2,
  DollarSign,
  Layers,
  CheckCircle2,
  BookmarkCheck,
  Megaphone,
  Bot,
  Wand2,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  ListOrdered,
  Check,
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

export type LowTicketRole = "frontend" | "orderbump" | "upsell" | "leadmagnet";

interface Ebook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  niche: string;
  role: LowTicketRole; // Front-End (R$ 19-37), Order Bump (+R$ 14-19), Upsell (+R$ 47-67)
  suggestedPrice: number;
  badgeText: string;
  coverColor1: string;
  coverColor2: string;
  coverTextColor: string;
  chapters: Chapter[];
  createdAt: string;
}

const STORAGE_KEY = "monyads-lowticket-ebooks";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Nichos campeões de vendas em Low Ticket no Brasil
const LOW_TICKET_PRESETS: Record<
  string,
  {
    title: string;
    subtitle: string;
    role: LowTicketRole;
    suggestedPrice: number;
    badgeText: string;
    coverColor1: string;
    coverColor2: string;
    coverTextColor: string;
    chapters: { title: string; content: string }[];
  }
> = {
  "emagrecimento-chas": {
    title: "Protocolo 21 Dias Seca Tudo",
    subtitle: "O método dos chás noturnos para desinflamar e acelerar o metabolismo sem academia",
    role: "frontend",
    suggestedPrice: 19.9,
    badgeText: "LOW TICKET CAMPEÃO 🔥",
    coverColor1: "#065f46",
    coverColor2: "#10b981",
    coverTextColor: "#ffffff",
    chapters: [
      {
        title: "Por Que Dietas Radicais Travam Seu Metabolismo",
        content:
          "Se você já tentou cortar carboidratos, passar fome ou viver de salada e mesmo assim a balança continuou travada, a culpa não é sua.\n\nQuando você restringe drasticamente as calorias, seu corpo entra em modo de sobrevivência, reduzindo o gasto calórico e retendo líquidos. Neste protocolo de 21 dias, vamos trabalhar a desinflamação celular usando compostos naturais que reprogramam o metabolismo de dentro para fora.",
      },
      {
        title: "A Tríade dos Chás Noturnos Desintoxicantes",
        content:
          "Durante o sono profundo ocorre o pico da produção de hormônios reguladores do apetite (grelina e leptina). Tomar o chá certo antes de dormir diminui a inflamação intestinal e combate o inchaço matinal.\n\nReceita 1: Chá de Camomila com Canela em Pau e Gengibre Ralado.\nPreparo: Ferva 250ml de água, adicione a canela e o gengibre por 3 minutos. Desligue, adicione a camomila e abafe por 5 minutos. Tome 30 minutos antes de se deitar.",
      },
      {
        title: "Cardápio Prático de 21 Dias Sem Passar Fome",
        content:
          "Aqui está a estrutura de refeições fáceis e acessíveis com ingredientes que você já tem na sua geladeira:\n\n• Café da Manhã: Ovos mexidos com azeite + fatia de mamão com sementes de chia.\n• Almoço: Prato colorido (50% salada crua/cozida, 25% proteína magra, 25% carboidrato bom como batata doce ou arroz integral).\n• Lanche da Tarde: Castanhas ou iogurte natural com canela.\n• Jantar: Sopa nutritiva ou omelete leve.",
      },
      {
        title: "Lista Secreta de Alimentos que Secam a Barriga",
        content:
          "Alimentos termogênicos e diuréticos naturais que devem fazer parte do seu carrinho de compras:\n\n1. Pepino e Limão (limpeza renal imediata)\n2. Chá Verde e Hibisco (combate a retenção hídrica)\n3. Frutas vermelhas e Abacaxi (enzimas digestivas poderosas)\n4. Sementes de Abóbora e Chia (saciedade prolongada)",
      },
      {
        title: "Como Evitar o Efeito Sanfona Definitivamente",
        content:
          "O segredo para nunca mais engordar os quilos eliminados é a regra do equilíbrio 80/20. Em 80% do tempo você nutre seu corpo com refeições anti-inflamatórias, e em 20% você desfruta de momentos sociais sem culpa.\n\nA consistência supera a perfeição em qualquer processo de emagrecimento duradouro.",
      },
    ],
  },
  "marmitas-lucrativas": {
    title: "Marmitas Fit Congeladas Lucrativas",
    subtitle: "Como faturar de R$ 2.000 a R$ 5.000 por mês cozinhando na cozinha da sua própria casa",
    role: "frontend",
    suggestedPrice: 27.0,
    badgeText: "RENDA EXTRA RÁPIDA 💰",
    coverColor1: "#9a3412",
    coverColor2: "#f97316",
    coverTextColor: "#ffffff",
    chapters: [
      {
        title: "O Mercado Bilionário da Praticidade e Alimentação Saudável",
        content:
          "As pessoas não têm mais tempo de cozinhar todos os dias, mas desejam comer saudável. Quem oferece comida saborosa, bem embalada e pronta para esquentar no micro-ondas tem fila de clientes garantida no WhatsApp.\n\nVocê não precisa de equipamentos industriais para começar: com o seu fogão, geladeira e panelas atuais já é possível iniciar suas primeiras 30 marmitas.",
      },
      {
        title: "Os 5 Menus Mais Vendidos e Pedidos",
        content:
          "Os cardápios que mais geram recompra toda semana:\n\n1. Escondidinho de Batata Doce com Frango Desfiado\n2. Patinho Moído com Purê de Mandioquinha e Brócolis\n3. Strogonoff Fit de Frango com Arroz Integral\n4. Filé de Tilápia com Legumes Grelhados no Azeite\n5. Nhoque de Ricota com Espinafre ao Molho Rústico de Tomate",
      },
      {
        title: "Técnicas de Congelamento Seguro Sem Juntar Água",
        content:
          "O maior erro de quem começa é congelar a comida ainda morna ou colocar vegetais com alto teor de água crua. Isso faz a marmita ficar empapada ao descongelar.\n\nRegra de Ouro: Espere o alimento atingir temperatura ambiente, resfrie na geladeira por 1 hora e só então leve ao congelador. Faça o branqueamento prévio dos vegetais (mergulhe em água fervente por 2 minutos e depois em água com gelo).",
      },
      {
        title: "Precificação Inteligente: Lucro Real por Marmita",
        content:
          "Fórmula de precificação simples:\nCusto do Ingrediente + Custo da Embalagem + 30% Custos Operacionais (Gás, Energia, Água) x Margem de Lucro desejada (mínimo de 100% a 150%).\n\nExemplo:\nMarmita com custo total de R$ 6,50 deve ser vendida entre R$ 15,00 e R$ 18,00 no combo semanal.",
      },
      {
        title: "Script de WhatsApp para Fechar 15 Clientes Fixos por Semana",
        content:
          "Mensagem para enviar nos grupos do bairro e condomínio:\n\n'Olá vizinhos! 🥗 Para quem quer comer comida saudável e caseira sem ter trabalho de cozinhar na semana, abri 10 vagas para o meu combo semanal de marmitas fit congeladas com entrega grátis no condomínio nesta sexta-feira. Quem quiser o cardápio da semana com desconto de primeira compra, me chama aqui no direct!'",
      },
    ],
  },
  "oracao-salmos": {
    title: "O Guia dos Salmos da Prosperidade",
    subtitle: "Orações diárias para blindar sua casa, destrancar caminhos e alcançar a paz financeira",
    role: "frontend",
    suggestedPrice: 17.0,
    badgeText: "ESPIRITUALIDADE & FÉ ✨",
    coverColor1: "#1e1b4b",
    coverColor2: "#4338ca",
    coverTextColor: "#ffffff",
    chapters: [
      {
        title: "O Poder da Palavra e da Oração com Propósito",
        content:
          "A oração não é apenas um pedido repetitivo, mas uma conversa de intimidade e alinhamento com os planos de Deus para sua família.\n\nQuando você ora com fé inabalável e entendimento das promessas divinas, o medo cede lugar à convicção de que o melhor ainda está por vir.",
      },
      {
        title: "Salmo 23: Oração para Não Faltar Provisão no Lar",
        content:
          "'O Senhor é meu pastor, nada me faltará.'\n\nComo aplicar na prática: Faça esta oração todas as manhãs antes de sair de casa ou começar seus trabalhos. Agradeça antecipadamente pelo pão na mesa e pela sabedoria para administrar suas finanças com retidão.",
      },
      {
        title: "Salmo 91: Blindagem Espiritual Contra Inveja e Calúnias",
        content:
          "'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.'\n\nColoque este salmo aberto no cômodo central da sua residência e leia em voz alta com seus familiares uma vez por semana, consagrando cada entrada e saída do seu lar.",
      },
      {
        title: "Rotina Devocional da Meia-Noite para Quebra de Bloqueios",
        content:
          "Nos momentos de silêncio da noite, separe 10 minutos para agradecer pelas livramentos do dia e entregar nas mãos do Criador as decisões difíceis do dia seguinte.",
      },
    ],
  },
  "orderbump-sucos": {
    title: "Combo Bônus: 30 Sucos Detox Anti-Inchaço",
    subtitle: "O complemento ideal para turbinar seus resultados e limpar o organismo em 48 horas",
    role: "orderbump",
    suggestedPrice: 14.9,
    badgeText: "ORDER BUMP PERFEITO ⚡",
    coverColor1: "#14532d",
    coverColor2: "#22c55e",
    coverTextColor: "#ffffff",
    chapters: [
      {
        title: "Sucos Verdes de Ação Rápida em Jejum",
        content:
          "Combine couve crua, maçã verde, suco de 1 limão e 1 rodela de gengibre com água de coco gelada. Beba sem coar para preservar as fibras ativas.",
      },
      {
        title: "Sucos Vermelhos Antioxidantes da Tarde",
        content:
          "Bata morangos frescos, beterraba crua ralada e raspas de limão. Excelente para oxigenação sanguínea e disposição para o dia a dia.",
      },
    ],
  },
};

// Motor Inteligente de Geração de Conteúdo com IA
function generateAiChapter({
  bookTitle,
  bookSubtitle,
  chapterTitle,
  userPrompt,
  tone,
  format,
  length,
}: {
  bookTitle: string;
  bookSubtitle: string;
  chapterTitle: string;
  userPrompt?: string;
  tone: string;
  format: string;
  length: "standard" | "detailed";
}): string {
  const introHook =
    tone === "persuasive"
      ? `A maioria das pessoas falha ao tentar dominar ${chapterTitle.toLowerCase()} porque comete um erro silencioso: focar apenas na teoria e ignorar a execução prática imediata.\n\nNeste capítulo de "${bookTitle}", você vai descobrir exatamente o que funciona no mundo real, eliminando passos desnecessários e focando apenas nas ações que trazem retorno rápido.`
      : tone === "urgent"
      ? `Se você continuar ignorando os fundamentos de ${chapterTitle.toLowerCase()}, estará desperdiçando tempo, dinheiro e energia.\n\nPreste muita atenção em cada linha deste capítulo, pois o que está descrito aqui é o divisor de águas entre quem continua empacado e quem finalmente alcança ${bookSubtitle.toLowerCase()}.`
      : tone === "welcoming"
      ? `Eu sei como pode parecer desafiador dar os primeiros passos quando o assunto é ${chapterTitle.toLowerCase()}.\n\nRespire fundo: você não está sozinho nessa jornada. O objetivo deste capítulo é pegar na sua mão e mostrar com simplicidade e carinho como transformar essa etapa em um hábito leve e prazeroso.`
      : `Dominar ${chapterTitle.toLowerCase()} é um dos pilares essenciais dentro do método apresentado em "${bookTitle}".\n\nNeste capítulo, estruturamos os conceitos de forma didática e objetiva para que você possa entender o porquê de cada decisão e aplicar imediatamente no seu dia a dia.`;

  let body = "";
  if (format === "stepbystep") {
    body = `### O Método Passo a Passo de Execução:

1. **Passo 1: Diagnóstico e Preparação Inicial**
Antes de qualquer ação, avalie seu ponto de partida. Elimine as distrações e separe todos os recursos necessários descritos nesta seção para não pausar a execução na metade.

2. **Passo 2: Implementação do Primeiro Bloco de Ação**
Comece pela tarefa que gera o maior impacto com o menor esforço (Princípio de Pareto 80/20). Não busque a perfeição agora, foque apenas em concluir a primeira versão funcional.

3. **Passo 3: Ajustes Finos e Otimização**
Monitore os primeiros sinais de resposta. Se algo não sair exatamente como o previsto, ajuste a rota utilizando o checklist de correção rápida que preparamos para você.

4. **Passo 4: Criação do Hábito / Rotina de Repetição**
O segredo dos grandes resultados não é a intensidade de um único dia, mas a consistência de repetir o método sem falhar ao longo das próximas semanas.`;
  } else if (format === "secrets") {
    body = `### Os 3 Grandes Segredos (e os Erros Fatais para Evitar):

❌ **Erro Fatal #1: Esperar o momento perfeito para começar**
A perfeição é inimiga da velocidade no Low Ticket e na vida. Quem espera ter todas as condições perfeitas nunca tira o projeto do papel.

💡 **Segredo Revelado #1: Aceleração por micro-vitórias**
Divida essa tarefa em metas de 15 minutos. Quando seu cérebro percebe que a tarefa é simples e rápida, a procrastinação desaparece instantaneamente.

❌ **Erro Fatal #2: Complicar o que deveria ser simples**
Mais ferramentas e métodos complexos só servem para gerar ansiedade. O básico bem feito todos os dias supera qualquer estratégia mirabolante.

💡 **Segredo Revelado #2: Foco no resultado mensurável**
Tenha sempre uma métrica clara para acompanhar seu progresso diário ao aplicar ${chapterTitle.toLowerCase()}.`;
  } else if (format === "checklist") {
    body = `### Checklist Prático de Aplicação Imediata:

[ ] **Item 1:** Definir exatamente o horário e local onde você vai colocar em prática os ensinamentos deste capítulo.
[ ] **Item 2:** Separar os materiais e ingredientes/ferramentas necessários antes de iniciar.
[ ] **Item 3:** Executar a primeira etapa sem interrupções por pelo menos 20 minutos focados.
[ ] **Item 4:** Anotar os resultados obtidos e as sensações/aprendizados da primeira aplicação.
[ ] **Item 5:** Compartilhar sua evolução ou revisar as anotações antes de avançar para o próximo capítulo.`;
  } else {
    body = `### Aprofundamento Prático & Aplicação Real:

Ao colocar em prática ${chapterTitle.toLowerCase()}, lembre-se de que a simplicidade é o maior trunfo para manter a constância.

Quando analisamos os alunos e leitores que obtiveram os melhores resultados com "${bookTitle}", percebemos um padrão comum: todos eles aplicaram as orientações exatamente na ordem proposta, sem pular etapas e sem tentar inventar atalhos.

${
  userPrompt
    ? `Observação focada no seu objetivo: ${userPrompt}. Certifique-se de priorizar esse ponto durante a sua rotina.`
    : `Mantenha seu foco firme no objetivo final: ${bookSubtitle}.`
}`;
  }

  const tipBox = `\n\n💡 **Dica de Ouro do Especialista:**
Se você só puder fazer uma única coisa hoje em relação a ${chapterTitle.toLowerCase()}, faça isso agora: execute os primeiros 5 minutos imediatamente após terminar esta leitura. O movimento gera clareza e destrava qualquer bloqueio!`;

  const detailedExtension =
    length === "detailed"
      ? `\n\n### Perguntas Frequentes & Resolução de Dúvidas Comuns:

• **"E se eu não tiver tempo suficiente?"**
Você só precisa de 10 a 15 minutos dedicados por dia. O método foi desenhado exatamente para pessoas com rotinas corridas.

• **"Em quanto tempo começo a ver os primeiros resultados?"**
Os primeiros reflexos de clareza e progresso aparecem já nas primeiras 48 a 72 horas de aplicação contínua.

• **"Posso adaptar alguma parte do método?"**
Sim, contanto que mantenha a estrutura central que apresentamos aqui intacta.`
      : "";

  const conclusion = `\n\n---\n**Conclusão do Capítulo:**
Agora que você tem o mapa exato do que fazer em ${chapterTitle.toLowerCase()}, não deixe esse conhecimento parado na mente. Conclua essa etapa e avance preparado para o próximo capítulo!`;

  return `${introHook}\n\n${body}${tipBox}${detailedExtension}${conclusion}`;
}

export default function EbookTool() {
  const [ebooks, setEbooks] = useState<Ebook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: "demo-1",
        ...LOW_TICKET_PRESETS["emagrecimento-chas"],
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [current, setCurrent] = useState<Ebook | null>(null);
  const [mainTab, setMainTab] = useState("info");
  const [editingChapter, setEditingChapter] = useState<string | null>(null);

  // Estados do Assistente de IA de Capítulos
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetChapter, setAiTargetChapter] = useState<Chapter | null>(null);
  const [aiUserPrompt, setAiUserPrompt] = useState("");
  const [aiTone, setAiTone] = useState("persuasive");
  const [aiFormat, setAiFormat] = useState("stepbystep");
  const [aiLength, setAiLength] = useState<"standard" | "detailed">("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAiContent, setGeneratedAiContent] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ebooks));
  }, [ebooks]);

  const persist = (list: Ebook[]) => {
    setEbooks(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const createFromPreset = (key: string) => {
    const preset = LOW_TICKET_PRESETS[key];
    if (!preset) return;
    const ebook: Ebook = {
      id: uid(),
      title: preset.title,
      subtitle: preset.subtitle,
      author: "Especialista Mony Ads",
      niche: key,
      role: preset.role,
      suggestedPrice: preset.suggestedPrice,
      badgeText: preset.badgeText,
      coverColor1: preset.coverColor1,
      coverColor2: preset.coverColor2,
      coverTextColor: preset.coverTextColor,
      chapters: preset.chapters.map((ch) => ({ id: uid(), ...ch })),
      createdAt: new Date().toISOString(),
    };
    persist([ebook, ...ebooks]);
    setCurrent(ebook);
    toast.success("E-book de Low Ticket gerado com capítulos completos!");
  };

  const createBlankEbook = () => {
    const ebook: Ebook = {
      id: uid(),
      title: "Meu E-book de Alta Conversão",
      subtitle: "Subtítulo atraente com benefício claro e prazo",
      author: "Seu Nome ou Marca",
      niche: "Geral",
      role: "frontend",
      suggestedPrice: 19.9,
      badgeText: "NOVA OFERTA 🚀",
      coverColor1: "#1e293b",
      coverColor2: "#0284c7",
      coverTextColor: "#ffffff",
      chapters: [
        { id: uid(), title: "Introdução ao Método", content: "Escreva aqui a introdução envolvente..." },
        { id: uid(), title: "O Passo a Passo Prático", content: "Escreva aqui o passo a passo..." },
      ],
      createdAt: new Date().toISOString(),
    };
    persist([ebook, ...ebooks]);
    setCurrent(ebook);
    toast.success("E-book em branco criado!");
  };

  const saveCurrent = () => {
    if (!current) return;
    persist(ebooks.map((e) => (e.id === current.id ? current : e)));
    toast.success("E-book salvo com sucesso!");
  };

  const deleteEbook = (id: string) => {
    persist(ebooks.filter((e) => e.id !== id));
    if (current?.id === id) setCurrent(null);
    toast.success("E-book removido.");
  };

  const addChapter = () => {
    if (!current) return;
    const ch: Chapter = {
      id: uid(),
      title: `Capítulo ${current.chapters.length + 1}: Novo Capítulo`,
      content: "",
    };
    setCurrent({ ...current, chapters: [...current.chapters, ch] });
    setEditingChapter(ch.id);
  };

  const updateChapter = (cid: string, patch: Partial<Chapter>) => {
    if (!current) return;
    setCurrent({
      ...current,
      chapters: current.chapters.map((c) => (c.id === cid ? { ...c, ...patch } : c)),
    });
  };

  const removeChapter = (cid: string) => {
    if (!current) return;
    setCurrent({
      ...current,
      chapters: current.chapters.filter((c) => c.id !== cid),
    });
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

  // Abrir Modal de Criação com IA para o capítulo selecionado
  const openAiGeneratorForChapter = (ch: Chapter) => {
    setAiTargetChapter(ch);
    setAiUserPrompt("");
    setGeneratedAiContent("");
    setAiModalOpen(true);
  };

  // Executar Geração com IA
  const handleGenerateAiChapter = () => {
    if (!current || !aiTargetChapter) return;
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateAiChapter({
        bookTitle: current.title,
        bookSubtitle: current.subtitle,
        chapterTitle: aiTargetChapter.title,
        userPrompt: aiUserPrompt,
        tone: aiTone,
        format: aiFormat,
        length: aiLength,
      });

      setGeneratedAiContent(generated);
      setIsGenerating(false);
      toast.success("Conteúdo gerado com sucesso pela IA!");
    }, 700);
  };

  // Aplicar conteúdo gerado no capítulo
  const applyAiContentToChapter = (mode: "replace" | "append") => {
    if (!aiTargetChapter || !generatedAiContent) return;
    const newContent =
      mode === "replace"
        ? generatedAiContent
        : aiTargetChapter.content
        ? `${aiTargetChapter.content}\n\n${generatedAiContent}`
        : generatedAiContent;

    updateChapter(aiTargetChapter.id, { content: newContent });
    setAiModalOpen(false);
    toast.success(
      mode === "replace" ? "Capítulo atualizado com a IA!" : "Conteúdo da IA adicionado ao capítulo!"
    );
  };

  // Injetar blocos rápidos com IA diretamente
  const injectQuickAiSnippet = (ch: Chapter, type: "tip" | "step" | "warning" | "faq") => {
    let snippet = "";
    if (type === "tip") {
      snippet = `\n\n💡 **Dica Rápida do Especialista:**\nPara ter resultados ainda mais rápidos em ${ch.title.toLowerCase()}, execute esta ação em blocos de 25 minutos com foco total, sem interrupções de celular ou notificações.`;
    } else if (type === "step") {
      snippet = `\n\n### Passo a Passo de Aplicação:\n1. Revise os materiais necessários.\n2. Inicie pela tarefa mais importante.\n3. Meça o resultado do dia e anote os aprendizados.`;
    } else if (type === "warning") {
      snippet = `\n\n⚠️ **Atenção — Erro Comum:**\nNunca pule esta etapa tentando acelerar o processo. Quem tenta improvisar aqui acaba tendo retrabalho nos próximos dias.`;
    } else if (type === "faq") {
      snippet = `\n\n❓ **Dúvida Frequente:**\n*Quanto tempo leva para dominar essa técnica?*\nA maioria das pessoas consegue aplicar perfeitamente em 3 a 5 dias de prática guiada.`;
    }

    updateChapter(ch.id, { content: (ch.content || "") + snippet });
    toast.success("Bloco inteligente inserido no capítulo!");
  };

  const wordCount = useMemo(() => {
    if (!current) return 0;
    return current.chapters.reduce(
      (sum, ch) => sum + ch.content.split(/\s+/).filter(Boolean).length,
      0
    );
  }, [current]);

  const readingTimeMinutes = useMemo(() => {
    return Math.max(1, Math.round(wordCount / 180));
  }, [wordCount]);

  // Exportar como Texto Formatado
  const exportAsText = () => {
    if (!current) return;
    const lines: string[] = [];
    lines.push("=".repeat(50));
    lines.push(current.title.toUpperCase());
    if (current.subtitle) lines.push(current.subtitle);
    if (current.author) lines.push(`Por: ${current.author}`);
    lines.push(
      `Papel no Funil: ${current.role.toUpperCase()} (Preço sugerido: R$ ${current.suggestedPrice.toFixed(
        2
      )})`
    );
    lines.push("=".repeat(50));
    lines.push("");
    lines.push("SUMÁRIO DO E-BOOK");
    lines.push("-".repeat(30));
    current.chapters.forEach((ch, i) => {
      lines.push(`${i + 1}. ${ch.title}`);
    });
    lines.push("");
    current.chapters.forEach((ch, i) => {
      lines.push("=".repeat(50));
      lines.push(`CAPÍTULO ${i + 1}: ${ch.title.toUpperCase()}`);
      lines.push("=".repeat(50));
      lines.push("");
      lines.push(ch.content || "[Conteúdo não preenchido]");
      lines.push("");
    });
    lines.push("=".repeat(50));
    lines.push("Gerado com Mony Ads — Plataforma Especializada em Low Ticket");
    lines.push("=".repeat(50));

    navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Texto completo do e-book copiado!");
  };

  // Gerar Copy de Pitch para o Facebook Ads
  const copyFacebookAdPitch = () => {
    if (!current) return;
    const pitch = `🔥 [ATENÇÃO] Finalmente revelado: como ter acesso ao "${current.title}"!

Se você sofre com a falta de tempo e métodos complicados, este guia prático foi feito para você.

✅ O que você vai aprender no material:
${current.chapters.map((c, i) => `👉 ${i + 1}. ${c.title}`).join("\n")}

⚠️ Oferta exclusiva de lançamento por apenas R$ ${current.suggestedPrice.toFixed(
      2
    )} (Acesso Imediato no seu e-mail).

👇 Toque no botão 'Saiba Mais' abaixo e garanta sua cópia com valor promocional antes que o preço suba!`;

    navigator.clipboard.writeText(pitch);
    toast.success("Copy de anúncio para o Facebook Ads copiada!");
  };

  // Baixar Arquivo HTML Formatado para Leitura ou PDF
  const downloadHtmlFile = () => {
    if (!current) return;
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${current.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; color: #1e293b; max-width: 750px; margin: 40px auto; padding: 0 20px; }
    .cover { background: linear-gradient(135deg, ${current.coverColor1}, ${current.coverColor2}); color: ${current.coverTextColor}; padding: 60px 40px; border-radius: 16px; text-align: center; margin-bottom: 50px; }
    h1 { font-size: 32px; margin-bottom: 12px; }
    .subtitle { font-size: 18px; opacity: 0.9; margin-bottom: 24px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }
    .author { font-size: 14px; opacity: 0.8; }
    .toc { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 50px; }
    .toc h2 { margin-top: 0; font-size: 20px; }
    .toc ol { padding-left: 20px; }
    .chapter { margin-bottom: 50px; page-break-after: always; }
    .chapter h2 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
    p { margin-bottom: 16px; white-space: pre-line; }
    @media print { .cover { page-break-after: always; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="badge">${current.badgeText}</div>
    <h1>${current.title}</h1>
    <div class="subtitle">${current.subtitle}</div>
    <div class="author">Por ${current.author}</div>
  </div>

  <div class="toc">
    <h2>Sumário</h2>
    <ol>
      ${current.chapters.map((c) => `<li>${c.title}</li>`).join("")}
    </ol>
  </div>

  ${current.chapters
    .map(
      (c, i) => `
    <div class="chapter">
      <h2>Capítulo ${i + 1}: ${c.title}</h2>
      <p>${c.content}</p>
    </div>
  `
    )
    .join("")}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${current.title.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Arquivo HTML baixado! Abra no navegador e use Ctrl+P para salvar em PDF.");
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-card/80 to-accent/10 p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold px-2.5 py-0.5">
                CRIADOR DE PRODUTOS DIGITAIS
              </Badge>
              <Badge variant="outline" className="border-accent text-accent">
                IA Integrada para Escrita
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gerador de E-books com IA</h2>
            <p className="text-sm text-muted-foreground">
              Crie em minutos produtos digitais com capítulos gerados por Inteligência Artificial prontos para vender no Low Ticket.
            </p>
          </div>

          {current && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={saveCurrent}>
                <Save className="w-4 h-4 mr-1.5" /> Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={exportAsText}>
                <Copy className="w-4 h-4 mr-1.5" /> Copiar Texto
              </Button>
              <Button size="sm" className="bg-gradient-brand shadow-glow" onClick={downloadHtmlFile}>
                <Download className="w-4 h-4 mr-1.5" /> Baixar HTML/PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {!current ? (
        <div className="space-y-6">
          {/* Seção de Criação com Presets de Nichos Vencedores */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Modelos Prontos de Alta Margem (Nichos Validados)</h3>
                <p className="text-xs text-muted-foreground">
                  Selecione um modelo com estrutura e capítulos já redigidos para começar rápido:
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={createBlankEbook}>
                <Plus className="w-4 h-4 mr-1.5" /> Criar em Branco
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(LOW_TICKET_PRESETS).map(([key, preset]) => (
                <div
                  key={key}
                  className="rounded-xl border border-border/80 bg-background/50 p-4 flex flex-col justify-between hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => createFromPreset(key)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {preset.badgeText}
                      </Badge>
                      <span className="text-xs font-bold text-green-400">
                        R$ {preset.suggestedPrice.toFixed(2)}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{preset.chapters.length} capítulos</span>
                    <span className="text-primary font-medium flex items-center gap-1">
                      Usar este modelo →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de E-books Salvos */}
          {ebooks.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-primary" /> Meus E-books Salvos ({ebooks.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ebooks.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col justify-between p-4 rounded-xl border border-border bg-background/60 hover:border-border transition-all"
                  >
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px]">
                          {e.badgeText || "E-book"}
                        </Badge>
                        <span className="text-xs font-semibold text-primary">
                          R$ {e.suggestedPrice ? e.suggestedPrice.toFixed(2) : "19.90"}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-foreground line-clamp-1">{e.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {e.chapters.length} capítulos • {e.author || "Sem autor"}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        className="flex-1 text-xs bg-gradient-brand"
                        onClick={() => setCurrent(e)}
                      >
                        Abrir Editor
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 px-2"
                        onClick={() => deleteEbook(e.id)}
                        title="Excluir e-book"
                      >
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
        /* Modo Edição */
        <div className="space-y-4">
          {/* Top Bar do Editor */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card/60">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  saveCurrent();
                  setCurrent(null);
                }}
              >
                ← Voltar aos Projetos
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {current.chapters.length} capítulos
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {wordCount.toLocaleString("pt-BR")} palavras (~{readingTimeMinutes} min de leitura)
                </Badge>
                <Badge className="bg-green-500/15 text-green-400 border border-green-500/30 text-xs">
                  Preço Sugerido: R$ {current.suggestedPrice.toFixed(2)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={copyFacebookAdPitch}>
                <Megaphone className="w-3.5 h-3.5 mr-1 text-accent" /> Copiar Pitch para Facebook
              </Button>
            </div>
          </div>

          {/* Abas do Editor */}
          <Tabs value={mainTab} onValueChange={setMainTab}>
            <TabsList className="bg-card/60 border border-border">
              <TabsTrigger value="info">Informações & Preço</TabsTrigger>
              <TabsTrigger value="chapters">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Capítulos & Conteúdo com IA
              </TabsTrigger>
              <TabsTrigger value="cover">
                <Palette className="w-3.5 h-3.5 mr-1.5" /> Capa 3D
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-3.5 h-3.5 mr-1.5" /> Pré-Visualização
              </TabsTrigger>
            </TabsList>

            {/* Aba Informações & Preço */}
            <TabsContent value="info" className="mt-4">
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Título Principal do E-book *</Label>
                    <Input
                      value={current.title}
                      onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                      placeholder="Ex: Manual das Marmitas Fit Lucrativas"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subtítulo de Impacto (Promessa + Prazo) *</Label>
                    <Input
                      value={current.subtitle}
                      onChange={(e) => setCurrent({ ...current, subtitle: e.target.value })}
                      placeholder="Ex: Como faturar R$ 3.000 no primeiro mês"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nome do Autor / Especialista</Label>
                    <Input
                      value={current.author}
                      onChange={(e) => setCurrent({ ...current, author: e.target.value })}
                      placeholder="Ex: Dra. Mariana Costa ou Equipe Marmita Pro"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Selo / Destaque de Capa</Label>
                    <Input
                      value={current.badgeText}
                      onChange={(e) => setCurrent({ ...current, badgeText: e.target.value })}
                      placeholder="Ex: EDIÇÃO 2026 · MÉTODO PRÁTICO"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-border/50">
                  <div className="space-y-1.5">
                    <Label>Papel no Funil Low Ticket</Label>
                    <Select
                      value={current.role}
                      onValueChange={(v: LowTicketRole) => setCurrent({ ...current, role: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Produto Front-End (R$ 19 - R$ 37)</SelectItem>
                        <SelectItem value="orderbump">Order Bump no Checkout (+R$ 14,90 - R$ 19,90)</SelectItem>
                        <SelectItem value="upsell">Upsell de 1 Clique (+R$ 47 - R$ 67)</SelectItem>
                        <SelectItem value="leadmagnet">Isca Digital Gratuita (Captação de Leads)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Preço Sugerido de Venda (R$)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={current.suggestedPrice}
                      onChange={(e) =>
                        setCurrent({
                          ...current,
                          suggestedPrice: parseFloat(e.target.value) || 19.9,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  <span>
                    <b>Dica Estratégica:</b> E-books de <b>R$ 19,90</b> a <b>R$ 27,00</b> com Order Bump de <b>R$ 14,90</b> atingem as maiores taxas de conversão no Facebook Ads para tráfego direto.
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* Aba Capítulos & Conteúdo com IA */}
            <TabsContent value="chapters" className="mt-4">
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Conteúdo dos Capítulos
                      <Badge variant="outline" className="text-accent border-accent text-[10px]">
                        IA Habilitada
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Clique em <b>"Editar Conteúdo"</b> para escrever manualmente ou usar a <b>IA para gerar o capítulo completo</b>.
                    </p>
                  </div>
                  <Button size="sm" onClick={addChapter} className="bg-gradient-brand">
                    <Plus className="w-4 h-4 mr-1.5" /> Adicionar Capítulo
                  </Button>
                </div>

                <ScrollArea className="h-[520px] pr-3">
                  <div className="space-y-3">
                    {current.chapters.map((ch, idx) => (
                      <div
                        key={ch.id}
                        className="rounded-xl border border-border bg-background/60 p-4 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Badge variant="secondary" className="text-xs shrink-0">
                              Capítulo {idx + 1}
                            </Badge>
                            <Input
                              value={ch.title}
                              onChange={(e) => updateChapter(ch.id, { title: e.target.value })}
                              className="h-8 text-sm font-semibold max-w-md bg-transparent"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Botão rápido para abrir IA para este capítulo */}
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30"
                              onClick={() => {
                                setEditingChapter(ch.id);
                                openAiGeneratorForChapter(ch);
                              }}
                            >
                              <Wand2 className="w-3.5 h-3.5 mr-1" /> Criar com IA
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveChapter(idx, -1)}
                              disabled={idx === 0}
                              title="Mover para cima"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => moveChapter(idx, 1)}
                              disabled={idx === current.chapters.length - 1}
                              title="Mover para baixo"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant={editingChapter === ch.id ? "default" : "outline"}
                              onClick={() =>
                                setEditingChapter(editingChapter === ch.id ? null : ch.id)
                              }
                            >
                              {editingChapter === ch.id ? "Recolher" : "Editar Conteúdo"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => removeChapter(ch.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Área Aberta do Editor do Capítulo */}
                        {editingChapter === ch.id && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                            {/* Barra de Ferramentas de IA em Destaque */}
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold text-foreground">
                                  Assistente de Escrita com IA:
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-gradient-brand shadow-glow"
                                  onClick={() => openAiGeneratorForChapter(ch)}
                                >
                                  <Bot className="w-3.5 h-3.5 mr-1" /> Escrever Capítulo com IA
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => injectQuickAiSnippet(ch, "step")}
                                  title="Inserir um bloco passo a passo com IA"
                                >
                                  <ListOrdered className="w-3 h-3 mr-1 text-primary" /> + Passo a Passo
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => injectQuickAiSnippet(ch, "tip")}
                                  title="Inserir uma dica de ouro no texto"
                                >
                                  <Lightbulb className="w-3 h-3 mr-1 text-yellow-400" /> + Dica de Ouro
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => injectQuickAiSnippet(ch, "warning")}
                                  title="Inserir um alerta de erro comum"
                                >
                                  <AlertTriangle className="w-3 h-3 mr-1 text-orange-400" /> + Alerta
                                </Button>
                              </div>
                            </div>

                            {/* Textarea de Conteúdo */}
                            <Textarea
                              value={ch.content}
                              onChange={(e) => updateChapter(ch.id, { content: e.target.value })}
                              placeholder="Escreva aqui o conteúdo deste capítulo ou use o botão 'Escrever Capítulo com IA' acima para criar tudo automaticamente..."
                              rows={11}
                              className="text-sm font-sans leading-relaxed bg-background"
                            />

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {ch.content.split(/\s+/).filter(Boolean).length} palavras
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs text-primary"
                                onClick={() => setEditingChapter(null)}
                              >
                                Concluir Edição
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Aba Capa 3D */}
            <TabsContent value="cover" className="mt-4">
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-base">Capa do E-book & Mockup 3D</h3>
                  <p className="text-xs text-muted-foreground">
                    Personalize as cores e veja o mockup 3D do seu e-book em tempo real:
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-center">
                  {/* Controles de Cores */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Cor de Fundo 1</Label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={current.coverColor1}
                            onChange={(e) => setCurrent({ ...current, coverColor1: e.target.value })}
                            className="w-9 h-9 rounded cursor-pointer border border-border"
                          />
                          <Input
                            value={current.coverColor1}
                            onChange={(e) => setCurrent({ ...current, coverColor1: e.target.value })}
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label>Cor de Fundo 2</Label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={current.coverColor2}
                            onChange={(e) => setCurrent({ ...current, coverColor2: e.target.value })}
                            className="w-9 h-9 rounded cursor-pointer border border-border"
                          />
                          <Input
                            value={current.coverColor2}
                            onChange={(e) => setCurrent({ ...current, coverColor2: e.target.value })}
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Cor do Texto</Label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={current.coverTextColor}
                          onChange={(e) => setCurrent({ ...current, coverTextColor: e.target.value })}
                          className="w-9 h-9 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={current.coverTextColor}
                          onChange={(e) => setCurrent({ ...current, coverTextColor: e.target.value })}
                          className="text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Paletas Rápidas */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <Label className="text-xs text-muted-foreground">Paletas Rápidas Recomendadas:</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: "Esmeralda", c1: "#065f46", c2: "#10b981", text: "#ffffff" },
                          { name: "Laranja Fit", c1: "#9a3412", c2: "#f97316", text: "#ffffff" },
                          { name: "Azul Real", c1: "#1e1b4b", c2: "#3b82f6", text: "#ffffff" },
                          { name: "Vinho Gold", c1: "#4c0519", c2: "#be123c", text: "#ffffff" },
                          { name: "Dark Modern", c1: "#0f172a", c2: "#334155", text: "#38bdf8" },
                        ].map((p) => (
                          <Button
                            key={p.name}
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() =>
                              setCurrent({
                                ...current,
                                coverColor1: p.c1,
                                coverColor2: p.c2,
                                coverTextColor: p.text,
                              })
                            }
                          >
                            <span
                              className="w-3 h-3 rounded-full mr-1.5 border border-white/20"
                              style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                            />
                            {p.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mockup 3D com Efeito de Livro */}
                  <div className="flex justify-center p-6 bg-muted/20 rounded-2xl border border-border/40">
                    <div
                      className="relative w-[240px] h-[340px] rounded-r-xl shadow-2xl flex flex-col justify-between p-6 transition-transform hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${current.coverColor1}, ${current.coverColor2})`,
                        color: current.coverTextColor,
                        boxShadow: "10px 15px 35px rgba(0,0,0,0.45), inset 6px 0 10px rgba(0,0,0,0.3)",
                        borderLeft: "6px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {/* Selo no Topo */}
                      <div className="text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-black/30 border border-white/20">
                          {current.badgeText || "MÉTODO COMPLETO"}
                        </span>
                      </div>

                      {/* Título e Subtítulo Central */}
                      <div className="my-auto text-center space-y-2">
                        <h3 className="text-xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                          {current.title || "Título do E-book"}
                        </h3>
                        <p className="text-[11px] opacity-90 line-clamp-3 leading-snug">
                          {current.subtitle || "Subtítulo atraente com a promessa principal"}
                        </p>
                      </div>

                      {/* Autor na Base */}
                      <div className="text-center pt-2 border-t border-white/20">
                        <p className="text-[10px] font-semibold tracking-wide uppercase opacity-85">
                          {current.author || "Nome do Autor"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Aba Pré-Visualização */}
            <TabsContent value="preview" className="mt-4">
              <div className="rounded-2xl border border-border bg-card/60 p-6">
                <ScrollArea className="h-[520px] pr-4">
                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Capa no Preview */}
                    <div
                      className="w-full rounded-2xl p-10 text-center space-y-3 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${current.coverColor1}, ${current.coverColor2})`,
                        color: current.coverTextColor,
                      }}
                    >
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/25">
                        {current.badgeText}
                      </span>
                      <h1 className="text-3xl font-extrabold">{current.title}</h1>
                      <p className="text-sm opacity-90 max-w-lg mx-auto">{current.subtitle}</p>
                      <p className="text-xs opacity-75 pt-4">Por {current.author}</p>
                    </div>

                    {/* Sumário */}
                    <div className="rounded-xl border border-border bg-muted/40 p-5 space-y-3">
                      <h3 className="font-bold text-base text-foreground">Sumário</h3>
                      <div className="space-y-1.5 text-sm">
                        {current.chapters.map((ch, i) => (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between py-1 border-b border-border/30 last:border-0"
                          >
                            <span className="text-muted-foreground">
                              {i + 1}. <b className="text-foreground">{ch.title}</b>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capítulos */}
                    {current.chapters.map((ch, i) => (
                      <div key={ch.id} className="space-y-3 pt-4 border-t border-border">
                        <div className="space-y-1">
                          <span className="text-xs uppercase font-bold text-primary tracking-wider">
                            Capítulo {i + 1}
                          </span>
                          <h2 className="text-2xl font-bold text-foreground">{ch.title}</h2>
                        </div>
                        <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line space-y-2">
                          {ch.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Modal / Dialog do Assistente de IA de Escrita */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              Escrever Capítulo com Inteligência Artificial
            </DialogTitle>
          </DialogHeader>

          {aiTargetChapter && (
            <div className="space-y-4 py-2 text-sm">
              <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Capítulo Selecionado
                  </Badge>
                  <p className="font-bold text-foreground">{aiTargetChapter.title}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  E-book: <b>{current?.title}</b> ({current?.subtitle})
                </p>
              </div>

              {/* Instruções para a IA */}
              <div className="space-y-1.5">
                <Label>O que a IA deve abordar neste capítulo? (Opcional)</Label>
                <Input
                  placeholder="Ex: Foque na receita do chá, passos de preparo e como tomar antes de dormir..."
                  value={aiUserPrompt}
                  onChange={(e) => setAiUserPrompt(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Tom de Voz da IA</Label>
                  <Select value={aiTone} onValueChange={setAiTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persuasive">Persuasivo & Direto (Vendas)</SelectItem>
                      <SelectItem value="educational">Educativo & Didático</SelectItem>
                      <SelectItem value="urgent">Urgente & Transformador</SelectItem>
                      <SelectItem value="welcoming">Acolhedor & Empático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Estrutura / Formato</Label>
                  <Select value={aiFormat} onValueChange={setAiFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stepbystep">Passo a Passo Prático</SelectItem>
                      <SelectItem value="secrets">Segredos & Erros Fatais</SelectItem>
                      <SelectItem value="checklist">Checklist & Ação Rápida</SelectItem>
                      <SelectItem value="story">Exemplo Real & Aplicação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Tamanho do Conteúdo</Label>
                  <Select
                    value={aiLength}
                    onValueChange={(v: "standard" | "detailed") => setAiLength(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Padrão (~350 palavras)</SelectItem>
                      <SelectItem value="detailed">Completo & Detalhado (~700 palavras)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botão de Disparo da IA */}
              <Button
                className="w-full bg-gradient-brand shadow-glow font-bold py-2.5"
                disabled={isGenerating}
                onClick={handleGenerateAiChapter}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    A Inteligência Artificial está escrevendo o capítulo...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Gerar Conteúdo com IA Agora
                  </>
                )}
              </Button>

              {/* Pré-Visualização do Conteúdo Gerado pela IA */}
              {generatedAiContent && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      Conteúdo Gerado pela IA:
                    </Label>
                    <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                      {generatedAiContent.split(/\s+/).filter(Boolean).length} palavras
                    </Badge>
                  </div>

                  <Textarea
                    value={generatedAiContent}
                    onChange={(e) => setGeneratedAiContent(e.target.value)}
                    rows={10}
                    className="text-xs font-mono leading-relaxed bg-muted/40"
                  />

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Button
                      className="flex-1 bg-gradient-brand"
                      onClick={() => applyAiContentToChapter("replace")}
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Substituir Capítulo com este Texto
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => applyAiContentToChapter("append")}
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Adicionar ao Final do Capítulo
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleGenerateAiChapter}
                      title="Gerar nova versão com IA"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}