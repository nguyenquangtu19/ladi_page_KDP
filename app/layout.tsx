import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOOK FLOW AI — Kiếm $100-300/Tháng Từ Amazon KDP Bằng AI Agent",
  description: "Hệ thống 4 bước xuất bản sách Amazon KDP tự động bằng AI Agent. Không cần vốn, không cần biết viết. Kiếm $100-300/tháng passive income trong 60 ngày.",
  keywords: "amazon kdp, kiếm tiền online, passive income, AI agent, sách kindle, thu nhập thụ động",
  openGraph: {
    title: "BOOK FLOW AI — Kiếm $100-300/Tháng Từ Amazon KDP",
    description: "Không cần vốn. Không cần biết viết. AI viết sách hộ anh/chị.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${rubik.variable} ${nunitoSans.variable}`}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
