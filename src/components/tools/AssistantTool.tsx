import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const TEMPLATES = [
  { label: "Como criar um anúncio para Facebook?", topic: "facebook_ads" },
  { label: "Dicas para copy de vendas", topic: "copy_vendas" },
  { label: "Estratégia de lançamento", topic: "lancamento" },
  { label: "Como definir público-alvo", topic: "publico_alvo" },
  { label: "Melhores práticas para VSL", topic: "vsl" },
  { label: "Como otimizar CPA", topic: "otimizar_cpa" },
  { label: "Como escalar campanhas", topic: "escalar" },
  { label: "Criação de funil de vendas", topic: "funil" },
  { label: "E-mail marketing eficiente", topic: "email" },
  { label: "Como usar remarketing", topic: "remarketing" },
  { label: "Tráfego orgânico vs pago", topic: "organico_pago" },
  { label: "Como criar oferta irresistível", topic: "oferta" },
];

const RESPONSES: Record<string, string> = {
  facebook_ads: `## Como Criar um Anúncio de Alta Performance no Facebook

### 1. Estrutura de Campanha
- **Campanha:** Defina o objetivo (Conversões é o mais comum para vendas diretas)
- **Conjunto de Anúncios:** Configure o público, orçamento e posicionamentos
- **Anúncio:** Crie o criativo (imagem/vídeo + copy)

### 2. Segmentação de Público
- **Públicos Frios:** Use interesses relacionados ao nicho (ex: "marketing digital", "empreendedorismo")
- **Públicos Mornos:** Lookalike 1-3% baseado em compradores ou leads
- **Públicos Quentes:** Remarketing de visitantes do site, engajados, carrinho abandonado

### 3. Copy que Converte
- **Hook (Gancho):** Primeira linha que para o scroll. Ex: "Você está cometendo estes 3 erros que impedem suas vendas..."
- **Corpo:** Apresente o problema, agite a dor, mostre a solução
- **CTA:** Chamada clara para ação. Ex: "Clique em SAIBA MAIS e descubra como..."

### 4. Criativos
- **Imagens:** Use contraste, rostos humanos, texto overlay (menos de 20%)
- **Vídeos:** Primeiros 3 segundos são cruciais. Use formato vertical (9:16) para Stories/Reels
- **Carrossel:** Ótimo para contar história sequencial ou mostrar benefícios

### 5. Otimização
- Comece com R$20-50/dia por conjunto de anúncios
- Teste 3-5 criativos diferentes por conjunto
- Deixe rodar por 3-5 dias antes de tomar decisões
- Mate o que tem CPA acima de 2x do seu target
- Escale horizontalmente (novos públicos) antes de verticalmente (mais orçamento)

### 6. Métricas-chave
- **CTR:** Acima de 1.5% é bom
- **CPM:** Varia por nicho, monitore tendências
- **CPA:** Deve ser menor que seu lucro por venda
- **ROAS:** Mínimo 2x para ser sustentável`,

  copy_vendas: `## Dicas Avançadas para Copy de Vendas

### A Estrutura AIDA (Atenção → Interesse → Desejo → Ação)

**1. Atenção — O Hook**
- Perguntas provocativas: "Você sabia que 97% dos afiliados nunca fazem uma venda?"
- Números impactantes: "Método que gerou R$127.000 em 30 dias"
- Declarações ousadas: "Tudo que te ensinaram sobre tráfego pago está errado"

**2. Interesse — O Problema**
- Identifique a dor principal do público
- Agite a dor mostrando as consequências de não resolver
- Use storytelling: conte uma história que o público se identifique

**3. Desejo — A Solução**
- Apresente os benefícios (não apenas características)
- Use prova social: depoimentos, números, resultados
- Ancoragem de preço: mostre quanto vale vs. quanto custa

**4. Ação — O CTA**
- Seja específico: "Clique no botão abaixo e garanta sua vaga"
- Adicione urgência: "Apenas 47 vagas restantes"
- Reduza risco: "Garantia de 7 dias ou seu dinheiro de volta"

### Palavras de Poder para Vendas
- **Urgência:** Agora, Hoje, Imediatamente, Última chance
- **Exclusividade:** Secreto, Limitado, VIP, Seleto
- **Emoção:** Transformação, Liberdade, Segurança, Conquista
- **Credibilidade:** Comprovado, Garantido, Testado, Certificado

### Gatilhos Mentais Essenciais
1. **Escassez:** Vagas/unidades limitadas
2. **Urgência:** Prazo definido para acabar
3. **Prova Social:** "Mais de 10.000 alunos"
4. **Autoridade:** Credenciais, resultados, mídia
5. **Reciprocidade:** Dê valor antes de pedir a venda
6. **Compromisso:** Pequenos "sins" antes do grande SIM`,

  lancamento: `## Estratégia Completa de Lançamento Digital

### Fase 1 — Pré-Pré-Lançamento (30-45 dias antes)
- Construa audiência nas redes sociais com conteúdo de valor
- Crie uma lista de espera/interesse com landing page
- Comece a gerar curiosidade sem revelar o produto
- Meta: 1.000-5.000 leads na lista

### Fase 2 — Pré-Lançamento (14-21 dias antes)
- **CPL 1 (Conteúdo Pré-Lançamento):** A Oportunidade — mostre que existe uma solução
- **CPL 2:** A Transformação — ensine algo valioso gratuitamente
- **CPL 3:** A Experiência — dê uma prova do resultado
- Use lives, webinars ou vídeos gravados
- Cada CPL deve ter CTA para o próximo e para a lista de espera

### Fase 3 — Lançamento (7 dias)
- **Dia 1-2:** Abertura do carrinho com bônus de ação rápida
- **Dia 3-4:** Prova social, depoimentos, cases de sucesso
- **Dia 5-6:** Quebra de objeções, FAQ, lives de dúvidas
- **Dia 7:** Fechamento com urgência máxima (últimas horas)

### Fase 4 — Pós-Lançamento
- Onboarding dos compradores
- Pesquisa com quem não comprou (entender objeções)
- Planejamento do próximo lançamento ou abertura perpétua

### Métricas-alvo por Fase
| Métrica | Meta |
|---------|------|
| Leads CPL 1 | 3.000-10.000 |
| Taxa abertura e-mail | >30% |
| Presença nas lives | 15-25% da lista |
| Conversão (lista → venda) | 3-7% |
| Ticket médio | R$297-997 |

### Orçamento Sugerido
- **Lista pequena (<5K):** R$3.000-8.000 em tráfego
- **Lista média (5-20K):** R$8.000-25.000
- **Lista grande (>20K):** R$25.000-100.000+`,

  publico_alvo: `## Como Definir Seu Público-Alvo com Precisão

### 1. Criando Sua Persona (Avatar)

Responda estas perguntas detalhadamente:

**Dados Demográficos:**
- Idade, gênero, localização
- Renda mensal, nível educacional
- Estado civil, tem filhos?

**Dados Psicográficos:**
- Quais seus maiores medos e frustrações?
- Quais seus sonhos e desejos?
- O que o mantém acordado à noite?
- Se pudesse resolver UM problema, qual seria?

**Comportamento Digital:**
- Quais redes sociais mais usa?
- Que tipo de conteúdo consome?
- Quais influenciadores segue?
- Como busca informação (Google, YouTube, Instagram)?

### 2. Pesquisa Prática
- **Grupos do Facebook:** Entre em grupos do nicho e leia os comentários/dúvidas
- **Comentários no YouTube:** Veja o que as pessoas perguntam em vídeos do nicho
- **Yahoo Respostas / Quora:** Descubra perguntas reais do público
- **Amazon reviews:** Leia reviews de livros/produtos do nicho para entender dores
- **Google Suggest:** Digite perguntas do nicho e veja as sugestões

### 3. Segmentação para Anúncios
- **Interesses:** Páginas, influenciadores e marcas que seu público segue
- **Comportamentos:** Compradores online, donos de negócios, etc.
- **Lookalike:** Baseado em seus melhores clientes (1-3%)
- **Custom Audiences:** Engajados, visitantes do site, lista de e-mails

### 4. Validação
- Crie anúncios de teste com R$10-20/dia para 3-5 públicos
- Meça CTR e CPC — público certo terá melhor engajamento
- Analise por 3-5 dias antes de decidir
- O público vencedor recebe mais orçamento`,

  vsl: `## Melhores Práticas para VSL (Video Sales Letter)

### Estrutura da VSL Perfeita

**1. Hook (0-30 segundos)**
- Comece com uma promessa ou pergunta poderosa
- "Se você pudesse [resultado desejado] em [tempo], sem [obstáculo], você assistiria este vídeo até o final?"
- Use pattern interrupt para prender atenção

**2. Identificação (30s - 2min)**
- Conte sua história ou de um aluno
- O público precisa se ver na história
- "Eu sei como é [dor/frustração] porque eu também passei por isso..."

**3. O Problema (2-5min)**
- Aprofunde na dor principal
- Mostre as consequências de não resolver
- Agite as emoções (frustração, medo, vergonha)

**4. A Solução (5-10min)**
- Apresente o mecanismo único
- "Descobri que o segredo está em [mecanismo]"
- Explique POR QUE funciona diferente

**5. Prova (10-15min)**
- Resultados seus e de alunos
- Screenshots, depoimentos em vídeo
- Números concretos e verificáveis

**6. A Oferta (15-20min)**
- O que está incluído (módulos/bônus)
- Ancoragem de preço (valor real vs. investimento)
- Bônus com prazo limitado

**7. CTA + Garantia (20-25min)**
- Garantia incondicional de 7-30 dias
- "Clique no botão abaixo agora"
- Repita os principais benefícios

### Dicas Técnicas
- **Duração ideal:** 15-45 minutos (teste!)
- **Formato:** Slides com narração convertem bem
- **Velocidade:** Fale com energia e ritmo
- **Texto na tela:** Reforce pontos-chave com texto
- **Sem controles:** Remova barra de progresso do player
- **Botão atrasado:** Mostre o CTA apenas após a oferta (após 70-80% do vídeo)`,

  otimizar_cpa: `## Como Otimizar Seu CPA (Custo Por Aquisição)

### Diagnóstico — Onde Está o Problema?
Analise cada etapa do funil:
1. **CPM alto?** → Problema de segmentação ou saturação de público
2. **CTR baixo?** → Problema de criativo (imagem/vídeo e copy)
3. **CPC alto?** → Problema de relevância do anúncio
4. **Taxa de conversão baixa?** → Problema na página de vendas/oferta

### Otimizações por Etapa

**Nível 1 — Criativos**
- Teste novos ângulos de copy a cada 3-5 dias
- Use UGC (User Generated Content) — converte até 4x mais
- Formatos que mais convertem: Vídeo curto (15-30s), carrossel, imagem com texto
- Renove criativos antes de saturar (frequência > 3)

**Nível 2 — Segmentação**
- Expanda públicos Lookalike (1% → 3% → 5%)
- Teste Broad (sem interesses) com orçamento maior
- Exclua compradores e leads já convertidos
- Use exclusões para evitar público não qualificado

**Nível 3 — Página de Vendas**
- Velocidade < 3 segundos (use PageSpeed Insights)
- Teste headlines diferentes (A/B test)
- Simplifique o checkout (menos campos = mais conversão)
- Adicione chat/WhatsApp para tirar dúvidas

**Nível 4 — Oferta**
- Teste preços diferentes
- Adicione bônus que aumentem o valor percebido
- Ofereça parcelamento
- Teste garantias mais longas (7 → 15 → 30 dias)

### Benchmarks de CPA por Nicho
| Nicho | CPA Bom | CPA Médio | CPA Ruim |
|-------|---------|-----------|----------|
| Infoprodutos | < R$30 | R$30-80 | > R$80 |
| E-commerce | < R$25 | R$25-60 | > R$60 |
| SaaS/Apps | < R$50 | R$50-120 | > R$120 |
| Serviços locais | < R$20 | R$20-50 | > R$50 |

### Regra de Ouro
Se CPA > preço do produto ÷ 3, tem problema. Exemplo: produto de R$297 → CPA deveria ser < R$99.`,

  escalar: `## Como Escalar Campanhas de Tráfego Pago

### Quando Escalar?
Só escale quando tiver:
- ✅ CPA consistente por 5-7 dias
- ✅ ROAS acima de 2x
- ✅ Pelo menos 50 conversões no pixel
- ✅ Margem de lucro positiva após custos

### Estratégia 1 — Escala Horizontal (Mais Seguro)
1. Duplique o conjunto de anúncios vencedor
2. Mude APENAS o público (novo lookalike, novos interesses)
3. Mantenha o mesmo orçamento por conjunto
4. Teste 3-5 novos públicos por semana
5. Mate os que não performam em 3-5 dias

### Estratégia 2 — Escala Vertical (Mais Rápido)
1. Aumente o orçamento em 20-30% a cada 2-3 dias
2. NUNCA aumente mais de 30% de uma vez (reseta o aprendizado)
3. Se CPA subir, volte ao orçamento anterior
4. Funciona melhor com CBO (Campaign Budget Optimization)

### Estratégia 3 — Escala por Novos Canais
1. Facebook → Instagram → Google → TikTok → YouTube
2. Adapte o criativo para cada plataforma
3. Não replique — cada canal tem sua linguagem

### Armadilhas da Escala
- ❌ Escalar antes de validar (precisa de dados suficientes)
- ❌ Subir orçamento 100% de uma vez
- ❌ Ignorar a fadiga do criativo
- ❌ Não ter margem para CPA flutuar
- ❌ Escalar sem estoque/capacidade de entrega

### Orçamentos Recomendados por Fase
| Fase | Orçamento Diário | Objetivo |
|------|-----------------|----------|
| Teste | R$20-50 | Validar público e criativo |
| Otimização | R$50-200 | Refinar e encontrar winners |
| Escala Inicial | R$200-500 | Multiplicar resultados |
| Escala Avançada | R$500-2000+ | Dominar o nicho |`,

  funil: `## Como Criar um Funil de Vendas Eficiente

### Tipos de Funil por Objetivo

**1. Funil de Captura (Lead Magnet)**
\`Anúncio → Landing Page → Isca Digital → E-mail Sequence → Oferta\`
- Ideal para: construir lista, aquecer audiência fria
- Isca: E-book, checklist, mini-curso, webinar gravado

**2. Funil de Vendas Direto**
\`Anúncio → Página de Vendas/VSL → Checkout → Upsell → Obrigado\`
- Ideal para: produtos de ticket baixo-médio (R$47-297)
- Taxa de conversão esperada: 1-3%

**3. Funil de Webinar**
\`Anúncio → Registro → Webinar ao Vivo/Gravado → Oferta → Checkout\`
- Ideal para: produtos de ticket alto (R$997+)
- Necessita autoridade e prova social

**4. Funil de WhatsApp**
\`Anúncio → WhatsApp → Qualificação → Oferta → Venda\`
- Ideal para: serviços, consultorias, high ticket
- Maior taxa de conversão, mas menor escala

### Elementos Essenciais de Cada Página

**Landing Page:**
- Headline focada no benefício principal
- 3-5 bullets com sub-benefícios
- Formulário simples (nome + e-mail ou só e-mail)
- Prova social (números, logos, depoimentos)

**Página de Vendas:**
- VSL ou copy longa
- Seção de benefícios e transformação
- Depoimentos e resultados
- Ancoragem de preço + oferta
- FAQ para quebrar objeções
- Garantia clara

**Checkout:**
- Order bump (produto complementar barato)
- Resumo claro do que está comprando
- Selos de segurança
- Múltiplas formas de pagamento

**Upsell/Downsell:**
- One-click upsell (sem precisar preencher dados novamente)
- Relacionado ao produto principal
- Desconto exclusivo por tempo limitado`,

  email: `## E-mail Marketing Eficiente para Vendas

### Sequência de Boas-Vindas (Automação Essencial)
1. **E-mail 1 (Imediato):** Entrega do lead magnet + apresentação pessoal
2. **E-mail 2 (Dia 1):** História pessoal + dor do público
3. **E-mail 3 (Dia 2):** Conteúdo de valor puro (ensine algo)
4. **E-mail 4 (Dia 3):** Case de sucesso / prova social
5. **E-mail 5 (Dia 4):** Apresentação da oferta (soft sell)
6. **E-mail 6 (Dia 5):** Oferta direta com bônus
7. **E-mail 7 (Dia 6):** Urgência + último lembrete

### Assuntos que Abrem (Taxa > 30%)
- Números: "3 erros que destroem suas vendas"
- Curiosidade: "Isso mudou tudo para mim..."
- Personalização: "[Nome], preciso te contar algo"
- Urgência: "Última chance (fecha às 23:59)"
- Polêmica: "Por isso você não vende (verdade dura)"

### Métricas-chave
| Métrica | Bom | Médio | Ruim |
|---------|-----|-------|------|
| Taxa de abertura | >25% | 15-25% | <15% |
| Taxa de clique | >3% | 1-3% | <1% |
| Taxa de conversão | >1% | 0.5-1% | <0.5% |
| Descadastro | <0.5% | 0.5-1% | >1% |

### Dicas de Ouro
- Envie e-mails 3-5x por semana (mais frequência = mais vendas, se o conteúdo for bom)
- 80% valor, 20% oferta
- Escreva como se fosse para UM amigo
- Teste assuntos com A/B (mande para 20%, vencedor para 80%)
- Segmente por comportamento (abriu, clicou, comprou)`,

  remarketing: `## Como Usar Remarketing para Multiplicar Vendas

### O Que é Remarketing?
Mostrar anúncios para pessoas que já interagiram com seu conteúdo, site ou perfil. São públicos "quentes" — já te conhecem.

### Públicos de Remarketing (do mais quente ao mais frio)
1. **Carrinho abandonado** (últimos 7 dias) — CPA mais baixo
2. **Visitou checkout** (últimos 14 dias)
3. **Visitou página de vendas** (últimos 30 dias)
4. **Leads que não compraram** (últimos 60 dias)
5. **Engajou com conteúdo** (últimos 90 dias)
6. **Visualizou vídeos 50%+** (últimos 180 dias)
7. **Seguidores do perfil** (últimos 365 dias)

### Estratégias por Público

**Carrinho Abandonado (7d):**
- Copy: "Você esqueceu algo... seu acesso está reservado por mais 24h"
- Oferta: Mesmo preço ou desconto de 10%
- Formato: Imagem simples + urgência

**Visitou Página de Vendas (30d):**
- Copy: Quebre a objeção principal (preço, tempo, confiança)
- Use depoimentos e cases de sucesso
- Formato: Vídeo com prova social

**Leads que Não Compraram (60d):**
- Copy: Ofereça conteúdo adicional de valor
- Webinar/aula extra → nova oferta
- Formato: Conteúdo educativo

### Orçamento de Remarketing
- Dedique 20-30% do orçamento total para remarketing
- CPA do remarketing é geralmente 50-70% menor que público frio
- ROI do remarketing é 3-10x maior que público frio

### Dica Avançada
Crie uma "escada de remarketing":
\`Viu anúncio → Viu vídeo → Visitou site → Viu oferta → Carrinho → Comprou\`
Cada etapa recebe uma mensagem diferente e mais direta.`,

  organico_pago: `## Tráfego Orgânico vs. Tráfego Pago — Estratégia Completa

### Comparação Direta
| Aspecto | Orgânico | Pago |
|---------|----------|------|
| Velocidade | Lento (3-12 meses) | Imediato |
| Custo inicial | Baixo (tempo) | Alto (dinheiro) |
| Custo longo prazo | Quase zero | Constante |
| Escalabilidade | Limitada | Alta |
| Previsibilidade | Baixa | Alta |
| Confiança do público | Alta | Média |
| Dependência | Algoritmo | Orçamento |

### Quando Usar Cada Um

**Comece com Orgânico quando:**
- Orçamento limitado (< R$1.000/mês)
- Tem tempo para produzir conteúdo
- Nicho com bom volume de busca
- Quer construir autoridade de longo prazo

**Comece com Pago quando:**
- Precisa de resultados rápidos
- Tem orçamento disponível (> R$1.500/mês)
- Produto já validado (sabe que converte)
- Quer escalar rapidamente

### A Estratégia Ideal — Ambos!

**Fase 1 (Mês 1-3):** 70% pago / 30% orgânico
- Valide sua oferta com tráfego pago
- Comece a produzir conteúdo consistente
- Construa perfis nas redes sociais

**Fase 2 (Mês 3-6):** 50% pago / 50% orgânico
- Orgânico começa a gerar leads
- Use dados do pago para direcionar conteúdo orgânico
- Crie remarketing com engajados do orgânico

**Fase 3 (Mês 6+):** 40% pago / 60% orgânico
- Orgânico reduz dependência do pago
- Pago foca em escala e retargeting
- Custo por aquisição cai significativamente

### Canais Orgânicos que Funcionam em 2024
1. **Instagram Reels** — Maior alcance orgânico atual
2. **TikTok** — Viralização mais fácil
3. **YouTube** — Melhor para construir autoridade
4. **SEO/Blog** — Tráfego perene e consistente
5. **Pinterest** — Subestimado, ótimo para nichos visuais`,

  oferta: `## Como Criar uma Oferta Irresistível

### O Framework da Oferta Perfeita

**1. Resultado dos Sonhos**
- Qual a transformação que o cliente terá?
- Seja específico: "Emagreça 10kg" > "Perca peso"
- Adicione prazo: "em 90 dias" aumenta credibilidade

**2. Probabilidade Percebida de Sucesso**
- Depoimentos e cases reais
- Método passo a passo
- Suporte e comunidade
- "Se 3.427 alunos conseguiram, você também consegue"

**3. Tempo até o Resultado**
- Quanto menor, melhor
- "Resultados nas primeiras 48 horas"
- Mostre quick wins e marco de progresso

**4. Esforço e Sacrifício**
- Quanto menor, melhor
- "Apenas 15 minutos por dia"
- "Sistema feito para você" / "Templates prontos"

### Componentes da Oferta

**Produto Principal:** O curso/serviço/produto core
**Bônus 1:** Algo que acelera o resultado (templates, planilhas)
**Bônus 2:** Algo que facilita (tutoriais, comunidade)
**Bônus 3:** Algo exclusivo (mentoria, acesso VIP)

### Ancoragem de Preço
1. Some o valor individual de tudo (ex: R$4.997)
2. Mostre que NÃO vai cobrar esse valor
3. Revele o preço real (ex: R$497)
4. Compare com alternativas mais caras (ex: faculdade = R$60.000)

### Garantias que Vendem
- **7 dias:** Padrão mínimo (exigido por lei no Brasil)
- **15 dias:** Mostra confiança
- **30 dias:** Reduz bastante a objeção
- **Garantia incondicional:** "Se não gostar, devolvemos 100%"
- **Garantia condicional:** "Se aplicar e não ter resultado em 90 dias, devolvemos + R$100"

### Checklist da Oferta Irresistível
- [ ] Transformação clara e específica
- [ ] Prazo definido para resultados
- [ ] Pelo menos 3 bônus relevantes
- [ ] Ancoragem de preço convincente
- [ ] Garantia forte que remove risco
- [ ] Escassez real (vagas, prazo, bônus)
- [ ] Prova social abundante
- [ ] Facilidade de pagamento (parcelamento)`,
};

