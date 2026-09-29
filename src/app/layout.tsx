import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { SavedDealsProvider } from '@/context/SavedDealsContext';

export const metadata: Metadata = {
  title: "Olato — Discover What's Worth It Around You",
  description:
    'Discover verified local discounts from nearby cafés, restaurants, and selected places. Search by bank card, student status, and real-time proximity.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F6] text-[#15151A] antialiased selection:bg-[#5B5CE2] selection:text-white">
        <AuthProvider>
          <LocationProvider>
            <SavedDealsProvider>
              <CustomCursor />
              {children}
            </SavedDealsProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
