import { DM_Sans } from "next/font/google";
import "./globals.css";

const font = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });

export const metadata = {
  title: "WebVision – Full Stack Development, AI Integration & Website Transformation",
  description:
    "Full stack, frontend and backend development, website maintenance, and modern website transformation with AI integration and automation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
