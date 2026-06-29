"use client"
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { BlueTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/reusables";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FEATURES, PLACEHOLDERS, STEPS, SUGGESTIONS } from "@/lib/data";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { CheckoutButton } from "@clerk/nextjs/experimental";

export default function Home() {
  const { isSignedIn ,has} = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);



  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || prompt) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">
      <section className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.00)"
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          }}
        />

        <Badge variant="outline" className="gap-2 p-4 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Powered by Agentic AI
        </Badge>

        <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl z-10">
          <GrayTitle> Aurask your deepest</GrayTitle>
          <br />
          <BlueTitle>thoughts into reality.</BlueTitle>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/40 z-10">
          Describe what you want to build. AI writes the code, picks the
          packages, and renders a live preview all inside your browser.
        </p>

        <div className="relative mx-auto mt-12 w-full max-w-2xl">
          <div
            className={cn(
              "rounded-2xl border bg-[#111111] duration-200",
              isFocused ? "border-white/20 ring-1 ring-white/8" : "border-white/8"
            )}
          >
            <Textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={PLACEHOLDERS[placeholderIndex]}
              rows={1}
              className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base"
              style={{ minHeight: 56, maxHeight: 200 }}
            />
            <div className="flex items-center justify-between border-t border-white/6 px-4 py-2.5">
              <span className="text-xs text-white/20">
                Press ⏎ to generate · Shift+⏎ for new line
              </span>
              {isSignedIn ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim()}
                  className="h-8 rounded-full px-5 font-semibold"
                  variant={prompt.trim() ? "default" : "secondary"}
                >
                  Generate
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 ease-out hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    sign in
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40 hover:border-white/15 hover:bg-white/8 hover:text-white/70"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-white/20">
          No credit card required · 10 free generations on sign up
        </p>
      </section>

      <section className="relative mx-auto my-24 max-w-[1440px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#07070c]/80 px-6 py-6 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,120,255,0.22),transparent_18%),radial-gradient(circle_at_85%_20%,rgba(0,255,212,0.16),transparent_20%)]" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-3 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.18)]">
                <span className="block h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_12px_rgba(255,95,87,0.45)]" />
              </span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.18)]">
                <span className="block h-2.5 w-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_12px_rgba(255,189,46,0.45)]" />
              </span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.18)]">
                <span className="block h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_0_12px_rgba(40,200,64,0.45)]" />
              </span>
              <span className="ml-4 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                dev workspace
              </span>
            </div>
            <div className="hidden items-center gap-2 text-xs text-white/50 sm:flex">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Code</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live</span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="absolute inset-x-6 top-6 h-1 rounded-full bg-white/5 blur-xl" />
              <div className="relative z-10 flex items-center justify-between pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/70">AI Chat Studio</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Dev assistant flow</h2>
                </div>
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-200/80">
                  Real time
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-black/35 p-4 text-sm text-white/80 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">User</p>
                  <p className="mt-3 text-base leading-7 text-white/90">Build a futuristic workspace mockup with a dark neon browser, AI chat, and live preview sandbox.</p>
                </div>

                <div className="rounded-[2rem] border border-cyan-300/10 bg-cyan-400/5 p-4 text-sm text-white shadow-[0_24px_80px_-40px_rgba(0,0,0,0.52)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-100/70">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    Resolved AI snippet
                  </div>
                  <pre className="overflow-x-auto rounded-3xl border border-white/10 bg-[#09131a]/95 p-4 text-left text-[0.92rem] leading-6 text-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                    <code>{`const workspace = {
  header: 'Borderless browser UI',
  chat: 'Translucent AI conversation',
  preview: 'Frosted-glass Kanban board',
};

