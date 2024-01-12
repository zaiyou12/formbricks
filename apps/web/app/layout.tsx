import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | BsideKorea",
    default: "BsideKorea",
  },
  description:
    "비사이드는 주주자본주의에 기반하여 국내 자본시장을 개선하기 위해 태어난 최초의 주주행동주의 플랫폼입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      {process.env.VERCEL === "1" && <SpeedInsights sampleRate={0.1} />}
      <body className="flex h-full flex-col">{children}</body>
    </html>
  );
}
