"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { teas } from "@/components/leaves/teas";
import { MAX_SECONDS, MIN_SECONDS, SECOND_CHOICES, teaGuides, type TeaGuide } from "./guide-data";
import { brewSteps } from "./steps";
import "./brewguide.css";
import Speak from "@/components/speak/Speak";

const STEP_COUNT = brewSteps.length;
const DONE_STAGE = STEP_COUNT + 1;
const TIMER_STAGE = brewSteps.findIndex((s) => s.extra === "timer") + 1;

// ─── Countdown ──────────────────────────────────────────────────────────────

type TimerStatus = "idle" | "running" | "paused" | "done";

/** Counts down against a wall-clock deadline, so a throttled or backgrounded tab still finishes on time. */
function useCountdown(totalSec: number, onDone: () => void) {
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [rest, setRest] = useState(0);
  const endAt = useRef(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (status !== "running") return;
    const tick = () => {
      const left = endAt.current - Date.now();
      if (left <= 0) {
        setRest(0);
        setStatus("done");
      } else {
        setRest(left);
      }
    };
    const id = window.setInterval(tick, 200);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [status]);

  useEffect(() => {
    if (status === "done") onDoneRef.current();
  }, [status]);

  const start = () => {
    endAt.current = Date.now() + totalSec * 1000;
    setRest(totalSec * 1000);
    setStatus("running");
  };
  const pause = () => {
    setRest(Math.max(0, endAt.current - Date.now()));
    setStatus("paused");
  };
  const resume = () => {
    endAt.current = Date.now() + rest;
    setStatus("running");
  };
  const reset = () => setStatus("idle");

  return { status, leftMs: status === "idle" ? totalSec * 1000 : rest, start, pause, resume, reset };
}

// ─── Chime, vibration, wake lock ────────────────────────────────────────────

function useChime() {
  const ctx = useRef<AudioContext | null>(null);

  // Browsers only allow sound after a tap, so the context is created from a button press.
  const unlock = useCallback(() => {
    try {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx.current ??= new Ctor();
      void ctx.current.resume();
    } catch {
      /* no sound is fine — the screen still tells you */
    }
  }, []);

  const ring = useCallback(() => {
    const c = ctx.current;
    if (!c) return;
    // A small bell: a fundamental plus two inharmonic partials, each fading out over a couple of seconds.
    const strike = (t: number, f: number) => {
      ([[1, 0.16], [2.76, 0.05], [5.4, 0.018]] as const).forEach(([mult, vol]) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sine";
        o.frequency.value = f * mult;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + 2.5);
      });
    };
    const now = c.currentTime;
    strike(now, 880);
    strike(now + 0.7, 1174.66);
  }, []);

  useEffect(
    () => () => {
      void ctx.current?.close();
    },
    [],
  );

  return { unlock, ring };
}

/** Keeps the phone awake while the guide is open, so the countdown stays in view. */
function useWakeLock() {
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let live = true;
    const grab = async () => {
      try {
        const l = await navigator.wakeLock.request("screen");
        if (live) lock = l;
        else void l.release();
      } catch {
        /* denied or unsupported — harmless */
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!lock || lock.released)) void grab();
    };
    void grab();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      live = false;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, []);
}

// ─── Small pieces ───────────────────────────────────────────────────────────

function restAdvice(tempC: number) {
  if (tempC >= 100) return "Full boil — the traditional Hà Nội way.";
  if (tempC >= 95) return "Take the kettle off the boil for about a minute.";
  if (tempC >= 90) return "Take the kettle off the boil for a minute or two.";
  return "Take the kettle off the boil for two to three minutes.";
}

function PotFill({ fill }: { fill: number }) {
  const clip = useId();
  const top = 82 - 64 * fill;
  return (
    <svg className="pot" viewBox="0 0 100 92" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <ellipse cx="50" cy="50" rx="38" ry="32" />
        </clipPath>
      </defs>
      <rect className="pot__leaf" x="0" y={top} width="100" height={100 - top} clipPath={`url(#${clip})`} />
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <ellipse cx="50" cy="50" rx="38" ry="32" />
        <path d="M30 20C34 8 66 8 70 20" />
        <path d="M44 9C46 3 54 3 56 9" />
      </g>
    </svg>
  );
}