render(workspace);`}</code>
                  </pre>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm shadow-[0_18px_60px_-42px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/40">
                    <span>Generating response</span>
                    <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-cyan-200/80">Live</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/85">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,255,233,0.38)] animate-pulse" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,255,233,0.38)] animate-[blink_1.2s_ease-in-out_infinite]" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,255,233,0.38)] animate-[blink_1.2s_ease-in-out_infinite_0.2s]" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(56,255,233,0.38)] animate-[blink_1.2s_ease-in-out_infinite_0.4s]" />
                    <span className="text-white/70">AI is composing the final card layout…</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-[1.75rem] border border-white/10 bg-white/5/90 p-4 shadow-[0_20px_80px_-44px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/40">Prompt</label>
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-100">AI</span>
                  <span className="flex-1 text-white/80">Ask the assistant to refine the board, add motion, or export CSS.</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="absolute -right-16 top-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="relative z-10 flex items-center justify-between pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-white/40">Preview sandbox</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Kanban live preview</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/50">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(56,255,189,0.35)]" />
                  Live
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-[#07131f]/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-white/40">
                  <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-cyan-100">Code</span>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-white/50">Preview</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white/90">Backlog</span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/50">5</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-16 rounded-3xl bg-white/5 p-3 text-sm text-white/70 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]">
                        <div className="mb-2 h-3.5 w-20 rounded-full bg-white/10" />
                        <div className="h-3 w-28 rounded-full bg-white/10" />
                      </div>
                      <div className="h-14 rounded-3xl bg-white/5 p-3 text-sm text-white/70 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]">
                        <div className="h-3.5 w-24 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white/90">In progress</span>
                      <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[11px] text-cyan-200">Drag</span>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-3xl border border-cyan-300/10 bg-cyan-300/10 p-4 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]">
                        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-100/80">
                          <span className="h-2 w-2 rounded-full bg-cyan-300" /> Active
                        </div>
                        <div className="h-4 w-28 rounded-full bg-white/10" />
                        <div className="mt-3 h-3.5 w-20 rounded-full bg-white/10" />
                      </div>
                      <div className="h-16 rounded-3xl bg-white/5 p-3 text-sm text-white/70 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]">
                        <div className="h-3.5 w-16 rounded-full bg-white/10" />
                        <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white/90">Review</span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/50">2</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-16 rounded-3xl bg-white/5 p-3 text-sm text-white/70 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]">
                        <div className="h-3.5 w-18 rounded-full bg-white/10" />
                        <div className="mt-2 h-3 w-24 rounded-full bg-white/10" />
                      </div>
                      <div className="h-14 rounded-3xl bg-white/5 p-3 text-sm text-white/70 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]">
                        <div className="h-3.5 w-20 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
      `}</style>
      <section className="px-4 py-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <SectionHeading gray="From prompt" blue="to production." />
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-3">
        
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group bg-[#0a0a0a] p-7 hover:bg-[#0f0f0f]"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/4 group-hover:border-white/15 group-hover:bg-white/8">
                <Icon className="h-4 w-4 text-white/60 group-hover:text-blue-400/70" />
              </div>
              <p className="mb-2 text-sm font-semibold">{label}</p>
              <p className="text-sm leading-relaxed text-white/40">{desc}</p>
            </div>
          ))}



        </div>
           
      </section>

       {/* HOW IT WORKS */}
      <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading gray="Four steps" blue="to a working app." />
        </div>

        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <span className="font-mono text-xs font-semibold text-white/50">
                    {step.number}
                  </span>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-white/6" />
                )}
              </div>

              <div className="pb-10 pt-1.5">
                <p className="mb-1.5 text-sm font-semibold sm:text-base">
                  {step.label}
                </p>

                <p className="text-sm leading-relaxed text-white/40">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

        {/* PRICING */}
      <section className="px-4 pb-32">
        <div className="mx-auto mb-14 max-w-5xl text-center">
          <SectionLabel>Simple pricing</SectionLabel>
          <SectionHeading gray="Start free," blue="scale when ready." />

          <p className="mx-auto mt-4 max-w-sm text-sm text-white/35">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3">
          {PRICING_PLANS .map((plan) => {
            const planOrder: Record<string, number> = {
              free: 0,
              starter: 1,
              pro: 2,
            };
            const activePlanKey = isSignedIn
              ? has?.({ plan: "pro" })
                ? "pro"
                : has?.({ plan: "starter" })
                ? "starter"
                : "free"
              : null;

            const isActive = isSignedIn && activePlanKey === plan.key;
            const isDowngrade =
              isSignedIn &&
              activePlanKey !== null &&
              !isActive &&
              planOrder[plan.key] < planOrder[activePlanKey];

            return (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-7 transition-colors",
                  plan.featured
                    ? "border-blue-500/25 bg-blue-500/4"
                    : "border-white/8 bg-[#0f0f0f]"
                )}
              >
                {/* Most popular pill */}
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full border border-blue-500/20 bg-[#0a0a0a] px-3 py-1 text-[11px] font-medium text-blue-400">
                      Most popular
                    </span>
                  </div>
                )}

                {/* Plan name + active badge */}
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-white/90">
                    {plan.label}
                  </p>
                  {isActive && (
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                      Active
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mb-6 text-xs leading-relaxed text-white/35">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-serif text-4xl">
                    {plan.price === 0 ? (
                      <GrayTitle>$0</GrayTitle>
                    ) : (
                      <BlueTitle>${plan.price}</BlueTitle>
                    )}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-white/30">/mo</span>
                  )}
                </div>
                <p className="mb-6 text-xs text-white/25">
                  {plan.price === 0 ? "Always free" : "Only billed monthly"}
                </p>

                {/* Feature list */}
                <div className="mb-8 space-y-3 border-t border-white/6 pt-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          plan.featured ? "bg-blue-500/15" : "bg-white/8"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-2.5 w-2.5",
                            plan.featured ? "text-blue-400" : "text-white/50"
                          )}
                        />
                      </div>
                      <span className="text-xs text-white/55">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div className="mt-auto">
                  {isActive ? (
                    <Button
                      disabled
                      className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60"
                      variant="ghost"
                    >
                      ✓ Current plan
                    </Button>
                  ) : plan.price === 0 ? (
                    isSignedIn ? (
                      <Button
                        disabled
                        className="w-full rounded-full text-sm font-semibold opacity-50 cursor-not-allowed border border-white/10 bg-transparent text-white/60"
                        variant="ghost"
                      >
                        Default plan
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          className="w-full rounded-full text-sm font-semibold border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90"
                          variant="ghost"
                        >
                          Get started free
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </SignInButton>
                    )
                  ) : isSignedIn ? (
                    <CheckoutButton
                      planId={plan.planId}
                      planPeriod="month"
                      checkoutProps={{
                        appearance: {
                          elements: {
                            drawerRoot: {
                              zIndex: 2000,
                            },
                          },
                        },
                      }}
                    >
                      <Button
                        className={cn(
                          "w-full rounded-full text-sm font-semibold transition-all",
                          plan.featured
                            ? "bg-blue-500 text-white hover:bg-blue-400 active:scale-95"
                            : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90"
                        )}
                        variant="ghost"
                      >
                        {isDowngrade ? "Downgrade" : "Get started"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CheckoutButton>
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        className={cn(
                          "w-full rounded-full text-sm font-semibold transition-all",
                          plan.featured
                            ? "bg-blue-500 text-white hover:bg-blue-400 active:scale-95"
                            : "border border-white/10 bg-transparent text-white/60 hover:bg-white/6 hover:text-white/90"
                        )}
                        variant="ghost"
                      >
                        Get started
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto mb-32 max-w-5xl overflow-hidden rounded-2xl border border-white/8 px-10 py-24 text-center">
        <HoleBackground
          strokeColor="rgba(255,255,255,0.00)" // blur
          numberOfLines={36}
          numberOfDiscs={36}
          particleRGBColor={[147, 197, 253]}
          className="absolute inset-0 h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />

        <SectionHeading gray="Start building," blue="for free." />

        <p className="mb-8 text-sm leading-relaxed text-white/40">
          Get 10 free generations on sign up. No credit card required.
          <br />
          Upgrade when you&apos;re ready.
        </p>

        <SignInButton mode="modal">
          <Button
            size="lg"
            className="relative h-11 rounded-full bg-white px-8 animate-bounce"

          >
            Get started free
            <ChevronRight className="h-4 w-4" />
          </Button>
        </SignInButton>
      </section>

       {/* <footer className="relative z-10 border-t border-white/7 py-12 mx-auto px-6 flex flex-wrap items-center justify-center text-stone-400">
        Made with ❤️ Anish
      </footer> */}
    </main>
  );
}