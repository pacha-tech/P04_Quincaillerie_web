
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-app-surface text-app-text-primary">
        {children}
      </body>
    </html>
  );
}