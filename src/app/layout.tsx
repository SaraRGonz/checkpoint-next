import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap' 
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['600', '700'], 
  variable: '--font-rajdhani', 
  display: 'swap' 
});

export const metadata: Metadata = {
  metadataBase: new URL("https://checkpoint-next-navy.vercel.app"),
  title: {
    default: "Checkpoint | Your video game library",
    template: "%s | Checkpoint", 
  },
  description: "Manage your collection, discover new titles, and organize your video game backlog.",
  keywords: ["gaming", "backlog", "video games", "collection tracker", "RAWG"],
  openGraph: {
    title: "Checkpoint",
    description: "Your ultimate video game backlog tracker.",
    url: "https://checkpoint-next-navy.vercel.app", 
    siteName: "Checkpoint",
    images: [
      {
        url: "/checkpointlogo.svg", 
        width: 1200,
        height: 630,
        alt: "Checkpoint Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkpoint",
    description: "Your ultimate video game tracker.",
    images: ["/checkpointlogo.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${rajdhani.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-text">
        <Providers>

          <Navbar />
          
          <main className="grow container mx-auto px-4 py-8">
            {children}
          </main>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}