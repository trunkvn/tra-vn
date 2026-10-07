import Image from "next/image";
import type { CSSProperties } from "react";
import { teas } from "@/components/leaves/teas";
import AudioPlayer from "./AudioPlayer";
import "./hero.css";
import Speak from "@/components/speak/Speak";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__art" aria-hidden="true">
        <div className="hero__ripples" />
        <Image className="hero__teapot" src="/art/teapot.svg" alt="" width={840} height={760} priority unoptimized />
      </div>
      <div className="hero__inner">
        <div className="hero__body">
          <p className="hero__eyebrow">
            <span lang="vi" style={{ color: "inherit", letterSpacing: "inherit" }}>
              Xem · Ngửi · Phẩm
            </span>
            <span>Look · smell · taste</span>
          </p>
          <h1 id="hero-title">
            Ấm Trà
            <em>The Vietnamese way of tea</em>
          </h1>
          <p className="hero__pron">
            <span lang="vi">Nhất thủy, nhì trà, tam bôi, tứ bình, ngũ quần anh</span>
            <Speak text="Nhất thủy, nhì trà, tam bôi, tứ bình, ngũ quần anh" size="sm" /> ·{" "}
            <i>“water, tea, cup, pot, good company”</i>
          </p>
          <p className="lede hero__lede">
            In Việt Nam a hot cup of tea —{" "}
            <span className="vi" lang="vi">
              chén trà nóng
            </span>{" "}
            — is the first thing offered to a guest: a greeting, a wish for peace and a sign of welcome. In Hà Nội the
            care that went into making it, for yourself or for a visitor, slowly became ritual. A small pot and a few
            small cups are all it takes for a moment of stillness.
          </p>
          <div className="hero__cta">
            <a className="btn btn--solid" href="#leaves">
              Pour a cup
            </a>
            <AudioPlayer />
          </div>

          <div className="hero__dishes">
            <p className="hero__dishes-label" id="hero-teas-label">
              Seven teas to pour
            </p>
            <ul className="hero__strip" aria-labelledby="hero-teas-label">
              {teas.map((t) => (
                <li key={t.id}>
                  <a
                    className="hero__chip"
                    href="#leaves"
                    data-jump={`tab-${t.id}`}
                    style={{ "--liquor": t.liquor } as CSSProperties}
                    aria-label={`${t.vi}, ${t.en} — show it on the tray`}
                  >
                    <Image src={`/photos/${t.photo}-chip.jpg`} alt="" width={600} height={600} sizes="64px" quality={65} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="hero__scroll" aria-hidden="true">
        Scroll
      </p>
    </section>
  );
}
