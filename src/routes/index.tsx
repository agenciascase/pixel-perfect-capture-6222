import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/logo-scase.webp.asset.json";
import preventLogo from "@/assets/logo-prevent.png.asset.json";
import indaiaLogo from "@/assets/logo-indaia.png.asset.json";
import mmLogo from "@/assets/logo-mm.png.asset.json";
import { trackOnce } from "@/lib/tracking";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketing para óticas | Scase" },
      { name: "description", content: "Conte sobre sua ótica ou rede e agende uma conversa com a Scase sobre marketing e tráfego pago." },
      { property: "og:title", content: "Marketing para óticas que querem crescer | Scase" },
      { property: "og:description", content: "Descubra como a Scase pode ajudar sua ótica ou rede a melhorar seus resultados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Configure the real scheduling tool (Calendly or Cal.com link) via VITE_SCHEDULING_URL.
const SCHEDULING_URL: string = import.meta.env['VITE_SCHEDULING_URL'] ?? "";
// Optional endpoint (e.g. CRM/Zapier/Make webhook) that receives each lead as JSON.
const LEAD_WEBHOOK_URL: string = import.meta.env['VITE_LEAD_WEBHOOK_URL'] ?? "";

type Data = {
  nome: string; empresa: string; email: string; telefone: string;
  unidades: string; investimento: string; desafio: string; responsavel: string; decisao: string;
};
const empty: Data = { nome: "", empresa: "", email: "", telefone: "", unidades: "", investimento: "", desafio: "", responsavel: "", decisao: "" };

const questions: { key: keyof Data; title: string; options: string[] }[] = [
  { key: "unidades", title: "Quantas unidades sua ótica/rede possui atualmente?", options: ["1 unidade", "2 a 4 unidades", "5 a 10 unidades", "11 a 30 unidades", "Mais de 30 unidades"] },
  { key: "investimento", title: "Hoje vocês investem em tráfego pago?", options: ["Não investimos", "Até R$ 3 mil/mês", "R$ 3 mil a R$ 10 mil/mês", "R$ 10 mil a R$ 30 mil/mês", "Acima de R$ 30 mil/mês"] },
  { key: "desafio", title: "Qual é o principal desafio de marketing hoje?", options: ["Gerar mais movimento nas lojas", "Gerar mais contatos pelo WhatsApp", "Aumentar as vendas", "Melhorar Google e presença local", "Organizar o marketing de várias unidades", "Melhorar o resultado das campanhas atuais"] },
  { key: "responsavel", title: "Quem cuida do marketing atualmente?", options: ["Equipe interna", "Agência", "Freelancer", "Franqueadora", "Nós mesmos", "Não temos estrutura definida"] },
  { key: "decisao", title: "Você participa da decisão sobre contratação de marketing?", options: ["Sim, sou o responsável pela decisão", "Participo da decisão", "Preciso apresentar para outro responsável"] },
];
const TOTAL = questions.length + 1;

const clients: { name: string; logo?: { src: string; alt: string } }[] = [
  { name: "Óticas Prevent", logo: { src: preventLogo.url, alt: "Óticas Prevent" } },
  { name: "Ótica Indaiá", logo: { src: indaiaLogo.url, alt: "Ótica Indaiá" } },
  { name: "Óticas MM Barra", logo: { src: mmLogo.url, alt: "Óticas MM Barra" } },
];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const WHATSAPP_URL = `https://wa.me/5514991527687?text=${encodeURIComponent("Olá! Quero agendar uma reunião com a Scase.")}`;
const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

function nextBusinessDays(n: number) {
  const days: { label: string; weekday: string }[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < n) {
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) {
      days.push({
        label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", ""),
        weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function Index() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [phase, setPhase] = useState<"form" | "schedule" | "done">("form");
  const [sending, setSending] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");

  const set = (k: keyof Data, v: string) => { setData((d) => ({ ...d, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validateBasics = () => {
    const e: typeof errors = {};
    if (data.nome.trim().length < 2) e.nome = "Informe seu nome";
    if (data.empresa.trim().length < 2) e.empresa = "Informe o nome da empresa";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "E-mail inválido";
    if (data.telefone.replace(/\D/g, "").length < 10) e.telefone = "WhatsApp inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setSending(true);
    try {
      if (LEAD_WEBHOOK_URL) {
        const r = await fetch(LEAD_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, origem: "lp-oticas", data: new Date().toISOString() }) });
        if (!r.ok) throw new Error("fail");
      }
      trackOnce("Lead", { content_name: "LP Óticas" });
      setPhase("schedule");
      document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setErrors({ decisao: "Não foi possível enviar. Tente novamente." });
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    if (step === 0) { if (validateBasics()) setStep(1); return; }
    const q = questions[step - 1]!;
    if (!data[q.key]) { setErrors({ [q.key]: "Selecione uma opção" }); return; }
    if (step === TOTAL - 1) submit(); else setStep(step + 1);
  };

  // Listen for real booking confirmations from Calendly / Cal.com embeds.
  useEffect(() => {
    if (phase !== "schedule") return;
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { event?: string; type?: string } | undefined;
      const ok = d?.event === "calendly.event_scheduled" || d?.type === "bookingSuccessful" || d?.type === "bookingSuccessfulV2";
      if (ok) { trackOnce("Schedule"); setPhase("done"); }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [phase]);

  const scheduleSrc = SCHEDULING_URL
    ? `${SCHEDULING_URL}${SCHEDULING_URL.includes("?") ? "&" : "?"}name=${encodeURIComponent(data.nome)}&email=${encodeURIComponent(data.email)}&embed_domain=${typeof window !== "undefined" ? window.location.hostname : ""}&embed_type=Inline&embed=true`
    : "";

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <img src={logo.url} alt="Scase" className="h-7 w-auto" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Para óticas</span>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:pb-24 md:pt-20">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">● Óticas e redes de óticas</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-8xl" style={{ fontStretch: "110%" }}>
            Marketing para óticas que as vendas estagnaram.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Conte um pouco sobre sua operação e descubra como a Scase pode ajudar sua ótica ou rede a melhorar seus resultados.
          </p>
          <a href="#formulario" className="mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
            Quero aumentar minhas vendas <span aria-hidden>→</span>
          </a>
        </section>

        <section id="formulario" className="scroll-mt-6 px-3 pb-20 md:px-5">
          <div className="mx-auto max-w-2xl rounded-2xl bg-paper p-6 text-paper-foreground md:p-10">
            {phase === "form" && (
              <>
                <div className="mb-8">
                  <div className="mb-3 flex justify-between font-mono text-xs uppercase tracking-widest opacity-60">
                    <span>Etapa {step + 1} de {TOTAL}</span>
                    <span>{Math.round(((step + 1) / TOTAL) * 100)}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-paper-foreground/10">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
                  </div>
                </div>

                <div key={step} className="step-in">
                  {step === 0 ? (
                    <>
                      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Seus dados</h2>
                      <div className="grid gap-4">
                        {([
                          ["nome", "Nome", "text", "name"],
                          ["empresa", "Nome da empresa", "text", "organization"],
                          ["email", "E-mail", "email", "email"],
                          ["telefone", "Telefone (WhatsApp)", "tel", "tel"],
                        ] as const).map(([k, label, type, ac]) => (
                          <label key={k} className="block">
                            <span className="mb-1.5 block text-sm font-medium">{label}</span>
                            <input
                              type={type}
                              autoComplete={ac}
                              inputMode={k === "telefone" ? "tel" : undefined}
                              value={data[k]}
                              onChange={(e) => set(k, k === "telefone" ? maskPhone(e.target.value) : e.target.value)}
                              className="h-13 w-full rounded-xl border border-paper-foreground/15 bg-transparent px-4 py-3.5 text-base outline-none focus:border-paper-foreground"
                            />
                            {errors[k] && <span className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
                          </label>
                        ))}
                      </div>
                    </>
                  ) : (
                    (() => {
                      const q = questions[step - 1]!;
                      return (
                        <>
                          <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">{q.title}</h2>
                          <div className="grid gap-2.5">
                            {q.options.map((o) => {
                              const active = data[q.key] === o;
                              return (
                                <button
                                  key={o}
                                  type="button"
                                  onClick={() => set(q.key, o)}
                                  className={`flex min-h-14 items-center justify-between rounded-xl border px-4 py-3 text-left text-base transition-colors ${active ? "border-paper-foreground bg-paper-foreground text-paper" : "border-paper-foreground/15 hover:border-paper-foreground/50"}`}
                                >
                                  {o}
                                  <span className={`ml-3 h-4 w-4 shrink-0 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-paper-foreground/30"}`} />
                                </button>
                              );
                            })}
                          </div>
                          {errors[q.key] && <p className="mt-3 text-sm text-destructive">{errors[q.key]}</p>}
                        </>
                      );
                    })()
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="h-14 rounded-full border border-paper-foreground/20 px-6 font-medium">
                      Voltar
                    </button>
                  )}
                  <button type="button" disabled={sending} onClick={next} className="h-14 flex-1 rounded-full bg-paper-foreground font-semibold text-paper transition-opacity disabled:opacity-60">
                    {step === TOTAL - 1 ? (sending ? "Enviando..." : "Enviar") : "Continuar"}
                  </button>
                </div>
              </>
            )}

            {phase === "schedule" && (
              <div className="step-in">
                <p className="font-mono text-xs uppercase tracking-widest text-primary-foreground/60">✓ Recebemos suas informações.</p>
                <p className="mt-2 text-muted-foreground">Agora escolha um horário para conversar com nossa equipe.</p>
                <h2 className="mt-8 text-3xl font-semibold tracking-tight">Agende sua reunião</h2>
                <p className="mt-2 opacity-70">Escolha o melhor horário para conversar com nossa equipe.</p>
                <div className="mt-6 overflow-hidden rounded-xl border border-paper-foreground/10">
                  {scheduleSrc ? (
                    <iframe title="Agendamento Scase" src={scheduleSrc} className="h-[680px] w-full" />
                  ) : (
                    <div className="p-8 text-center opacity-70">
                      A agenda online estará disponível em breve. Nossa equipe entrará em contato pelo WhatsApp informado para marcar a reunião.
                    </div>
                  )}
                </div>
              </div>
            )}

            {phase === "done" && (
              <div className="step-in py-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">✓</div>
                <h2 className="text-3xl font-semibold tracking-tight">Reunião agendada com sucesso!</h2>
                <p className="mx-auto mt-3 max-w-md opacity-70">Os detalhes da reunião serão enviados para o e-mail e WhatsApp informados.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl border-t px-5 py-16 md:py-24">
          <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">Já atendemos empresas do segmento óptico</h2>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {clients.map((c) => (
              <div key={c.name} className="flex h-28 select-none items-center justify-center overflow-hidden rounded-2xl border bg-card px-4 text-center text-xl font-semibold tracking-tight text-muted-foreground" style={{ fontStretch: "115%" }}>
                {c.logo ? (
                  <img src={c.logo.src} alt={c.logo.alt} loading="lazy" className="max-h-20 max-w-full object-contain" />
                ) : (
                  c.name
                )}
              </div>
            ))}
          </div>
        </section>
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
