import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeColors } from "@/components/ThemeColors";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TalentFlow - Learning Management System",
  description: "Professional learning and development platform",
};

export default function RootLayout({ children }) {
  // Replace this string with your actual Client ID from Google Cloud Console
  // const GOOGLE_CLIENT_ID = "830459513315-6b5321i2vs1a3vj4uahhc2qrsm47pics.apps.googleusercontent.com";
  const GOOGLE_CLIENT_ID =
    "673257819625-88m4rr41v05cnj77gnlib8t9kpliql72.apps.googleusercontent.com";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} appBody h-full antialiased`}
      >
        <Providers>
          <main
            style={{ backgroundColor: ThemeColors.bgBlue }}
            className="min-h-screen"
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
