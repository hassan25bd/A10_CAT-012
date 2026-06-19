import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../lib/AuthContext';
import QueryProvider from '../components/QueryProvider';
import LoadingScreen from '../components/LoadingScreen';

export const metadata = {
  title: 'Fable – Discover & Read Original Ebooks',
  description: 'Fable connects ebook lovers with talented writers. Browse, discover, and read original ebooks.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>
            <LoadingScreen />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1a1830',
                  color: '#e8e8f0',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '12px',
                },
                success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
