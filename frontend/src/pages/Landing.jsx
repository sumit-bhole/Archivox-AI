import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  CheckCircle2,
  ClipboardList,
  Code2,
  FileText,
  Layers3,
  Mic,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import Footer from '../components/Footer';


const problems = [
  {
    number: '01',
    title: 'Unclear project requirements',
    description:
      'Clients describe their ideas in everyday language. Developers still need to uncover the features, user flows, and constraints behind them.',
  },
  {
    number: '02',
    title: 'Repetitive discovery calls',
    description:
      'Every new lead needs attention. Gathering the same basic information manually takes time away from actual development.',
  },
  {
    number: '03',
    title: 'Important details get missed',
    description:
      'Integrations, user roles, authentication, and edge cases are easier to overlook when project requirements are scattered across conversations.',
  },
];

const workflow = [
  {
    number: '01',
    icon: Workflow,
    title: 'Share your intake link',
    description:
      'Give a prospective client a dedicated link to explain their software idea through a voice conversation.',
  },
  {
    number: '02',
    icon: Mic,
    title: 'Let AI gather the details',
    description:
      'A voice agent guides the conversation and collects information about the problem, features, users, and project needs.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Review the project blueprint',
    description:
      'Turn the conversation into a structured project brief your team can review before deciding what to build.',
  },
];

const features = [
  {
    icon: AudioLines,
    title: 'Voice-first discovery',
    description:
      'Let clients explain an idea naturally instead of forcing them through a long technical questionnaire.',
  },
  {
    icon: ClipboardList,
    title: 'Structured requirements',
    description:
      'Organize the extracted project details into a consistent format that is easier to review and discuss.',
  },
  {
    icon: Layers3,
    title: 'One place for incoming projects',
    description:
      'Keep intake links, submissions, and generated project briefs together in your workspace.',
  },
  {
    icon: Code2,
    title: 'Developer-focused output',
    description:
      'Start with a clearer view of features, technical considerations, and open questions before implementation.',
  },
  {
    icon: ShieldCheck,
    title: 'Review before you build',
    description:
      'Use the generated brief as a starting point for human review, clarification, and scope approval.',
  },
  {
    icon: Zap,
    title: 'A more consistent process',
    description:
      'Give every prospective project a repeatable discovery workflow instead of starting from scratch each time.',
  },
];

