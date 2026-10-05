"use client";

import { useRef, useState } from "react";

// Seven small cups on a ring around a pot: the tea tray, seen from above.
const CUPS = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
  return [100 + Math.cos(a) * 62, 100 + Math.sin(a) * 62] as const;
});

export const TRACK = {
  title: "’laxin",
  artist: "Kuromaru ft .hereafter",
  license: "CC BY 3.0",
  page: "https://commons.wikimedia.org/wiki/File:Kuromaru_ft_.hereafter_-_%E2%80%99laxin_(Lo_Fi_Background_Music).ogg",
};

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.55;
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }

  return (
    <div className={`player${playing ? " is-playing" : ""}`}>
      <button
        className="player__btn"
        type="button"
        aria-pressed={playing}
        aria-label={playing ? "Pause the music" : "Play the music"}
        onClick={toggle}
      >
        <svg className="player__tray" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="96" strokeWidth="1.4" />
            <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
            <circle cx="100" cy="100" r="34" strokeWidth="1.2" opacity=".7" />
            {CUPS.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="17" strokeWidth="2" />
                <circle cx={x} cy={y} r="9" strokeWidth="1.4" />
              </g>
            ))}
          </g>
        </svg>
        <svg className="player__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path className="player__play" d="M9 6.5 18 12l-9 5.5Z" />
          <path className="player__pause" d="M9 6h2.4v12H9zM12.6 6H15v12h-2.4z" />
        </svg>
      </button>
      <span className="player__label">
        <span aria-hidden="true">
          Lofi · <span lang="vi">{TRACK.title}</span>
        </span>
        <a
          className="dim player__credit"
          href={TRACK.page}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${TRACK.title} by ${TRACK.artist}, ${TRACK.license}, on Wikimedia Commons — opens in a new tab`}
        >
          {TRACK.artist} · {TRACK.license}
        </a>
      </span>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/laxin.mp3"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
