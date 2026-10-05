import Image from "next/image";
import "./closer.css";

export default function Closer() {
  return (
    <section className="section closer" id="closer" aria-labelledby="closer-title">
      <div className="closer__ripples" aria-hidden="true" />
      <div className="shell">
        <p className="kicker" style={{ justifyContent: "center" }}>
          Lời chào · The greeting
        </p>
        <h2 id="closer-title" lang="vi">
          Mời trà!
        </h2>
        <div className="closer__body">
          <p className="lede">“Please — have some tea.”</p>
          <p className="rule" aria-hidden="true">
            <span className="rule__mark" />
          </p>
          <p className="dim">
            It is how a Vietnamese home says hello: a warm greeting, a wish for peace and a sign of hospitality all at
            once. Offering tea also builds closeness and trust, and ties the generations together.
          </p>
          <p className="closer__punch">At Tết, at weddings, for an honoured guest — the hot cup always comes first.</p>
        </div>
      </div>
      <Image
        className="closer__tray"
        src="/art/tray-top.svg"
        alt="A round tea tray seen from above: a teapot at the centre with its spout pointing outwards, and seven small cups on saucers arranged around it."
        width={600}
        height={600}
        unoptimized
      />
    </section>
  );
}
