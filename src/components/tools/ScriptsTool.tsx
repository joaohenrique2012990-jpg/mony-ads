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
  Copy, Save, FolderOpen, Trash2, Clock, FileText,
  Video, Mic, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";

interface ScriptInput {
  productName: string;
  targetAudience: string;
  mainPain: string;
  mainBenefit: string;
  price: string;
  guarantee: string;
}

interface ScriptSection {
  label: string;
  content: string;
}

interface Script {
  id: string;
  name: string;
  type: string;
  framework: string;
  input: ScriptInput;
  sections: ScriptSection[];
  createdAt: string;
}

const STORAGE_KEY = "monyads-scripts";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const SCRIPT_TYPES = [
  { value: "vsl", label: "VSL (Video Sales Letter)", icon: <Video className="w-4 h-4" /> },
  { value: "youtube-ads", label: "YouTube Ads", icon: <Video className="w-4 h-4" /> },
  { value: "reels", label: "Instagram Reels", icon: <Video className="w-4 h-4" /> },
  { value: "tiktok", label: "TikTok", icon: <Video className="w-4 h-4" /> },
  { value: "stories", label: "Stories", icon: <Video className="w-4 h-4" /> },
  { value: "depoimento", label: "Depoimento", icon: <Mic className="w-4 h-4" /> },
];

const FRAMEWORKS = [
  { value: "aida", label: "AIDA (Atenção, Interesse, Desejo, Ação)" },
  { value: "pas", label: "PAS (Problema, Agitação, Solução)" },
  { value: "bab", label: "BAB (Antes, Depois, Ponte)" },
  { value: "fab", label: "FAB (Características, Vantagens, Benefícios)" },
];