function SectionLabel({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-300" />
      {children}
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[570px]">
      <div className="absolute -inset-8 rounded-full bg-indigo-500/[0.08] blur-3xl dark:bg-indigo-400/[0.10]" />

      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/[0.07] dark:border-[#2A3444] dark:bg-[#121923] dark:shadow-black/20">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#2A3444]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Project workspace
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Example project
              </p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
            Sample
          </span>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-0 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r dark:border-[#2A3444]">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Mic size={14} />
              Client conversation
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2A3444] dark:bg-[#0D1117]">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300">
                  <span className="text-[10px] font-bold">CL</span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Client
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                “I need an online store where customers can browse products,
                pay online, and track their orders.”
              </p>
            </div>

            <div className="my-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-400 dark:text-[#111827]">
                <Sparkles size={13} />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                AI follow-up
              </span>
            </div>

            <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/70 p-4 dark:border-indigo-400/20 dark:bg-indigo-400/[0.06]">
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
                “Will customers need accounts, and should an admin be able to
                manage products and orders?”
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <AudioLines size={15} className="text-indigo-500 dark:text-indigo-300" />
              <span>Voice-based project discovery</span>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <FileText size={14} />
              Project blueprint
            </div>

            <div className="mb-4 rounded-xl border border-slate-200 p-4 dark:border-[#2A3444]">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PROJECT SUMMARY
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                E-commerce platform
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                A storefront for browsing products and managing online orders.
              </p>
            </div>

            <div className="space-y-3">
              {[
                ['01', 'Product catalogue', 'Browse and view products'],
                ['02', 'Online payments', 'Payment integration required'],
                ['03', 'Order management', 'Customer order tracking'],
                ['04', 'Admin dashboard', 'Product and order controls'],
              ].map(([number, title, description]) => (
                <div key={number} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 dark:bg-[#202938] dark:text-slate-300">
                    {number}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {title}
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                      {description}
                    </p>
                  </div>
                  <CheckCircle2
                    size={15}
                    className="ml-auto mt-1 shrink-0 text-indigo-500 dark:text-indigo-300"
                  />
                </div>
              ))}
            </div>

            <p className="mt-5 border-t border-slate-200 pt-3 text-[11px] leading-5 text-slate-500 dark:border-[#2A3444] dark:text-slate-400">
              Illustrative preview — actual output depends on the project
              conversation.
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:border-[#2A3444] dark:bg-[#121923] dark:text-slate-300">
        <Check size={14} className="text-emerald-500" />
        From client idea to a reviewable brief
      </div>
    </div>
  );
}

function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handlePointerMove = (event) => {
      glow.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-72 w-72 rounded-full opacity-40 blur-3xl transition-transform duration-150 ease-out md:block dark:opacity-25"
      style={{
        background:
          'radial-gradient(circle, rgba(129,140,248,0.28) 0%, rgba(129,140,248,0.08) 40%, transparent 72%)',
      }}
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const goToSignUp = () => navigate('/auth?mode=signup');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#F7F5F0] font-sans text-[#292821] selection:bg-indigo-200 selection:text-indigo-950 dark:bg-[#0D1117] dark:text-slate-100 dark:selection:bg-indigo-400/30 dark:selection:text-white">
      {/* Hero */}
      <CursorGlow />
      <section className="relative mx-auto grid min-h-0 max-w-7xl items-center gap-8 px-4 pb-14 pt-28 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-32 lg:min-h-[790px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute left-[-180px] top-32 h-80 w-80 rounded-full bg-indigo-300/15 blur-3xl dark:bg-indigo-500/[0.08]" />

        <div className="relative z-10">
          <SectionLabel>AI-powered project discovery</SectionLabel>

          <h1 className="max-w-2xl text-3xl font-bold leading-[1.12] tracking-[-0.04em] text-slate-950 min-[400px]:text-4xl sm:text-5xl md:text-6xl dark:text-white">
            Every great build starts with a{' '}
            <span className="text-indigo-600 dark:text-indigo-300">
              better brief.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-400">
            Let AI talk to your clients, uncover project requirements, and turn
            their ideas into structured technical briefs your team can review
            before development begins.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
  onClick={goToSignUp}
  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600..."
>
  Create your intake link
  <ArrowRight size={17} />
</button>

            <button
              onClick={() => scrollTo('demo')}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-[#2A3444] dark:bg-[#151B24] dark:text-slate-200 dark:hover:bg-[#1B2431]"
            >
              Explore the preview
              <ArrowDown size={16} />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-indigo-500 dark:text-indigo-300" />
              Voice-first intake
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-indigo-500 dark:text-indigo-300" />
              Structured project briefs
            </span>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
            Built for software agencies, freelancers, and development teams.
          </p>
        </div>

        <div className="relative z-10">
          <ProductPreview />
        </div>
      </section>

      {/* Problem */}
      <section className="scroll-mt-24 border-y border-slate-200 bg-white py-14 sm:py-24 dark:border-[#252D3A] dark:bg-[#111720]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <SectionLabel>The problem</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Good development starts before the first line of code.
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              A project can go off track when the original idea is not
              translated into clear, reviewable requirements.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {problems.map((problem) => (
              <article
                key={problem.number}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 transition hover:-translate-y-1 hover:border-indigo-300 dark:border-[#2A3444] dark:bg-[#151B24] dark:hover:border-indigo-400/50"
              >
                <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-300">
                  {problem.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold">
                  {problem.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {problem.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section
        id="how-it-works"
        className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From first conversation to a clearer scope.
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            A simple intake workflow to help your team understand a project
            before committing to implementation.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 dark:border-[#2A3444] dark:bg-[#151B24]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                    <Icon size={22} />
                  </div>
                  <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-7 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Product preview */}
      <section
        id="demo"
        className="scroll-mt-24 border-y border-slate-200 bg-white py-20 sm:py-24 dark:border-[#252D3A] dark:bg-[#111720]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionLabel>Inside the blueprint</SectionLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Make the idea easier to understand, discuss, and build.
            </h2>
            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              Archivox turns information gathered during a voice conversation
              into a structured starting point for project planning. Your team
              can review the output, identify missing details, and clarify the
              scope with the client.
            </p>

            <ul className="mt-7 space-y-4">
              {[
                'Project overview and objectives',
                'Core features and user requirements',
                'Technical considerations and integrations',
                'Open questions that need client clarification',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  <span className="leading-6 text-slate-700 dark:text-slate-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <button
  onClick={goToSignUp}
  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600..."
>
  Try Archivox <ArrowRight size={16} />
</button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 shadow-xl shadow-slate-900/[0.04] sm:p-6 dark:border-[#2A3444] dark:bg-[#0D1117] dark:shadow-black/20">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-[#252D3A]">
              <div>
                <p className="text-sm font-semibold">Project brief</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Illustrative example
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                <FileText size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Objective
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  Build an online store for product discovery, customer
                  purchases, and order tracking.
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Functional requirements
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    'Product listing and details',
                    'Customer checkout and payments',
                    'Order status and history',
                    'Administrative product management',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 dark:border-[#2A3444] dark:bg-[#151B24] dark:text-slate-300"
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-indigo-500 dark:text-indigo-300"
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Questions to clarify
                </p>
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/[0.06] dark:text-amber-200">
                  Which payment provider is required? Will customers need
                  accounts? What delivery and shipping rules apply?
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-[#252D3A]">
                {['Requirements', 'Integrations', 'Open questions'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:border-[#2A3444] dark:bg-[#151B24] dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Why Archivox</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built around the way development teams work.
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            Collect project information in a consistent way, then use it to
            make better-informed scoping decisions.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-slate-900/[0.03] dark:border-[#2A3444] dark:bg-[#151B24] dark:hover:border-indigo-400/40 dark:hover:shadow-black/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                  <Icon size={21} />
                </div>
                <h3 className="mt-5 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 sm:px-6 sm:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-indigo-500/20 bg-indigo-600 px-6 py-16 text-center text-white sm:px-12 sm:py-20 dark:border-indigo-300/20 dark:bg-[#171D30]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Sparkles size={23} />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Spend less time decoding ideas.
              <br className="hidden sm:block" /> Start with a clearer brief.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100 dark:text-slate-300 sm:text-base">
              Give your next project a more structured start with AI-assisted
              discovery and reviewable requirements.
            </p>
            <button
  onClick={goToSignUp}
  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white..."
>
  Get started <ArrowUpRight size={17} />
</button>
          </div>
        </div>
      </section>

      
      <Footer/>
    </main>
  );
}
