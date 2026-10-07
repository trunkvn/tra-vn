"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { pronunciations } from "./pronunciations";
import { recorded, slugify } from "./recordings";
import "./speak.css";

const hasSynth = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

function findVoice(): SpeechSynthesisVoice | null {
  if (!hasSynth()) return null;
  const voices = speechSynthesis.getVoices();
  const lang = (v: SpeechSynthesisVoice) =>
    v.lang.toLowerCase().replace("_", "-");
  return (
    voices.find((v) => lang(v) === "vi-vn") ??
    voices.find((v) => lang(v).startsWith("vi")) ??
    null
  );
}

// Voices load late (and on some browsers only after the first getVoices() call), so watch for them.
function subscribeVoices(onChange: () => void) {
  if (!hasSynth()) return () => {};
  speechSynthesis.addEventListener("voiceschanged", onChange);
  speechSynthesis.getVoices();
  return () => speechSynthesis.removeEventListener("voiceschanged", onChange);
}
const hasVoice = () => findVoice() !== null;

// One sound at a time, across every button on the page.
let stopCurrent: (() => void) | null = null;

function play(text: string, slug: string, onEnd: () => void) {
  stopCurrent?.();
  let finished = false;
  let audio: HTMLAudioElement | null = null;

  const finish = () => {
    if (finished) return;
    finished = true;
    if (stopCurrent === stop) stopCurrent = null;
    onEnd();
  };
  const stop = () => {
    audio?.pause();
    if (!audio && hasSynth()) speechSynthesis.cancel();
    finish();
  };

  const synth = () => {
    const voice = findVoice();
    if (!voice) return finish();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice.lang;
    u.voice = voice;
    u.rate = 0.85; // a little slower than conversation, for learners
    u.onend = finish;
    u.onerror = finish;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  stopCurrent = stop;
  if (recorded.has(slug)) {
    audio = new Audio(`/audio/vi/${slug}.m4a`);
    audio.onended = finish;
    audio.onerror = () => {
      audio = null;
      synth();
    };
    audio.play().catch(() => {
      audio = null;
      synth();
    });
  } else {
    synth();
  }
  return stop;
}

/** A small speaker button that reads a Vietnamese word or phrase aloud. Renders nothing if no voice is available. */
export default function Speak({
  text,
  size = "md",
  caption,
}: {
  text: string;
  size?: "sm" | "md" | "lg";
  /** Visible text beside the icon, for the one or two places where the button should be easy to spot. */
  caption?: string;
}) {
  const slug = slugify(text);
  const voice = useSyncExternalStore(subscribeVoices, hasVoice, () => false);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  const pron = pronunciations[text];
  const pronEl = pron && (
    <span className="say__pron" data-size={size} aria-hidden="true">
      ({pron})
    </span>
  );

  // No sound on this device — the respelling is still worth showing.
  if (!voice && !recorded.has(slug)) return pronEl || null;

  const toggle = () => {
    if (playing) {
      stopRef.current?.();
      return;
    }
    setPlaying(true);
    stopRef.current = play(text, slug, () => setPlaying(false));
  };

  return (
    <>
      <button
        type="button"
        className="say"
        data-size={size}
        data-playing={playing}
        lang="en"
        aria-label={`${playing ? "Stop" : "Hear"} “${text}” in Vietnamese`}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            className="say__cone"
            d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            className="say__wave say__wave--1"
            d="M15.2 9.6a3.6 3.6 0 0 1 0 4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            className="say__wave say__wave--2"
            d="M17.7 7.4a7 7 0 0 1 0 9.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        {caption && <span className="say__caption">{caption}</span>}
      </button>
      {pron && " "}
      {pronEl}
    </>
  );
}
