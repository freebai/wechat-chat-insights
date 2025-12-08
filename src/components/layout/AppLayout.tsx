import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-60 transition-all duration-300 min-h-screen">
        <div className="bg-gradient-to-b from-primary/[0.02] to-transparent min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
