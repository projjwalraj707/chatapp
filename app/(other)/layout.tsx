import type { Metadata } from "next";
import Navbar from './Navbar.tsx';
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
		    <Navbar/>
        {children}
      </body>
    </html>
  );
}
