import Image from "next/image";
import "./manners.css";
import Speak from "@/components/speak/Speak";

const rules = [
  {
    vi: "Mời trà",
    gloss: "“Offer tea first.”",
    text: (
      <>
        A hot cup is the first thing put in front of a guest — a greeting, a blessing and a welcome in one. At a wedding,
        tea is offered to the grandparents and parents at the family altar, as thanks and as respect.
      </>
    ),
  },
  {
    vi: "Tráng trà",
    gloss: "“Rinse the tea.”",
    text: (
      <>
        Warm the pot and cups with boiling water, then pour the first water straight off the leaf: it clears the dust
        and lets the dry leaf sink and open. The second water, left a minute or two, is the one that counts.
      </>
    ),
  },
  {
    vi: "Rót đều",
    gloss: "“Pour so every cup is equal.”",
    text: (
      <>
        Set the cups rim to rim and sweep the spout round them in a circle, so that no cup gets only the weak end of
        the pot. The classic way is to pour into the <span lang="vi">chén tống</span> first and share it among the{" "}
        <span lang="vi">chén quân</span> — slower, and often skipped now because the tea cools and the scent fades.
      </>
    ),
  },
  {
    vi: "Tam long giá ngọc",
    gloss: "“Three dragons carry the jade.”",
    text: (
      <>
        A cup is offered with the middle finger under its base and the forefinger and thumb at its rim. Giver and
        receiver both bow a little. It is the old name for a small act of respect.
      </>
    ),
  },
  {
    vi: "Xem, ngửi, phẩm",
    gloss: "“Look, smell, taste.”",
    text: (
      <>
        Bring the cup to your nose before your lips. Then, a hand held over the mouth, take a small sip and swallow
        slowly, letting the scent rise through the nose. Swallow once or twice more to feel what stays behind.
      </>
    ),
  },
  {
    vi: "Trà đầu xuân",
    gloss: "“The first tea of the year.”",
    text: (
      <>
        In old Hà Nội, on the morning of the first day of Tết the grandchildren gave an elder the first quiet moments of
        the year for flowers and tea. Only then did the whole family sit round the tea table to wish them long life and
        listen to what they had to say.
      </>
    ),
  },
];

export default function Manners() {
  return (
    <section className="section manners" id="manners" aria-labelledby="manners-title">
      <div className="shell">
        <div className="manners__head">
          <div>
            <p className="kicker">Lễ nghi · The manners of the pot</p>
            <h2 id="manners-title">Six rules of the pot</h2>
            <p className="lede dim">
              A <span className="vi" lang="vi">ấm trà</span> is shared, and shared pots need manners. In old Hà Nội the
              fuss of making tea, for yourself or for a guest, slowly hardened into{" "}
              <span className="vi" lang="vi">lễ nghi</span> — ritual — and it was learned by watching an elder pour.
            </p>
          </div>
          <Image className="head-art" src="/art/pour.svg" alt="" width={1000} height={570} aria-hidden="true" unoptimized />
        </div>

        <ul className="manners__list">
          {rules.map((r) => (
            <li key={r.vi}>
              <h3 lang="vi">
                {r.vi}
                <Speak text={r.vi} size="sm" />
              </h3>
              <span className="gloss">{r.gloss}</span>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>

        <p className="manners__sources">
          Drawn from{" "}
          <a href="https://kinhtedouong.vn/le-nghi-trong-van-hoa-tra-viet-90208.html" target="_blank" rel="noopener noreferrer">
            Kinh tế &amp; Đồ uống
          </a>
          ,{" "}
          <a href="https://haba.vn/van-hoa-uong-tra-cua-nguoi-viet/" target="_blank" rel="noopener noreferrer">
            Haba
          </a>{" "}
          and{" "}
          <a
            href="https://travinatea.com.vn/blogs/van-hoa-tra/su-tinh-te-trong-cach-thuong-tra-cua-nguoi-ha-noi-xua"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vinatea
          </a>
          . Customs differ from family to family and region to region.
        </p>
      </div>
    </section>
  );
}
