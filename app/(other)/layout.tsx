import Navbar from './Navbar';
import "../globals.css";
import { PayloadProvider } from '../lib/PayloadContext';
import { extractPayLoad } from '../lib/session';

export default async function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  const payload = await extractPayLoad();

  return (
    <html lang="en">
      <body>
        <PayloadProvider payload={payload}>
		    <Navbar/>
          {modal}
          {children}
        </PayloadProvider>
      </body>
    </html>
  );
}
