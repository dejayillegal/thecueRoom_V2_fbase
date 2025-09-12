
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
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from "@/lib/firebase-client";
import { signOut, onAuthStateChanged, User } from 'firebase/auth';


function LogoutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
            console.error("Error getting user claims", error);
            setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sidebarContent = (
    <>
      <SidebarHeader>
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <Logo className="h-9 w-auto text-foreground transition-transform duration-300 ease-in-out group-hover:scale-110" />
          <span className="font-normal tracking-tight group-data-[collapsible=icon]:hidden transition-transform duration-300 ease-in-out group-hover:-translate-y-0.5">
            thecueRoom
          </span>
        </Link>
        <SidebarTrigger>
          <div className="group-data-[collapsible=icon]:hidden" />
        </SidebarTrigger>
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
          <SidebarMenuButton asChild isActive={pathname === '/cover-art'} tooltip="Cover Art">
            <Link href="/cover-art">
              <Image />
              <span className="group-data-[collapsible=icon]:hidden">Cover Art</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
          <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/memes'} tooltip="Memes">
            <Link href="/memes">
              <Smile />
              <span className="group-data-[collapsible=icon]:hidden">Memes</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/news'} tooltip="News">
            <Link href="/news">
              <Newspaper />
              <span className="group-data-[collapsible=icon]:hidden">News</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/gigs'} tooltip="Gigs">
              <Link href="/gigs">
                <CalendarDays />
                <span className="group-data-[collapsible=icon]:hidden">Gigs</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/genres'} tooltip="Genres">
              <Link href="/genres">
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
    </>
  );

  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarRail />
          <SidebarContent>
            {sidebarContent}
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.5),transparent)]">
          <div className="relative z-10 flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/70 px-4 backdrop-blur-lg lg:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger>
                    {sidebarContent}
                  </SidebarTrigger>
                    <Button variant="outline" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Tools
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                      <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                    <LogoutButton />
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
  );
}
