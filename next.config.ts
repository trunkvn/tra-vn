import type { NextConfig } from "next";

const longCache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];

const nextConfig: NextConfig = {
  images: { qualities: [65, 75] },
  // Files in public/ are otherwise served with max-age=0, so every visit revalidated every drawing, photo and song.
  async headers() {
    return [
      ...["/art/:path*", "/photos/:path*", "/audio/:path*"].map((source) => ({ source, headers: longCache })),
      // fonts never change under the same file name
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
