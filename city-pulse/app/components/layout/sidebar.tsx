'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { NAV_ITEMS } from '@/lib/constants';
import { ChevronsLeft, Mountain } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 p-4">
          <Mountain className="w-8 h-8 text-sidebar-primary" />
          <h1 className="text-xl font-bold font-headline text-sidebar-foreground group-data-[collapsible=icon]:hidden">CityPulse</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{children: item.label, side: "right", align: "center"}}
              >
                <a href={item.href}>
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button
            variant="ghost"
            className="w-full justify-start gap-3 p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2"
            onClick={toggleSidebar}
          >
            <ChevronsLeft />
            <span className={cn('duration-200 group-data-[collapsible=icon]:hidden')}>
              {state === 'expanded' ? 'Collapse' : null}
            </span>
          </Button>
      </SidebarFooter>
    </>
  );
}
