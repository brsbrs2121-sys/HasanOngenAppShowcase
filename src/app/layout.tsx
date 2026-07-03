import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { FirebaseProvider } from "@/lib/firebase/FirebaseProvider";
import BodyClassHandler from "./login-body-handler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Hasan Öngen",
  description: "Berber Randevu ve Program Yönetim Sistemi",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-light.png",
    apple: "/logo-dark.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className="dark bg-background"
      style={{ colorScheme: "dark", backgroundColor: "black" }}
    >
      <body
        className={cn(
          "safe-area font-body bg-background text-white antialiased min-h-[100svh]",
          inter.variable,
          playfairDisplay.variable
        )}
      >
        {/* NOTCH */}
        <div className="safe-top" />

        <BodyClassHandler />
        <FirebaseProvider>{children}</FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
