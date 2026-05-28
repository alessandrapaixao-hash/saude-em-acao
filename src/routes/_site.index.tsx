import { createFileRoute, Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero-bg.png";
import {
  AlertTriangle,
  HeartPulse,
  Sprout,
  Globe2,
  ArrowRight,
  Skull,
  Brain,
  Baby,
  Activity,
  Droplet,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Saúde em Ação — Defensores Agrícolas nos alimentos e a ODS 3" },
      { name: "description", content: "Projeto educativo sobre o impacto dos defensores agrícolas na saúde humana, alinhado à ODS 3 da ONU." },
      { property: "og:title", content: "Saúde em Ação — Defensores Agrícolas e ODS 3" },
      { property: "og:description", content: "Conheça os riscos dos defensores agrícolas presentes nos alimentos." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* White overlay for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 75%, transparent) 60%, color-mix(in oklab, var(--background) 95%, transparent) 100%)",
          }}
        />
        {/* Decorative blobs */}
        <div aria-hidden className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[var(--leaf)]/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-[var(--tomato)]/15 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            <Globe2 className="w-3.5 h-3.5" /> ODS 3 · ONU
          </span>
          <h1 className="mt-5 font-display text-5xl md:text-7xl font-bold text-primary leading-[1.05] max-w-3xl drop-shadow-sm">
            O que está no seu prato pode estar adoecendo você.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/90 max-w-2xl font-semibold">
            Os defensores agrícolas presentes nos alimentos são uma ameaça invisível à
            <span className="text-primary"> saúde e bem-estar</span> de
            milhões de pessoas. O <em>Saúde em Ação</em> existe para mudar isso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/alimentos"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
            >
              Ver alimentos contaminados <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/informe-se"
              className="inline-flex items-center gap-2 bg-card/90 backdrop-blur border border-border px-6 py-3 rounded-full font-bold hover:border-primary transition"
            >
              Informe-se!
            </Link>
          </div>
        </div>
      </section>

      {/* RED ALERT — sensationalist but data-backed */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--tomato)] to-[oklch(0.45_0.22_28)] text-white">
        <div aria-hidden className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 18px, rgba(255,255,255,.18) 18px 20px)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Skull className="w-4 h-4" /> Alerta vermelho
          </div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-black leading-[1.05] max-w-4xl">
            Você está comendo veneno — e nem percebe.
          </h2>
          <p className="mt-5 text-lg md:text-xl max-w-3xl text-white/95 font-semibold">
            O Brasil é o <strong>maior consumidor mundial de defensores agrícolas</strong>.
            Despejamos mais de <strong>540 mil toneladas por ano</strong> nas
            lavouras — e os resíduos chegam ao seu prato, à sua água e ao corpo
            do seu filho. Os efeitos são lentos, silenciosos e <em>irreversíveis</em>.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ShockStat n="1 em 5" t="amostras da Anvisa têm resíduos acima do permitido ou defensores agrícolas proibidos no país." />
            <ShockStat n="34.000" t="brasileiros intoxicados por defensores agrícolas a cada ano segundo o SUS — e estima-se 50× mais casos não notificados." />
            <ShockStat n="7 em 10" t="amostras de leite materno analisadas no PR/MT tinham resíduos de defensores agrícolas (UFMG/Fiocruz)." />
            <ShockStat n="+20" t="defensores agrícolas usados no Brasil são proibidos na União Europeia por causarem câncer e mutações." />
          </div>

          <p className="mt-8 text-sm text-white/80 max-w-3xl">
            Fontes: Anvisa (PARA), INCA, Fiocruz, IDEC e Faculdade de Medicina
            da UFMG.
          </p>
        </div>
      </section>

      {/* What is the problem */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
              O problema
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-primary">
              Defensores Agrícolas: um veneno que chega à mesa.
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed">
              O Brasil é um dos maiores consumidores mundiais de defensores agrícolas. A
              cada ano, mais de <strong>540 mil toneladas</strong> são
              despejadas nas lavouras — e parte significativa permanece nos
              alimentos que consumimos diariamente.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Esses produtos químicos foram associados a intoxicações agudas,
              doenças crônicas, distúrbios hormonais, problemas neurológicos e
              diversos tipos de câncer, segundo o INCA, a Anvisa e o
              Ministério da Saúde. <strong>Mais de 30%</strong> dos defensores agrícolas
              usados no Brasil estão <strong>proibidos na União Europeia</strong>.
            </p>
          </div>
          <div className="grid gap-4">
            <Stat number="20%" label="das amostras analisadas pela Anvisa apresentam resíduos acima do permitido ou de substâncias proibidas." />
            <Stat number="+540 mil t" label="de defensores agrícolas consumidos por ano no Brasil — campeão mundial." />
            <Stat number="34 mil" label="notificações anuais de intoxicação por defensores agrícolas no SUS." />
          </div>
        </div>
      </section>

      {/* ODS 3 */}
      <section className="relative bg-secondary/40 border-y border-border overflow-hidden">
        <div aria-hidden className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-[var(--leaf)]/15 blur-3xl" />
        <div aria-hidden className="absolute -bottom-20 left-10 w-72 h-72 rounded-full bg-[var(--sun)]/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
              Nosso compromisso
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-primary">
              Alinhados à ODS 3 da ONU
            </h2>
            <p className="mt-4 text-foreground/80">
              "Assegurar uma vida saudável e promover o bem-estar para todos,
              em todas as idades." É a partir dessa meta global que o
              <em> Saúde em Ação</em> nasceu — informar é o primeiro passo
              para transformar.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            <Pillar
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Reconhecer o risco"
              text="Saber quais alimentos têm maior contaminação e quais defensores agrícolas estão envolvidos."
            />
            <Pillar
              icon={<HeartPulse className="w-6 h-6" />}
              title="Proteger a saúde"
              text="Reduzir a exposição com escolhas conscientes, lavagem correta e preferência por orgânicos."
            />
            <Pillar
              icon={<Sprout className="w-6 h-6" />}
              title="Agir coletivamente"
              text="Pressionar por políticas públicas e apoiar a agricultura familiar e agroecológica."
            />
          </div>
        </div>
      </section>

      {/* Impacts — expanded with detail per organ/sistema */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--tomato)]">
            <Flame className="w-3.5 h-3.5" /> Impactos comprovados na sua saúde
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-primary">
            O preço silencioso dos defensores agrícolas
          </h2>
          <p className="text-foreground/75 mt-4">
            A exposição contínua, mesmo em pequenas doses, é cumulativa.
            Os efeitos aparecem ao longo dos anos — e podem destruir vidas
            inteiras. Confira, com base em estudos do INCA, UFMG, Fiocruz e
            Ministério da Saúde, o que o veneno faz com o corpo humano:
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <DamageCard
            icon={<Skull className="w-5 h-5" />}
            title="Câncer"
            text="O INCA reconhece os defensores agrícolas como fator de risco para leucemia, linfomas não-Hodgkin, câncer de próstata, mama, cérebro, pulmão, fígado e estômago. Crianças expostas têm até 7× mais risco de leucemia."
          />
          <DamageCard
            icon={<Brain className="w-5 h-5" />}
            title="Sistema nervoso"
            text="Organofosforados e carbamatos atacam o cérebro: estão ligados a Parkinson, Alzheimer precoce, depressão grave, ansiedade, suicídio e perda de memória em adultos. Em crianças, causam déficit cognitivo permanente."
          />
          <DamageCard
            icon={<Baby className="w-5 h-5" />}
            title="Gestação e bebês"
            text="Atravessam a placenta e contaminam o leite materno. Estão associados a abortos, malformações congênitas, microcefalia, autismo, puberdade precoce e infertilidade futura."
          />
          <DamageCard
            icon={<HeartPulse className="w-5 h-5" />}
            title="Sistema hormonal"
            text="São desreguladores endócrinos: alteram tireoide, testosterona e estrógeno, causando infertilidade, obesidade, diabetes tipo 2 e doenças cardiovasculares mesmo em jovens."
          />
          <DamageCard
            icon={<Droplet className="w-5 h-5" />}
            title="Fígado e rins"
            text="O corpo precisa metabolizar o veneno todos os dias. O resultado: hepatite tóxica, cirrose não-alcoólica e insuficiência renal crônica em pessoas cada vez mais jovens."
          />
          <DamageCard
            icon={<Activity className="w-5 h-5" />}
            title="Intoxicação aguda"
            text="Náusea, vômito, tontura, convulsão, parada respiratória e morte. O SUS registra 34 mil casos/ano — e a OMS estima que para cada notificação existam até 50 casos invisíveis."
          />
        </div>

        <div className="mt-12 bg-[var(--tomato)]/8 border-2 border-[var(--tomato)]/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--tomato)] text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-2xl font-bold text-[var(--tomato)]">
              Não existe "dose segura"
            </h3>
            <p className="mt-2 text-foreground/85 leading-relaxed">
              Pesquisadores da Faculdade de Medicina da UFMG alertam:
              "os efeitos dos defensores agrícolas sobre a saúde humana só serão
              percebidos no <strong>futuro</strong>". Ou seja — o câncer, o
              Parkinson e a infertilidade que aparecerão daqui a 10, 20, 30
              anos estão sendo plantados no prato de hoje.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center flex flex-wrap justify-center gap-3">
          <Link
            to="/alimentos"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition"
          >
            Ver os alimentos mais afetados <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/informe-se"
            className="inline-flex items-center gap-2 bg-card border border-border px-7 py-3.5 rounded-full font-bold hover:border-primary transition"
          >
            Leia as fontes científicas
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start hover:border-primary/40 hover:-translate-y-0.5 transition">
      <div className="font-display text-3xl font-bold text-[var(--tomato)] shrink-0">{number}</div>
      <p className="text-sm text-foreground/75 leading-relaxed">{label}</p>
    </div>
  );
}

function ShockStat({ n, t }: { n: string; t: string }) {
  return (
    <div className="bg-white/10 backdrop-blur border border-white/25 rounded-2xl p-5">
      <div className="font-display text-4xl md:text-5xl font-black leading-none">{n}</div>
      <p className="text-sm mt-3 text-white/95 leading-relaxed">{t}</p>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-primary">{title}</h3>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function DamageCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-[var(--tomato)]/60 hover:-translate-y-1 hover:shadow-xl transition overflow-hidden">
      <div aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[var(--tomato)]/5 group-hover:bg-[var(--tomato)]/15 transition" />
      <div className="relative w-11 h-11 rounded-xl bg-[var(--tomato)]/12 text-[var(--tomato)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="relative font-display font-bold text-xl text-primary">{title}</h3>
      <p className="relative text-sm text-foreground/75 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}
