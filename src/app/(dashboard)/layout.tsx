
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { LogOut, Home, Newspaper, Settings, Palette, Music, Mic, Users, Shield, Tent, Bot, Star, GitBranch } from 'lucide-react';
import Logo from '@/components/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/news', label: 'News Feed', icon: Newspaper },
  { href: '/gigs', label: 'Gig Radar', icon: Tent },
  { href: '/genres', label: 'Genres', icon: Music },
  { href: '/memes', label: 'Meme Generator', icon: Bot },
  { href: '/cover-art', label: 'Cover Art AI', icon: Palette },
];

const adminNavItems = [
    { href: '/admin', label: 'Admin Console', icon: Shield },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, claims } = useAuth();
  
  const handleSignOut = async () => {
    try {
      const auth = getAuth(await getFirebaseApp());
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to sign out. Please try again.' });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              thecueRoom
            </span>
          </div>
          <SidebarTrigger side="left" />
        </SidebarHeader>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={<item.icon />}
                  tooltip={item.label}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {claims?.admin && (
             <SidebarGroup>
                <SidebarMenuItem>
                    <Link href="/admin" legacyBehavior passHref>
                        <SidebarMenuButton
                        isActive={pathname === '/admin'}
                        icon={<Shield />}
                        tooltip="Admin Console"
                        >
                        Admin Console
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
             </SidebarGroup>
          )}
        </SidebarMenu>
        <SidebarFooter>
            <SidebarGroup>
                 <SidebarMenuItem>
                    <Link href="/settings" legacyBehavior passHref>
                        <SidebarMenuButton isActive={pathname === '/settings'} icon={<Settings />} tooltip="Settings">
                            Settings
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton icon={<LogOut />} onClick={handleSignOut}>
                        Sign Out
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarGroup>
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium text-foreground truncate">{user?.displayName || 'User'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
