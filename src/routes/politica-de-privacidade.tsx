import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/logo-scase.webp.asset.json";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Scase" },
      {
        name: "description",
        content:
          "Como a Scase coleta, usa e protege os dados de quem usa esta página — em conformidade com a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade | Scase" },
      {
        property: "og:description",
        content: "Quais dados coletamos, para que usamos e como você pode controlá-los.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicy,
});

const WHATSAPP_URL = `https://wa.me/5514991527687?text=${encodeURIComponent("Olá! Quero falar sobre meus dados (Política de Privacidade).")}`;

const sections: { id: string; label: string; title: string; body: string[] }[] = [
  {
    id: "coleta",
    label: "01",
    title: "Quais dados coletamos",
    body: [
      "Quando você preenche o formulário desta página, recebemos: nome, nome da empresa, e-mail e telefone (WhatsApp), além das respostas às perguntas sobre a sua operação — número de unidades, investimento atual em tráfego pago, principal desafio, quem cuida do marketing hoje e se você participa da decisão de contratação.",
      "Quando você conversa com a Scase pelo WhatsApp, as mensagens dessa conversa também são registradas no canal de atendimento.",
      "Coletamos ainda dados de navegação de forma automática: páginas visitadas, tempo na página, dispositivo, navegador e cidade aproximada. Isso é feito pelas ferramentas de medição descritas na seção 05.",
      "Não solicitamos e não devemos receber dados sensíveis (como CPF, RG, dados de saúde ou de menores de idade) por esta página.",
    ],
  },
  {
    id: "uso",
    label: "02",
    title: "Para que usamos os dados",
    body: [
      "Os dados servem para entender a sua ótica ou rede, responder às suas perguntas, preparar uma conversa comercial e agendar a reunião escolhida por você.",
      "Também usamos as informações para melhorar a página e as campanhas: saber quantas pessoas enviaram o formulário e de onde vieram ajuda a entender o que está funcionando.",
      "Não vendemos seus dados. Não usamos seus dados para finalidade diferente da que motivou o envio, sem aviso prévio.",
    ],
  },
  {
    id: "base-legal",
    label: "03",
    title: "Base legal para o tratamento",
    body: [
      "Tratamos seus dados com base no seu consentimento (ao enviar o formulário, você escolhe se identificar e falar com a Scase), na execução de medidas preliminares a um contrato (a conversa comercial ou a reunião agendada) e no legítimo interesse de medir e melhorar esta página.",
      "Você pode retirar o consentimento a qualquer momento, pelo canal da seção 06, sem efeito retroativo.",
    ],
  },
  {
    id: "compartilhamento",
    label: "04",
    title: "Com quem compartilhamos",
    body: [
      "As informações podem transitar ou ficar registradas nos canais de atendimento e nos sistemas de gestão de clientes usados pela Scase, além das plataformas de mensagens (WhatsApp/Meta) quando você escolhe falar por lá.",
      "As ferramentas de medição e anúncios (Meta e Google) recebem dados de navegação desta página conforme as políticas delas.",
      "Também podemos tratar dados para atender obrigação legal ou ordem de autoridade competente.",
    ],
  },
  {
    id: "cookies",
    label: "05",
    title: "Cookies e ferramentas de medição",
    body: [
      "Esta página usa cookies e tecnologias parecidas para funcionar, medir resultados e avaliar a eficiência de anúncios. As ferramentas usadas são o Google Tag Manager e o Meta Pixel.",
      "Você pode bloquear ou apagar cookies nas configurações do seu navegador. Algumas partes da página podem parar de funcionar corretamente se você bloquear todos os cookies.",
      "Também é possível controlar parte do uso dos seus dados para anúncios nas próprias plataformas, nos centros de privacidade da Meta e do Google.",
    ],
  },
  {
    id: "direitos",
    label: "06",
    title: "Seus direitos (LGPD)",
    body: [
      "Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir a qualquer momento: confirmação de que tratamos seus dados, acesso a eles, correção de informações incompletas ou desatualizadas, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade, informação sobre com quem compartilhamos, e revogação do consentimento.",
      "Para fazer qualquer um desses pedidos, fale com a Scase pelo WhatsApp (14) 99152-7687. Vamos responder em prazo razoável e, se for necessário, pedir uma informação para confirmar que você é o titular dos dados.",
    ],
  },
  {
    id: "armazenamento",
    label: "07",
    title: "Por quanto tempo guardamos",
    body: [
      "Mantemos os dados enquanto a relação comercial fizer sentido — por exemplo, enquanto houver uma conversa, uma proposta ou um contrato em andamento.",
      "Depois disso, eliminamos ou anonimizamos as informações, salvo quando precisarmos guardá-las por obrigação legal ou para exercício regular de direitos.",
    ],
  },
  {
    id: "seguranca",
    label: "08",
    title: "Segurança",
    body: [
      "Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados: acesso restrito a quem precisa tratar a informação, canais de atendimento controlados e revisão do que é coletado nesta página.",
      "Nenhum sistema é completamente livre de riscos. Se ocorrer um incidente de segurança que possa causar dano relevante a você, avisaremos os titulares afetados e a autoridade competente quando a lei exigir.",
    ],
  },
  {
    id: "alteracoes",
    label: "09",
    title: "Alterações desta política",
    body: [
      "Esta política pode ser atualizada quando a página mudar ou novas ferramentas forem usadas. A versão vigente é sempre a publicada nesta página, com a data da última atualização indicada no topo.",
      "Se uma mudança afetar de forma relevante a forma como usamos seus dados, avisaremos por um canal de contato disponível.",
    ],
  },
];

function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" aria-label="Voltar para o início">
          <img src={logo.url} alt="Scase" className="h-7 w-auto" />
        </Link>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          ← Voltar
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-8 md:pt-12">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          ● Política de Privacidade
        </p>
        <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl" style={{ fontStretch: "110%" }}>
          Seus dados, explicados sem letras miúdas.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Esta página é da Scase e serve para óticas e redes de óticas pedirem uma conversa sobre
          marketing. Aqui está o que coletamos, para que usamos e como você pode controlar tudo isso.
        </p>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Última atualização: 7 de outubro de 2026
        </p>

        <nav aria-label="Índice" className="mt-12 rounded-2xl border bg-card p-5 md:p-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Índice
          </p>
          <ol className="grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex gap-3 text-foreground/85 transition-colors hover:text-primary">
                  <span className="font-mono text-xs text-muted-foreground">{s.label}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 space-y-14">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-6">
              <div className="mb-4 flex items-baseline gap-4">
                <span className="font-mono text-xs text-primary">{s.label}</span>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{s.title}</h2>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border bg-card p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Falar com a Scase sobre seus dados</h2>
          <p className="mt-3 text-muted-foreground">
            Qualquer dúvida sobre privacidade, pedido de acesso, correção ou exclusão pode ser feita
            diretamente pelo WhatsApp da agência.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-14 items-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Enviar mensagem <span aria-hidden>→</span>
          </a>
        </div>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <img src={logo.url} alt="Scase" className="h-5 w-auto opacity-80" />
          <span>© {new Date().getFullYear()} Scase. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
