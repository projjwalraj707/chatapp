import Navbar from './Navbar.tsx';
import "../globals.css";

export default function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
		    <Navbar/>
        {modal}
        {children}
      </body>
    </html>
  );
}
