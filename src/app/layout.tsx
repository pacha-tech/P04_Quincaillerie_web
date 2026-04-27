
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../hooks/AuthContext';
import { LocationProvider } from '../hooks/LocationContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <AuthProvider>
        <html lang="fr">
          <body className="antialiased bg-app-surface text-app-text-primary">
            {children}
            <Toaster position="bottom-right" reverseOrder={false} />
          </body>
        </html>
      </AuthProvider>
    </LocationProvider>
  );
}