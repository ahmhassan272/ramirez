import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ramirez Éttermek Siófok",
  description: "Experience classical elegance at Ramirez Restaurants in Siófok. Enjoy international cuisine, traditional Hungarian dishes, Gyros specialties, and oven-baked pizzas.",
  keywords: ['restaurant Siófok', 'Lake Balaton dining', 'Hungarian food', 'Ramirez Premium', 'pizza Siófok'],
  openGraph: {
    title: 'Ramirez Éttermek Siófok',
    description: 'Experience classical elegance at Ramirez Restaurants in Siófok. Enjoy international cuisine, traditional Hungarian dishes, Gyros specialties, and oven-baked pizzas.',
    url: 'https://ramirezrestaurant.hu',
    siteName: 'Ramirez Éttermek',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
