import { createFileRoute, Link } from "@tanstack/react-router";
import heroBg from "@/assets/hero-bg.png";
import { AlertTriangle, HeartPulse, Sprout, Globe2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Saúde em Ação — Agrotóxicos nos alimentos e a ODS 3" },
      { name: "description", content: "Projeto educativo sobre o impacto dos agrotóxicos na saúde humana, alinhado à ODS 3 da ONU." },
      { property: "og:title", content: "Saúde em Ação — Agrotóxicos e ODS 3" },
      { property: "og:description", content: "Conheça os riscos dos agrotóxicos presentes nos alimentos." },
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
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/60" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-3.5 h-3.5" /> ODS 3 · ONU
          </span>
          <h1 className="mt-5 font-display text-5xl md:text-7xl font-bold text-primary leading-[1.05] max-w-3xl">
            O que está no seu prato pode estar adoecendo você.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl">
            Os agrotóxicos presentes nos alimentos são uma ameaça invisível à
            <strong className="text-primary"> saúde e bem-estar</strong> de
            milhões de pessoas. O <em>Saúde em Ação</em> existe para mudar isso.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/alimentos"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition"
            >
              Ver alimentos contaminados <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/informe-se"
              className="inline-flex items-center gap-2 bg-card border border-border px-6 py-3 rounded-full font-bold hover:border-primary transition"
            >
              Informe-se!
            </Link>
          </div>
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
              Agrotóxicos: um veneno que chega à mesa.
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed">
              O Brasil é um dos maiores consumidores mundiais de agrotóxicos. A
              cada ano, mais de <strong>500 mil toneladas</strong> são
              despejadas nas lavouras — e parte significativa permanece nos
              alimentos que consumimos diariamente.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Esses produtos químicos foram associados a intoxicações agudas,
              doenças crônicas, distúrbios hormonais, problemas neurológicos e
              diversos tipos de câncer, segundo o INCA, a Anvisa e o
              Ministério da Saúde.
            </p>
          </div>
          <div className="grid gap-4">
            <Stat number="20%" label="das amostras analisadas pela Anvisa apresentam resíduos acima do permitido ou de substâncias proibidas." />
            <Stat number="+500 mil t" label="de agrotóxicos consumidos por ano no Brasil." />
            <Stat number="34 mil" label="notificações anuais de intoxicação por agrotóxicos no SUS." />
          </div>
        </div>
      </section>

      {/* ODS 3 */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
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
              text="Saber quais alimentos têm maior contaminação e quais agrotóxicos estão envolvidos."
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

      {/* Impacts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center">
          Impactos na saúde humana
        </h2>
        <p className="text-center text-foreground/70 mt-3 max-w-2xl mx-auto">
          A exposição contínua, mesmo em pequenas doses, é cumulativa.
          Os efeitos aparecem ao longo dos anos.
        </p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Intoxicação aguda", d: "Náuseas, vômitos, tonturas, convulsões e até morte em casos graves." },
            { t: "Câncer", d: "Associação comprovada com leucemias, linfomas e tumores cerebrais." },
            { t: "Distúrbios hormonais", d: "Desregulação endócrina, infertilidade e malformações fetais." },
            { t: "Sistema nervoso", d: "Parkinson, Alzheimer, depressão e déficit cognitivo." },
          ].map((i) => (
            <div
              key={i.t}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-primary">{i.t}</h3>
              <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/alimentos"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition"
          >
            Conheça os alimentos mais afetados <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start">
      <div className="font-display text-3xl font-bold text-[var(--tomato)] shrink-0">{number}</div>
      <p className="text-sm text-foreground/75 leading-relaxed">{label}</p>
    </div>
  );
}

function Pillar({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-primary">{title}</h3>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}
