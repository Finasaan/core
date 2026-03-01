import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./chat.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinasaanGPT | AI Financial Intelligence",
  description:
    "Ask about PSX stocks, mutual funds, and insurance with AI-powered analysis.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={ibmPlexMono.variable} style={{ height: "100dvh" }}>
      {children}
    </div>
  );
}
