import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeColors } from "@/components/ThemeColors";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'TalentFlow - Learning Management System',
  description: 'Professional learning and development platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} appBody h-full antialiased`}>
        <main style={{backgroundColor: ThemeColors.bgBlue}} className="">
          {children}
        </main>
      </body>
    </html>
  );
}
