"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./masthead.css";

const links = [
  { href: "#leaves", label: "Lá Trà", en: "The Leaves" },
  { href: "#legend", label: "Sự Tích", en: "The Legend" },
  { href: "#brew", label: "Pha Trà", en: "The Brew" },
  { href: "#manners", label: "Lễ Nghi", en: "Manners" },
];

function useScrollSpy(
  barRef: React.RefObject<HTMLDivElement | null>,
  navRef: React.RefObject<HTMLElement | null>,
  cloudRef: React.RefObject<HTMLSpanElement | null>,
) {
  useEffect(() => {
    const bar = barRef.current;
    const nav = navRef.current;
    const cloud = cloudRef.current;
    if (!bar || !nav || !cloud || !("IntersectionObserver" in window)) return;

    const anchors = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const sections = anchors.map((a) => document.querySelector(a.getAttribute("href")!));
    let visible: Element[] = [];
    let current: HTMLAnchorElement | null = null;

    function ride() {
      if (!current || !bar || !nav || !cloud) return;
      const link = current.getBoundingClientRect();
      const base = bar.getBoundingClientRect();
      const navBox = nav.getBoundingClientRect();
      const w = Math.min(Math.max(link.width * 0.5, 30), 46);
      cloud.style.setProperty("--cloud-w", `${w}px`);
      cloud.style.setProperty("--cloud-x", `${link.left - base.left + (link.width - w) / 2}px`);
      bar.classList.toggle("masthead--riding", link.right > navBox.left + 4 && link.left < navBox.right - 4);
    }

    function paint() {
      if (!visible.length) return;
      const top = sections.filter((s): s is Element => !!s && visible.includes(s)).pop();
      anchors.forEach((a, i) => {
        if (sections[i] === top) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      current = (top && anchors[sections.indexOf(top)]) || null;
      if (current) ride();
      else bar?.classList.remove("masthead--riding");
    }

    // Band just under the sticky header: a section becomes current as its top passes beneath the nav.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = visible.indexOf(e.target);
          if (e.isIntersecting && i < 0) visible.push(e.target);
          if (!e.isIntersecting && i > -1) visible.splice(i, 1);
        });
        visible.sort((a, b) => sections.indexOf(a) - sections.indexOf(b));
        paint();
      },
      { rootMargin: "-14% 0px -80% 0px", threshold: 0 },
    );
    sections.forEach((s) => s && io.observe(s));

    window.addEventListener("resize", ride);
    nav.addEventListener("scroll", ride, { passive: true });
    document.fonts?.ready.then(ride);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", ride);
      nav.removeEventListener("scroll", ride);
      visible = [];
    };
  }, [barRef, navRef, cloudRef]);
}

export default function Masthead() {
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLSpanElement>(null);
  useScrollSpy(barRef, navRef, cloudRef);
  const [tip, setTip] = useState({ text: "", x: 0, show: false });

  // The nav scrolls (overflow clips children), so the tooltip lives outside it, positioned from the hovered link.
  function showTip(el: HTMLAnchorElement, text: string) {
    const bar = barRef.current;
    if (!bar) return;
    const link = el.getBoundingClientRect();
    const base = bar.getBoundingClientRect();
    setTip({ text, x: link.left - base.left + link.width / 2, show: true });
  }

  return (
    <header className="masthead">
      <div className="masthead__inner" ref={barRef}>
        <a className="brand" href="#top" aria-label="Ấm Trà — về đầu trang">
          {/* a cup seen from above, with one leaf floating in it */}
          <svg className="brand__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <g fill="none" stroke="currentColor" strokeWidth="4">
              <circle cx="50" cy="50" r="46" />
              <circle cx="50" cy="50" r="36" />
            </g>
            <path fill="currentColor" d="M50 18C72 38 72 64 50 84C28 64 28 38 50 18Z" />
            <path d="M50 30V76" fill="none" stroke="var(--leaf-900)" strokeWidth="3" />
          </svg>
          <span className="brand__word">Ấm Trà</span>
        </a>
        <nav className="nav" aria-label="Các phần" ref={navRef}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onMouseEnter={(e) => showTip(e.currentTarget, l.en)}
              onMouseLeave={() => setTip((t) => ({ ...t, show: false }))}
              onFocus={(e) => showTip(e.currentTarget, l.en)}
              onBlur={() => setTip((t) => ({ ...t, show: false }))}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="nav__cloud" aria-hidden="true" ref={cloudRef} />
        <span className="nav__tip" aria-hidden="true" data-show={tip.show} style={{ left: tip.x }}>
          {tip.text}
        </span>
        <a className="plaque" href="#closer">
          <span className="plaque__face">
            <Image className="plaque__sprig" src="/art/sprig-tea.svg" alt="" width={120} height={120} aria-hidden="true" unoptimized />
            <span>Mời trà!</span>
            <Image
              className="plaque__sprig plaque__sprig--right"
              src="/art/sprig-tea.svg"
              alt=""
              width={120}
              height={120}
              aria-hidden="true"
              unoptimized
            />
          </span>
        </a>
      </div>
    </header>
  );
}
