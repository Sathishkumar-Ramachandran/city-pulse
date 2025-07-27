import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/sidebar';
import AppHeader from '@/components/layout/header';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
