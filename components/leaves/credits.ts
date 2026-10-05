export type PhotoCredit = { file: string; author: string; license: string; licenseUrl?: string; page: string };

// Photos are from Wikimedia Commons; each entry is what its file page lists for author and licence.
export const photoCredits: Record<string, PhotoCredit> = {
  "xanh-chip": { file: "Tr\u00e0 xanh Th\u00e1i Nguy\u00ean \u0111\u1ea7u n\u0103m, ng1th1n2022 (chung tr\u00e0) (3).jpg", author: "Phương Huy", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Tr%C3%A0_xanh_Th%C3%A1i_Nguy%C3%AAn_%C4%91%E1%BA%A7u_n%C4%83m,_ng1th1n2022_(chung_tr%C3%A0)_(3).jpg" },
  "xanh-panel": { file: "Tea hill in Thai Nguyen.jpg", author: "Bacthai20", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Tea_hill_in_Thai_Nguyen.jpg" },
  "sen-chip": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/ef/13/1c/ef131cf595e18b2fdd0296144d307170.jpg" },
  "sen-panel": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/ef/13/1c/ef131cf595e18b2fdd0296144d307170.jpg" },
  "nhai-chip": { file: "Dried jasmine tea.jpg", author: "Fumikas Sagisavas", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", page: "https://commons.wikimedia.org/wiki/File:Dried_jasmine_tea.jpg" },
  "nhai-panel": { file: "Jasminum sambac flower.jpg", author: "SJasminum", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Jasminum_sambac_flower.jpg" },
  "shan-chip": { file: "Che Shan tuyet.JPG", author: "VuThiAnh", license: "Public domain", licenseUrl: undefined, page: "https://commons.wikimedia.org/wiki/File:Che_Shan_tuyet.JPG" },
  "shan-panel": { file: "Ha Giang theiers.jpg", author: "Velvet", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Ha_Giang_theiers.jpg" },
  "olong-chip": { file: "Oolong Tea wrapped tea balls.jpg", author: "Usernet123u", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", page: "https://commons.wikimedia.org/wiki/File:Oolong_Tea_wrapped_tea_balls.jpg" },
  "olong-panel": { file: "Thu ho\u1ea1ch ch\u00e8 \u1edf Vi\u1ec7t Nam (24759432147).jpg", author: "Vinnie Cartabiano", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", page: "https://commons.wikimedia.org/wiki/File:Thu_ho%E1%BA%A1ch_ch%C3%A8_%E1%BB%9F_Vi%E1%BB%87t_Nam_(24759432147).jpg" },
  "den-chip": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/ff/71/00/ff71009c5b542211113b9ae16026ce90.jpg" },
  "den-panel": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/ff/71/00/ff71009c5b542211113b9ae16026ce90.jpg" },
  "man-chip": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/39/9f/4a/399f4a01441caaeaef5f0962c446844e.jpg" },
  "man-panel": { file: "Image from Pinterest", author: "Pinterest (author unknown)", license: "licence not verified", licenseUrl: undefined, page: "https://i.pinimg.com/1200x/39/9f/4a/399f4a01441caaeaef5f0962c446844e.jpg" },
};
