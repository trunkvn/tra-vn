"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { photoCredits } from "./credits";
import { teas, type Tea } from "./teas";
import "./leaves.css";

const N = teas.length;
const STEP = 360 / N;
const DEAD_ZONE = 6;

const wrapAngle = (d: number) => {
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
};

const liquorVars = (t: Tea) => ({ "--liquor": t.liquor }) as CSSProperties;

export default function Leaves() {
  const trayRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentRef = useRef(0);
  const turnsRef = useRef(0); // accumulated so the tray keeps spinning one way
  const onScreenRef = useRef(false);
  const [current, setCurrent] = useState(0);
  // Only the teas that have been shown load their large photo: on wide screens all seven panels are in the DOM.
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [seen, setSeen] = useState(false);

  const rotateTo = useCallback((t: number) => {
    trayRef.current?.style.setProperty("--ring-rot", `${-t * STEP}deg`);
  }, []);

  const paint = useCallback((next: number) => {
    currentRef.current = next;
    setCurrent(next);
    setVisited((v) => (v.has(next) ? v : new Set(v).add(next)));
  }, []);

  const select = useCallback(
    (next: number, moveFocus: boolean) => {
      if (next === currentRef.current) return;
      // Take the short way round, but never unwind: keep adding turns.
      let delta = next - currentRef.current;
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      turnsRef.current += delta;
      rotateTo(turnsRef.current);
      paint(next);
      if (moveFocus) tabRefs.current[next]?.focus();
    },
    [paint, rotateTo],
  );

  const shift = useCallback((dir: number) => select((currentRef.current + dir + N) % N, false), [select]);

  const settle = useCallback(
    (target: number) => {
      turnsRef.current = Math.round(target);
      rotateTo(turnsRef.current);
      paint(((turnsRef.current % N) + N) % N);
    },
    [paint, rotateTo],
  );

  // Hero chips jump here with that tea already chosen; the href still works without JS.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element).closest<HTMLElement>("[data-jump]");
      if (!link) return;
      const i = teas.findIndex((t) => `tab-${t.id}` === link.dataset.jump);
      if (i < 0) return;
      e.preventDefault();
      select(i, false);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      (document.querySelector(".tray-layout") ?? trayRef.current)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      tabRefs.current[i]?.focus({ preventScroll: true });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [select]);

  // Left / right spin the tray from anywhere, but only while it is on screen.
  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return;
    const io = new IntersectionObserver(
      (entries) => {
        onScreenRef.current = entries[0].isIntersecting;
        if (entries[0].isIntersecting) setSeen(true);
      },
      { threshold: 0.25 },
    );
    io.observe(tray);

    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || !onScreenRef.current) return;
      const el = document.activeElement;
      if (el && el !== document.body) {
        if (el.closest('[role="tablist"]')) return; // the tablist has its own handler
        if (el.closest('input,textarea,select,[contenteditable="true"]')) return;
        if (el.closest("a,button") && !el.closest("[data-spin]")) return;
      }
      e.preventDefault();
      shift(e.key === "ArrowRight" ? 1 : -1);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, [shift]);

  // Drag to spin. Pointer events cover mouse, pen and touch; touch-action: pan-y keeps page scrolling working.
  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return;
    let dragging = false;
    let moved = false;
    let startAngle = 0;
    let startTurns = 0;
    let lastAngle = 0;
    let lastTime = 0;
    let velocity = 0;

    const angleAt = (e: PointerEvent) => {
      const r = tray.getBoundingClientRect();
      return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
    };
    // Where the ring visually is now, which differs from turnsRef while a settle animation runs.
    const shownTurns = () => {
      const ring = tray.querySelector(".tray__ring");
      const r = ring ? getComputedStyle(ring).rotate : "none";
      return -(r && r !== "none" ? parseFloat(r) : 0) / STEP;
    };

    function down(e: PointerEvent) {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startAngle = lastAngle = angleAt(e);
      startTurns = shownTurns();
      lastTime = e.timeStamp;
      velocity = 0;
    }
    function move(e: PointerEvent) {
      if (!dragging) return;
      const a = angleAt(e);
      const d = wrapAngle(a - startAngle);
      if (!moved && ((Math.abs(d) * Math.PI) / 180) * (tray!.offsetWidth / 2) < DEAD_ZONE) return;
      if (!moved) {
        moved = true;
        tray!.classList.add("is-dragging");
        rotateTo(startTurns);
        // Capturing on pointerdown would retarget a plain tap away from the cup's own button.
        tray!.setPointerCapture(e.pointerId);
      }
      const dt = Math.max(1, e.timeStamp - lastTime);
      velocity = wrapAngle(a - lastAngle) / dt;
      lastAngle = a;
      lastTime = e.timeStamp;
      rotateTo(startTurns - d / STEP);
      e.preventDefault();
    }
    const swallowClick = (ev: Event) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    function end(e: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      if (tray!.hasPointerCapture(e.pointerId)) tray!.releasePointerCapture(e.pointerId);
      if (!moved) return;
      tray!.classList.remove("is-dragging");
      const live = startTurns - wrapAngle(lastAngle - startAngle) / STEP;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const glide = reduce ? 0 : Math.max(-2, Math.min(2, (velocity * 90) / STEP));
      settle(live - glide);
      // Swallow only the click this very drag synthesises.
      tray!.addEventListener("click", swallowClick, true);
      setTimeout(() => tray!.removeEventListener("click", swallowClick, true), 0);
    }

    tray.addEventListener("pointerdown", down);
    tray.addEventListener("pointermove", move);
    tray.addEventListener("pointerup", end);
    tray.addEventListener("pointercancel", end);
    return () => {
      tray.removeEventListener("pointerdown", down);
      tray.removeEventListener("pointermove", move);
      tray.removeEventListener("pointerup", end);
      tray.removeEventListener("pointercancel", end);
    };
  }, [rotateTo, settle]);

  function onTablistKey(e: KeyboardEvent) {
    const last = N - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = current === last ? 0 : current + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = current === 0 ? last : current - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    select(next, true);
  }

  const active = teas[current];

  return (
    <section className="section tray-section" id="leaves" aria-labelledby="leaves-title">
      <div className="shell">
        <div className="tray-head">
          <div>
            <p className="kicker">Bảy loại trà trên một vòng tròn</p>
            <h2 id="leaves-title">
              Seven teas
              <br className="br-wide" /> on a circle
            </h2>
            <p className="lede dim">
              Seven teas, from the wild Shan trees and aged <span lang="vi">trà mạn</span> of the northern mountains to
              the green tea of Thái Nguyên, the lotus and jasmine teas scented in Hà Nội, oolong from the southern
              highlands and the black tea Việt Nam makes for export. Spin the tray. Whichever cup reaches the top is the
              one to pour.
            </p>
          </div>
          <Image className="head-art" src="/art/steam-flow.svg" alt="" width={420} height={183} aria-hidden="true" unoptimized />
        </div>

        <div className="tray-layout" data-seen={seen}>
          <div>
            <div className="tray" ref={trayRef}>
              <div className="tray__plate" aria-hidden="true" />
              <div className="tray__clip">
                <div className="tray__engraving" aria-hidden="true" />
                <div className="tray__glow" aria-hidden="true" />

                <div className="tray__ring" role="tablist" aria-label="The seven teas of the tray" onKeyDown={onTablistKey}>
                  {teas.map((t, i) => (
                    <button
                      key={t.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      className="dish"
                      type="button"
                      style={{ "--a": `${(i * STEP).toFixed(2)}deg`, ...liquorVars(t) } as CSSProperties}
                      role="tab"
                      id={`tab-${t.id}`}
                      aria-controls={`panel-${t.id}`}
                      aria-selected={i === current}
                      tabIndex={i === current ? 0 : -1}
                      aria-label={`${t.vi} — ${t.en}`}
                      onClick={() => select(i, false)}
                    >
                      <span className="dish__inner">
                        <Image src={`/photos/${t.photo}-chip.jpg`} alt="" width={300} height={300} sizes="(min-width: 600px) 112px, 21vw" quality={65} draggable={false} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="tray__label" aria-hidden="true">
                <span className="tray__label-vi">{active.vi}</span>
                <span className="tray__label-en">{active.en}</span>
              </p>
            </div>

            <div className="tray__controls">
              <button className="spin" type="button" data-spin="-1" aria-label="Spin the tray to the previous tea" onClick={() => shift(-1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
              </button>
              <p className="tray__hint">Choose a tea, or spin with the arrow keys</p>
              <button className="spin" type="button" data-spin="1" aria-label="Spin the tray to the next tea" onClick={() => shift(1)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="dish-panels">
            {teas.map((t, i) => (
              <div
                key={t.id}
                className="dish-panel"
                role="tabpanel"
                id={`panel-${t.id}`}
                aria-labelledby={`tab-${t.id}`}
                tabIndex={0}
                data-active={i === current}
                inert={i !== current}
              >
                <figure className="dish-panel__figure" style={liquorVars(t)}>
                  {visited.has(i) && (
                    <Image src={`/photos/${t.photo}-panel.jpg`} alt={t.alt} width={1200} height={800} sizes="(min-width: 960px) 560px, 92vw" quality={65} />
                  )}
                  <figcaption>
                    Photo:{" "}
                    <a href={photoCredits[`${t.id}-panel`].page} target="_blank" rel="noopener noreferrer">
                      {photoCredits[`${t.id}-panel`].author}
                    </a>{" "}
                    · {photoCredits[`${t.id}-panel`].license}
                  </figcaption>
                </figure>
                <p className="dish-panel__index">
                  Tea {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} · {t.tagline}
                </p>
                <h3 lang="vi">{t.vi}</h3>
                <p className="dish-panel__en">{t.en}</p>
                <p className="dish-panel__note">{t.note}</p>
                <dl className="dish-facts">
                  {t.facts.map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
