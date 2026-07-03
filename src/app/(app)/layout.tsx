"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Scissors,
  Settings,
  UsersRound,
  UserX,
  Store,
  Users,
  Bell,
  Loader2,
  WifiOff,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useUser, useFirebase, useNetwork } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { initNotifications } from "@/lib/firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { useUserReady } from "@/lib/firebase/useUserReady";

const Logo = () => (
  <Image src="/logo-light.png" alt="logo" width={28} height={28} />
);

const OfflineBanner = () => {
  const { isOnline } = useNetwork();
  
  /*
  
  110 lines of codes
  
  */
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="bg-background pb-3.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Çıkış Yap">
                <LogOut className="text-destructive" />
                <span>Çıkış Yap</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarImage src={displayUser.photoUrl} />
                    <AvatarFallback>{displayUser.fallback}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayUser.name}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <header
        className="fixed left-0 right-0 z-50 flex h-auto flex-col
          border-b bg-background"
        style={{ top: "env(safe-area-inset-top)" }}
      >
        <div className="flex h-14 items-center gap-4 px-4 sm:h-16 sm:px-6">
            <SidebarTrigger className="md:hidden" />
        </div>
        <OfflineBanner />
      </header>

      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 sm:p-6 bg-background pt-[calc(env(safe-area-inset-top)+72px)] sm:pt-[calc(env(safe-area-inset-top)+80px)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