function Dial({ status, leftMs, totalSec }: { status: TimerStatus; leftMs: number; totalSec: number }) {
  const R = 88;
  const C = 2 * Math.PI * R;
  const progress = status === "idle" ? 0 : 1 - leftMs / (totalSec * 1000);
  const secs = Math.ceil(leftMs / 1000);
  const label = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <div className="dial" data-status={status}>
      <svg className="dial__ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle className="dial__track" cx="100" cy="100" r={R} />
        <circle
          className="dial__bar"
          cx="100"
          cy="100"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <svg className="dial__steam" viewBox="0 0 120 90" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path className="w1" d="M30 82C16 62 44 50 30 28" />
          <path className="w2" d="M60 86C44 62 78 46 60 18" />
          <path className="w3" d="M90 82C80 64 104 52 90 32" />
        </g>
      </svg>
      <p className="dial__time" role="timer" aria-live="off" aria-label={`${secs} seconds left`}>
        {label}
      </p>
    </div>
  );
}

// ─── The guide ──────────────────────────────────────────────────────────────

function GuideDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [teaId, setTeaId] = useState(teas[0].id);
  const [override, setOverride] = useState<number | null>(null);
  const [stage, setStage] = useState(0);
  const [sound, setSound] = useState(true);

  const tea = teas.find((t) => t.id === teaId) ?? teas[0];
  const guide: TeaGuide = teaGuides[tea.id];
  const seconds = Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, override ?? guide.seconds));

  const { unlock, ring } = useChime();
  const timer = useCountdown(seconds, () => {
    if (sound) ring();
    if ("vibrate" in navigator) navigator.vibrate([180, 90, 180]);
  });
  useWakeLock();

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, [stage]);

  const go = (next: number) => {
    if (stage === TIMER_STAGE && next !== TIMER_STAGE) timer.reset();
    setStage(next);
  };
  const close = () => dialogRef.current?.close();
  const step = stage >= 1 && stage <= STEP_COUNT ? brewSteps[stage - 1] : null;

  const nextLabel =
    stage === 0
      ? "Begin brewing"
      : stage === TIMER_STAGE && (timer.status === "running" || timer.status === "paused")
        ? "Skip the wait"
        : stage === STEP_COUNT
          ? "Finish"
          : "Next step";

  return createPortal(
    <dialog
      ref={dialogRef}
      className="guide"
      aria-labelledby="guide-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="guide__frame">
        <header className="guide__bar">
          <p className="guide__where">
            {stage === 0 ? "Choose your tea" : stage === DONE_STAGE ? "Mời trà!" : `Step ${stage} of ${STEP_COUNT}`}
          </p>
          <div className="guide__tools">
            <button
              type="button"
              className="guide__icon"
              aria-pressed={sound}
              aria-label="Chime when the wait is over"
              onClick={() => setSound((s) => !s)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3a6 6 0 0 0-6 6v3.5L4 16h16l-2-3.5V9a6 6 0 0 0-6-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                {!sound && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
              </svg>
            </button>
            <button type="button" className="guide__icon" aria-label="Close the guide" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <span className="guide__track" aria-hidden="true">
          <i style={{ transform: `scaleX(${stage / DONE_STAGE})` }} />
        </span>

        <div className="guide__main" ref={mainRef}>
          {stage === 0 && (
            <>
              <h2 id="guide-title" className="guide__title" tabIndex={-1} ref={headingRef}>
                Brew along
              </h2>
              <p className="guide__lede">
                Pick a tea and the guide shows how much leaf, how hot the water and how long to wait — then walks you
                through the seven steps, with a countdown for the second water.
              </p>

              <fieldset className="teapick">
                <legend className="sr-only">Tea</legend>
                {teas.map((t) => (
                  <label key={t.id} className="teapick__opt">
                    <input
                      type="radio"
                      name="guide-tea"
                      value={t.id}
                      checked={t.id === teaId}
                      onChange={() => {
                        setTeaId(t.id);
                        setOverride(null);
                      }}
                    />
                    <span className="teapick__card">
                      <Image src={`/photos/${t.photo}-chip.jpg`} alt="" width={600} height={600} sizes="52px" quality={60} />
                      <span>
                        <b lang="vi">{t.vi}</b>
                        <small>{t.en}</small>
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              <dl className="facts">
                <div>
                  <dt>Leaf</dt>
                  <dd>
                    {guide.fillLabel} of the pot <span>· about {guide.grams} g</span>
                  </dd>
                </div>
                <div>
                  <dt>Water</dt>
                  <dd>{guide.tempC} °C</dd>
                </div>
                <div>
                  <dt>Second water</dt>
                  <dd>{seconds} seconds</dd>
                </div>
              </dl>
              <p className="guide__tip">{guide.tip}</p>
              <p className="guide__fine">
                A starting point, not a rule. These amounts and temperatures are common rules of thumb for a small pot of
                about 150 ml, not figures from this page&rsquo;s sources — adjust to your leaf and your taste.
              </p>
            </>
          )}

          {step && (
            <>
              <h2 id="guide-title" className="guide__title" tabIndex={-1} ref={headingRef}>
                {step.title}
              </h2>
              <p className="guide__lede">{step.body}</p>

              {step.extra === "amount" && (
                <div className="callout callout--amount">
                  <PotFill fill={guide.fill} />
                  <p>
                    <b>
                      {guide.fillLabel} of the pot <span lang="vi">· {tea.vi}</span>
                    </b>
                    <span>About {guide.grams} g for a 150 ml pot.</span>
                    <span>{guide.tip}</span>
                  </p>
                </div>
              )}

              {step.extra === "water" && (
                <div className="callout callout--water">
                  <p className="callout__temp">
                    {guide.tempC}
                    <small> °C</small>
                  </p>
                  <p>
                    <b>
                      Water for <span lang="vi">{tea.vi}</span>
                    </b>
                    <span>{restAdvice(guide.tempC)}</span>
                    {guide.tempC < 100 && <span>Warming the pot and cups (step 1) still uses boiling water.</span>}
                  </p>
                </div>
              )}

              {step.extra === "timer" && (
                <div className="wait">
                  <div className="wait__pick" role="group" aria-label="How long to wait">
                    {SECOND_CHOICES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={s === seconds}
                        disabled={timer.status !== "idle"}
                        onClick={() => setOverride(s)}
                      >
                        {s}s
                      </button>
                    ))}
                  </div>
                  <Dial status={timer.status} leftMs={timer.leftMs} totalSec={seconds} />
                  <p className="wait__msg" role="status">
                    {timer.status === "done" && "Time. Pour the tea now."}
                  </p>
                  <div className="wait__ctl">
                    {timer.status === "idle" && (
                      <button
                        type="button"
                        className="gbtn gbtn--solid"
                        onClick={() => {
                          unlock();
                          timer.start();
                        }}
                      >
                        Start the {seconds}s wait
                      </button>
                    )}
                    {timer.status === "running" && (
                      <button type="button" className="gbtn" onClick={timer.pause}>
                        Pause
                      </button>
                    )}
                    {timer.status === "paused" && (
                      <button type="button" className="gbtn gbtn--solid" onClick={timer.resume}>
                        Resume
                      </button>
                    )}
                    {(timer.status === "running" || timer.status === "paused" || timer.status === "done") && (
                      <button type="button" className="gbtn" onClick={timer.reset}>
                        {timer.status === "done" ? "Wait again" : "Reset"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {stage === DONE_STAGE && (
            <>
              <h2 id="guide-title" className="guide__title guide__title--vi" tabIndex={-1} ref={headingRef} lang="vi">
                Mời trà!
                <Speak text="Mời trà!" size="lg" />
              </h2>
              <p className="guide__lede">
                Your <span lang="vi">{tea.vi}</span> is ready. Please — have some tea.
              </p>
            </>
          )}
        </div>

        <footer className="guide__foot">
          {stage === DONE_STAGE ? (
            <>
              <button type="button" className="gbtn" onClick={() => go(0)}>
                Brew another
              </button>
              <button type="button" className="gbtn gbtn--solid" onClick={close}>
                Close
              </button>
            </>
          ) : (
            <>
              <button type="button" className="gbtn" disabled={stage === 0} onClick={() => go(stage - 1)}>
                Back
              </button>
              <button
                type="button"
                className={`gbtn ${stage === TIMER_STAGE && timer.status === "running" ? "" : "gbtn--solid"}`}
                onClick={() => {
                  if (stage === 0) unlock();
                  go(stage + 1);
                }}
              >
                {nextLabel}
              </button>
            </>
          )}
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}

export default function BrewGuide() {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="guide-cta">
      <div>
        <p className="guide-cta__title">
          Brew along <span lang="vi">· Pha cùng</span>
        </p>
        <p className="guide-cta__text">
          Pick your tea and follow the seven steps one at a time, with the amount of leaf, the water temperature and a
          countdown for the second water. Works well on a phone beside the kettle.
        </p>
      </div>
      <button type="button" className="guide-cta__btn" onClick={() => setOpen(true)}>
        Start the guided brew
      </button>
      {open && <GuideDialog onClose={handleClose} />}
    </div>
  );
}