function findBestResponse(input: string): string {
  const lower = input.toLowerCase();
  const keywords: Record<string, string[]> = {
    facebook_ads: ["facebook", "fb", "meta", "anúncio", "anuncio", "facebook ads"],
    copy_vendas: ["copy", "copywriting", "texto", "persuasão", "vendas copy", "copy de vendas"],
    lancamento: ["lançamento", "lancamento", "lançar", "lancar", "launch"],
    publico_alvo: ["público", "publico", "alvo", "persona", "avatar", "segmentação", "segmentacao", "audiência", "audiencia"],
    vsl: ["vsl", "video sales", "vídeo de vendas", "video de vendas"],
    otimizar_cpa: ["cpa", "custo por aquisição", "custo por aquisicao", "otimizar custo", "reduzir cpa"],
    escalar: ["escalar", "escala", "scaling", "aumentar orçamento", "crescer campanha"],
    funil: ["funil", "funnel", "página de vendas", "pagina de vendas", "checkout", "upsell"],
    email: ["email", "e-mail", "newsletter", "automação de email", "sequência de email", "sequencia"],
    remarketing: ["remarketing", "retargeting", "público quente", "carrinho abandonado"],
    organico_pago: ["orgânico", "organico", "orgânico vs pago", "tráfego orgânico", "seo vs ads", "trafego organico"],
    oferta: ["oferta", "irresistível", "irresistivel", "precificação", "pricing", "bônus", "bonus", "garantia"],
  };

  for (const [topic, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      return RESPONSES[topic] || "";
    }
  }

  return `## Ótima pergunta! 🎯

Aqui vão algumas considerações sobre o que você perguntou:

### Dicas Gerais de Marketing Digital

1. **Conheça seu público:** Antes de qualquer ação, entenda profundamente quem é seu cliente ideal, suas dores e desejos.

2. **Teste sempre:** Nunca assuma que sabe o que funciona. Teste criativos, copies, públicos e ofertas constantemente.

3. **Dados são reis:** Use as métricas para tomar decisões. CTR, CPA, ROAS e LTV são seus melhores amigos.

4. **Consistência vence:** Publique conteúdo regularmente, mantenha campanhas rodando e otimize continuamente.

5. **Modelo AIDA:** Em toda comunicação de marketing, siga: Atenção → Interesse → Desejo → Ação.

### Próximos Passos Recomendados
- Defina seu objetivo principal (vendas, leads, branding)
- Escolha 1-2 canais para focar inicialmente
- Crie uma oferta irresistível
- Teste com orçamento pequeno, depois escale o que funciona

💡 **Dica:** Use os templates de perguntas abaixo para explorar tópicos específicos de marketing digital!`;
}

