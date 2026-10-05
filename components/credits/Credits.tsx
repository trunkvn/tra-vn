import { photoCredits } from "@/components/leaves/credits";
import { teas } from "@/components/leaves/teas";
import "./credits.css";

export default function Credits() {
  return (
    <footer className="footer">
      <div className="frieze" role="presentation" />
      <div className="footer__inner">
        <div>
          <p className="footer__tag">Ấm Trà · Mời cả nhà</p>
          <p>
            The Vietnamese way of tea: seven teas, the old Hà Nội way of brewing them, and the manners of offering a cup.
          </p>
          <p className="footer__by">
            Designed &amp; built by <strong>Gnoud</strong> · © {new Date().getFullYear()}
          </p>
        </div>
        <div>
          {/* <p>
            <strong>Built with</strong> Next.js, React, TypeScript and Tailwind CSS. The animated drawings are plain
            SVG and CSS.
          </p> */}
          <p>
            <strong>Words</strong> drawn from Vietnamese tea articles by{" "}
            <a
              href="https://thuantrathainguyen.com/blogs/news/lich-su-tra-viet-nguon-goc-su-phat-trien"
              target="_blank"
              rel="noopener noreferrer"
            >
              Thuận Trà Thái Nguyên
            </a>
            ,{" "}
            <a href="https://haba.vn/van-hoa-uong-tra-cua-nguoi-viet/" target="_blank" rel="noopener noreferrer">
              Haba
            </a>
            ,{" "}
            <a
              href="https://kinhtedouong.vn/le-nghi-trong-van-hoa-tra-viet-90208.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kinh tế &amp; Đồ uống
            </a>{" "}
            and{" "}
            <a
              href="https://travinatea.com.vn/blogs/van-hoa-tra/su-tinh-te-trong-cach-thuong-tra-cua-nguoi-ha-noi-xua"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vinatea
            </a>
            .
          </p>
          <p>
            <strong>Music</strong> <span lang="vi">“’laxin”</span> (Lo Fi Background Music) by Kuromaru ft .hereafter, used under{" "}
            <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">
              CC&nbsp;BY&nbsp;3.0
            </a>{" "}
            via{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Kuromaru_ft_.hereafter_-_%E2%80%99laxin_(Lo_Fi_Background_Music).ogg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            . Converted to MP3 and level-matched.
          </p>
          {/* <p>
            <strong>Layout</strong> inspired by{" "}
            <a href="https://the-family-rice-tray.vercel.app/" target="_blank" rel="noopener noreferrer">
              Mâm Cơm — the Vietnamese family rice tray
            </a>
            .
          </p> */}
        </div>
      </div>

      <div className="credits">
        <div className="shell">
          <p className="credits__title">Photo credits</p>
          <p className="credits__intro">
            Tea photographs are from Wikimedia Commons, used under the licences their authors chose. Each tea&apos;s
            round cup and its large photograph:
          </p>
          <ul className="credits__list">
            {teas.flatMap((t) =>
              (["chip", "panel"] as const).map((kind) => {
                const c = photoCredits[`${t.id}-${kind}`];
                return (
                  <li key={`${t.id}-${kind}`}>
                    <span lang="vi">{t.vi}</span> ({kind === "chip" ? "cup" : "photo"}) —{" "}
                    <a href={c.page} target="_blank" rel="noopener noreferrer">
                      {c.file.replace(/\.\w+$/, "")}
                    </a>
                    , {c.author}, {c.license}
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
