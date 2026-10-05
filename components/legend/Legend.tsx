import Image from "next/image";
import "./legend.css";

const sources = [
  { href: "https://thuantrathainguyen.com/blogs/news/lich-su-tra-viet-nguon-goc-su-phat-trien", label: "Thuận Trà Thái Nguyên" },
  { href: "https://haba.vn/van-hoa-uong-tra-cua-nguoi-viet/", label: "Haba" },
  { href: "https://kinhtedouong.vn/le-nghi-trong-van-hoa-tra-viet-90208.html", label: "Kinh tế & Đồ uống" },
  {
    href: "https://travinatea.com.vn/blogs/van-hoa-tra/su-tinh-te-trong-cach-thuong-tra-cua-nguoi-ha-noi-xua",
    label: "Vinatea",
  },
];

export default function Legend() {
  return (
    <section className="section legend" id="legend" aria-labelledby="legend-title">
      <div className="legend__seal" aria-hidden="true" />
      <div className="shell">
        <div className="legend__grid">
          <div>
            <p className="kicker">Nguồn gốc · Origins</p>
            <h2 id="legend-title" lang="vi">
              Từ Rừng Chè
              <br />
              Đến Chén Trà
            </h2>
            <p className="legend__sub">“From the wild tea forest to the cup”</p>
            <p>
              A tea history has two layers. The first is legend: the divine farmer{" "}
              <span lang="vi">Thần Nông</span> tasting a leaf that had fallen into his boiling water, and the Hùng kings
              teaching the people to grow tea. It tells you what tea means to a people.
            </p>
            <p>
              The second is evidence — living ancient trees, botany, chronicles, plantation ledgers — and it says where
              tea came from and when. Wild <span lang="vi">Shan</span> tea trees still stand in the northern mountains,
              and botanists place Việt Nam inside the tea plant&apos;s birthplace, a belt running from Yunnan through
              northern Việt Nam and Myanmar to Assam. The leaf grew here before anyone planted it; much of the ceremony
              of dried tea came later, with exchange with China.
            </p>
            <blockquote>
              The story of Vietnamese tea is a circle: from wild forest to plantation and farm, and back to families who
              know the name of their tree and their hill.
            </blockquote>
          </div>

          <ol className="timeline">
            <li>
              <h3>Thousands of years ago · The wild forest</h3>
              <p>
                Shan tea grows by itself on the high mountains of the north. Living groves remain at Suối Giàng (Yên
                Bái), Cao Bồ and Tây Côn Lĩnh (Hà Giang), Tà Xùa (Sơn La): trees six to ten metres tall, hundreds of
                years old, several of them recognised as Việt Nam Heritage Trees.
              </p>
            </li>
            <li>
              <h3>Long before records · Fresh tea</h3>
              <p>
                Before dried tea, people picked the mature leaf, crumpled it and steeped or boiled it — a habit still
                alive in the northern countryside. It is why Vietnamese has its own word, <span lang="vi">chè</span>,
                beside the Sino-Vietnamese <span lang="vi">trà</span>. It left almost no trace in the chronicles, but it
                is the oldest layer of all.
              </p>
            </li>
            <li>
              <h3>11th–14th century · Lý and Trần</h3>
              <p>
                Tea becomes tied to Zen Buddhism and the nobility. It appears in Zen poetry and in rites, and records
                mention tea offered at court and in the monasteries.
              </p>
            </li>
            <li>
              <h3>18th century · Lê Quý Đôn</h3>
              <p>
                <i>Vân Đài Loại Ngữ</i> sets down the kinds of tea, where they grow and how they are used, in one of the
                earliest systematic accounts in Chinese characters. Under the Nguyễn, tea is an offering and a court
                drink, and Hà Nội develops its own style: <span lang="vi">trà mạn</span>, and teas scented with lotus,
                jasmine and other flowers.
              </p>
            </li>
            <li>
              <h3>1880s–1922 · Plantations, then Thái Nguyên</h3>
              <p>
                French plantations appear from about the 1880s, and in 1918 the Phú Hộ research station opens — ancestor
                of today&apos;s tea institute. Around 1922, local records say, Vũ Văn Hiệt brought a variety from Phú Thọ
                to Tân Cương, opened a roasting kiln and made a name. The result is the green tea the whole country
                calls <span lang="vi">chè Thái</span>: a first bite of astringency, then sweetness, with a scent of young
                rice.
              </p>
            </li>
            <li data-now>
              <h3>Tonight</h3>
              <p>
                Since 1986 the tea gardens are back in family hands, and Việt Nam is among the world&apos;s five to eight
                largest tea exporters. At home it is still a small pot, <span lang="vi">ấm</span>; a sharing pitcher,{" "}
                <span lang="vi">chén tống</span>; little cups, <span lang="vi">chén quân</span> — and a hot cup is the
                first thing offered to the guest.
              </p>
            </li>
          </ol>
        </div>

        <p className="legend__sources">
          Drawn from{" "}
          {sources.map((s, i) => (
            <span key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
              {i < sources.length - 2 ? ", " : i === sources.length - 2 ? " and " : ""}
            </span>
          ))}
          . These are tea merchants&apos; and trade-press articles, not academic histories; dates before the 20th century
          are approximate.
        </p>
      </div>

      <figure className="legend__scene">
        <Image
          src="/art/legend-scene.svg"
          alt="Gold line drawing: a tea branch on the left, three leaves drifting down in a dotted arc into a steaming cauldron of water over a fire."
          width={1200}
          height={484}
          unoptimized
        />
        <figcaption>
          <span lang="vi">Một lá trà rơi vào nồi nước sôi.</span>
          <span className="dim">A leaf of tea falls into the boiling water — as the legend tells it.</span>
        </figcaption>
      </figure>
    </section>
  );
}
