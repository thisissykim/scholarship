import "./globals.css";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/app-providers";

export const metadata = {
  title: "SKKU Scholarship Mate",
  description: "성균관대 맞춤 장학금 매칭 서비스"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
