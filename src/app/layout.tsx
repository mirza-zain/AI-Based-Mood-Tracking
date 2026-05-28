import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AI Mood Tracker",
  description: "Track your mood and journal with AI-assisted insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
