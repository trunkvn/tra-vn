import Image from "next/image";
import { photoCredits } from "@/components/leaves/credits";
import "./brew.css";

const tools: { label: string; text: React.ReactNode }[] = [
  {
    label: "Pot",
    text: "a small clay pot — traditionally red clay — just big enough for a single round of tea",
  },
  { label: "Tea", text: "dry leaf, filling about a third of the pot" },
  {
    label: "Spoon",
    text: "a wooden spoon to scoop the leaf, and a bamboo or fragrant-wood tool to lift the used leaf out",
  },
  { label: "Water", text: "boiling, poured in a fine stream; spring water is best, then river, then well" },
  {
    label: "Pitcher",
    text: (
      <>
        a sharing pitcher — <span lang="vi">chén tống</span>, also called <span lang="vi">chén tướng</span>
      </>
    ),
  },
  {
    label: "Cups",
    text: (
      <>
        little cups — <span lang="vi">chén quân</span>
      </>
    ),
  },
  { label: "Fire", text: "charcoal; old tea lovers kept two copper kettles on the stove, taking turns at the boil" },
];

export default function Brew() {
  const credit = photoCredits["xanh-chip"];

  return (
    <section className="section brew" id="brew" aria-labelledby="brew-title">
      <div className="shell">
        <div className="brew__head">
          <div>
            <p className="kicker">Pha trà · The old way</p>
            <h2 id="brew-title" lang="vi">
              Pha Trà Kiểu Hà Nội
            </h2>
            <p className="brew__sub">Brewing in the traditional way · from boiling water to the first cup</p>
            <p className="brew__pick">
              Good tea you do not know how to brew is a wasted pot. Trường Xuân, the owner of Hiên Trà, says a good pot
              takes only seven minutes to make — and a lifetime if you never learn how.
            </p>
            <p className="brew__intro">
              <span lang="vi">Lục Vũ</span>, the Tang-dynasty master honoured as the saint of tea for his{" "}
              <i>Trà Kinh</i>, called fire the “tea master” and water the “tea friend”. Tea wants the right fire and the
              right water — and, like a person, a good teacher and good friends.
            </p>
          </div>
          <figure style={{ margin: 0 }}>
            <div className="brew__photo">
              <Image
                src="/photos/brew-cup.jpg"
                alt="A small dark clay cup with a Greek-key pattern in orange, holding clear yellow-green tea."
                width={1200}
                height={900}
                sizes="(min-width: 840px) 480px, 100vw"
                quality={65}
              />
            </div>
            <figcaption className="brew__credit">
              Trà xanh Thái Nguyên ·{" "}
              <a href={credit.page} target="_blank" rel="noopener noreferrer">
                {credit.author}
              </a>{" "}
              · {credit.license}
            </figcaption>
          </figure>
        </div>

        <div className="brew__grid">
          <div className="brew__col">
            <h3 id="ing-title">Tools &amp; water</h3>

            <ul className="ingredients" aria-labelledby="ing-title">
              {tools.map((t) => (
                <li key={t.label}>
                  <span className="qty">{t.label}</span>
                  <span>{t.text}</span>
                </li>
              ))}
            </ul>

            <dl className="brew__meta">
              <div>
                <dt>Tea in the pot</dt>
                <dd>about a third</dd>
              </div>
              <div>
                <dt>Water</dt>
                <dd>boiling</dd>
              </div>
              <div>
                <dt>Second water</dt>
                <dd>1–2 minutes</dd>
              </div>
              <div>
                <dt>Style</dt>
                <dd>Hà Nội</dd>
              </div>
            </dl>
          </div>

          <div className="brew__col">
            <h4 id="method-title">Method</h4>
            <ol className="steps" aria-labelledby="method-title">
              <li>
                <p>
                  <strong>Warm the pot and the cups.</strong> Pour boiling water over both. It keeps the water inside
                  the pot as hot as it can be for the whole brew.
                </p>
              </li>
              <li>
                <p>
                  <strong>Add the tea.</strong> Scoop the dry leaf into the small clay pot with a wooden spoon — the old
                  name for the gesture is <span lang="vi">Ngọc diệp hồi cung</span> — until it fills about a third of
                  the pot.
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    First water: <span lang="vi">Cao sơn trường thủy</span>.
                  </strong>{" "}
                  Pour a little boiling water down from a height, then strain it off at once and throw it away. It
                  washes the dust from the leaf and lets the dry leaf sink instead of floating.
                </p>
              </li>
              <li>
                <p>
                  <strong>
                    Second water: <span lang="vi">Hạ sơn nhập thủy</span>.
                  </strong>{" "}
                  Pour from high again, right up until the water spills over the rim. Put the lid on so the foam runs
                  off, then pour boiling water over the lid to keep the pot at its hottest.
                </p>
              </li>
              <li>
                <p>
                  <strong>Wait.</strong> The second water is the best cup of the pot. Leave it 60 to 90 seconds — some
                  writers say up to two minutes.
                </p>
              </li>
              <li>
                <p>
                  <strong>Pour evenly.</strong> Set the cups rim to rim and sweep the spout round them in a circle, so
                  every cup has the same strength. The classic way is to pour into the <span lang="vi">chén tống</span>{" "}
                  first and share it among the <span lang="vi">chén quân</span> — slower, and less used now because the
                  tea cools and the scent fades.
                </p>
              </li>
              <li>
                <p>
                  <strong>Offer the cup.</strong> Hold it with the middle finger under the base and the forefinger and
                  thumb at the rim — <span lang="vi">Tam long giá ngọc</span> — and bow a little as you hand it over.
                </p>
              </li>
            </ol>

            <p className="aside-note">
              <b>On the water.</b> The Song emperor Huy Tông ranked it: mountain spring first, river second, well third.
              Hà Nội lies downriver, far from any spring, so its tea lovers brewed with well water, or with rain caught
              in a big stoneware basin set out on a brick yard once the first ten minutes of rain had washed the dust
              from the air. The writer Nguyễn Tuân went further and gathered the dew from lotus leaves at dawn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
