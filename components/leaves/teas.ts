export type Tea = {
  id: string;
  photo: string;
  vi: string;
  en: string;
  tagline: string;
  note: string;
  facts: { label: string; value: string }[];
  liquor: string;
  alt: string;
};

export const teas: Tea[] = [
  {
    id: "xanh",
    photo: "xanh",
    vi: "Trà Xanh",
    en: "Green tea",
    tagline: "the one that bites, then sweetens",
    note: "The green tea the whole country calls chè Thái. Thái Nguyên had tea long before, but its fame dates from the 1920s: around 1922, local records say, Vũ Văn Hiệt (Đội Năm) brought a variety from Phú Thọ to Tân Cương and opened a roasting kiln. Feralit soil over shale, a midland climate and the Trung du hạt variety give a pan-roasted green tea with a first bite of astringency, then sweetness, and a scent of young rice (cốm).",
    facts: [
      { label: "Where", value: "Thái Nguyên — Tân Cương, Đại Từ, Phú Lương, Đồng Hỷ" },
      { label: "Tastes like", value: "Astringent first, then sweet (tiền chát hậu ngọt), with a scent of young rice" },
      { label: "Style", value: "Pan-roasted green tea (trà xanh sao suốt)" },
      { label: "Grown on", value: "Feralit soil over shale, in a midland climate" },
    ],
    liquor: "#b5c97a",
    alt: "Rolling green hills of tea terraces in Thái Nguyên, with pickers working between the rows.",
  },
  {
    id: "sen",
    photo: "sen-pot",
    vi: "Trà Sen",
    en: "Lotus-scented tea",
    tagline: "the one that takes a thousand flowers",
    note: "Hà Nội's tea makers scent a good tea by layering it with lotus stamens, then sieving, drying and scenting it again — two, three, even five times, each round deepening the perfume. A single kilo is said to take 1,000 to 1,200 blossoms; in the old days it traded for two or three chỉ of gold. Lotus, jasmine, ngâu and sói are the scents the old scented teas were made with.",
    facts: [
      { label: "Where", value: "Hà Nội" },
      { label: "Tastes like", value: "A gentle fragrance and a refined, light taste" },
      { label: "Made by", value: "Layers of leaf and lotus stamens, 18–24 hours each round" },
      { label: "Worth", value: "Once, a kilo for two or three chỉ of gold" },
    ],
    liquor: "#e6d5a8",
    alt: "A pink lotus resting inside a broken clay pot on a charred black table, petals scattered around it, with a small cup of amber tea and a dish of dried tea packed with lotus petals.",
  },
  {
    id: "nhai",
    photo: "nhai",
    vi: "Trà Nhài",
    en: "Jasmine tea",
    tagline: "the scent before the sip",
    note: "Jasmine — nhài, or lài — is one of the flowers Hà Nội's tea makers used to scent tea, along with lotus, ngâu and sói, a style that took shape under the Nguyễn. With green tea and lotus tea it is one of the teas Vietnamese people typically drink, prized for a light fragrance and a refined taste.",
    facts: [
      { label: "Where", value: "Hà Nội's scented-tea tradition, from the Nguyễn era" },
      { label: "Tastes like", value: "A light fragrance and a refined, gentle taste" },
      { label: "Scented with", value: "Jasmine blossom (nhài, or lài)" },
      { label: "Also in", value: "Ngũ hương tea, whose five flowers are cúc, sói, nhài, sen and ngâu" },
    ],
    liquor: "#ecdc8e",
    alt: "A single white jasmine blossom among glossy green leaves.",
  },
  {
    id: "shan",
    photo: "shan",
    vi: "Trà Shan Tuyết",
    en: "Ancient-tree tea",
    tagline: "the one from the clouds",
    note: "Picked from ancient wild trees — cổ thụ — that grow on the high mountains of the north, in Hà Giang up to 800–1,300 metres in mist all year. The trees stand six to ten metres tall and are hundreds of years old; several are recognised as Việt Nam Heritage Trees. Hà Nội's tea makers treated every bud as a treasure and chose this leaf as the base for their finest scented teas.",
    facts: [
      { label: "Where", value: "Hà Giang, Yên Bái, Sơn La and Điện Biên" },
      { label: "Grows", value: "Wild, in mist all year round" },
      { label: "Prized as", value: "The base for Hà Nội's finest scented teas" },
      { label: "Status", value: "Several trees are listed Việt Nam Heritage Trees" },
    ],
    liquor: "#d3dd9a",
    alt: "Terraced tea rows climbing a rounded hill in the northern mountains of Hà Giang.",
  },
  {
    id: "olong",
    photo: "olong",
    vi: "Trà Ô Long",
    en: "Oolong",
    tagline: "the one from the highlands",
    note: "A tea of the southern highlands. French planters set out tea at Cầu Đất and Bảo Lộc after the 1880s, and those estates kept making black tea well into the state-farm era (1954–1986); oolong came only near the end of it. Today it counts among the “thượng hạng” — premium — teas of Việt Nam, with trà đinh, shan cổ thụ, white tea and lotus tea, that are looking for a place of their own.",
    facts: [
      { label: "Where", value: "Bảo Lộc and Cầu Đất, in the highlands" },
      { label: "Began", value: "Near the end of the 1954–1986 state-farm era" },
      { label: "Estates", value: "French-era plantations that also made black tea" },
      { label: "Standing", value: "One of Việt Nam's premium teas, noted in international contests" },
    ],
    liquor: "#d79a45",
    alt: "A picker in a conical hat gathering tea leaves on a highland slope, terraced hills behind.",
  },
  {
    id: "den",
    photo: "den-bowl",
    vi: "Trà Đen",
    en: "Black tea",
    tagline: "the one made for the world",
    note: "Black tea is the tea Việt Nam makes to sell abroad. The French planted Phú Thọ for export from the 1880s, and the Phú Hộ research station, opened in 1918, brought in industrial ways of pruning, picking and processing black tea for Europe. After 1954 the state farms sent mostly black tea to the Soviet Union and Eastern Europe. Today Việt Nam is among the five to eight biggest tea exporters, though most of what it sells is black tea and raw green leaf, at low prices.",
    facts: [
      { label: "Where", value: "Phú Thọ first, then the highlands" },
      { label: "Began", value: "1880s, on French plantations" },
      { label: "Station", value: "Phú Hộ, opened in 1918" },
      { label: "Sold to", value: "Europe, then the Soviet Union and Eastern Europe" },
    ],
    liquor: "#a8472a",
    alt: "A dark clay cup of deep red-brown black tea on a walnut plate beside a heap of black leaf, with an old book and a glass pitcher on a weathered wooden table.",
  },
  {
    id: "man",
    photo: "man-smoke",
    vi: "Trà Mạn",
    en: "Upland leaf tea",
    tagline: "the one from the far uplands",
    note: "Trà mạn comes from the mạn ngược, the far uplands. Its finest grade, mạn hảo, is made from ancient Shan tuyết trees growing in Hà Giang at 800–1,300 metres in mist, and Hà Nội's tea makers prized it for scenting. Old hands aged it for three or four years in jars under a layer of dry banana leaf, until the roughness softened and the leaf turned airy as handmade paper — and it was the base on which lotus tea was scented.",
    facts: [
      { label: "Where", value: "The northern uplands (mạn ngược), above all Hà Giang" },
      { label: "Tastes like", value: "Astringent when young, mellowing with age" },
      { label: "Brewed", value: "The second water, left one to two minutes, is the best cup" },
      { label: "Kept in", value: "Jars, under dry banana leaf, for three or four years" },
    ],
    liquor: "#8c9a3c",
    alt: "A small white cup of amber tea in warm light beside a rough earthen jar of dark twisted leaves and a second jar holding a dried lotus pod, smoke curling in the dark behind.",
  },
];
