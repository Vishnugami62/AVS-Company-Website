import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "AVS Company — Corporate Supplies for Mumbai's Workplaces",
    template: "%s · AVS Company",
  },
  description:
    "Stationery, housekeeping, pantry, corporate gifting, printing and facility supplies for Mumbai's offices — one supplier, one account, itemised quotes within 24 hours.",
  keywords: [
    "office supplies Mumbai",
    "corporate stationery",
    "pantry supplies",
    "housekeeping supplies",
    "corporate gifting",
    "bulk office supplies",
  ],
  openGraph: {
    title: "AVS Company — Your Office, Fully Supplied",
    description: "Better Supplies for a Smoother Tomorrow.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