export default function AssistantTool() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = findBestResponse(text);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Conversa limpa!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assistente de Marketing</h2>
          <p className="text-sm text-muted-foreground">Tire suas dúvidas sobre marketing digital</p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="mr-1 h-4 w-4" /> Limpar conversa
          </Button>
        )}
      </div>

      {/* Templates */}
      {messages.length === 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Perguntas sugeridas
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.topic}
                onClick={() => sendMessage(t.label)}
                className="text-left text-sm p-3 rounded-lg bg-background/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col" style={{ height: messages.length > 0 ? "500px" : "auto" }}>
        {messages.length > 0 && (
          <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background/80 border border-border"}`}>
                    {msg.role === "assistant" ? (
                      <div className="text-sm prose prose-invert prose-sm max-w-none [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_table]:text-xs [&_th]:p-1 [&_td]:p-1 [&_code]:text-xs [&_code]:bg-background/50 [&_code]:px-1 [&_code]:rounded">
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("## ")) return <h2 key={i}>{line.replace("## ", "")}</h2>;
                          if (line.startsWith("### ")) return <h3 key={i}>{line.replace("### ", "")}</h3>;
                          if (line.startsWith("- ")) return <div key={i} className="flex gap-2 my-0.5"><span>•</span><span>{line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}</span></div>;
                          if (line.startsWith("| ")) return <div key={i} className="text-xs font-mono opacity-80">{line}</div>;
                          if (line.match(/^\d+\. /)) return <div key={i} className="my-0.5">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</div>;
                          if (line.trim() === "") return <br key={i} />;
                          return <p key={i}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p className={`text-xs mt-2 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-background/80 border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua pergunta sobre marketing..." disabled={isTyping} className="flex-1" />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Quick Templates (when chat is active) */}
        {messages.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {TEMPLATES.slice(0, 6).map((t) => (
              <button
                key={t.topic}
                onClick={() => sendMessage(t.label)}
                className="text-xs px-3 py-1.5 rounded-full bg-background/50 hover:bg-primary/10 border border-border hover:border-primary/20 transition-all"
                disabled={isTyping}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
