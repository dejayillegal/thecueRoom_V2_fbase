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
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
                asChild
                isActive={pathname === '/dashboard'}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/cover-art'} tooltip="Cover Art">
                <Link href="/dashboard/cover-art">
                  <Image />
                  Cover Art
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/memes'} tooltip="Memes">
                <Link href="/dashboard/memes">
                  <Smile />
                  Memes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/dashboard/news'} tooltip="News">
                <Link href="/dashboard/news">
                  <Newspaper />
                  News
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/gigs'} tooltip="Gigs">
                  <Link href="/dashboard/gigs">
                    <CalendarDays />
                    Gigs
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/genres'} tooltip="Genres">
                  <Link href="/dashboard/genres">
                    <Music />
                    Genres
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className='mt-auto'>
            {isAdmin && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/admin'} tooltip="Admin">
                  <Link href="/admin">
                    <Shield />
                    Admin
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/settings'} tooltip="Settings">
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
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
               <Button variant="default" size="sm" asChild>
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
        <footer className="p-4 md:p-6 lg:p-8 text-xs text-muted-foreground border-t">
          <div className="container mx-auto text-center space-y-2">
            <p>Content aggregated from trusted electronic music sources  • Data from Resident Advisor, Mixmag, Beatport, and more • Updated hourly • Links direct to original sources</p>
            <p>TheCueRoom aggregates content under fair use. All rights remain with original publishers.</p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
