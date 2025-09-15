import { Inter, Work_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-aspekta",
});

export const metadata = {
  title: "Estimax - Materials Estimation Made Easy with AI",
  description: "AI-powered material estimation platform for construction professionals. Get accurate estimates in minutes, not hours. Try Estimax today!",
  keywords: "material estimation, construction estimating, AI estimation, project costing, construction management",
  authors: [{ name: "Estimax Team" }],
  creator: "Estimax",
  publisher: "Estimax",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://estimax.ai",
    title: "Estimax - Materials Estimation Made Easy with AI",
    description: "AI-powered material estimation platform for construction professionals. Get accurate estimates in minutes, not hours.",
    siteName: "Estimax",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estimax - Materials Estimation Made Easy with AI",
    description: "AI-powered material estimation platform for construction professionals. Get accurate estimates in minutes, not hours.",
    creator: "@estimax",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${workSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
