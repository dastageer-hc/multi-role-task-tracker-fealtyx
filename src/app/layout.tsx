import "./globals.css";
import type { Metadata } from "next";
import LocalFont from "next/font/local";

const KumbhSans = LocalFont({
  src: "../assets//fonts/KumbhSans.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FealtyX Task Tracker",
  description: "Task/Bug Tracker for FealtyX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='../assets/favicon.ico' />

      </head>
      <body className={KumbhSans.className}>{children}</body>
    </html>
  );
}
