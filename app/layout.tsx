import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./onboarding.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Finasaan - Asaan Finance for Everyone",
    template: "%s | Finasaan",
  },
  description:
    "Start becoming financially independent with Finasaan. Join us today and start your path for financial freedom.",
  keywords: [
    "financial literacy",
    "financial education",
    "personal finance",
    "investing basics",
    "money management",
    "financial skills",
    "financial planning",
    "finance learning",
    "economic education",
  ],
  authors: [{ name: "Finasaan Team" }],
  creator: "Finasaan",
  publisher: "Finasaan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://finasaan.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finasaan.com", // Replace with your actual domain
    siteName: "Finasaan",
    title: "Finasaan - Asaan Finance for Everyone",
    description:
      "Start becoming financially independent with Finasaan. Join us today and start your path for financial freedom.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    //google: "your-google-verification-code", // Replace with your actual Google verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  // Instagram and other social media will use the Open Graph tags above
  other: {
    "instagram:site": "@finasaan", // Replace with your actual Instagram handle
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
