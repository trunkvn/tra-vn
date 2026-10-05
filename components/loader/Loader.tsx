"use client";

import { useEffect, useState } from "react";
import "./loader.css";

type Phase = "loading" | "leaving" | "done";

// Long enough to see the teapot drawn, short enough not to stand between a visitor and the page.
const MIN_MS = 1900;
const MIN_MS_REDUCED = 500;
const MAX_MS = 6000;
const LEAVE_MS = 800;

const ready = () =>
  Promise.all([
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
    document.fonts?.ready ?? Promise.resolve(),
  ]);

export default function Loader() {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    let alive = true;
    let leaveTimer = 0;
    // Wait for the page, but never longer than MAX_MS, and never less than the minimum.
    Promise.all([Promise.race([ready(), wait(MAX_MS)]), wait(reduce ? MIN_MS_REDUCED : MIN_MS)]).then(() => {
      if (!alive) return;
      setPhase("leaving");
      leaveTimer = window.setTimeout(() => alive && setPhase("done"), reduce ? 200 : LEAVE_MS);
    });
    return () => {
      alive = false;
      clearTimeout(leaveTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="loader" data-phase={phase} role="status" aria-live="polite">
      <span className="loader__sr">Loading Ấm Trà</span>
      <div className="loader__inner" aria-hidden="true">
        <svg className="loader__pot" viewBox="40 30 780 700" fill="none" stroke="#c3d98c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(20 130)">
            <g strokeWidth="2.4">
              <g className="loader__wisp w1"><path d="M345 70C312 28 382 -4 346 -52" /></g>
              <g className="loader__wisp w2"><path d="M400 62C366 14 440 -22 400 -84" /></g>
              <g className="loader__wisp w3"><path d="M455 70C424 30 490 -2 458 -46" /></g>
            </g>
            {/* body */}
            <path className="loader__draw" pathLength={1} style={{ "--d": "0s", "--t": "1.2s" } as React.CSSProperties} d="M170 360C170 250 270 170 400 170C530 170 630 250 630 360C630 470 540 550 400 550C260 550 170 470 170 360Z" />
            <path className="loader__fade" d="M188 360C188 262 280 190 400 190C520 190 612 262 612 360C612 458 530 532 400 532C270 532 188 458 188 360Z" strokeWidth="1.2" strokeDasharray="2 8" />
            {/* foot */}
            <path className="loader__draw" pathLength={1} style={{ "--d": "0.7s", "--t": "0.6s" } as React.CSSProperties} d="M300 549V578H500V549" />
            <path className="loader__draw" pathLength={1} style={{ "--d": "0.9s", "--t": "0.5s" } as React.CSSProperties} d="M285 578H515" strokeWidth="2" />
            {/* lid */}
            <g className="loader__lid">
              <path className="loader__draw" pathLength={1} style={{ "--d": "0.5s", "--t": "0.8s" } as React.CSSProperties} d="M262 198C290 152 344 128 400 128C456 128 510 152 538 198" />
              <path className="loader__draw" pathLength={1} style={{ "--d": "0.8s", "--t": "0.5s" } as React.CSSProperties} d="M250 200H550" />
              <circle className="loader__draw" pathLength={1} style={{ "--d": "1s", "--t": "0.5s" } as React.CSSProperties} cx="400" cy="108" r="20" />
            </g>
            {/* spout */}
            <path className="loader__draw" pathLength={1} style={{ "--d": "0.9s", "--t": "0.9s" } as React.CSSProperties} d="M606 300C662 284 712 248 744 192L774 204C752 276 702 336 628 374" />
            <path className="loader__draw" pathLength={1} style={{ "--d": "1.2s", "--t": "0.6s" } as React.CSSProperties} d="M606 332C648 322 690 290 722 242" strokeWidth="1.4" />
            {/* handle */}
            <path className="loader__draw" pathLength={1} style={{ "--d": "1s", "--t": "0.9s" } as React.CSSProperties} d="M182 300C92 284 58 340 68 392C78 444 130 462 190 440" />
            <path className="loader__draw" pathLength={1} style={{ "--d": "1.3s", "--t": "0.5s" } as React.CSSProperties} d="M184 332C128 322 108 356 114 386C120 416 150 426 188 412" strokeWidth="1.6" />
            {/* three leaves unfurl on the belly */}
            <g className="loader__leaves">
              <path d="M400 291C362 314 354 358 400 410C446 358 438 314 400 291Z" />
              <path d="M400 298V404" strokeWidth="1.6" />
              <g transform="rotate(-38 400 410)"><path d="M400 291C362 314 354 358 400 410C446 358 438 314 400 291Z" /><path d="M400 304V410" strokeWidth="1.4" /></g>
              <g transform="rotate(38 400 410)"><path d="M400 291C362 314 354 358 400 410C446 358 438 314 400 291Z" /><path d="M400 304V410" strokeWidth="1.4" /></g>
            </g>
          </g>
        </svg>
        <p className="loader__name">Ấm Trà</p>
        <p className="loader__line">Đang pha trà · steeping</p>
        <span className="loader__bar"><i /></span>
      </div>
    </div>
  );
}
