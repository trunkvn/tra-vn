import TeaScene from "./TeaScene";
import "./feast.css";

const counts = ["7 teas", "1 small pot", "1 sharing pitcher", "a few small cups", "the stories of the day"];

export default function Feast() {
  return (
    <section className="feast" id="feast" aria-labelledby="feast-title">
      <TeaScene />
      <div className="feast__body">
        <p className="feast__cap">
          Khay trà — a celadon pot and seven cups, one for each tea on the tray. Turn it; tap a cup.
        </p>
        <div>
          <p className="kicker">Một khay trà đầy đủ · A full tea tray</p>
          <h2 id="feast-title">
            This is welcome.
            <br className="br-wide" /> All on one tray.
          </h2>
        </div>
        <div>
          <p className="lede dim">
            A Vietnamese tea tray is simple: a small pot, <span lang="vi">ấm</span>, just big enough for one round of
            tea; a sharing pitcher, <span lang="vi">chén tống</span>; and little cups, <span lang="vi">chén quân</span>.
            Morning or evening, the family gathers round the pot and shares the stories of the day. Seven teas, one pot,
            and a few small cups.
          </p>
          <ul className="feast__count">
            {counts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
