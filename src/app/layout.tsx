import type { Metadata } from 'next';
import './globals.css';
import { LocationProvider } from '@/context/LocationContext';
import { SavedDealsProvider } from '@/context/SavedDealsContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Olato — Discover what’s worth it around you',
  description: 'Olato is a modern local discount discovery platform for cafés, restaurants, and featured places.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#F7F7FA] text-[#15151A] antialiased">
        <AuthProvider>
          <LocationProvider>
            <SavedDealsProvider>
              {children}
            </SavedDealsProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
