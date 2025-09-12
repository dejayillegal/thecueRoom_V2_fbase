
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Newspaper,
  LayoutDashboard,
  MessageSquare,
  Music,
  MapPin,
  Sparkles,
  Users,
  Settings,
  Shield,
} from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                isActive={true}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Feed">
                <MessageSquare />
                Feed
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Creative Tab">
                <Sparkles />
                Creative
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Playlists">
                    <Music />
                    Playlists
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="Gig Radar">
                    <MapPin />
                    Gig Radar
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="News">
                <Newspaper />
                News
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className='mt-auto'>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Admin">
                <Shield />
                Admin
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='p-2'>
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>DJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">dejayillegal</span>
                    <span className="text-xs text-muted-foreground">dejayillegal@gmail.com</span>
                </div>
            </div>
        </SidebarFooter>

      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b p-2">
            <SidebarTrigger />
            {/* Header Content */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