function generateScript(input: ScriptInput, type: string, framework: string): ScriptSection[] {
  const { productName, targetAudience, mainPain, mainBenefit, price, guarantee } = input;

  const isShort = ["reels", "tiktok", "stories"].includes(type);
  const isTestimonial = type === "depoimento";

  if (isTestimonial) {
    return [
      {
        label: "🎬 Abertura",
        content: `Oi, tudo bem? Meu nome é [NOME] e eu preciso te contar o que aconteceu comigo depois que conheci o ${productName}.\n\nAntes eu era ${targetAudience} que sofria muito com ${mainPain}. Eu já tinha tentado de tudo e nada funcionava.`,
      },
      {
        label: "😰 O Problema",
        content: `Eu estava no meu limite. ${mainPain} estava acabando com a minha autoestima e eu não sabia mais o que fazer.\n\nCheguei a pensar que nunca ia conseguir resolver isso. Já tinha gastado dinheiro com várias outras soluções e nenhuma deu resultado.`,
      },
      {
        label: "💡 A Descoberta",
        content: `Foi quando um amigo me indicou o ${productName}. No começo eu fiquei desconfiado(a), confesso. Mas decidi dar uma chance porque ${mainBenefit}.\n\nE cara... foi a melhor decisão que eu já tomei!`,
      },
      {
        label: "🎯 Os Resultados",
        content: `Em poucos dias eu já comecei a perceber os resultados. ${mainBenefit} se tornou realidade na minha vida.\n\nHoje eu posso dizer com toda certeza: o ${productName} realmente funciona! E o melhor: ${guarantee}.`,
      },
      {
        label: "📢 Recomendação",
        content: `Se você é ${targetAudience} e está passando pelo mesmo que eu passei, não pense duas vezes. O investimento é de apenas ${price} e tem ${guarantee}.\n\nClica no link aqui embaixo e muda sua vida assim como eu mudei a minha. Você não vai se arrepender!`,
      },
    ];
  }

  if (isShort) {
    switch (framework) {
      case "pas":
        return [
          {
            label: "🎣 Hook (0-3s)",
            content: `Você é ${targetAudience} e está cansado(a) de ${mainPain}?`,
          },
          {
            label: "😤 Agitação (3-10s)",
            content: `Isso está te impedindo de ${mainBenefit} e você sabe que precisa resolver isso AGORA.\n\nEnquanto você não resolve, o problema só piora.`,
          },
          {
            label: "✅ Solução (10-20s)",
            content: `O ${productName} resolve isso de forma simples e rápida.\n\nJá ajudou milhares de pessoas como você a ${mainBenefit}.`,
          },
          {
            label: "📢 CTA (20-30s)",
            content: `Por apenas ${price}. E tem ${guarantee}.\n\nClica no link da bio e garante o seu agora! 👇`,
          },
        ];
      case "bab":
        return [
          {
            label: "🎣 Hook (0-3s)",
            content: `De ${mainPain} para ${mainBenefit} — é possível sim!`,
          },
          {
            label: "😔 Antes (3-10s)",
            content: `Se você é ${targetAudience}, sabe como é difícil lidar com ${mainPain} todo dia.\n\nParece que não tem saída, né?`,
          },
          {
            label: "😊 Depois (10-20s)",
            content: `Imagina ${mainBenefit} em poucas semanas. Isso é real!\n\nO ${productName} já transformou a vida de milhares de pessoas.`,
          },
          {
            label: "🌉 Ponte + CTA (20-30s)",
            content: `A ponte entre onde você está e onde quer chegar se chama ${productName}.\n\n${price} • ${guarantee}\n\nLink na bio! 👆`,
          },
        ];
      default: // AIDA / FAB
        return [
          {
            label: "🎣 Hook (0-3s)",
            content: `PARE! Isso aqui é pra você que é ${targetAudience} 👇`,
          },
          {
            label: "⚡ Interesse (3-10s)",
            content: `O ${productName} é a solução definitiva para quem sofre com ${mainPain}.\n\nE o melhor: funciona em poucos dias!`,
          },
          {
            label: "🔥 Desejo (10-20s)",
            content: `Imagina ${mainBenefit}... Isso é o que nossos clientes relatam todos os dias.\n\nResultados REAIS de pessoas REAIS.`,
          },
          {
            label: "📢 CTA (20-30s)",
            content: `Aproveite: ${price} com ${guarantee}.\n\nClica no link e muda sua vida hoje! 🚀`,
          },
        ];
    }
  }

  // Long-form: VSL / YouTube Ads
  switch (framework) {
    case "pas":
      return [
        {
          label: "🎣 Hook",
          content: `Se você é ${targetAudience} e está sofrendo com ${mainPain}, preste muita atenção neste vídeo. Nos próximos minutos, eu vou revelar exatamente como resolver esse problema de uma vez por todas.\n\nE não, eu não vou te pedir pra comprar nada agora. Primeiro, eu vou te mostrar o PORQUÊ isso funciona.`,
        },
        {
          label: "😰 Problema",
          content: `Vamos falar a verdade: ${mainPain} é um dos maiores problemas que ${targetAudience} enfrenta hoje.\n\nVocê já tentou diversas soluções. Algumas prometeram resultados milagrosos. Outras pareciam boas no começo, mas não duraram.\n\nE o pior: enquanto você não resolve isso, o problema continua crescendo. Cada dia que passa sem ${mainBenefit} é um dia perdido.\n\nEu sei como é essa frustração porque já passei por isso também.`,
        },
        {
          label: "😤 Agitação",
          content: `E a verdade dura é que, se você não fizer nada diferente, nada vai mudar.\n\nVocê vai continuar acordando todo dia com o mesmo problema, gastando tempo e dinheiro com soluções que não funcionam.\n\nPense nisso: daqui a 6 meses, onde você vai estar se continuar no mesmo caminho?\n\nA maioria de ${targetAudience} desiste porque não encontra a solução certa. Mas eu garanto: a solução existe. E ela é mais simples do que você imagina.`,
        },
        {
          label: "✅ Solução",
          content: `Apresento a você: ${productName}.\n\nEsse não é mais um produto genérico. O ${productName} foi desenvolvido especificamente para ${targetAudience} que precisa ${mainBenefit}.\n\nEle funciona porque ataca a raiz do problema, não apenas os sintomas. Diferente de tudo que você já tentou antes.`,
        },
        {
          label: "🏆 Benefícios",
          content: `Com o ${productName}, você vai:\n\n✅ ${mainBenefit}\n✅ Economizar tempo e dinheiro com soluções que não funcionam\n✅ Ter resultados visíveis em poucos dias\n✅ Contar com suporte completo durante toda sua jornada\n✅ Fazer parte de uma comunidade de pessoas que já transformaram suas vidas`,
        },
        {
          label: "💰 Oferta",
          content: `Normalmente, resolver ${mainPain} custaria muito mais do que você imagina. Consultores cobram fortunas, cursos genéricos não dão resultado.\n\nMas hoje, o ${productName} está disponível por apenas ${price}.\n\nIsso é menos do que você gasta com [comparação relevante] por mês. E os resultados são para a vida toda.`,
        },
        {
          label: "🛡️ Garantia",
          content: `E pra você ficar ainda mais tranquilo(a): ${guarantee}.\n\nIsso mesmo. Você testa, aplica, vê os resultados. Se por qualquer motivo não ficar satisfeito(a), devolvemos cada centavo.\n\nO risco é ZERO pra você. Todo o risco é nosso.`,
        },
        {
          label: "📢 CTA Final",
          content: `Então a pergunta é: você vai continuar sofrendo com ${mainPain}, ou vai dar o primeiro passo para ${mainBenefit}?\n\nClique no botão abaixo agora mesmo e garanta seu acesso ao ${productName} por ${price}.\n\nLembre-se: ${guarantee}. Você não tem nada a perder e tudo a ganhar.\n\n👉 CLIQUE AQUI E COMECE AGORA 👈\n\nNão deixe pra depois. Seu futuro eu agradece. ✨`,
        },
      ];

    case "bab":
      return [
        {
          label: "🎣 Hook",
          content: `${targetAudience}, eu preciso te fazer uma pergunta: como seria sua vida se você pudesse ${mainBenefit}?\n\nNos próximos minutos, vou te mostrar exatamente como sair de onde você está e chegar onde sempre quis.`,
        },
        {
          label: "😔 Antes (Situação Atual)",
          content: `Eu sei como é a sua realidade agora.\n\nVocê é ${targetAudience} e está lidando com ${mainPain}. Todo dia é a mesma coisa: frustração, tentativas que não dão certo, sensação de que está ficando para trás.\n\nVocê olha para os outros e se pergunta: "Por que para eles parece tão fácil?"\n\nMas a verdade é que não é fácil para ninguém. A diferença é que algumas pessoas encontraram o caminho certo.`,
        },
        {
          label: "😊 Depois (Situação Desejada)",
          content: `Agora imagine essa cena:\n\nVocê acorda pela manhã e ${mainBenefit}. Sem estresse, sem preocupação com ${mainPain}.\n\nVocê tem clareza sobre o que fazer. Tem confiança nos seus resultados. E sabe que está no caminho certo.\n\nIsso não é um sonho. É a realidade de centenas de ${targetAudience} que fizeram uma simples escolha.`,
        },
        {
          label: "🌉 Ponte (A Solução)",
          content: `A ponte entre o antes e o depois se chama ${productName}.\n\nO ${productName} é um método comprovado que te leva de ${mainPain} para ${mainBenefit} de forma prática e direta.\n\nNada de teoria complicada. Nada de enrolação. Passo a passo claro para você aplicar hoje.`,
        },
        {
          label: "🏆 Benefícios + Prova",
          content: `Veja o que você recebe:\n\n✅ ${mainBenefit}\n✅ Método testado e validado\n✅ Acesso imediato\n✅ Suporte dedicado\n✅ Comunidade ativa\n\nJá são mais de [X] pessoas que saíram do "antes" para o "depois" com o ${productName}.`,
        },
        {
          label: "💰 Oferta + Garantia",
          content: `Tudo isso por apenas ${price}.\n\nE com ${guarantee}.\n\nVocê testa sem risco nenhum. Se não gostar, devolvemos seu dinheiro. Simples assim.`,
        },
        {
          label: "📢 CTA Final",
          content: `A decisão é sua: continuar no "antes" ou dar o passo para o "depois"?\n\nClique no botão abaixo e comece sua transformação agora.\n\n${productName} — por ${price} — com ${guarantee}.\n\n👉 QUERO COMEÇAR AGORA 👈`,
        },
      ];

    case "fab":
      return [
        {
          label: "🎣 Hook",
          content: `Atenção, ${targetAudience}! O que eu vou te mostrar agora pode mudar completamente a forma como você lida com ${mainPain}.`,
        },
        {
          label: "📋 Características",
          content: `O ${productName} é uma solução completa criada especificamente para ${targetAudience}.\n\nEle inclui:\n📌 Método passo a passo detalhado\n📌 Material de apoio completo\n📌 Acesso imediato e vitalício\n📌 Suporte especializado\n📌 Atualizações constantes`,
        },
        {
          label: "⚡ Vantagens",
          content: `Diferente de outras soluções que você já tentou, o ${productName}:\n\n🔹 Ataca a causa raiz de ${mainPain}, não apenas os sintomas\n🔹 Foi testado e validado por centenas de ${targetAudience}\n🔹 É simples de aplicar mesmo para iniciantes\n🔹 Gera resultados em poucos dias\n🔹 Tem suporte humano real, não bots`,
        },
        {
          label: "🎯 Benefícios",
          content: `O resultado prático disso tudo é que você vai:\n\n✅ ${mainBenefit}\n✅ Parar de perder tempo e dinheiro com soluções ineficazes\n✅ Ter um caminho claro e definido\n✅ Alcançar seus objetivos de forma consistente\n✅ Se sentir confiante e no controle`,
        },
        {
          label: "💰 Oferta",
          content: `E o investimento? Apenas ${price}.\n\nSim, por menos do que [comparação], você tem acesso completo ao ${productName}.`,
        },
        {
          label: "🛡️ Garantia + CTA",
          content: `${guarantee}. Risco zero para você.\n\nClique no botão abaixo e comece agora:\n\n👉 GARANTIR MEU ACESSO 👈\n\n${productName} • ${price} • ${guarantee}`,
        },
      ];

    default: // AIDA
      return [
        {
          label: "🎣 Hook / Atenção",
          content: `ATENÇÃO, ${targetAudience}!\n\nSe você sofre com ${mainPain}, esse é o vídeo mais importante que você vai assistir hoje.\n\nNão pule, não feche. Os próximos minutos podem literalmente mudar sua vida.`,
        },
        {
          label: "🧐 Interesse",
          content: `Existe um método que está ajudando milhares de ${targetAudience} a ${mainBenefit}.\n\nNão é milagre. Não é mágica. É uma abordagem comprovada, testada e que FUNCIONA.\n\nE o melhor: qualquer pessoa pode aplicar, independente de experiência ou conhecimento prévio.\n\nDeixe-me explicar como funciona...`,
        },
        {
          label: "🔥 Desejo",
          content: `Imagine como seria sua vida se você pudesse ${mainBenefit}.\n\nSem mais ${mainPain}. Sem mais frustração. Sem mais noites em claro se perguntando o que fazer.\n\nÉ exatamente isso que o ${productName} oferece.\n\nJá são mais de [X] pessoas que transformaram suas vidas com esse método. E agora é a sua vez.\n\nVeja o que você vai ter acesso:\n\n✅ ${mainBenefit}\n✅ Passo a passo completo\n✅ Suporte dedicado\n✅ Resultados visíveis em poucos dias\n✅ Comunidade exclusiva`,
        },
        {
          label: "💰 Oferta",
          content: `O ${productName} está disponível hoje por apenas ${price}.\n\nÉ isso mesmo. Por menos do que um jantar, você tem acesso completo à solução que vai resolver ${mainPain} de uma vez por todas.`,
        },
        {
          label: "🛡️ Garantia",
          content: `E pra eliminar qualquer dúvida: ${guarantee}.\n\nVocê testa, aplica, vê os resultados. Se não funcionar pra você, devolvemos 100% do seu investimento.\n\nO risco é TODO nosso. Pra você, é só benefício.`,
        },
        {
          label: "📢 Ação / CTA",
          content: `Não espere mais. Cada dia que passa sem agir é um dia a mais convivendo com ${mainPain}.\n\nClique no botão abaixo AGORA e garanta seu acesso ao ${productName}.\n\n${price} • ${guarantee}\n\n👉 QUERO MINHA TRANSFORMAÇÃO AGORA 👈\n\nSua vida nova começa com um clique. ✨`,
        },
      ];
  }
}

