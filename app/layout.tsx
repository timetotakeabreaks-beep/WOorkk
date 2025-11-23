import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SixtyScan",
  description: "ตรวจเช็คโรคพาร์กินสันด้วยเสียงพูดของคุณ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        {/* SessionProvider wrapping the whole app */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
