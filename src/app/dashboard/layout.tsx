
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
  Shield,
  Image,
  Search,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2">
                <Logo className="h-8 w-auto text-foreground" />
                <span className="font-headline text-xl font-bold tracking-tight">
                thecueRoom
                </span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard"
                isActive={pathname === '/dashboard'}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Cover Art">
                <Image />
                Cover Art
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Memes">
                <Smile />
                Memes
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard/news" isActive={pathname === '/dashboard/news'} tooltip="News">
                <Newspaper />
                News
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Gigs">
                    <CalendarDays />
                    Gigs
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Genres">
                    <Music />
                    Genres
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className='mt-auto'>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <div className="w-full text-center text-xs text-muted-foreground bg-muted p-2 rounded-md">
                Invite-only access active
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search artists, tracks, labels" className="pl-9" />
            </div>
            <div className="flex items-center gap-4">
               <Button variant="outline" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Tools
              </Button>
              <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>DJ</AvatarFallback>
              </Avatar>
               <Button variant="primary" size="sm" asChild>
                <Link href="/">
                  Sign out
                  <LogOut className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