export default function ScriptsTool() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [input, setInput] = useState<ScriptInput>({
    productName: "",
    targetAudience: "",
    mainPain: "",
    mainBenefit: "",
    price: "",
    guarantee: "",
  });
  const [selectedType, setSelectedType] = useState("vsl");
  const [selectedFramework, setSelectedFramework] = useState("aida");
  const [generated, setGenerated] = useState<ScriptSection[] | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [tab, setTab] = useState("create");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setScripts(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const persist = (list: Script[]) => {
    setScripts(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleGenerate = () => {
    const missing = [];
    if (!input.productName) missing.push("Nome do produto");
    if (!input.targetAudience) missing.push("Público-alvo");
    if (!input.mainPain) missing.push("Dor principal");
    if (!input.mainBenefit) missing.push("Benefício principal");
    if (missing.length) {
      toast.error(`Preencha: ${missing.join(", ")}`);
      return;
    }
    const sections = generateScript(input, selectedType, selectedFramework);
    setGenerated(sections);
    setExpandedSections(new Set(sections.map((_, i) => i)));
    toast.success("Roteiro gerado com sucesso!");
  };

  const saveScript = () => {
    if (!generated) return;
    const typeLabel = SCRIPT_TYPES.find((t) => t.value === selectedType)?.label || selectedType;
    const script: Script = {
      id: uid(),
      name: `${input.productName} — ${typeLabel}`,
      type: selectedType,
      framework: selectedFramework,
      input: { ...input },
      sections: generated,
      createdAt: new Date().toISOString(),
    };
    persist([...scripts, script]);
    toast.success("Roteiro salvo!");
  };

  const deleteScript = (id: string) => {
    persist(scripts.filter((s) => s.id !== id));
    toast.success("Roteiro excluído!");
  };

  const loadScript = (script: Script) => {
    setInput(script.input);
    setSelectedType(script.type);
    setSelectedFramework(script.framework);
    setGenerated(script.sections);
    setExpandedSections(new Set(script.sections.map((_, i) => i)));
    setTab("create");
  };

  const copySection = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Seção copiada!");
  };

  const copyFullScript = () => {
    if (!generated) return;
    const full = generated.map((s) => `${s.label}\n${"—".repeat(30)}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(full);
    toast.success("Roteiro completo copiado!");
  };

  const toggleSection = (idx: number) => {
    const next = new Set(expandedSections);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedSections(next);
  };

  const totalWords = generated ? generated.reduce((sum, s) => sum + s.content.split(/\s+/).filter(Boolean).length, 0) : 0;
  const estimatedMinutes = Math.ceil(totalWords / 150);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Roteiros e Áudios</h2>
            <p className="text-sm text-muted-foreground">Gere roteiros profissionais para vídeos de vendas e anúncios</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="create"><Sparkles className="w-4 h-4 mr-1" /> Criar Roteiro</TabsTrigger>
            <TabsTrigger value="saved"><FolderOpen className="w-4 h-4 mr-1" /> Salvos ({scripts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
              <h3 className="font-semibold">Informações do Produto</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Nome do Produto *</Label>
                  <Input value={input.productName} onChange={(e) => setInput({ ...input, productName: e.target.value })} placeholder="Ex: Método Fórmula Digital" />
                </div>
                <div>
                  <Label>Público-Alvo *</Label>
                  <Input value={input.targetAudience} onChange={(e) => setInput({ ...input, targetAudience: e.target.value })} placeholder="Ex: empreendedores iniciantes" />
                </div>
                <div>
                  <Label>Dor Principal *</Label>
                  <Input value={input.mainPain} onChange={(e) => setInput({ ...input, mainPain: e.target.value })} placeholder="Ex: não conseguir vender online" />
                </div>
                <div>
                  <Label>Benefício Principal *</Label>
                  <Input value={input.mainBenefit} onChange={(e) => setInput({ ...input, mainBenefit: e.target.value })} placeholder="Ex: faturar R$ 10 mil por mês" />
                </div>
                <div>
                  <Label>Preço</Label>
                  <Input value={input.price} onChange={(e) => setInput({ ...input, price: e.target.value })} placeholder="Ex: R$ 197,00" />
                </div>
                <div>
                  <Label>Garantia</Label>
                  <Input value={input.guarantee} onChange={(e) => setInput({ ...input, guarantee: e.target.value })} placeholder="Ex: Garantia de 7 dias" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
              <h3 className="font-semibold">Configuração do Roteiro</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Tipo de Conteúdo</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SCRIPT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Framework</Label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FRAMEWORKS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={handleGenerate}>
                <Sparkles className="w-4 h-4 mr-2" /> Gerar Roteiro
              </Button>
            </div>

            {generated && (
              <div className="rounded-2xl border border-border bg-card/60 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Roteiro Gerado</h3>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {totalWords} palavras
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~{estimatedMinutes} min
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={saveScript}>
                      <Save className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyFullScript}>
                      <Copy className="w-4 h-4 mr-1" /> Copiar Tudo
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-3">
                    {generated.map((section, idx) => (
                      <div key={idx} className="rounded-lg border border-border bg-background">
                        <button
                          className="w-full flex items-center justify-between p-4 text-left"
                          onClick={() => toggleSection(idx)}
                        >
                          <span className="font-medium">{section.label}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {section.content.split(/\s+/).filter(Boolean).length} palavras
                            </Badge>
                            {expandedSections.has(idx) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>
                        {expandedSections.has(idx) && (
                          <div className="px-4 pb-4 border-t border-border pt-3">
                            <Textarea
                              value={section.content}
                              onChange={(e) => {
                                const updated = [...generated];
                                updated[idx] = { ...updated[idx], content: e.target.value };
                                setGenerated(updated);
                              }}
                              rows={8}
                              className="font-mono text-sm mb-2"
                            />
                            <Button size="sm" variant="ghost" onClick={() => copySection(section.content)}>
                              <Copy className="w-3 h-3 mr-1" /> Copiar seção
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {scripts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum roteiro salvo ainda</p>
            ) : (
              <div className="space-y-3">
                {scripts.map((s) => {
                  const wordCount = s.sections.reduce((sum, sec) => sum + sec.content.split(/\s+/).filter(Boolean).length, 0);
                  return (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{SCRIPT_TYPES.find((t) => t.value === s.type)?.label}</Badge>
                          <Badge variant="outline" className="text-xs">{FRAMEWORKS.find((f) => f.value === s.framework)?.label?.split(" ")[0]}</Badge>
                          <span className="text-xs text-muted-foreground">{wordCount} palavras • {new Date(s.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => loadScript(s)}>Abrir</Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          const full = s.sections.map((sec) => `${sec.label}\n${"—".repeat(30)}\n${sec.content}`).join("\n\n");
                          navigator.clipboard.writeText(full);
                          toast.success("Copiado!");
                        }}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => deleteScript(s.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
