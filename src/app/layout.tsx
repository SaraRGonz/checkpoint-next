import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// configuración de fuentes optimizadas sin layout shift
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

// Metadatos base 
export const metadata: Metadata = {
  title: "Checkpoint | Your video game library",
  description: "Manage your collection, discover new titles, and organize your video game backlog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning para el dark mode toggle
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