"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, Mail, Phone, TrendingDown, Users } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { CATERING_ADDONS, CATERING_PACKAGES } from "@/lib/content";
import { buildQuote, quoteAsText, HEADS_MAX, HEADS_MIN } from "@/lib/catering";
import { STORE } from "@/lib/data";
import { cn, formatAUD } from "@/lib/utils";

const telHref = `tel:${STORE.phone.replace(/[\s()]/g, "")}`;

/** Head counts people actually order for, so the common case is one tap. */
const PRESETS = [10, 20, 40, 75, 120];

type Stage = "build" | "details" | "done";

export function QuoteBuilder({ initialPackageId }: { initialPackageId?: string }) {
  const [heads, setHeads] = useState(25);
  const [packageId, setPackageId] = useState(
    initialPackageId ?? CATERING_PACKAGES.find((p) => p.recommended)?.id ?? CATERING_PACKAGES[0].id,
  );
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>("build");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    date: "",
    notes: "",
  });
  const [touched, setTouched] = useState(false);

  const sliderId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const quote = useMemo(() => buildQuote(packageId, heads, addonIds), [packageId, heads, addonIds]);

  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  // Contact details are the only hard requirement: we need a way to call back,
  // and asking for anything more before that is answered costs completions.
  // `reach` is shared by the email and phone fields because either one satisfies
  // it — flagging both individually would read as two separate failures.
  const errors: { company?: string; contact?: string; reach?: string } = touched
    ? {
        company: form.company.trim() ? undefined : "Who are we quoting for?",
        contact: form.contact.trim() ? undefined : "Who should we ask for?",
        reach: form.email.trim() || form.phone.trim() ? undefined : "An email or a phone number.",
      }
    : {};

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    const ok =
      form.company.trim() && form.contact.trim() && (form.email.trim() || form.phone.trim());
    if (ok) {
      setStage("done");
      return;
    }

    // Move focus to the first field that failed. Without this a keyboard or
    // screen-reader user is told something is wrong and left sitting on the
    // submit button with no way to know which field to go back to. The frame
    // wait lets React paint the aria-invalid attributes first.
    window.requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
    });
  };

  const summary = useMemo(() => {
    const contactBlock = [
      "",
      `Company:        ${form.company || "—"}`,
      `Contact:        ${form.contact || "—"}`,
      `Email:          ${form.email || "—"}`,
      `Phone:          ${form.phone || "—"}`,
      `Preferred date: ${form.date || "—"}`,
      form.notes ? `Notes:          ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `${quoteAsText(quote, addonIds)}\n${contactBlock}`;
  }, [quote, addonIds, form]);

  const mailtoHref = `mailto:${STORE.cateringEmail}?subject=${encodeURIComponent(
    `Catering enquiry — ${form.company || "new"} — ${heads} people`,
  )}&body=${encodeURIComponent(summary)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard is blocked in some embedded browsers; the text is on screen
      // and selectable either way, so there is nothing useful to recover from.
    }
  };

  const fillPercent = ((heads - HEADS_MIN) / (HEADS_MAX - HEADS_MIN)) * 100;

  return (
    <div className="glass-bone grain relative overflow-hidden rounded-4xl">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ------------------------------ Controls ------------------------------ */}
        <div className="border-b border-white/8 p-6 sm:p-8 lg:border-r lg:border-b-0">
          <AnimatePresence mode="wait" initial={false}>
            {stage === "build" ? (
              <motion.div
                key="build"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Head count */}
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label htmlFor={sliderId} className="eyebrow text-bone-dim">
                    How many people?
                  </label>
                  <div className="flex items-baseline gap-1.5">
                    <Users className="size-4 self-center text-bone-dim" aria-hidden />
                    <span className="font-display text-3xl font-extrabold tracking-tight tabular text-bone">
                      {heads}
                    </span>
                    <span className="text-sm text-bone-dim">people</span>
                  </div>
                </div>

                <input
                  id={sliderId}
                  type="range"
                  min={HEADS_MIN}
                  max={HEADS_MAX}
                  step={5}
                  value={heads}
                  onChange={(e) => setHeads(Number(e.target.value))}
                  style={{ ["--fill" as string]: `${fillPercent}%` }}
                  className="range-ember mt-3"
                  aria-describedby={`${sliderId}-hint`}
                />
                <p id={`${sliderId}-hint`} className="sr-only">
                  Between {HEADS_MIN} and {HEADS_MAX} people, in steps of five.
                </p>

                <div className="-mt-1 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHeads(preset)}
                      aria-pressed={heads === preset}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold tabular transition-colors duration-200",
                        heads === preset
                          ? "border-ember/60 bg-ember/15 text-ember"
                          : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/25 hover:text-zinc-100",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Package */}
                <fieldset className="mt-8">
                  <legend className="eyebrow text-bone-dim">Package</legend>
                  <div className="mt-3 space-y-2">
                    {CATERING_PACKAGES.map((pkg) => {
                      const selected = pkg.id === packageId;
                      return (
                        <label
                          key={pkg.id}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors duration-200",
                            selected
                              ? "border-ember/50 bg-ember/8"
                              : "border-white/10 bg-white/2 hover:border-white/22",
                          )}
                        >
                          <input
                            type="radio"
                            name="catering-package"
                            value={pkg.id}
                            checked={selected}
                            onChange={() => setPackageId(pkg.id)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                              selected ? "border-ember bg-ember" : "border-white/25",
                            )}
                          >
                            {selected && <Check className="size-2.5 text-obsidian" strokeWidth={4} />}
                          </span>
                          <span className="flex-1">
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="text-sm font-bold text-zinc-100">{pkg.name}</span>
                              <span className="text-sm font-bold tabular text-ember">
                                {formatAUD(pkg.perHead)}
                                <span className="text-[11px] font-medium text-zinc-500"> /head</span>
                              </span>
                            </span>
                            <span className="mt-0.5 block text-xs text-zinc-500">
                              Minimum {pkg.minHeads} people
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Add-ons */}
                <fieldset className="mt-7">
                  <legend className="eyebrow text-bone-dim">Add-ons</legend>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {CATERING_ADDONS.map((addon) => {
                      const on = addonIds.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon.id)}
                          aria-pressed={on}
                          title={addon.note}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors duration-200",
                            on
                              ? "border-ember/50 bg-ember/12 text-ember"
                              : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/25 hover:text-zinc-100",
                          )}
                        >
                          <span className="flex items-center gap-1.5">
                            <span
                              aria-hidden
                              className={cn(
                                "grid size-4 shrink-0 place-items-center rounded-md border transition-colors",
                                on ? "border-ember bg-ember" : "border-white/20",
                              )}
                            >
                              {on && <Check className="size-2.5 text-obsidian" strokeWidth={4} />}
                            </span>
                            {addon.label}
                          </span>
                          <span className="shrink-0 tabular text-[11px] text-zinc-500">
                            +{formatAUD(addon.perHead)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
              >
                <p className="eyebrow text-bone-dim">Where do we send it?</p>
                <p className="mt-2 text-sm text-zinc-400">
                  {stage === "done"
                    ? "Here is your quote. Copy it, email it, or read it down the phone — whatever is fastest."
                    : "Two fields are required. We call to confirm before anything is locked in."}
                </p>

                {stage === "details" ? (
                  <form
                    ref={formRef}
                    noValidate
                    className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
                    onSubmit={handleSubmit}
                  >
                    <Field
                      label="Company"
                      name="company"
                      value={form.company}
                      onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                      required
                      error={errors.company}
                      autoComplete="organization"
                      placeholder="Monash Robotics…"
                    />
                    <Field
                      label="Your name"
                      name="contact"
                      value={form.contact}
                      onChange={(v) => setForm((f) => ({ ...f, contact: v }))}
                      required
                      error={errors.contact}
                      autoComplete="name"
                      placeholder="Sam Reid…"
                    />
                    <Field
                      label="Work email"
                      name="email"
                      type="email"
                      inputMode="email"
                      spellCheck={false}
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                      error={errors.reach}
                      autoComplete="email"
                      placeholder="sam@company.com.au…"
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      spellCheck={false}
                      value={form.phone}
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                      error={errors.reach}
                      autoComplete="tel"
                      placeholder="0400 000 000…"
                    />
                    <Field
                      label="Preferred date"
                      name="date"
                      type="date"
                      autoComplete="off"
                      value={form.date}
                      onChange={(v) => setForm((f) => ({ ...f, date: v }))}
                    />
                    <Field
                      label="Dietaries or notes"
                      name="notes"
                      autoComplete="off"
                      value={form.notes}
                      onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                      placeholder="4 vegan, 2 gluten free, dock on Bruce St…"
                      className="sm:col-span-2"
                    />

                    <div className="col-span-full mt-2 flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-ember to-gold px-6 py-3 text-sm font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Generate my quote
                        <ArrowRight className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStage("build")}
                        className="rounded-full px-4 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5">
                    {/* whitespace-pre, not pre-wrap: the summary is column-aligned ASCII, and
                        wrapping it mid-row destroys the alignment that makes it readable
                        when pasted into an email. Overflow scrolls instead. */}
                    <pre className="max-h-72 overflow-auto rounded-2xl border border-white/10 bg-obsidian/70 p-4 font-mono text-[11px] leading-relaxed whitespace-pre text-zinc-300">
                      {summary}
                    </pre>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={copy}
                        className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-xs font-bold text-zinc-100 transition-colors hover:bg-white/14"
                      >
                        {copied ? <Check className="size-3.5 text-open" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                        {copied ? "Copied" : "Copy quote"}
                      </button>
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-2.5 text-xs font-bold text-zinc-100 transition-colors hover:bg-white/14"
                      >
                        <Mail className="size-3.5" aria-hidden />
                        Email it to us
                      </a>
                      <a
                        href={telHref}
                        className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-ember to-gold px-4 py-2.5 text-xs font-bold text-obsidian"
                      >
                        <Phone className="size-3.5" aria-hidden />
                        {STORE.phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => setStage("build")}
                        className="rounded-full px-3 py-2.5 text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-200"
                      >
                        Start over
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ------------------------------- Receipt ------------------------------- */}
        <div className="relative flex flex-col justify-between bg-obsidian/40 p-6 sm:p-8">
          <div>
            <p className="eyebrow text-bone-dim">Your quote</p>

            <motion.p
              key={quote.total}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-5 text-4xl leading-none font-extrabold tracking-tight tabular text-bone sm:text-[3.25rem]"
            >
              {formatAUD(quote.total)}
            </motion.p>
            <p className="mt-2 text-xs text-zinc-500">Total, GST inclusive</p>

            <p className="mt-3 text-sm text-zinc-400">
              <span className="font-semibold tabular text-ember">
                {formatAUD(quote.effectivePerHead)}
              </span>{" "}
              per person · <span className="tabular">{quote.heads}</span> people
            </p>

            <div className="hairline my-6" />

            <dl className="space-y-2.5 text-sm">
              <Row label={`${quote.pkg.name} × ${quote.heads}`} value={formatAUD(quote.base)} />
              {quote.addonsTotal > 0 && (
                <Row
                  label={`Add-ons (${formatAUD(quote.addonsPerHead)}/head)`}
                  value={formatAUD(quote.addonsTotal)}
                />
              )}
              {quote.discount > 0 && (
                <Row
                  label={`Volume credit — ${Math.round(quote.discountRate * 100)}%`}
                  value={`−${formatAUD(quote.discount)}`}
                  tone="credit"
                />
              )}
              <Row label="GST component" value={formatAUD(quote.gst)} muted />
            </dl>

            {/* Goal gradient: naming the exact gap to the next tier converts far
                better than naming the tier alone. */}
            <AnimatePresence initial={false}>
              {quote.nextTier && (
                <motion.p
                  key={quote.nextTier.minHeads}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 flex items-start gap-2 overflow-hidden rounded-2xl bg-ember/8 px-3.5 py-3 text-xs text-ember"
                >
                  <TrendingDown className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>
                    <span className="font-bold tabular">{quote.nextTier.headsAway} more people</span>{" "}
                    unlocks {Math.round(quote.nextTier.rate * 100)}% off the whole order.
                  </span>
                </motion.p>
              )}
            </AnimatePresence>

            {quote.belowMinimum && (
              <p role="status" className="mt-3 rounded-2xl bg-chilli/10 px-3.5 py-3 text-xs text-chilli">
                {quote.pkg.name} starts at {quote.pkg.minHeads} people. We will quote the closest fit
                on the call.
              </p>
            )}
          </div>

          {stage === "build" && (
            <div className="mt-8">
              {/* Names the next step before asking for it. "Lock this in" on its
                  own reads as a commitment to buy; saying what actually happens
                  removes the reason to hesitate. */}
              <p className="mb-3 text-xs leading-relaxed text-zinc-500">
                Next: four fields, then a written quote you can forward. Nothing is booked and no
                card is taken until you say so.
              </p>
              <button
                type="button"
                onClick={() => setStage("details")}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-ember to-gold px-6 py-3.5 text-sm font-bold text-obsidian shadow-ember transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Lock this in
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
            Indicative pricing, GST inclusive. Delivery and setup within 10km of{" "}
            {STORE.shortAddress} is included. ABN {STORE.abn}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: string;
  tone?: "credit";
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn("text-zinc-400", muted && "text-zinc-600")}>{label}</dt>
      <dd
        className={cn(
          "shrink-0 font-semibold tabular",
          tone === "credit" ? "text-open" : muted ? "text-zinc-600" : "text-zinc-100",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  inputMode,
  spellCheck,
  required,
  error,
  placeholder,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "email" | "tel" | "numeric" | "text";
  spellCheck?: boolean;
  required?: boolean;
  /** Message shown under the field; its presence also marks the field invalid. */
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
        {label}
        {required && <span className="text-ember"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        spellCheck={spellCheck}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "rounded-xl border bg-white/3 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:bg-white/6 focus:outline-none",
          error ? "border-chilli/60" : "border-white/10 focus:border-ember/50",
        )}
      />
      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-medium text-chilli">
          {error}
        </p>
      )}
    </div>
  );
}
