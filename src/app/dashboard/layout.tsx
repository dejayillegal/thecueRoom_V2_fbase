'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Newspaper,
  LayoutDashboard,
  Smile,
  Music,
  CalendarDays,
  Settings,
  Image,
  Search,
  LogOut,
  Sparkles,
  Shield,
  UserPlus,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

// In a real app, you would get this from your auth provider
const isAdmin = true;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen w-full bg-background">
      <SidebarProvider>
          <Sidebar>
            <SidebarRail />
            <SidebarContent>
              <SidebarHeader>
                 <Link href="/dashboard" className="flex items-center gap-2 group">
                  <Logo className="h-9 w-auto text-foreground transition-transform duration-300 ease-in-out group-hover:scale-110" />
                  <span className="font-normal tracking-tight group-data-[collapsible=icon]:hidden transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5">
                    thecueRoom
                  </span>
                </Link>
                <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
              </SidebarHeader>
              <SidebarMenu>
                 <div className="relative w-full p-2">
                  <SidebarMenuButton asChild variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">Search...</span>
                      </div>
                  </SidebarMenuButton>
                </div>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/dashboard'}
                    tooltip="Dashboard"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard />
                      <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/cover-art'} tooltip="Cover Art">
                    <Link href="/dashboard/cover-art">
                      <Image />
                      <span className="group-data-[collapsible=icon]:hidden">Cover Art</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/memes'} tooltip="Memes">
                    <Link href="/dashboard/memes">
                      <Smile />
                      <span className="group-data-[collapsible=icon]:hidden">Memes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/dashboard/news'} tooltip="News">
                    <Link href="/dashboard/news">
                      <Newspaper />
                      <span className="group-data-[collapsible=icon]:hidden">News</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/gigs'} tooltip="Gigs">
                      <Link href="/gigs">
                        <CalendarDays />
                        <span className="group-data-[collapsible=icon]:hidden">Gigs</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/genres'} tooltip="Genres">
                      <Link href="/dashboard/genres">
                        <Music />
                        <span className="group-data-[collapsible=icon]:hidden">Genres</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarMenu className="mt-auto">
                {isAdmin && (
                   <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/admin'} tooltip="Admin">
                      <Link href="/admin">
                        <Shield />
                        <span className="group-data-[collapsible=icon]:hidden">Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
                    <Link href="/settings">
                      <Settings />
                      <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.5),transparent)]">
            <div className="relative z-10 flex min-h-screen flex-col">
              <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-lg lg:px-6">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                     <Button variant="outline" size="sm">
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Tools
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>DJ</AvatarFallback>
                    </Avatar>
                     <Button variant="default" size="sm" asChild>
                      <Link href="/">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Link>
                    </Button>
                  </div>
              </header>
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  {children}
              </main>
              <footer className="p-4 md:p-6 lg:p-8 text-xs text-muted-foreground border-t">
                <div className="container mx-auto text-center space-y-2">
                  <p>Content aggregated from trusted electronic music sources  • Data from Resident Advisor, Mixmag, Beatport, and more • Updated hourly • Links direct to original sources</p>
                  <p>TheCueRoom aggregates content under fair use. All rights remain with original publishers.</p>
                </div>
              </footer>
            </div>
          </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
